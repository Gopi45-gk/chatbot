import { useState, useRef, useEffect, useCallback } from 'react';
import { getCameraAnalysis, getAIResponse } from '../engine/aiEngine';

interface AnalysisResult {
  id: number;
  description: string;
  objects: string[];
  timestamp: Date;
  imageData?: string;
}

export default function CameraBot() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [flashEffect, setFlashEffect] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsCameraOn(true);
    } catch (err) {
      console.error('Camera access denied:', err);
      alert('Camera access is required for vision features. Please allow camera access.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureAndAnalyze = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsAnalyzing(true);
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 200);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);

      // Simulate MNN inference delay
      setTimeout(() => {
        const analysis = getCameraAnalysis();
        
        // Add contextual response based on what "camera sees"
        const contextResponse = getAIResponse("describe what you see in the camera");
        
        const result: AnalysisResult = {
          id: Date.now(),
          description: `${analysis.description}\n\n${contextResponse.text}`,
          objects: analysis.objects,
          timestamp: new Date(),
          imageData,
        };

        setResults(prev => [result, ...prev]);
        setIsAnalyzing(false);
      }, 1500 + Math.random() * 1000);
    }
  }, []);

  const objectIcons: Record<string, string> = {
    person: '👤', chair: '🪑', table: '🪵', laptop: '💻', phone: '📱',
    book: '📚', cup: '☕', bottle: '🍶', keyboard: '⌨️', monitor: '🖥️',
    plant: '🌱', window: '🪟', door: '🚪', light: '💡', bag: '👜',
    cat: '🐱', dog: '🐕', car: '🚗', tree: '🌳', flower: '🌸',
    clock: '⏰', 'picture frame': '🖼️',
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-xl">📷</span>
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">MNN Vision</h2>
          <p className="text-purple-100 text-xs">Camera • Object Detection • Offline AI</p>
        </div>
        <div className="ml-auto">
          {isAnalyzing && (
            <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
              <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
              <span className="text-white text-xs">Analyzing</span>
            </div>
          )}
        </div>
      </div>

      {/* Camera View */}
      <div className="relative flex-1 bg-black overflow-hidden">
        {isCameraOn ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Flash effect */}
            {flashEffect && (
              <div className="absolute inset-0 bg-white/50 animate-pulse"></div>
            )}

            {/* Scanning overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-green-400 rounded-lg animate-pulse">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>
                </div>
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/70 rounded-full px-4 py-2">
                  <p className="text-green-400 text-sm font-mono">MNN Processing...</p>
                </div>
              </div>
            )}

            {/* Camera grid overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                {Array(9).fill(0).map((_, i) => (
                  <div key={i} className="border border-white/10"></div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-24 h-24 bg-purple-600/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-5xl">📷</span>
            </div>
            <h3 className="text-white text-lg font-bold mb-2">Camera Vision</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Enable camera to let MNN analyze your surroundings using on-device neural networks
            </p>
            <button
              onClick={startCamera}
              className="bg-purple-600 text-white px-6 py-3 rounded-full font-medium hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/30 active:scale-95"
            >
              Enable Camera
            </button>
          </div>
        )}
      </div>

      {/* Camera Controls */}
      {isCameraOn && (
        <div className="bg-gray-800 px-6 py-4 flex items-center justify-center gap-6">
          <button
            onClick={stopCamera}
            className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-gray-600 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            onClick={captureAndAnalyze}
            disabled={isAnalyzing}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className={`w-12 h-12 rounded-full border-4 ${isAnalyzing ? 'border-purple-400 animate-spin' : 'border-gray-800'}`}></div>
          </button>

          <button
            className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-gray-600 transition-all"
            onClick={() => {
              if (videoRef.current) {
                // Switch camera
                stopCamera();
                setTimeout(() => startCamera(), 300);
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      )}

      {/* Analysis Results */}
      {results.length > 0 && (
        <div className="bg-gray-800 border-t border-gray-700 max-h-64 overflow-y-auto">
          <div className="px-4 py-2 bg-gray-750">
            <h3 className="text-white text-sm font-bold flex items-center gap-2">
              <span>🔍</span> Analysis Results
              <span className="text-xs text-gray-400 font-normal">({results.length} scans)</span>
            </h3>
          </div>
          <div className="divide-y divide-gray-700">
            {results.slice(0, 5).map((result) => (
              <div key={result.id} className="px-4 py-3">
                <div className="flex items-start gap-3">
                  {result.imageData && (
                    <img
                      src={result.imageData}
                      alt="Captured"
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-200 text-xs leading-relaxed line-clamp-3">
                      {result.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {result.objects.map((obj) => (
                        <span
                          key={obj}
                          className="inline-flex items-center gap-1 bg-purple-600/30 text-purple-200 text-xs px-2 py-0.5 rounded-full"
                        >
                          {objectIcons[obj] || '🔹'} {obj}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      {result.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
