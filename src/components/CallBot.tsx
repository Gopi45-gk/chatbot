import { useState, useEffect, useRef, useCallback } from 'react';
import { getVoiceResponse } from '../engine/aiEngine';

interface CallLog {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

type CallState = 'idle' | 'connecting' | 'active' | 'listening' | 'processing' | 'speaking';

export default function CallBot() {
  const [callState, setCallState] = useState<CallState>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [waveformBars, setWaveformBars] = useState<number[]>(Array(20).fill(20));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (synthRef.current) synthRef.current.cancel();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
    };
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [callLogs]);

  // Animate waveform
  useEffect(() => {
    if (callState === 'active' || callState === 'listening' || callState === 'speaking') {
      const interval = setInterval(() => {
        setWaveformBars(prev => prev.map(() => Math.random() * 80 + 20));
      }, 150);
      return () => clearInterval(interval);
    } else {
      setWaveformBars(Array(20).fill(20));
    }
  }, [callState]);

  // Call timer
  useEffect(() => {
    if (callState === 'active' || callState === 'listening' || callState === 'speaking' || callState === 'processing') {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
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

  const startCall = useCallback(() => {
    setCallState('connecting');
    setCallDuration(0);
    setCallLogs([{
      id: Date.now(),
      text: "Connecting to MNN AI Bot...",
      sender: 'bot',
      timestamp: new Date(),
    }]);

    setTimeout(() => {
      setCallState('active');
      setCallLogs(prev => [...prev, {
        id: Date.now(),
        text: "Hello! I'm your MNN AI assistant. I'm listening... speak to me!",
        sender: 'bot',
        timestamp: new Date(),
      }]);
      
      // Try to speak the greeting
      if (synthRef.current && isSpeakerOn) {
        const utterance = new SpeechSynthesisUtterance("Hello! I'm your MNN AI assistant. I'm listening, speak to me!");
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        synthRef.current.speak(utterance);
      }
      
      startListening();
    }, 2000);
  }, [isSpeakerOn]);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setCallLogs(prev => [...prev, {
        id: Date.now(),
        text: "Speech recognition not supported. Type your message below instead.",
        sender: 'bot',
        timestamp: new Date(),
      }]);
      setCallState('active');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCallState('processing');
      setCallLogs(prev => [...prev, {
        id: Date.now(),
        text: transcript,
        sender: 'user',
        timestamp: new Date(),
      }]);

      // Process response
      setTimeout(() => {
        const response = getVoiceResponse(transcript);
        setCallState('speaking');
        setCallLogs(prev => [...prev, {
          id: Date.now() + 1,
          text: response,
          sender: 'bot',
          timestamp: new Date(),
        }]);

        if (synthRef.current && isSpeakerOn) {
          const utterance = new SpeechSynthesisUtterance(response);
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          utterance.onend = () => {
            setCallState('listening');
            startListening();
          };
          synthRef.current.speak(utterance);
        } else {
          setTimeout(() => {
            setCallState('listening');
            startListening();
          }, 1000);
        }
      }, 800);
    };

    recognition.onerror = () => {
      setCallState('active');
      // Retry listening
      setTimeout(() => startListening(), 500);
    };

    recognition.onend = () => {
      if (callState !== 'idle') {
        // Will be restarted by onresult or onend handler
      }
    };

    recognitionRef.current = recognition;
    setCallState('listening');
    try {
      recognition.start();
    } catch(e) {
      setCallState('active');
    }
  }, [isSpeakerOn, callState]);

  const endCall = () => {
    if (synthRef.current) synthRef.current.cancel();
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    }
    setCallState('idle');
    setCallLogs(prev => [...prev, {
      id: Date.now(),
      text: `Call ended. Duration: ${formatDuration(callDuration)}`,
      sender: 'bot',
      timestamp: new Date(),
    }]);
  };

  const handleTextInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
      const text = (e.target as HTMLInputElement).value.trim();
      (e.target as HTMLInputElement).value = '';
      
      setCallLogs(prev => [...prev, {
        id: Date.now(),
        text: text,
        sender: 'user',
        timestamp: new Date(),
      }]);

      setCallState('processing');
      setTimeout(() => {
        const response = getVoiceResponse(text);
        setCallState('speaking');
        setCallLogs(prev => [...prev, {
          id: Date.now() + 1,
          text: response,
          sender: 'bot',
          timestamp: new Date(),
        }]);

        if (synthRef.current && isSpeakerOn) {
          const utterance = new SpeechSynthesisUtterance(response);
          utterance.onend = () => {
            setCallState('listening');
            startListening();
          };
          synthRef.current.speak(utterance);
        } else {
          setCallState('active');
        }
      }, 800);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Call Header */}
      <div className="px-4 py-3 text-center">
        <p className="text-gray-400 text-xs uppercase tracking-wider">
          {callState === 'idle' ? 'Voice Call' : callState === 'connecting' ? 'Connecting...' : 'MNN Voice Call'}
        </p>
      </div>

      {/* Main Call Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Avatar */}
        <div className="relative mb-6">
          <div className={`w-28 h-28 rounded-full flex items-center justify-center ${
            callState === 'idle' ? 'bg-gray-700' :
            callState === 'connecting' ? 'bg-yellow-600 animate-pulse' :
            callState === 'listening' ? 'bg-green-600' :
            callState === 'speaking' ? 'bg-blue-600' :
            'bg-indigo-600'
          } transition-colors duration-500`}>
            <span className="text-5xl">🤖</span>
          </div>
          {callState !== 'idle' && (
            <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping"></div>
          )}
        </div>

        {/* Bot Name */}
        <h2 className="text-white text-xl font-bold mb-1">MNN AI Bot</h2>
        <p className="text-gray-400 text-sm mb-4">
          {callState === 'idle' ? 'Tap to start a voice call' :
           callState === 'connecting' ? 'Establishing connection...' :
           callState === 'listening' ? '🎤 Listening...' :
           callState === 'processing' ? '🧠 Thinking...' :
           callState === 'speaking' ? '🔊 Speaking...' :
           '📞 Call Active'}
        </p>

        {/* Duration */}
        {callState !== 'idle' && (
          <div className="bg-white/10 rounded-full px-4 py-1 mb-6">
            <span className="text-white text-sm font-mono">{formatDuration(callDuration)}</span>
          </div>
        )}

        {/* Waveform */}
        {(callState === 'listening' || callState === 'speaking') && (
          <div className="flex items-center justify-center gap-0.5 h-16 mb-6">
            {waveformBars.map((height, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  callState === 'listening' ? 'bg-green-400' : 'bg-blue-400'
                }`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        )}

        {/* Call Log */}
        <div className="w-full max-w-sm max-h-48 overflow-y-auto mb-4 space-y-2">
          {callLogs.slice(-6).map((log) => (
            <div
              key={log.id}
              className={`rounded-lg px-3 py-2 text-xs ${
                log.sender === 'user'
                  ? 'bg-blue-600/30 text-blue-200 ml-8'
                  : 'bg-white/10 text-gray-300 mr-8'
              }`}
            >
              <span className="font-medium">
                {log.sender === 'user' ? '🎤 You' : '🤖 Bot'}:
              </span>{' '}
              {log.text}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* Call Controls */}
      <div className="px-6 pb-8 pt-4">
        {callState === 'idle' ? (
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={startCall}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-all shadow-lg shadow-green-500/30 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <p className="text-gray-400 text-sm">Tap to call MNN AI Bot</p>
            <p className="text-gray-500 text-xs">Uses device microphone & speaker</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {/* Control buttons */}
            <div className="flex items-center gap-6 mb-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isMuted ? 'bg-red-500/30 text-red-400' : 'bg-white/10 text-white'
                }`}
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

              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  !isSpeakerOn ? 'bg-red-500/30 text-red-400' : 'bg-white/10 text-white'
                }`}
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

            {/* Text input for when mic isn't available */}
            <div className="w-full max-w-sm">
              <input
                type="text"
                placeholder="Or type here and press Enter..."
                onKeyDown={handleTextInput}
                className="w-full bg-white/10 text-white rounded-full px-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* End call button */}
            <button
              onClick={endCall}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-lg shadow-red-500/30 active:scale-95 mt-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white rotate-[135deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
