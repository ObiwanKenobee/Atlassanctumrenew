import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PageView } from '../types';
import { db } from '../lib/db';
import { useAuth } from './AuthContext';

export type ContextualNotificationType = 'community_update' | 'mission_change' | 'covenant_milestone' | 'priority_floor';
export type NotificationSeverity = 'info' | 'important' | 'critical';

export interface ContextualNotification {
  id: string;
  type: ContextualNotificationType;
  title: string;
  summary: string;
  details: string;
  bioregion: string;
  timestamp: string;
  relativeTime: string;
  severity: NotificationSeverity;
  targetTab?: PageView;
  sourceEntity: string;
  requiresConfirmation: boolean;
  cleared: boolean;
  clearedAt?: string;
  clearedBy?: string;
  stewardClearanceNote?: string;
}

interface ContextualNotificationContextType {
  activeNotifications: ContextualNotification[];
  clearedNotifications: ContextualNotification[];
  unreadCount: number;
  pendingClearNotification: ContextualNotification | 'ALL' | null;
  isConfirmModalOpen: boolean;
  isTrayOpen: boolean;
  setIsTrayOpen: (open: boolean) => void;
  requestClearNotification: (id: string) => void;
  requestClearAll: () => void;
  confirmClearNotification: (stewardNote?: string) => Promise<void>;
  cancelClearance: () => void;
  addNotification: (notif: Omit<ContextualNotification, 'id' | 'cleared' | 'requiresConfirmation'>) => void;
}

const INITIAL_NOTIFICATIONS: ContextualNotification[] = [
  {
    id: 'notif-upper-tana-covenant',
    type: 'community_update',
    title: 'Upper Tana Basin: Elder Council FPIC Covenant Ratified',
    summary: '35% seasonal agricultural extraction cap ratified to ensure baseflow for downstream mangrove deltas.',
    details: 'The Tana Elders Stewards Council ratified the dry-season covenant with 98.4% community consensus. Smart meters on all 42 communal irrigation pumps have been automatically throttled in alignment with Priority Floor water guarantees.',
    bioregion: 'Upper Tana River Basin, Kenya',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    relativeTime: '18m ago',
    severity: 'important',
    targetTab: 'observatory',
    sourceEntity: 'Tana Elders Council & Hydrology Mesh',
    requiresConfirmation: true,
    cleared: false,
  },
  {
    id: 'notif-rift-mission-reroute',
    type: 'mission_change',
    title: 'Southern Rift Basin: Drone Phenology Flight Path Re-Routed',
    summary: 'Sentinel UAV sweep detected localized micro-canopy stress; autonomous patrol vectors shifted to Sector 4B.',
    details: 'Agent Swarm #4 autonomously adjusted aerial survey trajectories after ground-moisture readings fell 12% below the SWAT model baseline. Two mobile steward teams dispatched to inspect shallow aquifer recharge boreholes.',
    bioregion: 'Southern Rift Valley, Kenya',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    relativeTime: '45m ago',
    severity: 'critical',
    targetTab: 'agent-mission-control',
    sourceEntity: 'Agent Mission Control Swarm #4',
    requiresConfirmation: true,
    cleared: false,
  },
  {
    id: 'notif-mara-grazing-buffer',
    type: 'community_update',
    title: 'Mara Riparian Buffer: Multi-Clan Rotational Grazing Corridor Shift',
    summary: 'Local pastoralist clans agreed to temporary rotational corridor moratorium following Merkle soil telemetry.',
    details: 'Community assembly in Talek concluded consensus for a 21-day grazing deferral across the eastern riparian corridor. Grassland root biomass regeneration index is currently 74.2%, targeting 85% before reopening.',
    bioregion: 'Mara-Serengeti Transboundary Biosphere',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    relativeTime: '2h ago',
    severity: 'info',
    targetTab: 'living-reality',
    sourceEntity: 'Mara Bioregional Commons Assembly',
    requiresConfirmation: true,
    cleared: false,
  },
  {
    id: 'notif-lake-victoria-priority-floor',
    type: 'mission_change',
    title: 'Lake Victoria Watershed: Dissolved Oxygen Priority Floor Recalibration',
    summary: 'Minimum DO standard elevated to 6.2 mg/L under Canon XXIII; 12 IoT aeration stations activated.',
    details: 'In response to sudden hypoxia detected in Winam Gulf, the Moral Arbiter triggered emergency regenerative intervention. Multi-capital allocation approved 4,200 kWh of solar microgrid reserve power to continuous aeration injectors.',
    bioregion: 'Lake Victoria Watershed',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    relativeTime: '4h ago',
    severity: 'important',
    targetTab: 'steward',
    sourceEntity: 'Autonomous Water Reliability Mesh (AWS Winner)',
    requiresConfirmation: true,
    cleared: false,
  },
];

