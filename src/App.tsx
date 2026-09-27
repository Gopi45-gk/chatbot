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
      <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 flex flex-col items-center justify-center p-6">
        {/* Splash Screen */}
        <div className="text-center animate-fade-in">
          {/* Logo */}
          <div className="relative mb-8">
            <div className="w-28 h-28 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30 rotate-3 hover:rotate-0 transition-transform duration-500">
              <span className="text-5xl">🤖</span>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-extrabold text-white mb-2">
            MNN AI Bot
          </h1>
          <p className="text-blue-300 text-lg mb-1">Offline AI Assistant</p>
          <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto">
            Powered by MNN Deep Learning Framework • Text • Voice • Vision
          </p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mb-10 max-w-sm mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <span className="text-2xl mb-1 block">💬</span>
              <span className="text-white text-xs font-medium">Chat</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <span className="text-2xl mb-1 block">🗣️</span>
              <span className="text-white text-xs font-medium">Voice</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <span className="text-2xl mb-1 block">📷</span>
              <span className="text-white text-xs font-medium">Vision</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm">All Systems Offline Ready</span>
          </div>

          {/* Start Button */}
          <button
            onClick={() => setShowSplash(false)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl shadow-blue-600/30 active:scale-95"
          >
            Start Assistant
          </button>

          <p className="text-gray-500 text-xs mt-4">
            Based on MNN Framework by Alibaba
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && <ChatBot />}
        {activeTab === 'call' && <CallBot />}
        {activeTab === 'camera' && <CameraBot />}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-around py-2">
          <NavButton
            icon="💬"
            label="Chat"
            isActive={activeTab === 'chat'}
            onClick={() => setActiveTab('chat')}
          />
          <NavButton
            icon="🗣️"
            label="Call"
            isActive={activeTab === 'call'}
            onClick={() => setActiveTab('call')}
          />
          <NavButton
            icon="📷"
            label="Camera"
            isActive={activeTab === 'camera'}
            onClick={() => setActiveTab('camera')}
          />
        </div>
        {/* MNN Branding */}
        <div className="text-center pb-1">
          <span className="text-[10px] text-gray-400">Powered by MNN • Offline AI Engine</span>
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
}: {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-6 py-1.5 rounded-xl transition-all ${
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      <span className={`text-xl transition-transform ${isActive ? 'scale-110' : ''}`}>
        {icon}
      </span>
      <span className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
        {label}
      </span>
      {isActive && (
        <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
      )}
    </button>
  );
}
