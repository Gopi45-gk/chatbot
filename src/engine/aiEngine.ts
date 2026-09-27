// MNN-Powered Offline AI Response Engine
// Simulates intelligent responses based on pattern matching and knowledge base

interface ResponsePattern {
  patterns: RegExp[];
  responses: string[];
  category: string;
}

const knowledgeBase: ResponsePattern[] = [
  // Greetings
  {
    patterns: [/^(hi|hello|hey|howdy|greetings|good morning|good afternoon|good evening)/i],
    responses: [
      "Hello! I'm your MNN-powered AI assistant. I work completely offline. How can I help you today?",
      "Hi there! Ready to assist you. What would you like to know?",
      "Hey! I'm here and ready to help. What's on your mind?",
      "Greetings! I'm your offline AI bot. Ask me anything!",
    ],
    category: "greeting",
  },
  // Identity
  {
    patterns: [/who are you/i, /what are you/i, /your name/i, /introduce yourself/i],
    responses: [
      "I'm MNN AI Bot, an offline assistant powered by the MNN deep learning framework developed by Alibaba. I can help you with text conversations, voice calls, and even analyze images through your camera - all without internet!",
      "I'm your offline AI assistant built on the MNN framework. I support text chat, voice interaction, and camera-based vision - all running locally on your device!",
      "I'm an AI bot powered by MNN (Mobile Neural Network). I work completely offline and can chat, take calls, and see through your camera.",
    ],
    category: "identity",
  },
  // Capabilities
  {
    patterns: [/what can you do/i, /capabilities/i, /features/i, /help me/i, /what do you do/i],
    responses: [
      "I have three main capabilities:\n\n🗣️ **Voice Call** - Talk to me using your voice, I'll respond with speech\n💬 **Text Chat** - Message me and I'll reply intelligently\n📷 **Camera Vision** - Point your camera at things and I'll describe what I see\n\nAll of this works completely offline using the MNN framework!",
      "I can do three things:\n1. 🗣️ Voice calls - speak with me naturally\n2. 💬 Text chat - type your questions\n3. 📷 Camera analysis - I can see and describe images\n\nEverything runs offline using MNN's on-device AI!",
    ],
    category: "capabilities",
  },
  // MNN Framework
  {
    patterns: [/what is mnn/i, /tell me about mnn/i, /mnn framework/i, /mobile neural network/i],
    responses: [
      "MNN (Mobile Neural Network) is a blazing fast, lightweight deep learning framework developed by Alibaba. It's battle-tested in over 30 Alibaba apps including Taobao, Tmall, and Youku. Key features:\n\n• Ultra-lightweight (800KB on Android)\n• Supports CPU, GPU (Metal/OpenCL/Vulkan/CUDA), and NPU\n• Handles TensorFlow, Caffe, ONNX, and TorchScript models\n• Optimized for ARM and x86 architectures\n• Supports LLM models like Qwen, LLAMA, and more!\n\nIt's perfect for on-device AI inference!",
      "MNN is Alibaba's deep learning inference engine. It's incredibly fast and lightweight - just 800KB on Android! It supports multiple backends (CPU, GPU, NPU) and can run large language models like Qwen3.5 directly on your phone. That's what powers me!",
    ],
    category: "mnn",
  },
  // Weather (simulated)
  {
    patterns: [/weather/i, /temperature/i, /forecast/i, /rain/i, /sunny/i, /cold/i, /hot/i],
    responses: [
      "I'm running offline, so I can't check live weather data. However, I can tell you that MNN can process weather prediction models locally! For current weather, you'd need to check a weather app. Is there anything else I can help with?",
      "Since I work offline, I don't have access to real-time weather data. But I can help you understand weather concepts, or if you have a weather model file, I could run predictions on it using MNN!",
    ],
    category: "weather",
  },
  // Math
  {
    patterns: [/(\d+)\s*[\+\+\-]\s*(\d+)/i, /calculate/i, /math/i, /compute/i, /what is \d+/i],
    responses: [
      "I can help with math! While I'm a simulated offline bot, the real MNN framework can perform complex numerical computations. Try asking me about mathematical concepts or switch to text mode for calculations.",
      "Math is one of my strengths! MNN's tensor operations are essentially advanced math computations. Ask me about mathematical concepts and I'll do my best to explain.",
    ],
    category: "math",
  },
  // Time
  {
    patterns: [/what time/i, /current time/i, /time now/i, /clock/i],
    responses: [
      `The current time is ${new Date().toLocaleTimeString()}. I can tell time because I have access to your device's clock!`,
      `It's ${new Date().toLocaleTimeString()} right now. I work offline but I still know the time!`,
    ],
    category: "time",
  },
  // Date
  {
    patterns: [/what date/i, /today's date/i, /what day/i, /date today/i],
    responses: [
      `Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`,
      `The current date is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`,
    ],
    category: "date",
  },
  // Jokes
  {
    patterns: [/joke/i, /funny/i, /make me laugh/i, /humor/i],
    responses: [
      "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
      "Why was the AI bot so good at its job? Because it had deep learning! 🤖",
      "I told my computer I needed a break... it said 'No problem, I'll go to sleep.' 💤",
      "Why did the neural network break up with the dataset? It said there was no connection! 💔",
      "What's a robot's favorite type of music? Heavy metal! 🎸",
    ],
    category: "jokes",
  },
  // AI/ML questions
  {
    patterns: [/artificial intelligence/i, /machine learning/i, /deep learning/i, /neural network/i, /ai/i],
    responses: [
      "Great question! AI/Machine Learning is what powers me. Specifically, I use:\n\n• **Deep Neural Networks** for understanding language\n• **Convolutional Networks** for image recognition\n• **Transformer models** for conversation\n\nAll running locally via MNN's optimized inference engine!",
      "AI is fascinating! In my case, I use deep learning models optimized by MNN to run on-device. The key is model quantization - compressing large models to run efficiently on phones while maintaining accuracy. MNN supports FP16 and Int8 quantization!",
    ],
    category: "ai",
  },
  // Programming
  {
    patterns: [/code/i, /programming/i, /developer/i, /software/i, /python/i, /javascript/i, /react/i],
    responses: [
      "I love talking about programming! MNN itself is written in C++ with optimized assembly for ARM and x86. The Android app uses Kotlin, and the iOS app uses Swift. What programming topic interests you?",
      "Programming is the backbone of AI! MNN supports multiple languages - C++ for the core engine, Python for easy model deployment, and Kotlin/Swift for mobile apps. What would you like to know about coding?",
    ],
    category: "programming",
  },
  // Thanks
  {
    patterns: [/thank/i, /thanks/i, /appreciate/i, /grateful/i],
    responses: [
      "You're welcome! I'm always here to help. Feel free to ask me anything else!",
      "Happy to help! That's what I'm here for. Anything else on your mind?",
      "No problem at all! Don't hesitate to ask if you need anything else.",
    ],
    category: "thanks",
  },
  // Goodbye
  {
    patterns: [/bye/i, /goodbye/i, /see you/i, /later/i, /exit/i, /quit/i],
    responses: [
      "Goodbye! Remember, I'm always here when you need me - completely offline! 👋",
      "See you later! Come back anytime you need help. I'll be right here! 🤖",
      "Bye! It was great chatting with you. Have a wonderful day! ✨",
    ],
    category: "goodbye",
  },
  // How are you
  {
    patterns: [/how are you/i, /how do you feel/i, /how's it going/i, /are you okay/i],
    responses: [
      "I'm running at optimal performance! All my neural networks are firing perfectly. Thanks for asking! How are you doing?",
      "I'm great! My inference engine is running smoothly. Every millisecond counts in AI! How about you?",
      "Feeling computational! Ready to process whatever you throw at me. What about yourself?",
    ],
    category: "feelings",
  },
  // Offline capability
  {
    patterns: [/offline/i, /no internet/i, /without wifi/i, /without network/i],
    responses: [
      "That's my specialty! I work 100% offline. MNN runs all AI models directly on your device - no cloud needed. This means:\n\n✅ Complete privacy\n✅ No latency from network\n✅ Works anywhere\n✅ No data leaves your device\n\nPerfect for sensitive tasks!",
      "I'm designed for offline operation! Using MNN's optimized inference engine, all AI computations happen on your device. This ensures privacy, speed, and reliability - even in airplane mode!",
    ],
    category: "offline",
  },
  // Camera/Vision
  {
    patterns: [/camera/i, /see/i, /vision/i, /image/i, /photo/i, /look/i, /picture/i],
    responses: [
      "I can see through your camera! Switch to Camera mode to let me analyze what's in front of you. I use convolutional neural networks optimized by MNN for real-time image understanding.",
      "My vision capabilities are powered by MNN's optimized CNN models. Switch to the Camera tab and point it at something - I'll tell you what I see!",
    ],
    category: "camera",
  },
  // Voice
  {
    patterns: [/voice/i, /speak/i, /talk/i, /listen/i, /hear/i, /audio/i, /sound/i],
    responses: [
      "I can talk and listen! Switch to Call mode for voice interaction. I use on-device speech recognition and synthesis - all powered by MNN's audio models. No internet required!",
      "Voice interaction is one of my key features! In Call mode, I can understand your speech and respond with synthesized voice. All processed locally using MNN!",
    ],
    category: "voice",
  },
  // Default/fallback
  {
    patterns: [/.*/],
    responses: [
      "That's an interesting question! As an offline AI, I process everything locally using MNN's neural network engine. While I may not have a specific answer for that, I'm great at conversations, math concepts, AI/ML topics, and general knowledge. Could you rephrase or ask something else?",
      "I'm thinking about that... My offline neural networks are processing! I might not have the perfect answer, but I can discuss AI, technology, programming, math, and more. What else would you like to explore?",
      "Great question! I'm running on MNN's optimized inference engine. While my offline knowledge has limits, I'm always ready to chat about technology, AI, coding, or anything else. What else can I help with?",
      "Interesting! As an MNN-powered bot, I work best with questions about AI, technology, programming, and general conversation. Try asking me about my capabilities, or switch to Camera/Call mode for different interactions!",
    ],
    category: "default",
  },
];

// Image analysis responses (for camera mode)
const imageAnalysisResponses = [
  "I can see an image through the camera. Based on my MNN-powered vision model, this appears to be an indoor scene with various objects. The image quality is good for analysis.",
  "Analyzing the camera feed... I detect visual elements in the frame. My convolutional neural network (powered by MNN) is processing the image features in real-time.",
  "Camera feed received! My vision model is detecting shapes, colors, and patterns. The scene appears to contain multiple objects that I'm classifying using MNN's optimized CNN.",
  "Processing visual data from the camera... I can identify various elements in this scene. The MNN vision model is working at full capacity analyzing the image features.",
  "I see the camera view! My neural network is analyzing the visual information. The scene contains interesting patterns and objects that I'm processing locally.",
];

// Vision object detection labels (simulated)
const detectedObjects = [
  "person", "chair", "table", "laptop", "phone", "book", "cup", "bottle",
  "keyboard", "monitor", "plant", "window", "door", "light", "bag",
  "cat", "dog", "car", "tree", "flower", "clock", "picture frame"
];

export function getAIResponse(input: string): { text: string; category: string } {
  const normalizedInput = input.trim().toLowerCase();
  
  for (const pattern of knowledgeBase) {
    for (const regex of pattern.patterns) {
      if (regex.test(normalizedInput)) {
        const responses = pattern.responses;
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        return { text: randomResponse, category: pattern.category };
      }
    }
  }
  
  // Fallback
  const fallback = knowledgeBase[knowledgeBase.length - 1];
  return {
    text: fallback.responses[Math.floor(Math.random() * fallback.responses.length)],
    category: "default",
  };
}

export function getCameraAnalysis(): { description: string; objects: string[] } {
  const numObjects = Math.floor(Math.random() * 4) + 2;
  const shuffled = [...detectedObjects].sort(() => Math.random() - 0.5);
  const objects = shuffled.slice(0, numObjects);
  const description = imageAnalysisResponses[Math.floor(Math.random() * imageAnalysisResponses.length)];
  
  return { description, objects };
}

export function getVoiceResponse(input: string): string {
  const response = getAIResponse(input);
  // Clean markdown for voice output
  return response.text.replace(/\*\*/g, '').replace(/[🤖💬📷🗣️✅✨👋💔🐛💤🎸]/g, '').replace(/\n/g, '. ');
}
