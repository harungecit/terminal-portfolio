# 🚀 Terminal Portfolio - Harun Geçit

Interactive terminal-style portfolio website featuring a cyberpunk aesthetic with Matrix rain effects, functional terminal emulator, AI chat integration, and modern animations.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://harungecit.com)
[![Version](https://img.shields.io/badge/version-15.4-blue)]()
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red)]()

## ✨ Features

- **🌧️ Matrix Rain Background**: Animated Matrix-style rain effect using Canvas API
- **💻 Interactive Terminal**: Fully functional Linux-style terminal emulator powered by XTerm.js
- **🤖 AI Chat**: Gemini 2.0 Flash integration via Puter.js for intelligent conversations
- **🪄 Harry Potter Spells**: Magic commands including Lumos (light mode), Nox (dark mode), Accio, and more
- **🎮 Games**: Built-in Snake game playable in terminal
- **📊 System Monitor**: Simulated `top` command with process information
- **🌤️ Weather**: Real-time weather information via wttr.in
- **⚡ Glitch Effects**: Cyberpunk-inspired glitch animations and visual effects
- **🎨 Theme Support**: Light/Dark mode with smooth transitions
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
| [Puter.js](https://puter.com/) | AI Chat (Gemini 2.0 Flash) | v2 |
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
| `chat` | Start AI Chat (Gemini 2.0 Flash via Puter.js) |
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
    │   └── styles.css         # All styles (1700+ lines)
    │                          # - CSS variables & themes
    │                          # - Matrix animation styles
    │                          # - Terminal styling
    │                          # - Responsive breakpoints
    │                          # - Modal styles
    │                          # - Form validation styles
    │                          # - Custom scrollbar
    ├── js/
    │   ├── script.js          # Main JavaScript (985+ lines)
    │   │                      # - Matrix rain animation
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
    --primary-bg: #0a0e27;
    --secondary-bg: #1a1f3a;
    --neon-green: #00ff41;
    --neon-cyan: #00f0ff;
    --neon-purple: #b026ff;
}
```

### Light Mode (Lumos)
```css
body.light-mode {
    --primary-bg: #f5f5f5;
    --secondary-bg: #ffffff;
    --neon-green: #00b330;
    --neon-cyan: #0099cc;
    --neon-purple: #8800cc;
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

- ✅ Puter.js AI Chat integration (Gemini 2.0 Flash)
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

**Harun Geçit** - Software Architect & Full Stack Developer

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
