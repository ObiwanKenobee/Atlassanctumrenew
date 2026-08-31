import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  WalletState,
  WalletType,
  connectMetaMask,
  checkMetaMaskAvailability,
  getOrCreateSovereignKeypair,
  signMessageWithWallet
} from '../services/web3WalletService';
import { audioFeedback } from '../lib/audioFeedback';

interface Web3WalletContextType extends WalletState {
  hasMetaMask: boolean;
  connectMetaMaskWallet: () => Promise<void>;
  connectSovereignKeypair: () => Promise<void>;
  disconnectWallet: () => void;
  signClaimData: (claimTitle: string, claimPayload: string) => Promise<{ signature: string; timestamp: string; hash: string }>;
  clearError: () => void;
}

const defaultState: WalletState = {
  address: null,
  chainId: null,
  walletType: 'none',
  isConnected: false,
  isConnecting: false,
  error: null,
  did: null,
  publicKey: null
};

const Web3WalletContext = createContext<Web3WalletContextType>({
  ...defaultState,
  hasMetaMask: false,
  connectMetaMaskWallet: async () => {},
  connectSovereignKeypair: async () => {},
  disconnectWallet: () => {},
  signClaimData: async () => ({ signature: '', timestamp: '', hash: '' }),
  clearError: () => {}
});

export const useWeb3Wallet = () => useContext(Web3WalletContext);

const WALLET_PREF_KEY = 'atlas_connected_wallet_pref';

export const Web3WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WalletState>(defaultState);
  const [hasMetaMask, setHasMetaMask] = useState(false);

  // Check if MetaMask is available on mount
  useEffect(() => {
    let mounted = true;
    checkMetaMaskAvailability().then(available => {
      if (mounted) {
        setHasMetaMask(available);
      }
    });

    // Auto-restore previous connection preference or default to sovereign key
    try {
      const savedPref = localStorage.getItem(WALLET_PREF_KEY);
      if (savedPref === 'sovereign_local') {
        getOrCreateSovereignKeypair().then(kp => {
          if (mounted) {
            setState({
              address: kp.address,
              chainId: '0x-atlas-native',
              walletType: 'sovereign_local',
              isConnected: true,
              isConnecting: false,
              error: null,
              did: kp.did,
              publicKey: kp.publicKeyHex
            });
          }
        });
      } else if (savedPref === 'metamask') {
        // Try gentle check without throwing popup
        if (window.ethereum?.selectedAddress) {
          setState({
            address: window.ethereum.selectedAddress,
            chainId: window.ethereum.networkVersion ? '0x' + Number(window.ethereum.networkVersion).toString(16) : '0x1',
            walletType: 'metamask',
            isConnected: true,
            isConnecting: false,
            error: null,
            did: `did:pkh:eip155:1:${window.ethereum.selectedAddress}`,
            publicKey: null
          });
        }
      }
    } catch {
      // Ignore initial restore errors
    }

    // Set up Ethereum event listeners defensively
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts && accounts.length > 0) {
        setState(prev => ({
          ...prev,
          address: accounts[0],
          isConnected: true,
          walletType: 'metamask',
          did: `did:pkh:eip155:1:${accounts[0]}`,
          error: null
        }));
      } else {
        // Disconnected in MetaMask
        setState(defaultState);
        try {
          localStorage.removeItem(WALLET_PREF_KEY);
        } catch {}
      }
    };

    const handleChainChanged = (chainId: string) => {
      setState(prev => ({ ...prev, chainId }));
    };

    if (window.ethereum?.on) {
      try {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
      } catch {}
    }

    return () => {
      mounted = false;
      if (window.ethereum?.removeListener) {
        try {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        } catch {}
      }
    };
  }, []);

  const connectMetaMaskWallet = useCallback(async () => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));
    audioFeedback.playSubtleClick();

    try {
      const result = await connectMetaMask();
      setState({
        address: result.address,
        chainId: result.chainId,
        walletType: 'metamask',
        isConnected: true,
        isConnecting: false,
        error: null,
        did: `did:pkh:eip155:1:${result.address}`,
        publicKey: null
      });

      try {
        localStorage.setItem(WALLET_PREF_KEY, 'metamask');
      } catch {}

      audioFeedback.playSuccessChime();
    } catch (err: any) {
      console.warn('MetaMask connection notice:', err.message);
      const friendlyMsg = err?.message || 'Failed to connect to MetaMask';
      
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: friendlyMsg
      }));
      audioFeedback.playTelemetryWarning();
    }
  }, []);

  const connectSovereignKeypair = useCallback(async () => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));
    audioFeedback.playSubtleClick();

    try {
      const kp = await getOrCreateSovereignKeypair();
      setState({
        address: kp.address,
        chainId: '0x-atlas-native',
        walletType: 'sovereign_local',
        isConnected: true,
        isConnecting: false,
        error: null,
        did: kp.did,
        publicKey: kp.publicKeyHex
      });

      try {
        localStorage.setItem(WALLET_PREF_KEY, 'sovereign_local');
      } catch {}

      audioFeedback.playSuccessChime();
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: err.message || 'Failed to initialize sovereign keypair'
      }));
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    audioFeedback.playSubtleClick();
    setState(defaultState);
    try {
      localStorage.removeItem(WALLET_PREF_KEY);
    } catch {}
  }, []);

  const signClaimData = useCallback(async (claimTitle: string, claimPayload: string) => {
    if (!state.isConnected || !state.address) {
      // Auto-connect sovereign key if not connected
      const kp = await getOrCreateSovereignKeypair();
      const res = await signMessageWithWallet('sovereign_local', kp.address, `Claim: ${claimTitle}\nPayload: ${claimPayload}`);
      return res;
    }

    const res = await signMessageWithWallet(state.walletType, state.address, `Claim: ${claimTitle}\nPayload: ${claimPayload}`);
    return res;
  }, [state.isConnected, state.address, state.walletType]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return (
    <Web3WalletContext.Provider
      value={{
        ...state,
        hasMetaMask,
        connectMetaMaskWallet,
        connectSovereignKeypair,
        disconnectWallet,
        signClaimData,
        clearError
      }}
    >
      {children}
    </Web3WalletContext.Provider>
  );
};
