import { useState } from 'react';
import ChatBot from './components/ChatBot';
import CallBot from './components/CallBot';
import CameraBot from './components/CameraBot';

type Tab = 'chat' | 'call' | 'camera';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Splash Content */}
        <div className="text-center animate-fade-in relative z-10">
          {/* Logo */}
          <div className="relative mb-8 inline-block">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <span className="text-4xl">🤖</span>
            </div>
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50 animate-bounce">
              <span className="text-white text-[10px] font-bold">AI</span>
            </div>
            <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/50">
              <span className="text-[8px]">⚡</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-extrabold text-white mb-1 tracking-tight">
            MNN AI Bot
          </h1>
          <p className="text-indigo-300 text-base mb-1 font-medium">Offline AI Assistant</p>
          <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
            Powered by MNN Deep Learning Framework
          </p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mb-8 max-w-sm mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 hover:bg-white/10 transition-colors">
              <span className="text-2xl mb-1 block">💬</span>
              <span className="text-white text-xs font-medium">Text Chat</span>
              <p className="text-gray-500 text-[10px] mt-0.5">Smart replies</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 hover:bg-white/10 transition-colors">
              <span className="text-2xl mb-1 block">🗣️</span>
              <span className="text-white text-xs font-medium">Voice Call</span>
              <p className="text-gray-500 text-[10px] mt-0.5">Talk naturally</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 hover:bg-white/10 transition-colors">
              <span className="text-2xl mb-1 block">📷</span>
              <span className="text-white text-xs font-medium">Camera</span>
              <p className="text-gray-500 text-[10px] mt-0.5">See & analyze</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">All Systems Ready • 100% Offline</span>
          </div>

          {/* Start Button */}
          <button
            onClick={() => setShowSplash(false)}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-10 py-3.5 rounded-full font-bold text-base hover:shadow-xl hover:shadow-indigo-500/30 transition-all active:scale-95 border border-white/10"
          >
            Start Assistant →
          </button>

          <p className="text-gray-500 text-xs mt-6">
            Based on MNN Framework by Alibaba • Apache 2.0
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden min-h-0">
        {activeTab === 'chat' && <ChatBot />}
        {activeTab === 'call' && <CallBot />}
        {activeTab === 'camera' && <CameraBot />}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex-shrink-0">
        <div className="flex items-center justify-around py-1.5 px-4">
          <NavButton
            icon="💬"
            label="Chat"
            isActive={activeTab === 'chat'}
            onClick={() => setActiveTab('chat')}
            color="blue"
          />
          <NavButton
            icon="🗣️"
            label="Call"
            isActive={activeTab === 'call'}
            onClick={() => setActiveTab('call')}
            color="green"
          />
          <NavButton
            icon="📷"
            label="Camera"
            isActive={activeTab === 'camera'}
            onClick={() => setActiveTab('camera')}
            color="purple"
          />
        </div>
        {/* MNN Branding */}
        <div className="text-center pb-1.5 -mt-0.5">
          <span className="text-[10px] text-gray-400 font-medium">Powered by MNN • Offline AI Engine</span>
        </div>
      </div>
    </div>
  );
}

function NavButton({
  icon,
  label,
  isActive,
  onClick,
  color,
}: {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  color: string;
}) {
  const activeColors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };

  const dotColors: Record<string, string> = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-xl transition-all duration-200 border ${
        isActive
          ? activeColors[color]
          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50 border-transparent'
      }`}
    >
      <span className={`text-xl transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
        {icon}
      </span>
      <span className={`text-[11px] font-semibold ${isActive ? '' : 'text-gray-500'}`}>
        {label}
      </span>
      {isActive && (
        <div className={`w-1 h-1 ${dotColors[color]} rounded-full`}></div>
      )}
    </button>
  );
}
