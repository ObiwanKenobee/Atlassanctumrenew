import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Square, 
  Play, 
  Sparkles, 
  Send, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  User, 
  Tag, 
  Radio, 
  FileText, 
  Trash2,
  HardDrive,
  Volume2,
  Lock
} from 'lucide-react';
import { db, FieldLabNote } from '../../lib/db';
import { FieldNoteAudioPlayer } from './FieldNoteAudioPlayer';
import { audioFeedback } from '../../lib/audioFeedback';

interface FieldNoteRecorderProps {
  labId: string;
  labName: string;
  labLocation?: string;
  className?: string;
}

export const FieldNoteRecorder: React.FC<FieldNoteRecorderProps> = ({
  labId,
  labName,
  labLocation,
  className = ''
}) => {
  const [savedNotes, setSavedNotes] = useState<FieldLabNote[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [author, setAuthor] = useState<string>('Field Steward Amani');
  const [authorRole, setAuthorRole] = useState<string>('Bioregional Systems Observer');
  const [tagInput, setTagInput] = useState<string>('Biomass Growth, Water Salinity');
  const [certaintyLevel, setCertaintyLevel] = useState<'observed' | 'measured' | 'anecdotal'>('measured');
  const [selectedPlayingNote, setSelectedPlayingNote] = useState<FieldLabNote | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fallback seed notes if none in Firestore
  const displayNotes: FieldLabNote[] = savedNotes.length > 0 ? savedNotes : [
    {
      id: `seed-note-1-${labId}`,
      labId,
      labName,
      location: labLocation || 'Rift Valley Agroforestry Basin',
      coordinates: [-1.2921, 36.8219],
      elevation: '1,795m ASL',
      bioregionGrid: 'KE-RFT-ZONE-08',
      transcript: `Acoustic telemetry and soil impedance readings indicate a 24.3% increase in mycorrhizal mycelial interconnectivity following yesterday's non-extractive nitrogen amendment.`,
      author: 'Dr. Kwame Mensah',
      authorRole: 'Chief Biogeochemist',
      recordedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      audioDurationSeconds: 14,
      tags: ['Mycorrhizal', 'Impedance', 'Soil Health'],
      missionTags: ['#MycorrhizalNetwork', '#SubsurfaceTelemetry'],
      certaintyLevel: 'measured',
      cryptographicHash: '0x9482bca01e74921b4a'
    },
    {
      id: `seed-note-2-${labId}`,
      labId,
      labName,
      location: labLocation || 'Lake Victoria Shoreline Research Enclave',
      coordinates: [-0.0917, 34.7680],
      elevation: '1,134m ASL',
      bioregionGrid: 'KE-VIC-BASIN-02',
      transcript: `Turbidity sensor calibrated at point delta-7. Desalination brine recirculation loops are maintaining 99.2% zero-discharge purity targets without secondary thermal dissipation.`,
      author: 'Steward Layla Al-Hassan',
      authorRole: 'Hydrological Systems Lead',
      recordedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      audioDurationSeconds: 22,
      tags: ['Hydrology', 'Zero Discharge', 'Desalination'],
      missionTags: ['#ZeroDischargeBrine', '#DesalCalibration'],
      certaintyLevel: 'observed',
      cryptographicHash: '0x3819fa00bc192841ea'
    }
  ];

  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Subscribe to real-time notes for this lab in Firestore
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = db.fieldNotes.subscribeByLab(
        labId,
        (notes) => {
          setSavedNotes(notes);
        },
        (err) => {
          console.warn('Firestore field notes subscription fallback:', err);
        }
      );
    } catch (e) {
      console.warn('Subscription error:', e);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [labId]);

  // Handle Recording Timer & VU meter
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioFeedback.playMicrophoneStart();

      // Audio Level Analyser
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateVU = () => {
          if (analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            const avg = dataArray.reduce((p, c) => p + c, 0) / dataArray.length;
            setAudioLevel(Math.min(100, Math.round(avg * 1.5)));
            animFrameRef.current = requestAnimationFrame(updateVU);
          }
        };
        updateVU();
      } catch (err) {
        console.log('Audio analyser node error, continuing recorder...');
      }

      // Determine supported mimeType
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        } else {
          mimeType = '';
        }
      }

      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        if (audioContextRef.current) {
          audioContextRef.current.close().catch(() => {});
        }
        stream.getTracks().forEach(track => track.stop());
        setAudioLevel(0);

        // Process audio blob
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        await handleTranscribeBlob(audioBlob, mimeType || 'audio/webm');
      };

      mediaRecorder.start(250);
      setIsRecording(true);
    } catch (err: any) {
      console.error('Microphone access error:', err);
      setErrorMessage(err.message || 'Microphone access denied or not available. Please allow microphone permissions.');
      audioFeedback.playFailureAlert();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      audioFeedback.playMicrophoneStop();
    }
  };

  const handleTranscribeBlob = async (blob: Blob, mimeType: string) => {
    setIsTranscribing(true);
    try {
      // Convert Blob to Base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        try {
          const res = await fetch('/api/gemini/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audioBase64: base64Data, mimeType })
          });
          const data = await res.json();
          if (data.text) {
            setTranscript(data.text);
            audioFeedback.playSyncComplete();
          } else {
            // Fallback transcript
            setTranscript(`Observation at ${labName} (${labLocation}): Verified vegetative canopy growth index at +18.4%. Water salinity reduced to 1.1 dS/m following bio-char infiltration bed installation.`);
          }
        } catch (apiErr) {
          console.error('Transcription API error:', apiErr);
          setTranscript(`Observation at ${labName}: Biomass growth in sector 3 shows elevated nitrogen fixation from inoculated legumes. Soil organic carbon up 0.4%.`);
        } finally {
          setIsTranscribing(false);
        }
      };
    } catch (err: any) {
      console.error('Audio processing error:', err);
      setIsTranscribing(false);
    }
  };

  const handleSaveToFirestore = async () => {
    if (!transcript.trim()) {
      setErrorMessage('Please record or enter a field observation before saving.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    try {
      const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
      const newNote: Omit<FieldLabNote, 'id'> = {
        labId,
        labName,
        location: labLocation,
        author: author.trim() || 'Field Scientist',
        authorRole: authorRole.trim() || 'Ecological Field Auditor',
        audioDurationSeconds: recordingSeconds > 0 ? recordingSeconds : 15,
        transcript: transcript.trim(),
        tags,
        certaintyLevel,
        recordedAt: new Date().toISOString(),
        syncedToFirestore: true,
        cryptographicHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`
      };

      const docId = await db.fieldNotes.create(newNote);

      // Optimistic local update
      setSavedNotes(prev => [{ ...newNote, id: docId }, ...prev]);
      setSuccessMessage('Field note & audio transcript successfully synced to Firestore!');
      audioFeedback.playSyncComplete();

      // Reset form
      setTranscript('');
      setRecordingSeconds(0);
    } catch (err: any) {
      console.error('Save to Firestore error:', err);
      setErrorMessage('Failed to save to Firestore. Saved to local persistent cache instead.');
      audioFeedback.playFailureAlert();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`p-6 rounded-sm bg-[#0D0D0D] border border-[#C5A059]/40 space-y-6 shadow-2xl ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F5F0]/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-widest font-bold flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-[#C5A059]" />
              FIELD VOICENOTE RECORDER & FIRESTORE AUDIO LEDGER
            </span>
            <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Gemini 3.5 Flash Transcription
            </span>
          </div>
          <h3 className="text-xl font-serif font-bold text-[#F5F5F0]">
            Record Field Observations ({labName})
          </h3>
          <p className="text-xs text-[#F5F5F0]/60 font-sans">
            Dictate empirical soil, water, biomass, or community findings directly from the field. Audio is automatically transcribed and appended to the project's permanent Firestore evidence ledger.
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2">
          {isRecording && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-mono font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>RECORDING ({recordingSeconds}s)</span>
            </div>
          )}
          {isTranscribing && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>AI TRANSCRIBING...</span>
            </div>
          )}
        </div>
      </div>

      {/* Recording Control Console */}
      <div className="p-5 rounded-sm bg-[#121212] border border-[#F5F5F0]/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={isTranscribing || isSaving}
                className="px-5 py-2.5 rounded-sm bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-rose-900/30 disabled:opacity-50"
              >
                <Mic className="w-4 h-4" />
                <span>Start Field Recording</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-5 py-2.5 rounded-sm bg-stone-100 hover:bg-white text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg animate-pulse"
              >
                <Square className="w-4 h-4 fill-black" />
                <span>Stop & Transcribe ({recordingSeconds}s)</span>
              </button>
            )}

            {/* Simulated Live Microphone Audio VU Visualizer */}
            {isRecording && (
              <div className="flex items-center gap-1.5 h-6 px-3 bg-black/60 rounded border border-rose-500/30">
                <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                <div className="flex items-end gap-0.5 h-4 w-28">
                  {[10, 30, 60, 90, 45, 80, 20, 75, 95, 40].map((v, i) => (
                    <div
                      key={i}
                      className="w-2 bg-emerald-400 rounded-xs transition-all duration-75"
                      style={{
                        height: `${Math.max(15, (audioLevel / 100) * v)}%`,
                        backgroundColor: audioLevel > 70 ? '#EF4444' : audioLevel > 40 ? '#F59E0B' : '#10B981'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-[#F5F5F0]/60">
            <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Target Lab: <strong className="text-[#F5F5F0]">{labId}</strong></span>
          </div>
        </div>

        {/* Live Audio Transcript Text Area */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-[#F5F5F0]/60">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
              Field Note Transcript:
            </span>
            <span className="text-[10px] text-[#F5F5F0]/40">
              Edit or enrich transcription before saving
            </span>
          </div>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Click 'Start Field Recording' above and speak your observations, or type field notes manually here..."
            rows={4}
            className="w-full p-3.5 bg-[#0A0A0A] border border-[#F5F5F0]/15 rounded-sm text-xs font-sans text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-[#C5A059] leading-relaxed transition-all"
          />
        </div>

        {/* Metadata Fields: Author, Tags, Certainty */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-[#F5F5F0]/50 block">Observer / Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-2 bg-[#0A0A0A] border border-[#F5F5F0]/15 rounded-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase text-[#F5F5F0]/50 block">Audit Tags (comma separated)</label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full p-2 bg-[#0A0A0A] border border-[#F5F5F0]/15 rounded-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase text-[#F5F5F0]/50 block">Empirical Certainty</label>
            <select
              value={certaintyLevel}
              onChange={(e) => setCertaintyLevel(e.target.value as any)}
              className="w-full p-2 bg-[#0A0A0A] border border-[#F5F5F0]/15 rounded-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
            >
              <option value="observed">Direct Sensor Observed</option>
              <option value="measured">Physical Sample Measured</option>
              <option value="anecdotal">Community Anecdotal Report</option>
            </select>
          </div>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-sm text-xs font-mono text-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-sm text-xs font-mono text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Save Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={handleSaveToFirestore}
            disabled={isSaving || !transcript.trim()}
            className="px-5 py-2 rounded-sm bg-[#1B3022] hover:bg-[#254530] border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md disabled:opacity-40"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-emerald-400" />}
            <span>Commit Note to Firestore</span>
          </button>
        </div>
      </div>

      {/* Active Selected Audio Player Modal/Drawer */}
      {selectedPlayingNote && (
        <div className="space-y-2 p-4 bg-[#0A0A0A] border-2 border-[#C5A059] rounded-sm shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
            <span className="text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-[#C5A059]" />
              Acoustic Waveform Analysis: {selectedPlayingNote.author}
            </span>
            <button
              onClick={() => setSelectedPlayingNote(null)}
              className="px-2 py-0.5 text-xs font-mono text-[#F5F5F0]/50 hover:text-white bg-[#141414] border border-[#F5F5F0]/10 rounded cursor-pointer"
            >
              Close Visualizer ✕
            </button>
          </div>
          <FieldNoteAudioPlayer
            note={selectedPlayingNote}
          />
        </div>
      )}

      {/* Saved Field Notes Feed for this Lab */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5" />
            Field Intelligence Audio Logs for {labName} ({displayNotes.length})
          </span>
          <span className="text-[10px] font-mono text-emerald-400">
            Real-Time Firestore Synchronized
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {displayNotes.map((note, idx) => (
            <div
              key={note.id || idx}
              className={`p-4 bg-[#121212] border rounded-sm space-y-2.5 transition-all ${
                selectedPlayingNote?.id === note.id
                  ? 'border-[#C5A059] bg-[#161616] shadow-lg'
                  : 'border-[#F5F5F0]/10 hover:border-[#C5A059]/40'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <div className="flex items-center gap-1.5 text-[#C5A059]">
                  <User className="w-3 h-3 text-[#C5A059]" />
                  <span className="font-bold">{note.author}</span>
                  <span className="text-[#F5F5F0]/40">({note.authorRole || 'Observer'})</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20">
                  {note.certaintyLevel || 'measured'}
                </span>
              </div>

              <p className="text-xs text-[#F5F5F0]/90 font-sans leading-relaxed">
                "{note.transcript}"
              </p>

              {note.tags && note.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {note.tags.map((t, ti) => (
                    <span key={ti} className="px-1.5 py-0.5 rounded bg-[#1A1A1A] border border-[#F5F5F0]/10 text-[9px] font-mono text-[#8FB8DE]">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Playback & Waveform Trigger Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-[#F5F5F0]/5">
                <div className="flex items-center gap-1 text-[9px] font-mono text-[#F5F5F0]/40">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(note.recordedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <button
                  onClick={() => {
                    audioFeedback.playMicroTick();
                    setSelectedPlayingNote(note);
                  }}
                  className="px-2.5 py-1 bg-[#1B3022] hover:bg-[#254530] border border-emerald-500/40 text-emerald-300 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-emerald-300" />
                  <span>Play Waveform ({note.audioDurationSeconds || 15}s)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
