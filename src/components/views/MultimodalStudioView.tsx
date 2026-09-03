import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Mic, 
  Globe, 
  MapPin, 
  Upload, 
  Play, 
  Pause, 
  RefreshCw, 
  Check, 
  Send,
  ExternalLink,
  ShieldCheck,
  FileAudio,
  Sliders,
  Layers,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const MultimodalStudioView: React.FC<{ onOpenMoralSimulator: () => void }> = ({ onOpenMoralSimulator }) => {
  const { currentUser, isSigningIn, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'music' | 'transcribe' | 'grounded'>('image');

  // --- 1. Image Generation & Editing State ---
  const [imagePrompt, setImagePrompt] = useState('Biophilic zero-emission community hub built from compressed timber and solar-integrated glass in an East African valley');
  const [imageEditMode, setImageEditMode] = useState(false);
  const [uploadedBaseImage, setUploadedBaseImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  // --- 2. Video Generation (Veo) State ---
  const [videoPrompt, setVideoPrompt] = useState('Cinematic aerial sweep over regenerative terraces and agroforestry canopy at sunrise, 4k hyper-detailed');
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoUploadedImage, setVideoUploadedImage] = useState<string | null>(null);
  const [videoOperation, setVideoOperation] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  // --- 3. Music Generation (Lyria) State ---
  const [musicPrompt, setMusicPrompt] = useState('Gentle acoustic kora intertwined with contemplative ambient synthesizers and ambient forest birdsong');
  const [musicModel, setMusicModel] = useState<'lyria-3-clip-preview' | 'lyria-3-pro-preview'>('lyria-3-clip-preview');
  const [musicAudioUrl, setMusicAudioUrl] = useState<string | null>(null);
  const [musicLoading, setMusicLoading] = useState(false);

  // --- 4. Audio Transcription State ---
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptResult, setTranscriptResult] = useState<string | null>(null);
  const [transcribeLoading, setTranscribeLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // --- 5. Grounded Intelligence (Search & Maps) State ---
  const [groundedPrompt, setGroundedPrompt] = useState('What are the latest verified reforestation methodologies and regional climate corridors in Kenya and Tanzania?');
  const [groundedTool, setGroundedTool] = useState<'search' | 'maps' | 'both'>('both');
  const [groundedResult, setGroundedResult] = useState<any | null>(null);
  const [groundedLoading, setGroundedLoading] = useState(false);

  // --- Image Generator Handler ---
  const handleGenerateImage = async () => {
    setImageLoading(true);
    try {
      const base64Data = uploadedBaseImage ? uploadedBaseImage.split(',')[1] : undefined;
      const res = await fetch('/api/gemini/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          baseImageBase64: base64Data,
          editMode: imageEditMode && !!uploadedBaseImage,
        })
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);

        if (currentUser) {
          await addDoc(collection(db, 'user_generations'), {
            userId: currentUser.uid,
            type: 'image',
            prompt: imagePrompt,
            imageUrl: data.imageUrl,
            model: 'gemini-3.1-flash-image-preview',
            createdAt: serverTimestamp()
          });
        }
      }
    } catch (err) {
      console.error('Image error:', err);
    } finally {
      setImageLoading(false);
    }
  };

  // --- Video Generator Handler ---
  const handleGenerateVideo = async () => {
    setVideoLoading(true);
    setVideoUrl(null);
    try {
      const base64Data = videoUploadedImage ? videoUploadedImage.split(',')[1] : undefined;
      const res = await fetch('/api/gemini/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt,
          imageBase64: base64Data,
          aspectRatio: videoAspectRatio,
        })
      });
      const data = await res.json();
      if (data.operationName) {
        setVideoOperation(data.operationName);
        pollVideoStatus(data.operationName);
      }
    } catch (err) {
      console.error('Video gen error:', err);
      setVideoLoading(false);
    }
  };

  const pollVideoStatus = async (operationName: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/gemini/video/status?operationName=${encodeURIComponent(operationName)}`);
        const data = await res.json();
        if (data.done) {
          clearInterval(interval);
          setVideoLoading(false);
          if (data.videoUri) {
            setVideoUrl(data.videoUri);
          }
        }
      } catch (err) {
        clearInterval(interval);
        setVideoLoading(false);
      }
    }, 5000);
  };

  // --- Music Generator Handler ---
  const handleGenerateMusic = async () => {
    setMusicLoading(true);
    setMusicAudioUrl(null);
    try {
      const res = await fetch('/api/gemini/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: musicPrompt,
          model: musicModel,
        })
      });
      const data = await res.json();
      if (data.audioUrl) {
        setMusicAudioUrl(data.audioUrl);
      }
    } catch (err) {
      console.error('Music error:', err);
    } finally {
      setMusicLoading(false);
    }
  };

  // --- Audio Recording & Transcription Handler ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          transcribeAudio(base64Audio);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Recording permission error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (base64Audio: string) => {
    setTranscribeLoading(true);
    try {
      const res = await fetch('/api/gemini/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: base64Audio,
          mimeType: 'audio/webm'
        })
      });
      const data = await res.json();
      setTranscriptResult(data.text);
    } catch (err) {
      console.error('Transcribe error:', err);
    } finally {
      setTranscribeLoading(false);
    }
  };

  // --- Grounded Search & Maps Handler ---
  const handleRunGroundedQuery = async () => {
    setGroundedLoading(true);
    try {
      const res = await fetch('/api/gemini/grounded', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: groundedPrompt,
          toolType: groundedTool
        })
      });
      const data = await res.json();
      setGroundedResult(data);
    } catch (err) {
      console.error('Grounded query error:', err);
    } finally {
      setGroundedLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              GEMINI MULTIMODAL INTELLIGENCE SUITE
            </span>
            <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#1B3022] text-[#C5A059] rounded-sm border border-[#C5A059]/40">
              Veo 3.1 • Lyria 3 • Gemini 3.5
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">Atlas Multimodal Studio</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-3xl font-sans">
            Synthesize regenerative artifacts across visual design, acoustic environments, cinematic simulations, live grounding, and precision audio transcriptions.
          </p>
        </div>

        {/* User Auth Sync Status */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="p-2 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#1B3022] flex items-center justify-center text-[#C5A059] font-bold text-xs">
                {currentUser.displayName?.[0] || 'U'}
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold font-mono text-[#F5F5F0] truncate max-w-[140px]">
                  {currentUser.displayName || currentUser.email}
                </div>
                <div className="text-[8px] font-mono text-emerald-400">Firestore Cloud Sync ON</div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              disabled={isSigningIn}
              className={`px-4 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#C5A059] rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer ${
                isSigningIn ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In with Google</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#F5F5F0]/10">
        <button
          onClick={() => setActiveTab('image')}
          className={`px-4 py-2.5 rounded-sm text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'image'
              ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/60 font-bold'
              : 'bg-[#0D0D0D] text-[#F5F5F0]/60 border border-[#F5F5F0]/10 hover:text-[#F5F5F0]'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Image Gen & Edit</span>
        </button>

        <button
          onClick={() => setActiveTab('video')}
          className={`px-4 py-2.5 rounded-sm text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'video'
              ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/60 font-bold'
              : 'bg-[#0D0D0D] text-[#F5F5F0]/60 border border-[#F5F5F0]/10 hover:text-[#F5F5F0]'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Veo 3.1 Video Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('music')}
          className={`px-4 py-2.5 rounded-sm text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'music'
              ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/60 font-bold'
              : 'bg-[#0D0D0D] text-[#F5F5F0]/60 border border-[#F5F5F0]/10 hover:text-[#F5F5F0]'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>Lyria 3 Music Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('transcribe')}
          className={`px-4 py-2.5 rounded-sm text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'transcribe'
              ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/60 font-bold'
              : 'bg-[#0D0D0D] text-[#F5F5F0]/60 border border-[#F5F5F0]/10 hover:text-[#F5F5F0]'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Audio Transcription</span>
        </button>

        <button
          onClick={() => setActiveTab('grounded')}
          className={`px-4 py-2.5 rounded-sm text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'grounded'
              ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/60 font-bold'
              : 'bg-[#0D0D0D] text-[#F5F5F0]/60 border border-[#F5F5F0]/10 hover:text-[#F5F5F0]'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Search & Maps Grounding</span>
        </button>
      </div>

      {/* 1. IMAGE GENERATOR & EDITOR */}
      {activeTab === 'image' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em]">
                gemini-3.1-flash-image-preview
              </span>
              <h3 className="text-base font-serif text-[#F5F5F0]">Create & Edit Biophilic Visualizations</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#F5F5F0] mb-1.5 font-mono">
                  Prompt / Edit Instructions
                </label>
                <textarea
                  rows={4}
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Describe architectural, ecological, or community design concepts..."
                  className="w-full p-3 bg-[#080808] border border-[#F5F5F0]/20 rounded-sm text-xs text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              {/* Edit Mode Toggle & Upload */}
              <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#F5F5F0]">Edit Existing Image</span>
                  <input
                    type="checkbox"
                    checked={imageEditMode}
                    onChange={(e) => setImageEditMode(e.target.checked)}
                    className="accent-[#C5A059] w-4 h-4"
                  />
                </div>

                {imageEditMode && (
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setUploadedBaseImage(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-xs text-[#F5F5F0]/60 file:mr-2 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:bg-[#1B3022] file:text-[#C5A059] hover:file:bg-[#254530]"
                    />
                    {uploadedBaseImage && (
                      <div className="relative w-20 h-20 border border-[#F5F5F0]/20 rounded overflow-hidden">
                        <img src={uploadedBaseImage} alt="Base" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={handleGenerateImage}
                disabled={imageLoading || !imagePrompt.trim()}
                className="w-full py-3 bg-[#C5A059] hover:bg-[#B38E46] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {imageLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {imageEditMode ? 'Transform Image with Gemini' : 'Generate Concept Render'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm flex flex-col items-center justify-center min-h-[350px]">
            {generatedImage ? (
              <div className="w-full space-y-3">
                <div className="rounded-sm overflow-hidden border border-[#F5F5F0]/20 max-h-[480px] flex items-center justify-center bg-black">
                  <img src={generatedImage} alt="Generated" className="max-w-full h-auto object-contain" />
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-[#F5F5F0]/60">
                  <span>Model: gemini-3.1-flash-image-preview</span>
                  <a href={generatedImage} download="atlas-concept.png" className="text-[#C5A059] hover:underline">
                    Download Render
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3 max-w-sm">
                <ImageIcon className="w-12 h-12 text-[#F5F5F0]/20 mx-auto" />
                <h4 className="text-sm font-mono text-[#F5F5F0]/60">No Concept Generated Yet</h4>
                <p className="text-xs text-[#F5F5F0]/40 font-sans">
                  Craft a regenerative design prompt on the left to synthesize photorealistic architectural and ecological assets.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. VEO VIDEO GENERATOR (veo-3.1-fast-generate-preview) */}
      {activeTab === 'video' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em]">
                veo-3.1-fast-generate-preview
              </span>
              <h3 className="text-base font-serif text-[#F5F5F0]">Cinematic Planetary Video Generation</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#F5F5F0] mb-1.5 font-mono">
                  Video Cinematic Prompt
                </label>
                <textarea
                  rows={3}
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder="Describe camera movement, lighting, ecological context..."
                  className="w-full p-3 bg-[#080808] border border-[#F5F5F0]/20 rounded-sm text-xs text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              {/* Aspect Ratio Toggle (16:9 or 9:16) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-[#F5F5F0]/70">Aspect Ratio Requirement:</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setVideoAspectRatio('16:9')}
                    className={`flex-1 py-2 rounded-sm text-xs font-mono uppercase tracking-wider ${
                      videoAspectRatio === '16:9'
                        ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/60 font-bold'
                        : 'bg-[#080808] text-[#F5F5F0]/60 border border-[#F5F5F0]/10'
                    }`}
                  >
                    16:9 Landscape
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoAspectRatio('9:16')}
                    className={`flex-1 py-2 rounded-sm text-xs font-mono uppercase tracking-wider ${
                      videoAspectRatio === '9:16'
                        ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/60 font-bold'
                        : 'bg-[#080808] text-[#F5F5F0]/60 border border-[#F5F5F0]/10'
                    }`}
                  >
                    9:16 Portrait
                  </button>
                </div>
              </div>

              {/* Optional Animate from Photo */}
              <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-2">
                <label className="block text-xs font-mono text-[#F5F5F0]">Animate from Photo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setVideoUploadedImage(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-xs text-[#F5F5F0]/60 file:mr-2 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:bg-[#1B3022] file:text-[#C5A059]"
                />
              </div>

              <button
                onClick={handleGenerateVideo}
                disabled={videoLoading || (!videoPrompt.trim() && !videoUploadedImage)}
                className="w-full py-3 bg-[#C5A059] hover:bg-[#B38E46] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {videoLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                {videoUploadedImage ? 'Animate Photo into Video (Veo)' : 'Generate Video from Text (Veo)'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm flex flex-col items-center justify-center min-h-[350px]">
            {videoLoading ? (
              <div className="text-center space-y-3">
                <RefreshCw className="w-10 h-10 text-[#C5A059] animate-spin mx-auto" />
                <h4 className="text-sm font-mono text-[#F5F5F0]">Veo 3.1 Video Synthesis in Progress</h4>
                <p className="text-xs text-[#F5F5F0]/50 font-sans max-w-xs">
                  Polling operation status. High-fidelity temporal diffusion rendering active.
                </p>
              </div>
            ) : videoUrl ? (
              <div className="w-full space-y-3">
                <video src={videoUrl} controls autoPlay loop className="w-full rounded border border-[#F5F5F0]/20" />
                <div className="text-xs font-mono text-[#C5A059]">Generated with veo-3.1-fast-generate-preview ({videoAspectRatio})</div>
              </div>
            ) : (
              <div className="text-center space-y-3 max-w-sm">
                <Video className="w-12 h-12 text-[#F5F5F0]/20 mx-auto" />
                <h4 className="text-sm font-mono text-[#F5F5F0]/60">Veo Cinematic Stream Ready</h4>
                <p className="text-xs text-[#F5F5F0]/40 font-sans">
                  Generate text-to-video or upload a landscape photo to animate into a 16:9 or 9:16 cinematic flyover.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. MUSIC GENERATOR (Lyria 3) */}
      {activeTab === 'music' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em]">
                Interactions API • Lyria 3
              </span>
              <h3 className="text-base font-serif text-[#F5F5F0]">Harmonic & Organic Soundscape Studio</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#F5F5F0] mb-1.5 font-mono">
                  Music Soundscape Prompt
                </label>
                <textarea
                  rows={3}
                  value={musicPrompt}
                  onChange={(e) => setMusicPrompt(e.target.value)}
                  placeholder="Describe instruments, tempo, mood, environmental elements..."
                  className="w-full p-3 bg-[#080808] border border-[#F5F5F0]/20 rounded-sm text-xs text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-[#F5F5F0]/70">Model Selection:</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMusicModel('lyria-3-clip-preview')}
                    className={`flex-1 py-2 rounded-sm text-xs font-mono uppercase tracking-wider ${
                      musicModel === 'lyria-3-clip-preview'
                        ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/60 font-bold'
                        : 'bg-[#080808] text-[#F5F5F0]/60 border border-[#F5F5F0]/10'
                    }`}
                  >
                    Short Clip (&le;30s)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMusicModel('lyria-3-pro-preview')}
                    className={`flex-1 py-2 rounded-sm text-xs font-mono uppercase tracking-wider ${
                      musicModel === 'lyria-3-pro-preview'
                        ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/60 font-bold'
                        : 'bg-[#080808] text-[#F5F5F0]/60 border border-[#F5F5F0]/10'
                    }`}
                  >
                    Full Track (Pro)
                  </button>
                </div>
              </div>

              <button
                onClick={handleGenerateMusic}
                disabled={musicLoading || !musicPrompt.trim()}
                className="w-full py-3 bg-[#C5A059] hover:bg-[#B38E46] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {musicLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Music className="w-4 h-4" />}
                Synthesize Audio Composition
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm flex flex-col items-center justify-center min-h-[300px]">
            {musicAudioUrl ? (
              <div className="w-full max-w-md p-6 bg-[#080808] border border-[#C5A059]/40 rounded-sm space-y-4 text-center">
                <Music className="w-10 h-10 text-[#C5A059] mx-auto animate-pulse" />
                <h4 className="text-sm font-bold font-mono text-[#F5F5F0]">{musicPrompt}</h4>
                <audio src={musicAudioUrl} controls className="w-full" />
                <div className="text-[10px] font-mono text-[#F5F5F0]/50">Model: {musicModel}</div>
              </div>
            ) : (
              <div className="text-center space-y-3 max-w-sm">
                <Music className="w-12 h-12 text-[#F5F5F0]/20 mx-auto" />
                <h4 className="text-sm font-mono text-[#F5F5F0]/60">Acoustic Synthesizer Ready</h4>
                <p className="text-xs text-[#F5F5F0]/40 font-sans">
                  Generate generative soundscapes with Lyria 3 clip or pro preview models.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. AUDIO TRANSCRIPTION (gemini-3.5-flash) */}
      {activeTab === 'transcribe' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em]">
                gemini-3.5-flash audio transcription
              </span>
              <h3 className="text-base font-serif text-[#F5F5F0]">Voice Field Notes Transcription</h3>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-[#F5F5F0]/70 leading-relaxed font-sans">
                Record your voice or field observations directly with your microphone. Gemini 3.5 Flash will transcribe and organize the content with precision.
              </p>

              <div className="p-4 bg-[#080808] border border-[#F5F5F0]/15 rounded-sm flex flex-col items-center justify-center space-y-3">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
                  isRecording ? 'border-rose-500 bg-rose-950/40 animate-pulse' : 'border-[#C5A059] bg-[#1B3022]/30'
                }`}>
                  <Mic className={`w-8 h-8 ${isRecording ? 'text-rose-400' : 'text-[#C5A059]'}`} />
                </div>
                <div className="text-xs font-mono font-bold">
                  {isRecording ? 'Recording Live Microphone...' : 'Microphone Ready'}
                </div>

                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#B38E46] text-black font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                  >
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                  >
                    Stop & Transcribe
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold mb-3">
              Transcript Output
            </h4>
            {transcribeLoading ? (
              <div className="p-8 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#C5A059] animate-spin mx-auto" />
                <p className="text-xs font-mono text-[#F5F5F0]/70">Transcribing audio via gemini-3.5-flash...</p>
              </div>
            ) : transcriptResult ? (
              <div className="p-4 bg-[#080808] border border-[#F5F5F0]/15 rounded-sm whitespace-pre-wrap text-xs sm:text-sm font-sans leading-relaxed text-[#F5F5F0]">
                {transcriptResult}
              </div>
            ) : (
              <div className="p-8 text-center text-xs font-mono text-[#F5F5F0]/40">
                Record audio on the left to view the generated transcription here.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. SEARCH & MAPS GROUNDING (gemini-3.5-flash) */}
      {activeTab === 'grounded' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em]">
                gemini-3.5-flash Grounding
              </span>
              <h3 className="text-base font-serif text-[#F5F5F0]">Google Search & Maps Grounded Intelligence</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#F5F5F0] mb-1.5 font-mono">
                  Grounded Planetary Query
                </label>
                <textarea
                  rows={3}
                  value={groundedPrompt}
                  onChange={(e) => setGroundedPrompt(e.target.value)}
                  placeholder="Inquire about current live facts, places, locations, or environmental projects..."
                  className="w-full p-3 bg-[#080808] border border-[#F5F5F0]/20 rounded-sm text-xs text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-[#F5F5F0]/70">Grounding Tool:</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setGroundedTool('search')}
                    className={`flex-1 py-2 rounded-sm text-xs font-mono uppercase tracking-wider ${
                      groundedTool === 'search'
                        ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/60 font-bold'
                        : 'bg-[#080808] text-[#F5F5F0]/60 border border-[#F5F5F0]/10'
                    }`}
                  >
                    Google Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setGroundedTool('maps')}
                    className={`flex-1 py-2 rounded-sm text-xs font-mono uppercase tracking-wider ${
                      groundedTool === 'maps'
                        ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/60 font-bold'
                        : 'bg-[#080808] text-[#F5F5F0]/60 border border-[#F5F5F0]/10'
                    }`}
                  >
                    Google Maps
                  </button>
                  <button
                    type="button"
                    onClick={() => setGroundedTool('both')}
                    className={`flex-1 py-2 rounded-sm text-xs font-mono uppercase tracking-wider ${
                      groundedTool === 'both'
                        ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/60 font-bold'
                        : 'bg-[#080808] text-[#F5F5F0]/60 border border-[#F5F5F0]/10'
                    }`}
                  >
                    Both
                  </button>
                </div>
              </div>

              <button
                onClick={handleRunGroundedQuery}
                disabled={groundedLoading || !groundedPrompt.trim()}
                className="w-full py-3 bg-[#C5A059] hover:bg-[#B38E46] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {groundedLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                Synthesize Grounded Intelligence
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold">
              Grounded Evidence & Sources
            </h4>

            {groundedLoading ? (
              <div className="p-8 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#C5A059] animate-spin mx-auto" />
                <p className="text-xs font-mono text-[#F5F5F0]/70">Querying real-time Google Grounding APIs...</p>
              </div>
            ) : groundedResult ? (
              <div className="space-y-4">
                <div className="p-4 bg-[#080808] border border-[#F5F5F0]/15 rounded-sm text-xs sm:text-sm font-sans leading-relaxed text-[#F5F5F0]/90 whitespace-pre-wrap">
                  {groundedResult.text}
                </div>

                {groundedResult.sources && groundedResult.sources.length > 0 && (
                  <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-2">
                    <span className="text-[10px] font-mono uppercase text-[#8FB8DE] font-bold tracking-wider">
                      Grounding References:
                    </span>
                    <ul className="space-y-1">
                      {groundedResult.sources.map((s: any, idx: number) => (
                        <li key={idx}>
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#C5A059] hover:underline flex items-center gap-1.5"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>{s.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-xs font-mono text-[#F5F5F0]/40">
                Run a grounded search or maps query to evaluate real-time evidence.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
