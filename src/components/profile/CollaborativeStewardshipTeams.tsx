import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Award, 
  Target, 
  Plus, 
  Check, 
  Sparkles, 
  ArrowRight, 
  TreePine, 
  Droplets, 
  Flame, 
  Compass, 
  Medal, 
  Share2, 
  UserPlus, 
  ChevronRight, 
  Lock,
  HeartHandshake
} from 'lucide-react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  getDocs 
} from 'firebase/firestore';
import { firestoreInstance, handleFirestoreError, OperationType, auth } from '../../lib/db';
import { audioFeedback } from '../../lib/audioFeedback';

export interface StewardshipTeamMember {
  id: string;
  name: string;
  role: 'Lead Hydrologist' | 'Field Scout' | 'Drone Sentinel' | 'Forensic Auditor' | 'Community Elder';
  avatarInitials: string;
  auditsContributed: number;
  isCurrentUser?: boolean;
}

export interface SharedImpactBadge {
  id: string;
  name: string;
  tier: 'gold' | 'platinum' | 'emerald';
  icon: string;
  unlocked: boolean;
  criteria: string;
}

export interface StewardshipTeam {
  id: string;
  name: string;
  bioregion: string;
  challengeTitle: string;
  description: string;
  progressCurrent: number;
  progressTarget: number;
  progressUnit: string;
  collectiveReputation: number;
  maxMembers: number;
  members: StewardshipTeamMember[];
  sharedBadges: SharedImpactBadge[];
  isUserMember?: boolean;
}

const INITIAL_TEAMS: StewardshipTeam[] = [
  {
    id: 'team-mara-riparian',
    name: 'Mara Watershed Sentinels',
    bioregion: 'Upper Mara Catchment',
    challengeTitle: '120km Riparian Vetiver & Siltation Barrier Calibration',
    description: 'Collaborative deployment and verification of deep-rooting bioswales to stop severe agricultural runoff from choking the Mara River.',
    progressCurrent: 42,
    progressTarget: 50,
    progressUnit: 'Audits',
    collectiveReputation: 14200,
    maxMembers: 6,
    isUserMember: true,
    members: [
      { id: 'm1', name: 'Amani Kiprono', role: 'Lead Hydrologist', avatarInitials: 'AK', auditsContributed: 16, isCurrentUser: true },
      { id: 'm2', name: 'Dr. Sarah Nanjala', role: 'Drone Sentinel', avatarInitials: 'SN', auditsContributed: 12 },
      { id: 'm3', name: 'Mzee Ole Lenku', role: 'Community Elder', avatarInitials: 'OL', auditsContributed: 8 },
      { id: 'm4', name: 'Faith Cheruiyot', role: 'Field Scout', avatarInitials: 'FC', auditsContributed: 6 }
    ],
    sharedBadges: [
      { id: 'b1', name: 'Headwaters Aegis', tier: 'emerald', icon: 'Droplets', unlocked: true, criteria: 'Team executed 40+ dual-sensor calibrations' },
      { id: 'b2', name: 'Zero Siltation Surge', tier: 'gold', icon: 'ShieldCheck', unlocked: false, criteria: 'Reach 50/50 verified audit threshold' }
    ]
  },
  {
    id: 'team-kilifi-mangrove',
    name: 'Kilifi Coastal Mangrove Matrix',
    bioregion: 'Kilifi Biosphere Reserve',
    challengeTitle: 'Freshwater Lens Protection & Tidal Rewetting',
    description: 'Preserving estuarine mangrove channels against rapid coastal salinization and storm surge erosion.',
    progressCurrent: 28,
    progressTarget: 35,
    progressUnit: 'Lysimeter Logs',
    collectiveReputation: 9800,
    maxMembers: 5,
    isUserMember: false,
    members: [
      { id: 'k1', name: 'Omar Khamis', role: 'Lead Hydrologist', avatarInitials: 'OK', auditsContributed: 14 },
      { id: 'k2', name: 'Zahra Mwangi', role: 'Forensic Auditor', avatarInitials: 'ZM', auditsContributed: 9 },
      { id: 'k3', name: 'David Masha', role: 'Field Scout', avatarInitials: 'DM', auditsContributed: 5 }
    ],
    sharedBadges: [
      { id: 'kb1', name: 'Mangrove Root Barrier', tier: 'gold', icon: 'TreePine', unlocked: true, criteria: 'Verified 25 salinity barrier logs' },
      { id: 'kb2', name: 'Estuarine Sanctuary', tier: 'platinum', icon: 'Medal', unlocked: false, criteria: 'Complete 35/35 tidal logs' }
    ]
  },
  {
    id: 'team-mau-canopy',
    name: 'Mau High-Altitude Canopy Watch',
    bioregion: 'Mau Forest Complex',
    challengeTitle: 'Moist Broadleaf Firebreak Drone Transect Array',
    description: 'High-frequency thermal infrared mapping to eliminate dry-season wildfire contagion across ancient hardwood corridors.',
    progressCurrent: 18,
    progressTarget: 25,
    progressUnit: 'Flights',
    collectiveReputation: 8100,
    maxMembers: 6,
    isUserMember: false,
    members: [
      { id: 'mau1', name: 'Kiprotich Sang', role: 'Drone Sentinel', avatarInitials: 'KS', auditsContributed: 10 },
      { id: 'mau2', name: 'Wambui Karanja', role: 'Field Scout', avatarInitials: 'WK', auditsContributed: 8 }
    ],
    sharedBadges: [
      { id: 'mb1', name: 'Canopy Thermal Aegis', tier: 'emerald', icon: 'Flame', unlocked: false, criteria: 'Execute 25 continuous thermal flight lines' }
    ]
  }
];

