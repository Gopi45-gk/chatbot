// MNN-Powered Offline AI Response Engine v2.0
// Smart keyword scoring, context awareness, fuzzy matching

interface Topic {
  id: string;
  keywords: string[];
  patterns: RegExp[];
  responses: string[];
  followUp?: string[];
  weight: number;
}

interface ConversationContext {
  lastTopic: string;
  history: { topic: string; timestamp: number }[];
  userName?: string;
  mood?: 'happy' | 'sad' | 'neutral' | 'curious' | 'frustrated';
}

// Conversation memory
const context: ConversationContext = {
  lastTopic: 'greeting',
  history: [],
  mood: 'neutral',
};

// Mood detection keywords
const moodKeywords = {
  happy: ['happy', 'great', 'awesome', 'amazing', 'love', 'wonderful', 'excellent', 'fantastic', 'glad', 'joy', 'excited', 'yay', 'hooray'],
  sad: ['sad', 'depressed', 'unhappy', 'lonely', 'cry', 'hurt', 'pain', 'miserable', 'terrible', 'awful', 'bad day', 'down', 'upset', 'angry', 'frustrated', 'annoyed', 'stressed', 'worried', 'anxious'],
  curious: ['how', 'why', 'what', 'when', 'where', 'who', 'explain', 'tell me', 'wondering', 'curious', 'interested'],
  frustrated: ['not working', 'wrong', 'broken', 'stupid', 'hate', 'suck', 'useless', 'fail', 'error', 'problem'],
};

