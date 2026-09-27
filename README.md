# MNN AI Bot - Offline AI Assistant

A fully offline AI assistant powered by MNN (Mobile Neural Network) framework concepts, featuring text chat, voice calls, and camera vision capabilities.

## 🚀 Features

- 💬 **Smart Text Chat** - AI responses with markdown support and 20+ knowledge categories
- 🗣️ **Voice Call** - Real-time speech recognition & synthesis using Web Speech API
- 📷 **Camera Vision** - Image analysis with simulated object detection
- 🎨 **Beautiful UI** - Responsive design with smooth animations
- 🔒 **100% Offline** - Works without internet connection
- 📱 **Mobile-First** - Optimized for mobile devices

## 🛠️ Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Web Speech API (Voice)
- WebRTC (Camera)

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Deploy to Vercel

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option 2: GitHub + Vercel Dashboard

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - MNN AI Bot"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) and sign in

3. Click "Add New Project"

4. Import your GitHub repository

5. Vercel will auto-detect Vite - click "Deploy"

6. Your app is live! 🎉

### Option 3: Drag & Drop

1. Build the project:
   ```bash
   npm run build
   ```

2. Go to [vercel.com/new](https://vercel.com/new)

3. Drag and drop the `dist` folder

4. Deploy!

## 📱 Usage

### Text Chat Mode
- Type messages and get intelligent AI responses
- Supports markdown formatting
- 20+ knowledge categories (AI, tech, science, math, jokes, etc.)

### Voice Call Mode
- Tap the green call button to start
- Speak naturally - the bot will listen and respond
- Can also type messages during calls
- Features mute and speaker controls

### Camera Vision Mode
- Enable camera access
- Point at objects and tap capture
- Get AI analysis of detected objects
- All processing happens locally

## 🎯 Features Breakdown

### AI Engine
- Pattern matching with 20+ categories
- Contextual responses
- Dynamic time/date responses
- Markdown support
- Voice-optimized output

### Voice Features
- Web Speech API integration
- Real-time speech recognition
- Text-to-speech synthesis
- Waveform visualization
- Mute/speaker controls

### Camera Features
- WebRTC camera access
- Real-time video preview
- Simulated object detection
- Scan animation effects
- Result history

## 🔧 Configuration

The project is pre-configured for Vercel deployment with:
- `vercel.json` - Routing and build configuration
- SPA routing support
- Production-ready build output

## 📄 License

Based on MNN Framework by Alibaba - Apache 2.0 License

## 🙏 Acknowledgments

- MNN Framework by Alibaba
- React Team
- Vite Team
- Tailwind CSS Team

---

**Built with ❤️ using MNN concepts**
