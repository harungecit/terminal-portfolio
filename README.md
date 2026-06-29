# 🚀 Terminal Portfolio - Harun Geçit

Portfolio website for **Harun Geçit — Full Stack Developer & AI Engineer**, featuring a modern AI/SaaS dark design (glassmorphism, violet→cyan gradients, aurora glow), an interactive neural-network particle background, a functional terminal emulator, AI chat integration, a dedicated AI Engineering showcase (RAG, fine-tuning, multi-agent orchestration), and smooth animations.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://harungecit.com)
[![Version](https://img.shields.io/badge/version-17.2-blue)]()
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red)]()

## ✨ Features

- **🧠 Neural Network Background**: Interactive particle network (Canvas API) that reacts to the cursor — an AI metaphor replacing the old Matrix rain
- **💎 Modern AI/SaaS Design**: Dark glassmorphism UI with violet→cyan gradient accents, aurora ambient glow, Space Grotesk + Inter typography
- **💻 Interactive Terminal**: Fully functional Linux-style terminal emulator powered by XTerm.js
- **🧠 AI Engineering Section**: Dedicated showcase of RAG (pgvector), fine-tuning/PageIndex, multi-LLM orchestration, web-search agents, AI-driven SDLC and AI security
- **🤖 AI Chat**: Multi-model chat (Claude Sonnet 4.6 · Gemini 3.1 · GPT-5.4) via Puter.js with automatic fallback
- **🪄 Harry Potter Spells**: Magic commands including Lumos (light mode), Nox (dark mode), Accio, and more
- **🎮 Games**: Built-in Snake game playable in terminal
- **📊 System Monitor**: Simulated `top` command with process information
- **🌤️ Weather**: Real-time weather information via wttr.in
- **🎨 Theme Support**: Light/Dark mode with smooth transitions (lumos/nox terminal spells)
- **📱 Responsive Design**: Mobile-first approach with touch support
- **🎯 Smooth Animations**: Intersection Observer API for scroll-triggered animations
- **📝 Contact Form**: Enhanced validation with visitor tracking (IP, location via ip.guide)
- **🔒 Privacy Policy**: KVKK/GDPR compliant modal
- **🎠 Project Carousel**: Swiper.js powered project showcase

## 🛠️ Technologies

### Frontend Stack
- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox, animations
- **JavaScript (ES6+)**: Vanilla JavaScript for interactions

