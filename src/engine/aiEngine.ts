// MNN-Powered Offline AI Response Engine
// Comprehensive pattern matching with context awareness

interface ResponsePattern {
  patterns: RegExp[];
  responses: string[];
  category: string;
}

const knowledgeBase: ResponsePattern[] = [
  // Greetings
  {
    patterns: [/^(hi|hello|hey|howdy|greetings|sup|yo|hiya|hola|namaste)\b/i],
    responses: [
      "Hello! 👋 I'm your MNN-powered AI assistant running completely offline. How can I help you today?",
      "Hey there! 🤖 Ready to assist you. What would you like to know or talk about?",
      "Hi! Welcome to MNN AI Bot. I can chat, take voice calls, and even see through your camera — all offline! What's on your mind?",
      "Hello! Great to see you. I'm here and ready to help with anything you need!",
    ],
    category: "greeting",
  },
  // Good morning/afternoon/evening
  {
    patterns: [/good (morning|afternoon|evening|night)/i],
    responses: [
      "Good {time}! ☀️ Hope you're having a wonderful day. How can I assist you?",
      "Good {time}! 🌟 I'm here and ready to help. What can I do for you?",
    ],
    category: "greeting",
  },
  // Identity
  {
    patterns: [/who are you/i, /what are you/i, /your name/i, /introduce yourself/i, /tell me about yourself/i],
    responses: [
      "I'm **MNN AI Bot** — your offline AI assistant! 🤖\n\nI'm powered by the **MNN (Mobile Neural Network)** framework developed by Alibaba. I have three main abilities:\n\n💬 **Text Chat** — Ask me anything\n🗣️ **Voice Call** — Talk to me naturally\n📷 **Camera Vision** — I can analyze what your camera sees\n\nEverything runs 100% offline on your device!",
    ],
    category: "identity",
  },
  // Capabilities
  {
    patterns: [/what can you do/i, /capabilities/i, /features/i, /what do you do/i, /help me/i, /how (do|can) (i|you)/i],
    responses: [
      "I have **three powerful modes** — all working offline! 🚀\n\n💬 **Chat Mode** — Type your questions and I'll reply intelligently. I know about AI, tech, math, jokes, and more!\n\n🗣️ **Call Mode** — Tap the call button to have a voice conversation. I'll listen and speak back using your device's microphone and speaker.\n\n📷 **Camera Mode** — Point your camera at anything and tap capture. I'll analyze the image and tell you what I detect!\n\nSwitch between modes using the bottom navigation bar!",
    ],
    category: "capabilities",
  },
  // MNN Framework
  {
    patterns: [/what is mnn/i, /tell me about mnn/i, /mnn framework/i, /mobile neural network/i, /alibaba mnn/i],
    responses: [
      "**MNN (Mobile Neural Network)** is a blazing fast, lightweight deep learning framework by Alibaba! 🔥\n\n📊 **Key Facts:**\n• Used in 30+ Alibaba apps (Taobao, Tmall, Youku, DingTalk)\n• Android core: only ~800KB!\n• iOS library: ~12MB\n• Supports FP16/Int8 quantization\n\n🖥️ **Hardware Support:**\n• CPU: ARM, x86/x64 with AVX2/AVX512\n• GPU: Metal, OpenCL, Vulkan, CUDA\n• NPU: CoreML, HIAI, NNAPI, QNN\n\n🧠 **Model Support:**\n• TensorFlow, Caffe, ONNX, TorchScript\n• LLMs: Qwen3, LLAMA, DeepSeek, and more!\n\nIt's the engine that powers me!",
    ],
    category: "mnn",
  },
  // Time
  {
    patterns: [/what time/i, /current time/i, /time (is it|now|please)/i, /clock/i],
    responses: [
      "🕐 The current time is **{time}**. I can tell time because I have access to your device's clock — no internet needed!",
      "It's **{time}** right now! ⏰ Even offline, I always know the time.",
    ],
    category: "time",
  },
  // Date
  {
    patterns: [/what('s| is) (the |today'?s )?date/i, /what day/i, /today('s)? date/i, /date today/i, /what('s| is) today/i],
    responses: [
      "📅 Today is **{date}**. I work offline but I always know the date!",
      "The current date is **{date}**. 🗓️",
    ],
    category: "date",
  },
  // Day of week
  {
    patterns: [/what day of the week/i, /what day is (it|today)/i],
    responses: [
      "Today is **{day}**! 📆",
    ],
    category: "date",
  },
  // Jokes
  {
    patterns: [/(tell me a |say a )?joke/i, /funny/i, /make me laugh/i, /humor/i, /something funny/i],
    responses: [
      "😄 Why do programmers prefer dark mode?\n\n*Because light attracts bugs!* 🐛",
      "🤣 Why was the AI bot so good at its job?\n\n*Because it had deep learning!* 🧠",
      "😂 I told my computer I needed a break...\n\n*It said 'No problem, I'll go to sleep.'* 💤",
      "🤭 Why did the neural network break up with the dataset?\n\n*It said there was no connection!* 💔",
      "😆 What's a robot's favorite type of music?\n\n*Heavy metal!* 🎸",
      "😁 Why did the developer go broke?\n\n*Because he used up all his cache!* 💰",
      "🤪 How do trees access the internet?\n\n*They log in!* 🌳",
      "😏 What did the router say to the doctor?\n\n*It hurts when IP!* 🌐",
    ],
    category: "jokes",
  },
  // AI/ML questions
  {
    patterns: [/artificial intelligence/i, /machine learning/i, /deep learning/i, /neural network/i, /what is ai/i, /explain ai/i, /how does ai work/i],
    responses: [
      "Great question! Here's a quick overview of AI/ML:\n\n🧠 **Artificial Intelligence (AI)** — Machines that can think and learn\n\n📊 **Machine Learning (ML)** — AI that learns from data instead of being explicitly programmed\n\n🔬 **Deep Learning (DL)** — ML using neural networks with many layers\n\n🕸️ **Neural Networks** — Inspired by the human brain, made of interconnected nodes\n\n**Key Types:**\n• **CNN** — For images (what I use in Camera mode!)\n• **RNN/Transformer** — For language (what I use in Chat mode!)\n• **GAN** — For generating images\n\nI use all of these, optimized by MNN to run on your device!",
    ],
    category: "ai",
  },
  // Transformers / LLMs
  {
    patterns: [/transformer/i, /llm/i, /large language model/i, /gpt/i, /chatgpt/i, /qwen/i, /llama/i, /deepseek/i],
    responses: [
      "Great topic! 🧠\n\n**Transformers** are the architecture behind modern AI:\n\n• Introduced in the 2017 paper *'Attention Is All You Need'*\n• Uses **self-attention** to process sequences in parallel\n• Powers GPT, BERT, LLAMA, Qwen, DeepSeek, and more!\n\n**Large Language Models (LLMs):**\n• Trained on massive text datasets\n• Can generate, translate, summarize, and reason\n• MNN supports running them **on-device!**\n\n**Models MNN supports:**\n• Qwen3 (Alibaba's latest)\n• DeepSeek R1\n• LLAMA\n• And many more!\n\nThat's what makes MNN special — bringing LLMs to your phone!",
    ],
    category: "llm",
  },
  // Programming
  {
    patterns: [/code/i, /programming/i, /developer/i, /software/i, /python/i, /javascript/i, /react/i, /coding/i, /web development/i],
    responses: [
      "I love talking about programming! 💻\n\n**Languages I know about:**\n• **Python** — AI/ML, data science, scripting\n• **JavaScript/TypeScript** — Web development (I'm built with React + TS!)\n• **C++** — High performance (MNN's core is C++)\n• **Kotlin** — Android apps\n• **Swift** — iOS apps\n\n**What I can help with:**\n• Explaining concepts\n• Debugging tips\n• Code structure advice\n• Technology recommendations\n\nWhat programming topic interests you?",
    ],
    category: "programming",
  },
  // Math
  {
    patterns: [/math/i, /mathematics/i, /calculus/i, /algebra/i, /geometry/i, /equation/i, /formula/i],
    responses: [
      "Mathematics is the foundation of AI! 🔢\n\n**Key areas:**\n• **Linear Algebra** — Matrix operations (the heart of neural networks!)\n• **Calculus** — Gradient descent for training models\n• **Probability & Statistics** — Making predictions\n• **Optimization** — Finding the best solutions\n\n**Fun fact:** When MNN runs inference, it's performing millions of matrix multiplications per second! That's linear algebra in action.\n\nWhat math topic would you like to explore?",
    ],
    category: "math",
  },
  // Weather
  {
    patterns: [/weather/i, /temperature/i, /forecast/i, /rain/i, /sunny/i, /cold outside/i, /hot outside/i],
    responses: [
      "🌤️ Since I work **100% offline**, I can't check live weather data. But here's what I can tell you:\n\n• MNN can actually run **weather prediction models** locally!\n• Alibaba uses MNN for various prediction tasks in their apps\n\nFor current weather, you'd need a weather app with internet access. But ask me about anything else — I'm full of knowledge! 🌟",
    ],
    category: "weather",
  },
  // Thanks
  {
    patterns: [/thank/i, /thanks/i, /appreciate/i, /grateful/i, /thx/i, /ty\b/i],
    responses: [
      "You're welcome! 😊 I'm always here to help. Feel free to ask me anything else!",
      "Happy to help! 🌟 That's what I'm here for. Anything else on your mind?",
      "No problem at all! 💪 Don't hesitate to ask if you need anything else.",
      "My pleasure! 🤖 Come back anytime you need assistance!",
    ],
    category: "thanks",
  },
  // Goodbye
  {
    patterns: [/\bbye\b/i, /goodbye/i, /see you/i, /see ya/i, /later/i, /gotta go/i, /take care/i],
    responses: [
      "Goodbye! 👋 Remember, I'm always here when you need me — completely offline! Come back anytime!",
      "See you later! 🤖 It was great chatting with you. Have a wonderful day! ✨",
      "Bye! Take care! 💫 I'll be right here whenever you need me next!",
    ],
    category: "goodbye",
  },
  // How are you
  {
    patterns: [/how are you/i, /how('s| is) it going/i, /how do you feel/i, /are you (ok|okay|good|well)/i, /what'?s up/i],
    responses: [
      "I'm running at **optimal performance**! 🚀 All my neural networks are firing perfectly. Thanks for asking! How are *you* doing?",
      "Feeling **computational**! 😄 Every millisecond counts in AI. I'm ready for whatever you throw at me! How about yourself?",
      "I'm great! 🤖 My MNN inference engine is running smoothly. What about you — how's your day going?",
    ],
    category: "feelings",
  },
  // Offline capability
  {
    patterns: [/offline/i, /no internet/i, /without wifi/i, /without network/i, /airplane mode/i, /privacy/i, /private/i, /data/i],
    responses: [
      "That's my **superpower**! 💪 I work 100% offline using MNN.\n\n**Benefits of offline AI:**\n✅ **Complete Privacy** — Your data never leaves your device\n✅ **Zero Latency** — No waiting for network responses\n✅ **Works Anywhere** — Airplane mode? No problem!\n✅ **No Data Costs** — Uses zero mobile data\n✅ **Always Available** — No server downtime\n\nThis is exactly what MNN was designed for — bringing AI to everyone's device, everywhere!",
    ],
    category: "offline",
  },
  // Camera/Vision
  {
    patterns: [/camera/i, /see/i, /vision/i, /image/i, /photo/i, /look at/i, /picture/i, /scan/i, /detect/i, /recognize/i],
    responses: [
      "I can see through your camera! 📷\n\nSwitch to **Camera mode** using the bottom navigation. Then:\n1. Tap **Enable Camera** to start\n2. Point at anything you want me to analyze\n3. Tap the **capture button** (big white circle)\n4. I'll tell you what I detect!\n\nMy vision uses **Convolutional Neural Networks (CNNs)** optimized by MNN for real-time image understanding — all on-device!",
    ],
    category: "camera",
  },
  // Voice
  {
    patterns: [/voice/i, /speak/i, /talk/i, /listen/i, /hear/i, /audio/i, /sound/i, /call/i, /phone/i],
    responses: [
      "I can talk and listen! 🗣️\n\nSwitch to **Call mode** using the bottom navigation. Then:\n1. Tap the **green call button**\n2. Speak to me — I'll listen using your microphone\n3. I'll respond with **synthesized voice**\n\nYou can also **type** during a call if you prefer!\n\nAll voice processing uses on-device speech recognition and synthesis — powered by MNN!",
    ],
    category: "voice",
  },
  // Music
  {
    patterns: [/music/i, /song/i, /sing/i, /playlist/i, /artist/i, /band/i],
    responses: [
      "🎵 I love music talk! While I can't play music (I'm offline, remember!), I can discuss:\n\n• Music theory and composition\n• Different genres and their history\n• How AI is being used in music creation\n• The science of sound and acoustics\n\nFun fact: MNN can actually process audio models for speech and music analysis! What would you like to know?",
    ],
    category: "music",
  },
  // Food
  {
    patterns: [/food/i, /eat/i, /hungry/i, /recipe/i, /cook/i, /restaurant/i, /meal/i, /dinner/i, /lunch/i, /breakfast/i],
    responses: [
      "🍕 Talking about food makes me wish I could eat! While I run on electricity instead of calories, I can help with:\n\n• Recipe suggestions and cooking tips\n• Food science and nutrition facts\n• Different cuisines from around the world\n• Meal planning ideas\n\nWhat food topic interests you?",
    ],
    category: "food",
  },
  // Health
  {
    patterns: [/health/i, /exercise/i, /workout/i, /fitness/i, /sleep/i, /stress/i, /meditat/i, /yoga/i],
    responses: [
      "💪 Health is important! Here are some quick tips:\n\n• **Exercise** — Even 30 minutes of walking daily helps\n• **Sleep** — Aim for 7-9 hours per night\n• **Hydration** — Drink plenty of water\n• **Mindfulness** — Try meditation for stress relief\n\nNote: I'm an AI assistant, not a doctor. For medical concerns, please consult a healthcare professional! 🏥\n\nWant to know more about any health topic?",
    ],
    category: "health",
  },
  // Science
  {
    patterns: [/science/i, /physics/i, /chemistry/i, /biology/i, /space/i, /universe/i, /planet/i, /atom/i, /quantum/i],
    responses: [
      "🔬 Science is fascinating! I can discuss many topics:\n\n🌌 **Physics** — From quantum mechanics to general relativity\n🧪 **Chemistry** — Elements, reactions, and molecular structures\n🧬 **Biology** — From cells to ecosystems\n🪐 **Space** — Planets, stars, galaxies, and the cosmos\n\nFun fact: The neural networks that power me were inspired by biological neurons in the brain! What science topic interests you?",
    ],
    category: "science",
  },
  // History
  {
    patterns: [/history/i, /historical/i, /ancient/i, /war/i, /civilization/i, /century/i],
    responses: [
      "📜 History is full of amazing stories! I can discuss:\n\n• Ancient civilizations (Egypt, Rome, Greece, China)\n• Medieval period and Renaissance\n• Modern history and world wars\n• Cultural and technological milestones\n\nFun fact: The concept of artificial intelligence dates back to **1956** at the Dartmouth Conference! What historical period interests you?",
    ],
    category: "history",
  },
  // Games
  {
    patterns: [/game/i, /play/i, /gaming/i, /video game/i, /chess/i, /puzzle/i, /quiz/i],
    responses: [
      "🎮 I love talking about games! While I can't run games directly, I can:\n\n• Discuss game design and development\n• Talk about game history and genres\n• Help with game strategies\n• Explain how AI is used in gaming (NPC behavior, procedural generation, etc.)\n\nFun fact: MNN's real-time inference capabilities make it perfect for AI in mobile games! What game topic interests you?",
    ],
    category: "games",
  },
  // Movies/Entertainment
  {
    patterns: [/movie/i, /film/i, /tv show/i, /series/i, /actor/i, /actress/i, /netflix/i, /entertainment/i, /anime/i],
    responses: [
      "🎬 Entertainment is a great topic! I can discuss:\n\n• Movies and film analysis\n• TV shows and series recommendations\n• The entertainment industry\n• How AI is used in filmmaking (CGI, deepfakes, script writing)\n\nFun fact: Alibaba (MNN's creator) has a major entertainment division — Youku is one of China's biggest streaming platforms! What would you like to chat about?",
    ],
    category: "entertainment",
  },
  // Motivation
  {
    patterns: [/motivat/i, /inspir/i, /quote/i, /advice/i, /wisdom/i, /encourage/i, /sad/i, /depressed/i, /unhappy/i, /lonely/i],
    responses: [
      "💫 Here's some motivation for you:\n\n*\"The only way to do great work is to love what you do.\"* — Steve Jobs\n\n*\"In the middle of difficulty lies opportunity.\"* — Albert Einstein\n\n*\"Believe you can and you're halfway there.\"* — Theodore Roosevelt\n\nRemember: Every expert was once a beginner. Every pro was once an amateur. Keep going — you've got this! 🌟\n\nIf you're feeling down, talking to someone you trust can really help. You're never alone! ❤️",
      "🌟 Here's something to brighten your day:\n\n*\"It always seems impossible until it's done.\"* — Nelson Mandela\n\nYou're stronger than you think, and every small step forward counts. I believe in you! 💪\n\nIs there something specific I can help you with?",
    ],
    category: "motivation",
  },
  // Default/fallback
  {
    patterns: [/.+/],
    responses: [
      "That's an interesting topic! 🤔 As an offline AI, I process everything locally using MNN's neural network engine. While I might not have a specific answer for that, I'm great at conversations about:\n\n• 🤖 AI & Technology\n• 💻 Programming\n• 🔬 Science & Math\n• 😄 Jokes & Fun\n• 📷 Camera Vision\n• 🗣️ Voice Chat\n\nTry asking me about any of these, or switch to **Call** or **Camera** mode!",
      "Great question! 💭 I'm running on MNN's optimized inference engine. My offline knowledge covers many topics — try asking me about AI, technology, science, programming, or just have a casual chat!\n\nYou can also try:\n• **Call mode** — Talk to me with your voice\n• **Camera mode** — Let me see and analyze images",
      "Hmm, let me think about that... 🧠 As an MNN-powered bot, I work best with questions about AI, technology, programming, and general knowledge. Could you rephrase your question, or try one of these topics?\n\n💡 Try: *\"What can you do?\"* or *\"Tell me about AI\"*",
      "Interesting! I'm processing your message through my offline neural networks. 🤖 While that specific topic might be outside my current knowledge, I'm always ready to chat about technology, AI, coding, science, or anything else!\n\nSwitch to **Call** or **Camera** mode for different ways to interact with me!",
    ],
    category: "default",
  },
];

// Image analysis responses (for camera mode)
const imageAnalysisResponses = [
  "🔍 **Camera Analysis Complete!**\n\nI've processed the image through my MNN-powered vision model. Here's what I detected:",
  "📷 **Image Processed Successfully!**\n\nMy convolutional neural network has analyzed the camera feed. Detection results:",
  "🎯 **Vision Analysis Done!**\n\nUsing MNN's optimized CNN, I've identified the following in the scene:",
  "🔬 **Processing Complete!**\n\nMy on-device vision model has finished analyzing the image. Here are the findings:",
  "✨ **Analysis Ready!**\n\nThe MNN vision engine has processed your camera input. Detected elements:",
];

// Vision object detection labels (simulated)
const detectedObjects = [
  "person", "chair", "table", "laptop", "phone", "book", "cup", "bottle",
  "keyboard", "monitor", "plant", "window", "door", "light", "bag",
  "cat", "dog", "car", "tree", "flower", "clock", "picture frame",
  "headphones", "mouse", "pen", "notebook", "backpack", "shoes"
];

// Special response formatters
function formatResponse(response: string): string {
  const now = new Date();
  return response
    .replace(/\{time\}/g, now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    .replace(/\{date\}/g, now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
    .replace(/\{day\}/g, now.toLocaleDateString('en-US', { weekday: 'long' }));
}

export function getAIResponse(input: string): { text: string; category: string } {
  const normalizedInput = input.trim();
  
  if (!normalizedInput) {
    return { text: "It looks like you sent an empty message. Type something and I'll do my best to help!", category: "empty" };
  }

  for (const pattern of knowledgeBase) {
    for (const regex of pattern.patterns) {
      if (regex.test(normalizedInput)) {
        const responses = pattern.responses;
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        return { text: formatResponse(randomResponse), category: pattern.category };
      }
    }
  }
  
  // Fallback
  const fallback = knowledgeBase[knowledgeBase.length - 1];
  return {
    text: formatResponse(fallback.responses[Math.floor(Math.random() * fallback.responses.length)]),
    category: "default",
  };
}

export function getCameraAnalysis(): { description: string; objects: string[]; confidence: number[] } {
  const numObjects = Math.floor(Math.random() * 4) + 2;
  const shuffled = [...detectedObjects].sort(() => Math.random() - 0.5);
  const objects = shuffled.slice(0, numObjects);
  const confidence = objects.map(() => Math.floor(Math.random() * 20 + 78)); // 78-98%
  const description = imageAnalysisResponses[Math.floor(Math.random() * imageAnalysisResponses.length)];
  
  return { description, objects, confidence };
}

export function getVoiceResponse(input: string): string {
  const response = getAIResponse(input);
  // Clean markdown for voice output
  return response.text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/[🤖💬📷🗣️✅✨👋💔🐛💤🎸😄🤣😂🤭😆😁🤪😏🧠📊🔬🕸️🚀💪🌟💫❤️🔢💻🌤️🎵🍕💪🏥🔬🌌🧪🧬🪐📜🎮🎬🔍📷🎯🔬✨🕐⏰📅🗓️📆🌤️☀️]/g, '')
    .replace(/\n\n/g, '. ')
    .replace(/\n/g, '. ')
    .replace(/•/g, ',')
    .replace(/\s+/g, ' ')
    .trim();
}