const ContextualNotificationContext = createContext<ContextualNotificationContextType>({
  activeNotifications: [],
  clearedNotifications: [],
  unreadCount: 0,
  pendingClearNotification: null,
  isConfirmModalOpen: false,
  isTrayOpen: false,
  setIsTrayOpen: () => {},
  requestClearNotification: () => {},
  requestClearAll: () => {},
  confirmClearNotification: async () => {},
  cancelClearance: () => {},
  addNotification: () => {},
});

export const useContextualNotifications = () => useContext(ContextualNotificationContext);

export const ContextualNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userProfile } = useAuth();
  
  const [notifications, setNotifications] = useState<ContextualNotification[]>(() => {
    try {
      const stored = localStorage.getItem('atlas_contextual_notifications');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [pendingClearNotification, setPendingClearNotification] = useState<ContextualNotification | 'ALL' | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isTrayOpen, setIsTrayOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('atlas_contextual_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  const activeNotifications = notifications.filter((n) => !n.cleared);
  const clearedNotifications = notifications.filter((n) => n.cleared);
  const unreadCount = activeNotifications.length;

  const requestClearNotification = (id: string) => {
    const notif = notifications.find((n) => n.id === id);
    if (notif) {
      setPendingClearNotification(notif);
      setIsConfirmModalOpen(true);
    }
  };

  const requestClearAll = () => {
    if (activeNotifications.length > 0) {
      setPendingClearNotification('ALL');
      setIsConfirmModalOpen(true);
    }
  };

  const cancelClearance = () => {
    setPendingClearNotification(null);
    setIsConfirmModalOpen(false);
  };

  const confirmClearNotification = async (stewardNote?: string) => {
    const stewardName = userProfile?.displayName || currentUser?.displayName || 'Bioregional Steward';
    const clearanceTimestamp = new Date().toISOString();

    if (pendingClearNotification === 'ALL') {
      setNotifications((prev) =>
        prev.map((n) =>
          !n.cleared
            ? {
                ...n,
                cleared: true,
                clearedAt: clearanceTimestamp,
                clearedBy: stewardName,
                stewardClearanceNote: stewardNote || 'Acknowledged and reviewed in bulk clearance.',
              }
            : n
        )
      );

      // Audit log in Firestore
      try {
        await db.audit.logInteraction({
          action: 'Batch Cleared All Contextual Community Notifications',
          feature: 'moral_intelligence',
          impactTier: 'moderate',
          parameters: {
            clearedCount: activeNotifications.length,
            stewardName,
            stewardNote: stewardNote || 'Bulk reviewed',
          },
        });
      } catch (err) {
        console.warn('Could not log notification audit:', err);
      }
    } else if (pendingClearNotification && typeof pendingClearNotification === 'object') {
      const targetId = pendingClearNotification.id;
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === targetId
            ? {
                ...n,
                cleared: true,
                clearedAt: clearanceTimestamp,
                clearedBy: stewardName,
                stewardClearanceNote: stewardNote || 'Verified and acknowledged by steward.',
              }
            : n
        )
      );

      // Audit log individual clearance
      try {
        await db.audit.logInteraction({
          action: `Cleared Contextual Notification: ${pendingClearNotification.title}`,
          feature: 'moral_intelligence',
          impactTier: pendingClearNotification.severity === 'critical' ? 'high' : 'moderate',
          parameters: {
            notificationId: targetId,
            notificationType: pendingClearNotification.type,
            bioregion: pendingClearNotification.bioregion,
            stewardName,
            stewardNote: stewardNote || 'Individually reviewed and confirmed',
          },
        });
      } catch (err) {
        console.warn('Could not log notification audit:', err);
      }
    }

    setPendingClearNotification(null);
    setIsConfirmModalOpen(false);
  };

  const addNotification = useCallback((notif: Omit<ContextualNotification, 'id' | 'cleared' | 'requiresConfirmation'>) => {
    const newNotif: ContextualNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      cleared: false,
      requiresConfirmation: true,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  return (
    <ContextualNotificationContext.Provider
      value={{
        activeNotifications,
        clearedNotifications,
        unreadCount,
        pendingClearNotification,
        isConfirmModalOpen,
        isTrayOpen,
        setIsTrayOpen,
        requestClearNotification,
        requestClearAll,
        confirmClearNotification,
        cancelClearance,
        addNotification,
      }}
    >
      {children}
    </ContextualNotificationContext.Provider>
  );
};