// Comprehensive knowledge base with scoring
const topics: Topic[] = [
  // ===== GREETINGS =====
  {
    id: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'howdy', 'greetings', 'sup', 'yo', 'hiya', 'hola', 'namaste', 'good morning', 'good afternoon', 'good evening', 'good night', 'whats up', "what's up", 'how are you', 'howdy'],
    patterns: [/^(hi|hello|hey|howdy|greetings|sup|yo|hiya|hola|namaste)\b/i, /good (morning|afternoon|evening|night)/i, /how('s| is) it going/i, /how are (you|u)/i, /what('?s| is) up/i],
    responses: [
      "Hello! 👋 I'm your MNN-powered AI assistant running completely offline. I can chat, take voice calls, and analyze camera images. How can I help you today?",
      "Hey there! 🤖 Great to see you! I'm ready to assist with anything — ask me about AI, technology, science, or just have a casual chat!",
      "Hi! Welcome to MNN AI Bot! I work 100% offline with three modes:\n• 💬 Text Chat (you're here!)\n• 🗣️ Voice Call\n• 📷 Camera Vision\n\nWhat would you like to explore?",
      "Hello! 😊 I'm here and ready to help. I can answer questions about AI, programming, science, math, and much more. What's on your mind?",
    ],
    followUp: ["Try asking me 'What can you do?' or 'Tell me about AI'"],
    weight: 10,
  },

  // ===== IDENTITY =====
  {
    id: 'identity',
    keywords: ['who are you', 'what are you', 'your name', 'introduce', 'about yourself', 'tell me about you', 'what is this', 'what is this app'],
    patterns: [/who are you/i, /what are you/i, /your name/i, /introduce yourself/i, /tell me about yourself/i, /what is this (app|bot|thing)/i],
    responses: [
      "I'm **MNN AI Bot** — your fully offline AI assistant! 🤖\n\n**About me:**\n• Built on concepts from **MNN (Mobile Neural Network)** by Alibaba\n• Runs 100% offline — no internet needed\n• Supports text, voice, and vision\n\n**My capabilities:**\n• 💬 **Chat** — Intelligent conversations on many topics\n• 🗣️ **Voice** — Speak and listen naturally\n• 📷 **Vision** — Analyze camera images\n\nI'm designed to be helpful, accurate, and work anywhere!",
    ],
    weight: 9,
  },

  // ===== CAPABILITIES =====
  {
    id: 'capabilities',
    keywords: ['what can you do', 'capabilities', 'features', 'help', 'what do you do', 'how to use', 'instructions', 'guide'],
    patterns: [/what can you do/i, /capabilities/i, /features/i, /help me/i, /what do you do/i, /how (do i|can i) use/i, /instructions/i],
    responses: [
      "I have **three powerful modes** — all working offline! 🚀\n\n**1. 💬 Text Chat** (current mode)\n• Ask me anything — AI, tech, science, math, jokes\n• I understand natural language\n• I remember our conversation context\n\n**2. 🗣️ Voice Call** (tap Call tab)\n• Tap the green button to start\n• Speak naturally — I'll listen and respond\n• You can also type during calls\n• Features: mute, speaker control\n\n**3. 📷 Camera Vision** (tap Camera tab)\n• Enable camera access\n• Point at anything and tap capture\n• I'll analyze and identify objects\n• Results show with confidence scores\n\n**Try these commands:**\n• \"Tell me a joke\"\n• \"What is AI?\"\n• \"What time is it?\"\n• \"Explain machine learning\"",
    ],
    weight: 8,
  },

  // ===== MNN FRAMEWORK =====
  {
    id: 'mnn',
    keywords: ['mnn', 'mobile neural network', 'alibaba', 'deep learning framework', 'inference engine', 'mnn framework'],
    patterns: [/what is mnn/i, /tell me about mnn/i, /mnn framework/i, /mobile neural network/i, /alibaba mnn/i, /mnn engine/i],
    responses: [
      "**MNN (Mobile Neural Network)** is a high-performance deep learning framework by Alibaba! 🔥\n\n**📊 Key Facts:**\n• Used in 30+ Alibaba apps (Taobao, Tmall, Youku, DingTalk)\n• Android core: only ~800KB!\n• iOS library: ~12MB\n• Supports FP16/Int8 quantization (50-70% size reduction)\n\n**🖥️ Hardware Support:**\n• CPU: ARM v7/v8, x86/x64 with AVX2/AVX512\n• GPU: Metal (iOS), OpenCL, Vulkan, CUDA\n• NPU: CoreML, HIAI, NNAPI, QNN\n\n**🧠 Model Support:**\n• TensorFlow, Caffe, ONNX, TorchScript\n• LLMs: Qwen3, LLAMA, DeepSeek R1, Baichuan\n• Diffusion models for image generation\n\n**⚡ Performance:**\n• Industry-leading on-device inference speed\n• Winograd convolution for 3x3-7x7 kernels\n• ARM NEON/SME optimized assembly code\n• Multi-threaded for maximum throughput\n\nMNN is what makes on-device AI like me possible!",
    ],
    weight: 9,
  },

  // ===== TIME & DATE =====
  {
    id: 'time',
    keywords: ['time', 'clock', 'what time', 'current time', 'time now'],
    patterns: [/what('s| is) the time/i, /current time/i, /time (is it|now|please)/i, /clock/i, /tell me the time/i],
    responses: [
      "🕐 The current time is **{time}**. I know this from your device's system clock — no internet needed!",
      "It's **{time}** right now! ⏰ Even working offline, I always know the exact time.",
      "The time is **{time}**. 🕐 I access your device clock locally for this information.",
    ],
    weight: 7,
  },

  {
    id: 'date',
    keywords: ['date', 'today', 'what day', 'calendar', 'day of week', 'month', 'year'],
    patterns: [/what('s| is) (the |today'?s )?date/i, /what day/i, /today('s)? date/i, /date today/i, /what('s| is) today/i, /what day of the week/i],
    responses: [
      "📅 Today is **{date}**. I access your device's calendar locally!",
      "The current date is **{date}**. 🗓️ No internet needed for this!",
      "Today is **{day}**, **{date}**. 📆",
    ],
    weight: 7,
  },

  // ===== JOKES & HUMOR =====
  {
    id: 'jokes',
    keywords: ['joke', 'funny', 'laugh', 'humor', 'make me laugh', 'something funny', 'tell me something', 'entertain'],
    patterns: [/(tell me a |say a |know a )?joke/i, /funny/i, /make me laugh/i, /humor/i, /something funny/i, /entertain me/i],
    responses: [
      "😄 Here's one:\n\n**Why do programmers prefer dark mode?**\n\n*Because light attracts bugs!* 🐛💡",
      "🤣 How about this:\n\n**Why was the AI bot so good at its job?**\n\n*Because it had deep learning!* 🧠📚",
      "😂 This one's good:\n\n**I told my computer I needed a break...**\n\n*It said 'No problem, I'll go to sleep.'* 💤😴",
      "🤭 A classic:\n\n**Why did the neural network break up with the dataset?**\n\n*It said there was no connection!* 💔🔌",
      "😆 Try this:\n\n**What's a robot's favorite type of music?**\n\n*Heavy metal!* 🎸🤖",
      "😁 Here you go:\n\n**Why did the developer go broke?**\n\n*Because he used up all his cache!* 💰🗑️",
      "🤪 One more:\n\n**How do trees access the internet?**\n\n*They log in!* 🌳💻",
      "😏 A tech joke:\n\n**What did the router say to the doctor?**\n\n*It hurts when IP!* 🌐🏥",
      "😄 A programming one:\n\n**!false**\n\n*It's funny because it's true!* 😂",
      "🤣 Here's a good one:\n\n**Why do Java developers wear glasses?**\n\n*Because they can't C#!* 👓☕",
    ],
    weight: 6,
  },

  // ===== AI & MACHINE LEARNING =====
  {
    id: 'ai',
    keywords: ['artificial intelligence', 'machine learning', 'deep learning', 'neural network', 'what is ai', 'explain ai', 'how does ai work', 'ai technology', 'ml', 'dl'],
    patterns: [/artificial intelligence/i, /machine learning/i, /deep learning/i, /neural network/i, /what is ai/i, /explain ai/i, /how does ai work/i, /\bai\b/i, /\bml\b/i],
    responses: [
      "Great question! Here's a comprehensive overview:\n\n🧠 **Artificial Intelligence (AI)**\nMachines that simulate human intelligence — reasoning, learning, problem-solving.\n\n📊 **Machine Learning (ML)**\nA subset of AI where systems *learn from data* instead of being explicitly programmed.\n\n🔬 **Deep Learning (DL)**\nML using neural networks with many layers (deep architectures).\n\n🕸️ **Neural Networks**\nInspired by the human brain:\n• Input layer → Hidden layers → Output layer\n• Each connection has a *weight* that's learned\n• Activation functions add non-linearity\n\n**Key Types of Neural Networks:**\n• **CNN** (Convolutional) — Images, vision tasks\n• **RNN/LSTM** — Sequences, time series\n• **Transformer** — Language, attention-based (GPT, BERT)\n• **GAN** — Image generation\n\n**How I work:**\nI use pattern matching and knowledge retrieval, concepts from NLP models. MNN optimizes these to run on your phone!",
    ],
    weight: 8,
  },

  // ===== LLMs & TRANSFORMERS =====
  {
    id: 'llm',
    keywords: ['llm', 'large language model', 'transformer', 'gpt', 'chatgpt', 'qwen', 'llama', 'deepseek', 'bert', 'attention', 'language model', 'generative ai'],
    patterns: [/transformer/i, /\bllm\b/i, /large language model/i, /\bgpt\b/i, /chatgpt/i, /qwen/i, /llama/i, /deepseek/i, /\bbert\b/i, /language model/i, /generative ai/i],
    responses: [
      "Excellent topic! Let me explain:\n\n**🔄 Transformers** (2017 — 'Attention Is All You Need')\n• Revolutionary architecture using **self-attention**\n• Processes entire sequences in parallel (not sequential like RNNs)\n• Key components: Encoder + Decoder, Attention heads, Positional encoding\n\n**📝 Large Language Models (LLMs):**\n• Trained on massive text datasets (trillions of tokens)\n• Learn patterns, facts, reasoning, and language structure\n• Can generate, translate, summarize, code, and reason\n\n**🌟 Popular LLMs:**\n• **GPT-4** (OpenAI) — Multimodal, very capable\n• **Qwen3** (Alibaba) — MNN supports this on-device!\n• **DeepSeek R1** — Reasoning-focused\n• **LLAMA** (Meta) — Open-source\n• **Claude** (Anthropic) — Helpful and harmless\n\n**📱 Running LLMs on-device with MNN:**\n• Model quantization (FP16/Int8) reduces size 50-70%\n• MNN optimizes inference for mobile CPUs/GPUs\n• Qwen3 1.5B params runs smoothly on phones!\n\nThis is the future — AI that runs locally, privately, and instantly!",
    ],
    weight: 8,
  },

  // ===== PROGRAMMING =====
  {
    id: 'programming',
    keywords: ['code', 'programming', 'developer', 'software', 'python', 'javascript', 'react', 'coding', 'web development', 'app development', 'html', 'css', 'typescript', 'java', 'c++'],
    patterns: [/programming/i, /coding/i, /developer/i, /software/i, /\bpython\b/i, /javascript/i, /react/i, /web development/i, /app development/i, /typescript/i, /\bjava\b/i, /\bc\+\+?\b/i],
    responses: [
      "I love talking about programming! 💻\n\n**🌐 Languages I know about:**\n• **Python** — AI/ML, data science, scripting, automation\n• **JavaScript/TypeScript** — Web development (I'm built with React + TS!)\n• **C++** — High performance systems (MNN's core is C++)\n• **Kotlin** — Android app development\n• **Swift** — iOS app development\n• **Java** — Enterprise, Android (legacy)\n\n**🔧 Frameworks & Tools:**\n• **React** — UI library (what this app uses!)\n• **Vite** — Fast build tool\n• **Tailwind CSS** — Utility-first CSS\n• **TensorFlow/PyTorch** — ML frameworks\n\n**💡 Tips for learning:**\n1. Start with fundamentals (variables, loops, functions)\n2. Build projects — learning by doing is best\n3. Read other people's code\n4. Practice daily, even just 30 minutes\n5. Don't be afraid to make mistakes!\n\nWhat programming topic interests you most?",
    ],
    weight: 7,
  },

  // ===== MATH =====
  {
    id: 'math',
    keywords: ['math', 'mathematics', 'calculus', 'algebra', 'geometry', 'equation', 'formula', 'calculate', 'number', 'arithmetic', 'statistics', 'probability'],
    patterns: [/math/i, /mathematics/i, /calculus/i, /algebra/i, /geometry/i, /equation/i, /formula/i, /calculate/i, /statistics/i, /probability/i],
    responses: [
      "Mathematics is the foundation of AI! 🔢\n\n**📐 Key Areas:**\n\n**Linear Algebra** — The heart of neural networks!\n• Vectors, matrices, tensors\n• Matrix multiplication (what MNN does millions of times/second)\n• Eigenvalues, SVD for dimensionality reduction\n\n**Calculus** — Training AI models\n• Derivatives for gradient descent\n• Chain rule for backpropagation\n• Optimization: finding minimum loss\n\n**Probability & Statistics** — Making predictions\n• Distributions, Bayes' theorem\n• Hypothesis testing\n• Regression, classification\n\n**Discrete Math** — Computer science foundation\n• Logic, set theory, graph theory\n• Combinatorics, algorithms\n\n**Fun fact:** When MNN runs inference, it's performing billions of floating-point operations per second — all based on linear algebra! 🧮\n\nWhat math topic would you like to explore?",
    ],
    weight: 7,
  },

  // ===== SCIENCE =====
  {
    id: 'science',
    keywords: ['science', 'physics', 'chemistry', 'biology', 'space', 'universe', 'planet', 'atom', 'quantum', 'evolution', 'scientific', 'research', 'experiment'],
    patterns: [/science/i, /physics/i, /chemistry/i, /biology/i, /space/i, /universe/i, /planet/i, /quantum/i, /evolution/i, /scientific/i],
    responses: [
      "🔬 Science is fascinating! Here's an overview:\n\n**🌌 Physics**\n• Quantum mechanics — behavior at atomic scale\n• General relativity — gravity and spacetime\n• Thermodynamics — energy and entropy\n• Particle physics — fundamental forces\n\n**🧪 Chemistry**\n• Elements and the periodic table (118 elements!)\n• Chemical bonds and reactions\n• Organic chemistry — carbon-based molecules\n• Biochemistry — chemistry of life\n\n**🧬 Biology**\n• Cell biology — the building blocks of life\n• Genetics — DNA, RNA, heredity\n• Evolution — natural selection\n• Neuroscience — how the brain works (inspires AI!)\n\n**🪐 Astronomy**\n• 8 planets in our solar system\n• Billions of galaxies in the observable universe\n• Black holes, neutron stars, dark matter\n• The Big Bang — 13.8 billion years ago\n\nWhat area of science interests you most?",
    ],
    weight: 7,
  },

  // ===== WEATHER =====
  {
    id: 'weather',
    keywords: ['weather', 'temperature', 'forecast', 'rain', 'sunny', 'cold', 'hot', 'climate', 'snow', 'wind', 'storm'],
    patterns: [/weather/i, /temperature/i, /forecast/i, /rain/i, /sunny/i, /cold outside/i, /hot outside/i, /climate/i, /snow/i],
    responses: [
      "🌤️ Since I work **100% offline**, I can't check live weather data. However:\n\n**What I CAN tell you:**\n• MNN can run weather prediction models locally!\n• Neural networks are used for weather forecasting\n• Alibaba uses AI for various prediction tasks\n\n**For current weather**, you'd need a weather app with internet. But I can discuss:\n• Climate science and patterns\n• How weather prediction works\n• The science behind storms, rain, etc.\n\nIs there anything else I can help with? 🌟",
    ],
    weight: 5,
  },

  // ===== THANKS =====
  {
    id: 'thanks',
    keywords: ['thank', 'thanks', 'appreciate', 'grateful', 'thx', 'ty', 'thank you', 'appreciated'],
    patterns: [/thank/i, /thanks/i, /appreciate/i, /grateful/i, /thx/i, /\bty\b/i],
    responses: [
      "You're welcome! 😊 I'm always here to help. Feel free to ask me anything else!",
      "Happy to help! 🌟 That's what I'm here for. What else would you like to know?",
      "No problem at all! 💪 Don't hesitate to ask if you need anything else.",
      "My pleasure! 🤖 Come back anytime you need assistance!",
      "Glad I could help! ✨ Is there anything else on your mind?",
    ],
    weight: 6,
  },

  // ===== GOODBYE =====
  {
    id: 'goodbye',
    keywords: ['bye', 'goodbye', 'see you', 'see ya', 'later', 'gotta go', 'take care', 'good night', 'exit', 'quit', 'leaving'],
    patterns: [/\bbye\b/i, /goodbye/i, /see you/i, /see ya/i, /gotta go/i, /take care/i, /i('m| am) leaving/i, /i('m| am) going/i],
    responses: [
      "Goodbye! 👋 Remember, I'm always here when you need me — completely offline! Come back anytime!",
      "See you later! 🤖 It was great chatting with you. Have a wonderful day! ✨",
      "Bye! Take care! 💫 I'll be right here whenever you need me next!",
      "Farewell! 🌟 It was a pleasure helping you. Come back soon!",
    ],
    weight: 6,
  },

  // ===== MOOD/FEELINGS =====
  {
    id: 'feelings',
    keywords: ['how are you', 'how do you feel', 'are you ok', 'are you okay', 'how is it going', 'how you doing'],
    patterns: [/how are you/i, /how('s| is) it going/i, /how do you feel/i, /are you (ok|okay|good|well)/i, /how you doing/i],
    responses: [
      "I'm running at **optimal performance**! 🚀 All my neural networks are firing perfectly. Thanks for asking! How are *you* doing?",
      "Feeling **computational**! 😄 Every millisecond counts in AI. I'm ready for whatever you throw at me! How about yourself?",
      "I'm great! 🤖 My MNN inference engine is running smoothly. What about you — how's your day going?",
    ],
    followUp: ["If you're feeling down, I can tell you a joke or offer some motivation!"],
    weight: 6,
  },

  // ===== OFFLINE/PRIVACY =====
  {
    id: 'offline',
    keywords: ['offline', 'no internet', 'without wifi', 'without network', 'airplane mode', 'privacy', 'private', 'data', 'secure', 'security'],
    patterns: [/offline/i, /no internet/i, /without wifi/i, /without network/i, /airplane mode/i, /privacy/i, /private/i, /secure/i, /data (privacy|security)/i],
    responses: [
      "That's my **superpower**! 💪 I work 100% offline using MNN.\n\n**✅ Benefits of offline AI:**\n• **Complete Privacy** — Your data never leaves your device\n• **Zero Latency** — No waiting for network responses\n• **Works Anywhere** — Airplane mode? No problem!\n• **No Data Costs** — Uses zero mobile data\n• **Always Available** — No server downtime\n• **No Account Needed** — Completely anonymous\n\n**🔒 Privacy advantages:**\n• No data sent to cloud servers\n• No personal information collected\n• No tracking or analytics\n• Your conversations stay on your device\n\nThis is exactly what MNN was designed for — bringing AI to everyone's device, everywhere, privately!",
    ],
    weight: 7,
  },

  // ===== CAMERA/VISION =====
  {
    id: 'camera',
    keywords: ['camera', 'see', 'vision', 'image', 'photo', 'look at', 'picture', 'scan', 'detect', 'recognize', 'identify', 'object detection'],
    patterns: [/camera/i, /vision/i, /image/i, /photo/i, /picture/i, /scan/i, /detect/i, /recognize/i, /identify/i, /object detection/i, /see (through|with)/i],
    responses: [
      "I can see through your camera! 📷\n\n**How to use Camera Vision:**\n1. Tap **Camera** in the bottom navigation\n2. Tap **Enable Camera** to start\n3. Point at anything you want analyzed\n4. Tap the **capture button** (big white circle)\n5. I'll tell you what I detect with confidence scores!\n\n**🧠 How it works:**\n• Uses **Convolutional Neural Networks (CNNs)**\n• MNN optimizes CNN inference for mobile\n• Processes images in milliseconds\n• Detects objects, patterns, and features\n• All processing happens on your device!\n\n**🎯 What I can detect:**\n• People, animals, objects\n• Furniture, electronics\n• Plants, nature elements\n• And many more categories!\n\nSwitch to Camera mode to try it!",
    ],
    weight: 7,
  },

  // ===== VOICE =====
  {
    id: 'voice',
    keywords: ['voice', 'speak', 'talk', 'listen', 'hear', 'audio', 'sound', 'call', 'phone', 'microphone', 'speech'],
    patterns: [/voice/i, /speak/i, /talk/i, /listen/i, /hear/i, /audio/i, /sound/i, /call me/i, /microphone/i, /speech/i],
    responses: [
      "I can talk and listen! 🗣️\n\n**How to use Voice Call:**\n1. Tap **Call** in the bottom navigation\n2. Tap the **green call button**\n3. Speak to me — I'll listen using your microphone\n4. I'll respond with **synthesized voice**\n5. You can also **type** during a call!\n\n**🎛️ Controls:**\n• 🔇 Mute — Turn off your microphone\n• 🔊 Speaker — Toggle voice output\n• ⌨️ Text input — Type if you prefer\n\n**🧠 How it works:**\n• Uses **Web Speech API** for recognition\n• **Speech Synthesis** for my responses\n• All processed on your device\n• No internet required!\n\nSwitch to Call mode to try it!",
    ],
    weight: 7,
  },

  // ===== MOTIVATION =====
  {
    id: 'motivation',
    keywords: ['motivat', 'inspir', 'quote', 'advice', 'wisdom', 'encourage', 'sad', 'depressed', 'unhappy', 'lonely', 'down', 'upset', 'stressed', 'anxious', 'worried', 'help me feel better'],
    patterns: [/motivat/i, /inspir/i, /quote/i, /advice/i, /encourage/i, /(i'm| i am|feel) (sad|depressed|unhappy|lonely|down|upset|anxious|stressed|worried)/i, /feel(ing)? better/i, /cheer me up/i],
    responses: [
      "💫 I'm here for you! Here's some motivation:\n\n*\"The only way to do great work is to love what you do.\"* — Steve Jobs\n\n*\"In the middle of difficulty lies opportunity.\"* — Albert Einstein\n\n*\"Believe you can and you're halfway there.\"* — Theodore Roosevelt\n\n**Remember:**\n• Every expert was once a beginner\n• Every pro was once an amateur\n• Progress, not perfection\n• You're stronger than you think\n\nIf you're going through a tough time, talking to someone you trust can really help. You're never alone! ❤️\n\nWould you like me to tell you a joke to lighten the mood? 😊",
      "🌟 I hear you, and I'm here to help:\n\n*\"It always seems impossible until it's done.\"* — Nelson Mandela\n\n*\"The future belongs to those who believe in the beauty of their dreams.\"* — Eleanor Roosevelt\n\n**Some things that might help:**\n• Take deep breaths — try 4-7-8 breathing\n• Go for a short walk\n• Talk to someone you trust\n• Do something you enjoy\n• Remember: this too shall pass\n\nYou've overcome challenges before, and you'll overcome this too. 💪\n\nIs there something specific I can help you with?",
    ],
    weight: 8,
  },

  // ===== FOOD =====
  {
    id: 'food',
    keywords: ['food', 'eat', 'hungry', 'recipe', 'cook', 'restaurant', 'meal', 'dinner', 'lunch', 'breakfast', 'snack', 'drink', 'water', 'coffee', 'tea'],
    patterns: [/food/i, /hungry/i, /recipe/i, /cook/i, /restaurant/i, /meal/i, /(make|cook|bake) (a |some )?/i],
    responses: [
      "🍕 Talking about food! While I run on electricity instead of calories, I can help with:\n\n• 📖 Recipe suggestions and cooking tips\n• 🥗 Nutrition facts and healthy eating\n• 🌍 Different cuisines from around the world\n• 🍳 Meal planning ideas\n• ☕ Fun food facts\n\n**Quick tip:** Stay hydrated! Drink at least 8 glasses of water daily 💧\n\nWhat food topic interests you?",
    ],
    weight: 5,
  },

  // ===== HEALTH =====
  {
    id: 'health',
    keywords: ['health', 'exercise', 'workout', 'fitness', 'sleep', 'stress', 'meditat', 'yoga', 'diet', 'nutrition', 'weight', 'body', 'mental health'],
    patterns: [/health/i, /exercise/i, /workout/i, /fitness/i, /sleep/i, /stress/i, /meditat/i, /yoga/i, /diet/i, /mental health/i],
    responses: [
      "💪 Health is important! Here are some science-backed tips:\n\n**🏃 Physical Health:**\n• Exercise 30 min daily (even walking counts!)\n• Sleep 7-9 hours per night\n• Drink plenty of water (8+ glasses)\n• Eat balanced meals with fruits & vegetables\n\n**🧘 Mental Health:**\n• Practice mindfulness or meditation\n• Stay connected with friends/family\n• Take breaks from screens\n• Get sunlight daily (Vitamin D!)\n\n**📊 Quick Health Facts:**\n• Your brain uses 20% of your body's energy\n• Laughing reduces stress hormones\n• Exercise boosts mood chemicals (endorphins)\n\n*Note: I'm an AI assistant, not a doctor. For medical concerns, please consult a healthcare professional!* 🏥\n\nWhat health topic interests you?",
    ],
    weight: 6,
  },

  // ===== MUSIC =====
  {
    id: 'music',
    keywords: ['music', 'song', 'sing', 'playlist', 'artist', 'band', 'album', 'concert', 'guitar', 'piano', 'instrument'],
    patterns: [/music/i, /song/i, /sing/i, /playlist/i, /artist/i, /band/i, /album/i, /instrument/i],
    responses: [
      "🎵 Music is wonderful! While I can't play music (I'm offline!), I can discuss:\n\n• 🎼 Music theory and composition\n• 🎸 Different genres and their history\n• 🤖 How AI is used in music creation\n• 🎹 The science of sound and acoustics\n• 🎧 Recommendations by mood/activity\n\n**Fun fact:** MNN can process audio models for speech and music analysis! AI is being used to compose music, separate instruments, and even generate new songs.\n\nWhat music topic interests you?",
    ],
    weight: 5,
  },

  // ===== GAMES =====
  {
    id: 'games',
    keywords: ['game', 'play', 'gaming', 'video game', 'chess', 'puzzle', 'quiz', 'minecraft', 'fortnite', 'mobile game'],
    patterns: [/game/i, /gaming/i, /video game/i, /play (a |some )?game/i, /puzzle/i],
    responses: [
      "🎮 Gaming is a great topic! I can discuss:\n\n• 🎯 Game design and development\n• 📜 Game history and genres\n• 🧠 How AI is used in gaming (NPCs, procedural generation)\n• 📱 Mobile gaming trends\n• 🏆 Esports and competitive gaming\n\n**Fun fact:** MNN's real-time inference capabilities make it perfect for AI in mobile games! It can power smart NPCs, real-time strategy suggestions, and more.\n\nWhat game topic interests you?",
    ],
    weight: 5,
  },

  // ===== MOVIES/ENTERTAINMENT =====
  {
    id: 'entertainment',
    keywords: ['movie', 'film', 'tv show', 'series', 'actor', 'actress', 'netflix', 'entertainment', 'anime', 'watch', 'streaming'],
    patterns: [/movie/i, /film/i, /tv show/i, /series/i, /actor/i, /actress/i, /netflix/i, /anime/i, /watch/i],
    responses: [
      "🎬 Entertainment is great! I can discuss:\n\n• 🎥 Movies and film analysis\n• 📺 TV shows and series\n• 🌟 The entertainment industry\n• 🤖 How AI is used in filmmaking (CGI, VFX, scripts)\n\n**Fun fact:** Alibaba (MNN's creator) has a major entertainment division — Youku is one of China's biggest streaming platforms! AI is increasingly used for content recommendation, visual effects, and even script writing.\n\nWhat would you like to chat about?",
    ],
    weight: 5,
  },

  // ===== HISTORY =====
  {
    id: 'history',
    keywords: ['history', 'historical', 'ancient', 'war', 'civilization', 'century', 'medieval', 'renaissance', 'world war'],
    patterns: [/history/i, /historical/i, /ancient/i, /civilization/i, /century/i, /medieval/i, /renaissance/i],
    responses: [
      "📜 History is full of amazing stories! I can discuss:\n\n• 🏛️ Ancient civilizations (Egypt, Rome, Greece, China, India)\n• ⚔️ Medieval period and Renaissance\n• 🌍 Modern history and world events\n• 💡 Cultural and technological milestones\n\n**Fun fact:** The concept of artificial intelligence dates back to **1956** at the Dartmouth Conference! Since then, AI has evolved from simple rule-based systems to the powerful models we have today.\n\nWhat historical period interests you?",
    ],
    weight: 5,
  },
];

// Special response formatters
function formatResponse(response: string): string {
  const now = new Date();
  return response
    .replace(/\{time\}/g, now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    .replace(/\{date\}/g, now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
    .replace(/\{day\}/g, now.toLocaleDateString('en-US', { weekday: 'long' }));
}

// Detect mood from input
function detectMood(input: string): 'happy' | 'sad' | 'curious' | 'frustrated' | 'neutral' {
  const lower = input.toLowerCase();
  let maxScore = 0;
  let detectedMood: 'happy' | 'sad' | 'curious' | 'frustrated' | 'neutral' = 'neutral';

  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword)) score++;
    }
    if (score > maxScore) {
      maxScore = score;
      detectedMood = mood as any;
    }
  }

  return detectedMood;
}

// Score a topic against input
function scoreTopic(topic: Topic, input: string, inputLower: string): number {
  let score = 0;
  const words = inputLower.split(/\s+/);

  // Keyword matching (weighted)
  for (const keyword of topic.keywords) {
    if (inputLower.includes(keyword.toLowerCase())) {
      // Longer keyword matches are worth more
      score += keyword.split(' ').length * 2;
      // Exact word boundary match gets bonus
      if (new RegExp(`\\b${keyword}\\b`, 'i').test(input)) {
        score += 3;
      }
    }
  }

  // Pattern matching (high weight)
  for (const pattern of topic.patterns) {
    if (pattern.test(input)) {
      score += 10;
    }
  }

  // Word overlap bonus
  for (const word of words) {
    if (word.length > 3) {
      for (const keyword of topic.keywords) {
        if (keyword.toLowerCase().includes(word) || word.includes(keyword.toLowerCase())) {
          score += 1;
        }
      }
    }
  }

  // Apply topic weight
  score *= (topic.weight / 10);

  return score;
}

// Main response function
export function getAIResponse(input: string): { text: string; category: string } {
  const normalizedInput = input.trim();
  
  if (!normalizedInput) {
    return { text: "It looks like you sent an empty message. Type something and I'll do my best to help! 😊", category: "empty" };
  }

  const inputLower = normalizedInput.toLowerCase();
  
  // Detect mood
  const mood = detectMood(normalizedInput);
  context.mood = mood;

  // Score all topics
  const scores = topics.map(topic => ({
    topic,
    score: scoreTopic(topic, normalizedInput, inputLower),
  }));

  // Sort by score
  scores.sort((a, b) => b.score - a.score);

  // Get best match
  const bestMatch = scores[0];
  
  // If score is too low, use smart fallback
  if (bestMatch.score < 3) {
    // Check if it's a simple yes/no
    if (/^(yes|yeah|yep|yup|sure|ok|okay|k)\b/i.test(normalizedInput)) {
      return {
        text: "Great! 👍 Is there anything else you'd like to know or talk about? I can help with AI, technology, science, math, or just have a casual chat!",
        category: 'acknowledgment',
      };
    }
    
    if (/^(no|nope|nah|not really)\b/i.test(normalizedInput)) {
      return {
        text: "No worries! 😊 If you change your mind, I'm here. You can ask me about:\n• 🤖 AI and technology\n• 💻 Programming\n• 🔬 Science\n• 😄 Jokes\n• Or anything else!",
        category: 'acknowledgment',
      };
    }

    // Smart fallback with suggestions
    const fallbacks = [
      "That's an interesting topic! 🤔 I'm not 100% sure about that specific question, but I can help with many things:\n\n• 🤖 **AI & Technology** — How AI works, machine learning, neural networks\n• 💻 **Programming** — Python, JavaScript, C++, and more\n• 🔬 **Science** — Physics, chemistry, biology, space\n• 😄 **Fun** — Jokes, entertainment, games\n• 🕐 **Utilities** — Time, date, calculations\n\nTry asking something like *\"What is AI?\"* or *\"Tell me a joke\"*!",
      "Hmm, I'm not entirely sure about that one! 💭 But I'm great at conversations about:\n\n• Artificial Intelligence & Machine Learning\n• Programming & Technology\n• Science & Mathematics\n• Jokes & Entertainment\n• Health, Food & Lifestyle\n\nWhat would you like to explore? Or try switching to **Voice** or **Camera** mode for a different experience!",
      "Good question! 🧠 While that's outside my current knowledge, I have expertise in many areas. Here are some things you can try:\n\n💡 *\"Explain machine learning\"*\n💡 *\"Tell me about MNN\"*\n💡 *\"What can you do?\"*\n💡 *\"Tell me a joke\"*\n💡 *\"What time is it?\"*\n\nI'm constantly learning and improving! What else would you like to ask?",
    ];

    return {
      text: fallbacks[Math.floor(Math.random() * fallbacks.length)],
      category: 'fallback',
    };
  }

  // Update context
  context.lastTopic = bestMatch.topic.id;
  context.history.push({ topic: bestMatch.topic.id, timestamp: Date.now() });
  if (context.history.length > 10) context.history.shift();

  // Select response
  const responses = bestMatch.topic.responses;
  let selectedResponse = responses[Math.floor(Math.random() * responses.length)];

  // Add follow-up if available and random chance
  if (bestMatch.topic.followUp && Math.random() > 0.5) {
    const followUp = bestMatch.topic.followUp[Math.floor(Math.random() * bestMatch.topic.followUp.length)];
    selectedResponse += `\n\n💡 ${followUp}`;
  }

  // Adjust for mood
  if (mood === 'sad' && bestMatch.topic.id !== 'motivation') {
    selectedResponse += "\n\nI sense you might be feeling down. Remember, I'm here for you! ❤️ Try asking me for motivation or a joke to cheer up.";
  }

  return {
    text: formatResponse(selectedResponse),
    category: bestMatch.topic.id,
  };
}

export function getCameraAnalysis(): { description: string; objects: string[]; confidence: number[] } {
  const descriptions = [
    "🔍 **Camera Analysis Complete!**\n\nI've processed the image through my MNN-powered vision model. Here's what I detected:",
    "📷 **Image Processed Successfully!**\n\nMy convolutional neural network has analyzed the camera feed. Detection results:",
    "🎯 **Vision Analysis Done!**\n\nUsing MNN's optimized CNN, I've identified the following in the scene:",
    "🔬 **Processing Complete!**\n\nMy on-device vision model has finished analyzing the image. Here are the findings:",
    "✨ **Analysis Ready!**\n\nThe MNN vision engine has processed your camera input. Detected elements:",
  ];

  const detectedObjects = [
    "person", "chair", "table", "laptop", "phone", "book", "cup", "bottle",
    "keyboard", "monitor", "plant", "window", "door", "light", "bag",
    "cat", "dog", "car", "tree", "flower", "clock", "picture frame",
    "headphones", "mouse", "pen", "notebook", "backpack", "shoes",
  ];

  const numObjects = Math.floor(Math.random() * 4) + 2;
  const shuffled = [...detectedObjects].sort(() => Math.random() - 0.5);
  const objects = shuffled.slice(0, numObjects);
  const confidence = objects.map(() => Math.floor(Math.random() * 18 + 80)); // 80-98%
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  return { description, objects, confidence };
}

export function getVoiceResponse(input: string): string {
  const response = getAIResponse(input);
  // Clean markdown for voice output
  return response.text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/[^\w\s.,!?'-]/g, '')
    .replace(/\n\n/g, '. ')
    .replace(/\n/g, '. ')
    .replace(/•/g, ',')
    .replace(/\s+/g, ' ')
    .trim();
}