export const CollaborativeStewardshipTeams: React.FC = () => {
  const [teams, setTeams] = useState<StewardshipTeam[]>(INITIAL_TEAMS);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('team-mara-riparian');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newTeamName, setNewTeamName] = useState<string>('');
  const [newBioregion, setNewBioregion] = useState<string>('Upper Mara Catchment');
  const [newChallenge, setNewChallenge] = useState<string>('');
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(false);

  // Real-time Firestore sync with /stewardship_teams
  useEffect(() => {
    const teamsCol = collection(firestoreInstance, 'stewardship_teams');
    const unsubscribe = onSnapshot(
      teamsCol,
      async (snapshot) => {
        setIsFirestoreConnected(true);
        if (snapshot.empty) {
          // Seed initial teams into Firestore
          for (const team of INITIAL_TEAMS) {
            try {
              await setDoc(doc(firestoreInstance, 'stewardship_teams', team.id), {
                id: team.id,
                name: team.name,
                bioregion: team.bioregion,
                missionTitle: team.challengeTitle,
                missionGoal: team.description,
                missionTarget: team.progressTarget,
                missionCurrent: team.progressCurrent,
                missionUnit: team.progressUnit,
                collectiveReputation: team.collectiveReputation,
                members: team.members,
                sharedBadges: team.sharedBadges,
                creatorId: 'lead',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              });
            } catch (err) {
              console.warn('Seeding team warning:', err);
            }
          }
          setTeams(INITIAL_TEAMS);
        } else {
          const loaded: StewardshipTeam[] = [];
          snapshot.forEach((snap) => {
            const data = snap.data();
            loaded.push({
              id: snap.id,
              name: data.name || 'Restoration Team',
              bioregion: data.bioregion || 'Bioregion',
              challengeTitle: data.missionTitle || data.challengeTitle || 'Shared Restoration Goal',
              description: data.missionGoal || data.description || 'Restoration collective',
              progressCurrent: data.missionCurrent ?? data.progressCurrent ?? 0,
              progressTarget: data.missionTarget ?? data.progressTarget ?? 10,
              progressUnit: data.missionUnit || data.progressUnit || 'Actions',
              collectiveReputation: data.collectiveReputation ?? 500,
              maxMembers: data.maxMembers || 8,
              isUserMember: data.members?.some((m: any) => m.isCurrentUser || m.id === (auth.currentUser?.uid || 'current-user')) || false,
              members: data.members || [],
              sharedBadges: data.sharedBadges || []
            });
          });
          setTeams(loaded);
          if (loaded.length > 0 && !loaded.some(t => t.id === selectedTeamId)) {
            setSelectedTeamId(loaded[0].id);
          }
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'stewardship_teams');
        } catch {
          setIsFirestoreConnected(false);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const activeTeam = teams.find(t => t.id === selectedTeamId) || teams[0];

  const handleJoinTeam = async (teamId: string) => {
    audioFeedback.playBell([528, 660], 0.2);
    const targetTeam = teams.find(t => t.id === teamId);
    if (!targetTeam) return;

    const alreadyMember = targetTeam.members.some(m => m.isCurrentUser);
    if (alreadyMember) return;

    const currentUid = auth.currentUser?.uid || 'current-user';
    const newMember: StewardshipTeamMember = {
      id: currentUid,
      name: auth.currentUser?.displayName || 'Amani Kiprono',
      role: 'Field Scout',
      avatarInitials: 'AK',
      auditsContributed: 1,
      isCurrentUser: true
    };

    const updatedMembers = [...targetTeam.members, newMember];
    const updatedTeam: StewardshipTeam = {
      ...targetTeam,
      isUserMember: true,
      members: updatedMembers
    };

    // Optimistic UI update
    setTeams(teams.map(t => t.id === teamId ? updatedTeam : t));

    // Persist to Firestore
    try {
      await setDoc(doc(firestoreInstance, 'stewardship_teams', teamId), {
        id: updatedTeam.id,
        name: updatedTeam.name,
        bioregion: updatedTeam.bioregion,
        missionTitle: updatedTeam.challengeTitle,
        missionGoal: updatedTeam.description,
        missionTarget: updatedTeam.progressTarget,
        missionCurrent: updatedTeam.progressCurrent,
        missionUnit: updatedTeam.progressUnit,
        collectiveReputation: updatedTeam.collectiveReputation,
        members: updatedMembers,
        sharedBadges: updatedTeam.sharedBadges,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `stewardship_teams/${teamId}`);
    }
  };

  const handleContributeToMission = async () => {
    audioFeedback.playMicroTick();
    if (!activeTeam) return;

    const nextProgress = Math.min(activeTeam.progressTarget, activeTeam.progressCurrent + 1);
    const willUnlockBadge = nextProgress >= activeTeam.progressTarget;
    const updatedBadges = activeTeam.sharedBadges.map(b => {
      if (!b.unlocked && willUnlockBadge) {
        return { ...b, unlocked: true };
      }
      return b;
    });

    const updatedMembers = activeTeam.members.map(m => {
      if (m.isCurrentUser) {
        return { ...m, auditsContributed: m.auditsContributed + 1 };
      }
      return m;
    });

    const updatedTeam: StewardshipTeam = {
      ...activeTeam,
      progressCurrent: nextProgress,
      collectiveReputation: activeTeam.collectiveReputation + 250,
      members: updatedMembers,
      sharedBadges: updatedBadges
    };

    setTeams(teams.map(t => t.id === activeTeam.id ? updatedTeam : t));

    // Persist to Firestore
    try {
      await setDoc(doc(firestoreInstance, 'stewardship_teams', activeTeam.id), {
        missionCurrent: nextProgress,
        collectiveReputation: updatedTeam.collectiveReputation,
        members: updatedMembers,
        sharedBadges: updatedBadges,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `stewardship_teams/${activeTeam.id}`);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !newChallenge.trim()) return;

    audioFeedback.playBell([440, 880], 0.25);
    const teamId = `team-${Date.now()}`;
    const currentUid = auth.currentUser?.uid || 'current-user';

    const newTeam: StewardshipTeam = {
      id: teamId,
      name: newTeamName.trim(),
      bioregion: newBioregion,
      challengeTitle: newChallenge.trim(),
      description: 'Community-led ecological mission collective formed by active field stewards.',
      progressCurrent: 1,
      progressTarget: 30,
      progressUnit: 'Actions',
      collectiveReputation: 1000,
      maxMembers: 6,
      isUserMember: true,
      members: [
        { 
          id: currentUid, 
          name: auth.currentUser?.displayName || 'Amani Kiprono', 
          role: 'Lead Hydrologist', 
          avatarInitials: 'AK', 
          auditsContributed: 1, 
          isCurrentUser: true 
        }
      ],
      sharedBadges: [
        { id: `b-${Date.now()}`, name: 'Founding Sentinel', tier: 'gold', icon: 'Award', unlocked: true, criteria: 'Team founded on Atlas Sanctum' },
        { id: `b2-${Date.now()}`, name: 'Target Milestone', tier: 'emerald', icon: 'ShieldCheck', unlocked: false, criteria: 'Reach 30/30 mission goal' }
      ]
    };

    const updated = [newTeam, ...teams];
    setTeams(updated);
    setSelectedTeamId(newTeam.id);
    setIsCreateModalOpen(false);
    setNewTeamName('');
    setNewChallenge('');

    // Persist new team to Firestore
    try {
      await setDoc(doc(firestoreInstance, 'stewardship_teams', teamId), {
        id: newTeam.id,
        name: newTeam.name,
        bioregion: newTeam.bioregion,
        missionTitle: newTeam.challengeTitle,
        missionGoal: newTeam.description,
        missionTarget: newTeam.progressTarget,
        missionCurrent: newTeam.progressCurrent,
        missionUnit: newTeam.progressUnit,
        collectiveReputation: newTeam.collectiveReputation,
        maxMembers: newTeam.maxMembers,
        members: newTeam.members,
        sharedBadges: newTeam.sharedBadges,
        creatorId: currentUid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `stewardship_teams/${teamId}`);
    }
  };

  return (
    <div id="collaborative-stewardship-teams" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#0C150E] via-[#08100B] to-[#0C150E] border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-400/40 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#F5F5F0]">
              Collaborative Stewardship Teams
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/40">
              COLLECTIVE CHALLENGES
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isFirestoreConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {isFirestoreConnected ? 'Firestore Synced' : 'Connecting...'}
            </span>
          </div>
          <p className="text-xs text-white/60 font-sans">
            Form small, agile teams of 3 to 8 stewards to share verified impact badges and collectively solve high-stakes bioregional challenges.
          </p>
        </div>

        <button
          id="open-create-team-modal-btn"
          onClick={() => {
            audioFeedback.playMicroTick();
            setIsCreateModalOpen(true);
          }}
          className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Form New Team</span>
        </button>
      </div>

      {/* Grid: Left Team List & Right Active Team Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Team Selector Cards */}
        <div className="space-y-2.5">
          <span className="text-xs font-mono font-bold text-white/60 uppercase tracking-wider">
            Active Bioregional Collectives ({teams.length})
          </span>

          <div className="space-y-2">
            {teams.map((team) => {
              const isSelected = team.id === selectedTeamId;
              const pct = Math.round((team.progressCurrent / team.progressTarget) * 100);

              return (
                <div
                  key={team.id}
                  onClick={() => {
                    audioFeedback.playMicroTick();
                    setSelectedTeamId(team.id);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#121E16] border-emerald-400/80 shadow-lg shadow-emerald-950/40'
                      : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-black/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-white">
                          {team.name}
                        </h4>
                        {team.isUserMember && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                            YOUR TEAM
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-[#C5A059]">
                        {team.bioregion}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {pct}%
                      </span>
                    </div>
                  </div>

                  {/* Mini Progress Bar */}
                  <div className="mt-2 w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-white/50 pt-2">
                    <span>{team.members.length}/{team.maxMembers} Members</span>
                    <span>{team.collectiveReputation.toLocaleString()} Rep</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Team Showcase */}
        {activeTeam && (
          <div className="lg:col-span-2 space-y-4 p-5 rounded-xl bg-black/40 border border-[#1B3022]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-serif font-bold text-white">
                    {activeTeam.name}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-[#C5A059] border border-[#C5A059]/40">
                    {activeTeam.bioregion}
                  </span>
                </div>
                <p className="text-xs text-white/70 font-sans mt-0.5">
                  {activeTeam.description}
                </p>
              </div>

              {!activeTeam.isUserMember ? (
                <button
                  onClick={() => handleJoinTeam(activeTeam.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Join Team</span>
                </button>
              ) : (
                <button
                  onClick={handleContributeToMission}
                  className="px-3.5 py-1.5 rounded-lg bg-[#C5A059] hover:bg-[#D4AF37] text-black font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Contribute Audit (+1)</span>
                </button>
              )}
            </div>

            {/* Mission Challenge Progress Card */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-400" />
                  Collective Challenge: {activeTeam.challengeTitle}
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  {activeTeam.progressCurrent} / {activeTeam.progressTarget} {activeTeam.progressUnit}
                </span>
              </div>

              <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden border border-emerald-500/30">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-500"
                  style={{ width: `${Math.round((activeTeam.progressCurrent / activeTeam.progressTarget) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-white/60">
                <span>Team Pool: {activeTeam.collectiveReputation.toLocaleString()} Rep Points</span>
                <span>
                  {activeTeam.progressCurrent >= activeTeam.progressTarget ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Mission Accomplished!
                    </span>
                  ) : (
                    <span>{activeTeam.progressTarget - activeTeam.progressCurrent} {activeTeam.progressUnit} remaining</span>
                  )}
                </span>
              </div>
            </div>

            {/* Shared Impact Badges */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                <Medal className="w-3.5 h-3.5 text-[#C5A059]" />
                Shared Team Impact Badges (Unlocked Together)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeTeam.sharedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-lg border flex items-start gap-3 ${
                      badge.unlocked
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                        : 'bg-black/40 border-white/10 text-white/40'
                    }`}
                  >
                    <div className={`p-2 rounded-lg border shrink-0 ${
                      badge.unlocked
                        ? 'bg-emerald-900 border-emerald-400 text-emerald-300'
                        : 'bg-white/5 border-white/10 text-white/30'
                    }`}>
                      <Award className="w-4 h-4" />
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-[#F5F5F0]">
                          {badge.name}
                        </span>
                        {badge.unlocked ? (
                          <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-emerald-900 text-emerald-300 border border-emerald-500/40">
                            UNLOCKED
                          </span>
                        ) : (
                          <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-white/10 text-white/40">
                            IN PROGRESS
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] opacity-80 leading-tight">
                        {badge.criteria}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Roster */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono font-bold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                Team Roster ({activeTeam.members.length}/{activeTeam.maxMembers} Stewards)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeTeam.members.map((member) => (
                  <div
                    key={member.id}
                    className="p-2.5 rounded-lg bg-black/50 border border-white/10 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                        member.isCurrentUser
                          ? 'bg-emerald-500 text-black'
                          : 'bg-white/10 text-white/70'
                      }`}>
                        {member.avatarInitials}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <span>{member.name}</span>
                          {member.isCurrentUser && (
                            <span className="text-[8px] font-mono px-1 rounded bg-emerald-900 text-emerald-300">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-white/50 font-mono">
                          {member.role}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-[#C5A059]">
                        {member.auditsContributed}
                      </div>
                      <div className="text-[9px] font-mono text-white/40">audits</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B120D] border border-emerald-500/40 rounded-xl p-5 max-w-md w-full space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-serif font-bold text-emerald-300 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Form a Collaborative Stewardship Team
              </h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-white/50 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-3.5 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-white/60">Team Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Mara Watershed Sentinels"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  required
                  className="w-full p-2 rounded bg-black/60 border border-white/10 text-white focus:border-emerald-400 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/60">Target Bioregion:</label>
                <select
                  value={newBioregion}
                  onChange={(e) => setNewBioregion(e.target.value)}
                  className="w-full p-2 rounded bg-black/60 border border-white/10 text-white focus:border-emerald-400 focus:outline-hidden"
                >
                  <option value="Upper Mara Catchment">Upper Mara Catchment</option>
                  <option value="Kilifi Biosphere Reserve">Kilifi Biosphere Reserve</option>
                  <option value="Mau Forest Complex">Mau Forest Complex</option>
                  <option value="Turkana Transboundary Basin">Turkana Transboundary Basin</option>
                  <option value="Congo Basin Peatlands">Congo Basin Peatlands</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-white/60">Mission Challenge Objective:</label>
                <input
                  type="text"
                  placeholder="e.g. Deploy 30 Vetiver Swales to Halt Siltation"
                  value={newChallenge}
                  onChange={(e) => setNewChallenge(e.target.value)}
                  required
                  className="w-full p-2 rounded bg-black/60 border border-white/10 text-white focus:border-emerald-400 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
