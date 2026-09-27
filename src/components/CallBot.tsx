import { useState, useEffect, useRef, useCallback } from 'react';
import { getVoiceResponse } from '../engine/aiEngine';

interface CallLog {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

type CallState = 'idle' | 'connecting' | 'active' | 'listening' | 'processing' | 'speaking' | 'error';

export default function CallBot() {
  const [callState, setCallState] = useState<CallState>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [waveformBars, setWaveformBars] = useState<number[]>(Array(24).fill(15));
  const [textInput, setTextInput] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const isListeningRef = useRef(false);
  const callActiveRef = useRef(false);
  const callStateRef = useRef<CallState>('idle');
  
  // Keep ref in sync with state
  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    
    // Check speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
    
    return () => {
      callActiveRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        isListeningRef.current = false;
        try { recognitionRef.current.abort(); } catch(e) {}
      }
    };
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [callLogs]);

  // Animate waveform
  useEffect(() => {
    if (callState === 'listening' || callState === 'speaking') {
      const interval = setInterval(() => {
        setWaveformBars(prev => prev.map(() => Math.random() * 85 + 15));
      }, 120);
      return () => clearInterval(interval);
    } else if (callState === 'processing') {
      const interval = setInterval(() => {
        setWaveformBars(prev => prev.map((_, i) => {
          const wave = Math.sin(Date.now() / 200 + i * 0.5) * 30 + 50;
          return wave;
        }));
      }, 80);
      return () => clearInterval(interval);
    } else {
      setWaveformBars(Array(24).fill(15));
    }
  }, [callState]);

  // Call timer
  useEffect(() => {
    if (callState !== 'idle' && callState !== 'connecting' && callState !== 'error') {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addLog = (text: string, sender: 'user' | 'bot') => {
    setCallLogs(prev => [...prev, {
      id: Date.now() + Math.random(),
      text,
      sender,
      timestamp: new Date(),
    }]);
  };

  const speakText = useCallback((text: string, onEnd?: () => void) => {
    if (!synthRef.current || !isSpeakerOn) {
      onEnd?.();
      return;
    }
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Try to find a good voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) 
      || voices.find(v => v.lang.startsWith('en'))
      || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.onend = () => {
      if (callActiveRef.current) {
        onEnd?.();
      }
    };
    utterance.onerror = () => {
      if (callActiveRef.current) {
        onEnd?.();
      }
    };
    
    synthRef.current.speak(utterance);
  }, [isSpeakerOn]);

  const startListening = useCallback(() => {
    if (!callActiveRef.current || isMuted) return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setCallState('active');
      return;
    }

    // Stop any existing recognition
    if (recognitionRef.current) {
      isListeningRef.current = false;
      try { recognitionRef.current.abort(); } catch(e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      
      if (!transcript.trim()) {
        // Empty result, restart listening
        if (callActiveRef.current) {
          setTimeout(() => startListening(), 300);
        }
        return;
      }

      addLog(transcript, 'user');
      setCallState('processing');

      // Process response
      setTimeout(() => {
        const response = getVoiceResponse(transcript);
        addLog(response, 'bot');
        setCallState('speaking');

        speakText(response, () => {
          if (callActiveRef.current && !isMuted) {
            setCallState('listening');
            setTimeout(() => startListening(), 200);
          }
        });
      }, 500);
    };

    recognition.onerror = (event: any) => {
      if (!callActiveRef.current) return;
      
      // Don't treat 'no-speech' or 'aborted' as errors
      if (event.error === 'no-speech' || event.error === 'aborted') {
        if (callActiveRef.current && !isMuted) {
          setTimeout(() => startListening(), 500);
        }
        return;
      }
      
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setErrorMessage('Microphone access denied. Please allow microphone permission.');
        setCallState('error');
        return;
      }

      // For other errors, retry
      if (callActiveRef.current) {
        setTimeout(() => startListening(), 1000);
      }
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      // Auto-restart if call is still active and we're in listening state
      if (callActiveRef.current && !isMuted && callStateRef.current !== 'processing' && callStateRef.current !== 'speaking') {
        setTimeout(() => startListening(), 300);
      }
    };

    recognitionRef.current = recognition;
    isListeningRef.current = true;
    setCallState('listening');
    
    try {
      recognition.start();
    } catch(e) {
      // If start fails, retry
      setTimeout(() => {
        if (callActiveRef.current) startListening();
      }, 500);
    }
  }, [isMuted, speakText]);

  const startCall = () => {
    setCallState('connecting');
    setCallDuration(0);
    setCallLogs([]);
    setErrorMessage('');
    callActiveRef.current = true;

    addLog("Connecting to MNN AI Bot...", 'bot');

    setTimeout(() => {
      const greeting = "Hello! I'm your MNN AI assistant. I'm listening. What would you like to talk about?";
      addLog(greeting, 'bot');
      setCallState('speaking');

      speakText(greeting, () => {
        if (callActiveRef.current) {
          setCallState('listening');
          startListening();
        }
      });
    }, 1500);
  };

  const endCall = () => {
    callActiveRef.current = false;
    isListeningRef.current = false;
    
    if (synthRef.current) synthRef.current.cancel();
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch(e) {}
      recognitionRef.current = null;
    }
    
    addLog(`Call ended. Duration: ${formatDuration(callDuration)}`, 'bot');
    setCallState('idle');
  };

  const handleTextSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && textInput.trim() && callState !== 'idle' && callState !== 'connecting') {
      e.preventDefault();
      const text = textInput.trim();
      setTextInput('');
      
      addLog(text, 'user');
      setCallState('processing');

      setTimeout(() => {
        const response = getVoiceResponse(text);
        addLog(response, 'bot');
        setCallState('speaking');

        speakText(response, () => {
          if (callActiveRef.current) {
            if (!isMuted && speechSupported) {
              setCallState('listening');
              startListening();
            } else {
              setCallState('active');
            }
          }
        });
      }, 500);
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    
    if (newMuted && recognitionRef.current) {
      isListeningRef.current = false;
      try { recognitionRef.current.abort(); } catch(e) {}
      setCallState('active');
    } else if (!newMuted && callActiveRef.current) {
      setCallState('listening');
      startListening();
    }
  };

  const getStatusText = () => {
    switch (callState) {
      case 'idle': return 'Tap to start a voice call';
      case 'connecting': return 'Establishing connection...';
      case 'active': return isMuted ? '🔇 Microphone muted' : '📞 Call active — type below';
      case 'listening': return '🎤 Listening... speak now';
      case 'processing': return '🧠 Processing with MNN...';
      case 'speaking': return '🔊 Speaking...';
      case 'error': return '⚠️ Error occurred';
      default: return '';
    }
  };

  const getStatusColor = () => {
    switch (callState) {
      case 'idle': return 'bg-gray-600';
      case 'connecting': return 'bg-yellow-500 animate-pulse';
      case 'active': return 'bg-blue-500';
      case 'listening': return 'bg-green-500';
      case 'processing': return 'bg-purple-500 animate-pulse';
      case 'speaking': return 'bg-blue-500 animate-pulse';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900">
      {/* Call Header */}
      <div className="px-4 py-3 text-center flex-shrink-0">
        <p className="text-gray-400 text-xs uppercase tracking-widest font-medium">
          {callState === 'idle' ? 'Voice Call' : 'MNN Voice Call'}
        </p>
      </div>

      {/* Main Call Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Avatar */}
        <div className="relative mb-5">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${getStatusColor()} transition-colors duration-500 shadow-xl`}>
            <span className="text-4xl">🤖</span>
          </div>
          {(callState === 'listening' || callState === 'speaking') && (
            <>
              <div className="absolute inset-[-8px] rounded-full border-2 border-white/20 animate-ping"></div>
              <div className="absolute inset-[-16px] rounded-full border border-white/10 animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </>
          )}
        </div>

        {/* Bot Name & Status */}
        <h2 className="text-white text-lg font-bold mb-1">MNN AI Bot</h2>
        <p className="text-gray-400 text-sm mb-3">{getStatusText()}</p>

        {/* Duration */}
        {callState !== 'idle' && callState !== 'connecting' && (
          <div className="bg-white/10 rounded-full px-4 py-1 mb-4 backdrop-blur-sm">
            <span className="text-white text-sm font-mono">{formatDuration(callDuration)}</span>
          </div>
        )}

        {/* Waveform */}
        {(callState === 'listening' || callState === 'speaking' || callState === 'processing') && (
          <div className="flex items-center justify-center gap-[3px] h-14 mb-4 w-full max-w-xs">
            {waveformBars.map((height, i) => (
              <div
                key={i}
                className={`w-[3px] rounded-full transition-all duration-100 ${
                  callState === 'listening' ? 'bg-green-400' : 
                  callState === 'speaking' ? 'bg-blue-400' : 
                  'bg-purple-400'
                }`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        )}

        {/* Error Message */}
        {callState === 'error' && errorMessage && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-2 mb-4 max-w-xs">
            <p className="text-red-300 text-xs text-center">{errorMessage}</p>
          </div>
        )}

        {/* Call Log */}
        <div className="w-full max-w-sm flex-1 min-h-0 overflow-y-auto mb-3 space-y-1.5 px-1">
          {callLogs.slice(-8).map((log) => (
            <div
              key={log.id}
              className={`rounded-xl px-3 py-2 text-xs animate-slide-up ${
                log.sender === 'user'
                  ? 'bg-blue-600/20 text-blue-200 ml-6 border border-blue-500/20'
                  : 'bg-white/5 text-gray-300 mr-6 border border-white/10'
              }`}
            >
              <span className="font-semibold text-[10px] uppercase tracking-wider opacity-70">
                {log.sender === 'user' ? '🎤 You' : '🤖 Bot'}
              </span>
              <p className="mt-0.5 leading-relaxed">{log.text}</p>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* Call Controls */}
      <div className="px-6 pb-6 pt-3 flex-shrink-0">
        {callState === 'idle' ? (
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={startCall}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-all shadow-lg shadow-green-500/30 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <p className="text-gray-400 text-sm">Tap to call MNN AI Bot</p>
            {!speechSupported && (
              <p className="text-yellow-400/70 text-xs text-center max-w-xs">
                ⚠️ Speech recognition not supported in this browser. You can still type during calls.
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            {/* Text input */}
            <div className="w-full max-w-sm">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={handleTextSubmit}
                placeholder={isMuted || !speechSupported ? "Type your message & press Enter..." : "Or type here and press Enter..."}
                className="w-full bg-white/10 text-white rounded-full px-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
                disabled={callState === 'connecting'}
              />
            </div>

            {/* Control buttons */}
            <div className="flex items-center gap-5">
              <button
                onClick={toggleMute}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )}
              </button>

              {/* End call */}
              <button
                onClick={endCall}
                className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-lg shadow-red-500/30 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white rotate-[135deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>

              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  !isSpeakerOn ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title={isSpeakerOn ? 'Speaker on' : 'Speaker off'}
              >
                {isSpeakerOn ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