### Libraries & APIs
| Library/API | Purpose | Version |
|-------------|---------|---------|
| [XTerm.js](https://xtermjs.org/) | Terminal emulator | 5.3.0 |
| [XTerm Fit Addon](https://github.com/xtermjs/xterm.js) | Terminal responsive sizing | 0.8.0 |
| [Swiper.js](https://swiperjs.com/) | Touch slider/carousel | 11.x |
| [Puter.js](https://puter.com/) | AI Chat (Claude / Gemini / GPT, multi-model) | v2 |
| [Font Awesome](https://fontawesome.com/) | Icon library | 6.5.1 |
| [Google Fonts](https://fonts.google.com/) | Fira Code, Share Tech Mono | - |
| [wttr.in](https://wttr.in/) | Weather API | - |
| [ip.guide](https://ip.guide/) | Visitor IP/Location info | - |

## 💻 Terminal Commands

### Basic Commands
| Command | Description |
|---------|-------------|
| `help` | Display all available commands |
| `about` | Learn more about me |
| `ai` | View my AI engineering stack (RAG, LLM, agents) |
| `skills` | View technical skills |
| `experience` | Show work experience |
| `projects` | List featured projects |
| `contact [type]` | Get contact info or open directly |
| `social [platform]` | View/open social media links |
| `whoami` | Who am I? |
| `date` | Display current date and time |
| `history` | Show command history |
| `clear` | Clear terminal screen |

### File System Commands
| Command | Description |
|---------|-------------|
| `ls` | List directory contents |
| `cd [dir]` | Change directory |
| `pwd` | Print working directory |
| `cat [file]` | Read file content |

### Network Commands
| Command | Description |
|---------|-------------|
| `ip` | Display your IP address |
| `ping [host]` | Ping a host (simulated) |
| `weather [city]` | Check weather forecast |

### Interactive Features
| Command | Description |
|---------|-------------|
| `chat` | Start AI Chat (Claude · Gemini · GPT via Puter.js) |
| `snake` | Play Snake game |
| `top` | System monitor |

### 🪄 Harry Potter Spells
| Command | Description |
|---------|-------------|
| `lumos` | Activate light mode |
| `nox` | Activate dark mode |
| `accio [section]` | Scroll to page section |
| `expecto patronum` | Conjure a protective charm |
| `riddikulus` | Banish fears with laughter |

### Fun Commands
| Command | Description |
|---------|-------------|
| `hack [target]` | Hollywood-style hacking simulation |
| `matrix` | Enter the Matrix |
| `coffee` | Brew some coffee |
| `sudo` | Try it and see what happens |

### Hidden Easter Eggs
| Command | Description |
|---------|-------------|
| `xyzzy` | Classic adventure game reference |
| `konami` | Konami code tribute |
| `starwars` | Star Wars scroll |

### Keyboard Shortcuts
- **Arrow Up/Down**: Navigate command history
- **Tab**: Auto-complete commands
- **Ctrl+C**: Cancel current input
- **Ctrl+L**: Clear screen
- **q**: Exit games/monitors

## 📁 Project Structure

```
terminal-portfolio/
├── index.html                 # Main HTML file
├── README.md                  # Project documentation
├── .gitignore                 # Git ignore rules
└── assets/
    ├── css/
    │   └── styles.css         # All styles
    │                          # - Design tokens & themes (violet→cyan)
    │                          # - Glassmorphism components
    │                          # - Terminal styling
    │                          # - Responsive breakpoints
    │                          # - Modal styles
    │                          # - Form validation styles
    │                          # - Custom scrollbar
    ├── js/
    │   ├── script.js          # Main JavaScript
    │   │                      # - Neural network particle background
    │   │                      # - Navigation & hamburger menu
    │   │                      # - Typing animation
    │   │                      # - Stats counter
    │   │                      # - Scroll animations
    │   │                      # - Contact form handler
    │   │                      # - Form validation (email, phone)
    │   │                      # - Privacy modal
    │   │                      # - Swiper carousel init
    │   │                      # - ip.guide integration
    │   └── terminal.js        # Terminal emulator (1400+ lines)
    │                          # - XTerm.js configuration
    │                          # - Command processing
    │                          # - File system simulation
    │                          # - Snake game
    │                          # - System monitor (top)
    │                          # - AI Chat (Puter.js)
    │                          # - Weather integration
    │                          # - Harry Potter spells
    │                          # - Easter eggs
    └── images/                # Image assets
```

## 🎨 Theming

### Dark Mode (Default)
```css
:root {
    --bg: #07070d;
    --violet: #8b5cf6;
    --cyan: #22d3ee;
    --emerald: #34d399;
    --grad: linear-gradient(135deg, var(--violet), var(--cyan));
}
```

### Light Mode (Lumos)
```css
body.light-mode {
    --bg: #fafafa;
    --violet: #7c3aed;
    --cyan: #0891b2;
    --emerald: #059669;
}
```

Toggle between modes using:
- Terminal command: `lumos` / `nox`
- Persists in localStorage

## 📝 Contact Form Features

- **Fields**: Name, Email, Phone (optional), Topic, Message
- **Validation**:
  - Email: RFC 5322 compliant, length checks, domain validation
  - Phone: International format, 7-15 digits
  - Real-time validation on blur
- **Visitor Tracking**: Appends IP, country, city, timezone via ip.guide
- **KVKK/GDPR**: Privacy policy modal with consent checkbox
- **Netlify Forms**: Backend integration

## 🚀 Deployment

### Netlify (Recommended)
- Auto-deploys from GitHub
- Form handling built-in
- Custom domain support

### GitHub Pages
```bash
# Settings → Pages → Source: main branch
# Live at: https://username.github.io/terminal-portfolio
```

## 🌐 Browser Support

| Browser | Status |
|---------|--------|
| Chrome/Edge | ✅ Full Support |
| Firefox | ✅ Full Support |
| Safari | ✅ Full Support |
| Opera | ✅ Full Support |

## 📊 Performance

- **60fps** Matrix rain using `requestAnimationFrame`
- **Intersection Observer** for scroll animations
- **Lazy loading** for Puter.js (loads only when chat is opened)
- **Custom scrollbars** styled to match theme
- **Optimized CSS** with GPU-accelerated transforms

## 🔄 Recent Updates (v15.4)

- ✅ Puter.js AI Chat integration (multi-model with fallback)
- ✅ Dynamic Puter.js loading (prevents 401 on page load)
- ✅ Turkish character support in chat
- ✅ Phone field in contact form
- ✅ Enhanced email/phone validation
- ✅ Visitor info tracking (ip.guide)
- ✅ Privacy policy modal
- ✅ Site-wide custom scrollbar
- ✅ Contact form layout improvements
- ✅ Swiper.js project carousel

## 👨‍💻 Author

**Harun Geçit** - Full Stack Developer & AI Engineer

- 🌐 Website: [harungecit.com](https://harungecit.com)
- 📧 Email: [info@harungecit.com](mailto:info@harungecit.com)
- 💼 LinkedIn: [@harungecit](https://linkedin.com/in/harungecit)
- 🐙 GitHub: [@harungecit](https://github.com/harungecit)
- 📷 Instagram: [@harungecit.dev](https://instagram.com/harungecit.dev)
- 🐦 X (Twitter): [@harungecit_](https://x.com/harungecit_)
- 📝 Blog: [echo.harungecit.dev](https://echo.harungecit.dev)
- 🔗 All Links: [bio.link/harungecit](https://bio.link/harungecit)

## 📄 License

Copyright © 2025 **Harun Geçit**. All rights reserved.

---

<div align="center">

**⭐ Star this repo if you like it!**

Built with 💚 and ☕ by [Harun Geçit](https://harungecit.com)

</div>
