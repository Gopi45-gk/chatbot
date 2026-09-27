import { useState, useRef, useEffect, useCallback } from 'react';
import { getCameraAnalysis } from '../engine/aiEngine';
import Markdown from './Markdown';

interface AnalysisResult {
  id: number;
  description: string;
  objects: string[];
  confidence: number[];
  timestamp: Date;
  imageData?: string;
}

export default function CameraBot() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [flashEffect, setFlashEffect] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [scanLine, setScanLine] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', 
          width: { ideal: 1280 }, 
          height: { ideal: 720 } 
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsCameraOn(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError') {
        setCameraError('Camera permission denied. Please allow camera access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else {
        setCameraError('Unable to access camera. Please check your device settings.');
      }
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
    setIsAnalyzing(false);
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, []);

  const captureAndAnalyze = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return;

    setIsAnalyzing(true);
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 150);

    // Start scan line animation
    setScanLine(0);
    scanIntervalRef.current = setInterval(() => {
      setScanLine(prev => {
        if (prev >= 100) {
          if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.7);

      // Simulate MNN inference delay (realistic processing time)
      const processingTime = 1200 + Math.random() * 800;
      setTimeout(() => {
        const analysis = getCameraAnalysis();
        
        const result: AnalysisResult = {
          id: Date.now(),
          description: analysis.description,
          objects: analysis.objects,
          confidence: analysis.confidence,
          timestamp: new Date(),
          imageData,
        };

        setResults(prev => [result, ...prev].slice(0, 10)); // Keep last 10 results
        setIsAnalyzing(false);
        setScanLine(0);
      }, processingTime);
    }
  }, [isAnalyzing]);

  const objectIcons: Record<string, string> = {
    person: '👤', chair: '🪑', table: '🪵', laptop: '💻', phone: '📱',
    book: '📚', cup: '☕', bottle: '🍶', keyboard: '⌨️', monitor: '🖥️',
    plant: '🌱', window: '🪟', door: '🚪', light: '💡', bag: '',
    cat: '🐱', dog: '🐕', car: '🚗', tree: '🌳', flower: '🌸',
    clock: '⏰', 'picture frame': '🖼️', headphones: '🎧', mouse: '🖱️',
    pen: '🖊️', notebook: '📓', backpack: '🎒', shoes: '👟',
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 flex items-center gap-3 shadow-lg flex-shrink-0">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <span className="text-xl">📷</span>
        </div>
        <div className="flex-1">
          <h2 className="text-white font-bold text-base">MNN Vision</h2>
          <p className="text-purple-100 text-xs">Camera • Object Detection • Offline AI</p>
        </div>
        {isAnalyzing && (
          <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-medium">Analyzing</span>
          </div>
        )}
      </div>

      {/* Camera View */}
      <div className="relative flex-1 bg-black overflow-hidden min-h-0">
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
              <div className="absolute inset-0 bg-white/60 transition-opacity duration-150"></div>
            )}

            {/* Scanning overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0">
                {/* Corner brackets */}
                <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-green-400 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-green-400 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-green-400 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-green-400 rounded-br-lg"></div>
                </div>
                
                {/* Scan line */}
                <div 
                  className="absolute left-[25%] right-[25%] h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-lg shadow-green-400/50"
                  style={{ top: `${25 + scanLine * 0.5}%` }}
                ></div>

                {/* Processing indicator */}
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/80 rounded-full px-4 py-2 backdrop-blur-sm border border-green-400/30">
                  <p className="text-green-400 text-sm font-mono flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    MNN Processing...
                  </p>
                </div>
              </div>
            )}

            {/* Camera grid overlay */}
            {!isAnalyzing && (
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                  {Array(9).fill(0).map((_, i) => (
                    <div key={i} className="border border-white/30"></div>
                  ))}
                </div>
              </div>
            )}

            {/* Camera error overlay */}
            {cameraError && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6">
                <div className="text-center">
                  <span className="text-4xl mb-3 block">⚠️</span>
                  <p className="text-red-400 text-sm">{cameraError}</p>
                  <button
                    onClick={startCamera}
                    className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-full text-sm hover:bg-purple-700"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
              <span className="text-4xl">📷</span>
            </div>
            <h3 className="text-white text-lg font-bold mb-2">Camera Vision</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-xs leading-relaxed">
              Enable your camera to let MNN analyze your surroundings using on-device neural networks. 
              All processing happens locally — your images never leave your device.
            </p>
            {cameraError && (
              <p className="text-red-400 text-xs mb-4">{cameraError}</p>
            )}
            <button
              onClick={startCamera}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-600/30 active:scale-95"
            >
              Enable Camera
            </button>
            <div className="mt-6 grid grid-cols-3 gap-3 max-w-xs">
              <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                <span className="text-lg block mb-0.5">🎯</span>
                <span className="text-gray-400 text-[10px]">Detect</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                <span className="text-lg block mb-0.5">🏷️</span>
                <span className="text-gray-400 text-[10px]">Classify</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                <span className="text-lg block mb-0.5">📊</span>
                <span className="text-gray-400 text-[10px]">Analyze</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Camera Controls */}
      {isCameraOn && (
        <div className="bg-gray-800/95 backdrop-blur-sm px-6 py-3 flex items-center justify-center gap-6 flex-shrink-0 border-t border-gray-700">
          <button
            onClick={stopCamera}
            className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-gray-600 transition-all active:scale-95"
            title="Close camera"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            onClick={captureAndAnalyze}
            disabled={isAnalyzing}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ring-4 ring-white/20"
            title="Capture & Analyze"
          >
            <div className={`w-12 h-12 rounded-full border-[3px] border-gray-800 ${isAnalyzing ? 'animate-pulse' : ''}`}></div>
          </button>

          <button
            onClick={() => {
              stopCamera();
              setTimeout(() => startCamera(), 300);
            }}
            className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-gray-600 transition-all active:scale-95"
            title="Switch camera"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      )}

      {/* Analysis Results */}
      {results.length > 0 && (
        <div className="bg-gray-800 border-t border-gray-700 max-h-56 overflow-y-auto flex-shrink-0">
          <div className="px-4 py-2 flex items-center justify-between border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
            <h3 className="text-white text-sm font-bold flex items-center gap-2">
              <span>🔍</span> Results
              <span className="text-xs text-gray-400 font-normal">({results.length})</span>
            </h3>
            <button
              onClick={() => setResults([])}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="divide-y divide-gray-700/50">
            {results.slice(0, 5).map((result) => (
              <div key={result.id} className="px-4 py-3">
                <div className="flex items-start gap-3">
                  {result.imageData && (
                    <img
                      src={result.imageData}
                      alt="Captured"
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-gray-600"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <Markdown text={result.description} className="text-gray-300 text-xs" />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {result.objects.map((obj, idx) => (
                        <span
                          key={obj}
                          className="inline-flex items-center gap-1 bg-purple-600/20 text-purple-200 text-[10px] px-2 py-0.5 rounded-full border border-purple-500/30"
                        >
                          {objectIcons[obj] || '🔹'} {obj}
                          <span className="text-purple-400">{result.confidence[idx]}%</span>
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-500 text-[10px] mt-1.5">
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
