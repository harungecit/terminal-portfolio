# 🚀 Terminal Portfolio - Harun Geçit

Interactive terminal-style portfolio website featuring a cyberpunk aesthetic with Matrix rain effects, functional terminal emulator, and modern animations.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://harungecit.github.io/terminal-portfolio)
[![Version](https://img.shields.io/badge/version-1.0.1-blue)]()
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red)]()

## ✨ Features

- **🌧️ Matrix Rain Background**: Animated Matrix-style rain effect using Canvas API
- **💻 Interactive Terminal**: Fully functional Linux-style terminal emulator powered by XTerm.js
- **⚡ Glitch Effects**: Cyberpunk-inspired glitch animations and visual effects
- **🎨 Modern UI**: Neon green, cyan, and purple color scheme with dark theme
- **📱 Responsive Design**: Mobile-first approach with hamburger menu
- **🎯 Smooth Animations**: Intersection Observer API for scroll-triggered animations
- **📊 Stats Counter**: Animated statistics showcase
- **🎓 Timeline**: Visual work experience timeline
- **🎮 Easter Eggs**: Konami code support and hidden console messages

## 🛠️ Technologies

### Frontend Stack
- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox, animations
- **JavaScript (ES6+)**: Vanilla JavaScript for interactions

### Libraries
| Library | Purpose | Version |
|---------|---------|---------|
| [XTerm.js](https://xtermjs.org/) | Terminal emulator | 5.3.0 |
| [XTerm Fit Addon](https://github.com/xtermjs/xterm.js) | Terminal responsive sizing | 0.8.0 |
| [Font Awesome](https://fontawesome.com/) | Icon library | 6.5.1 |
| [Google Fonts](https://fonts.google.com/) | Fira Code, Share Tech Mono | - |

### Visual Effects
- Canvas API for Matrix rain animation
- CSS keyframe animations
- Glitch text effects
- Typing animation
- Skill bar animations
- Scroll-triggered animations

## Terminal Commands

The interactive terminal supports the following commands:

| Command | Description |
|---------|-------------|
| `help` | Display all available commands |
| `about` | Learn more about me |
| `skills` | View technical skills |
| `experience` | Show work experience |
| `projects` | List featured projects |
| `education` | Display education background |
| `certifications` | Show certifications |
| `contact` | Get contact information |
| `social` | View social media links |
| `whoami` | Who am I? |
| `ls` | List files (simulated) |
| `cat <file>` | Display file contents |
| `date` | Display current date and time |
| `uname` | Display system information |
| `history` | Show command history |
| `clear` | Clear terminal screen |
| `exit` | Close terminal |

**Special Commands:**
- Arrow Up/Down: Navigate command history
- Tab: Auto-complete commands
- Ctrl+C: Cancel current input
- Ctrl+L: Clear screen

## 📁 Project Structure

```
terminal-portfolio/
├── index.html                 # Main HTML file
├── README.md                  # Project documentation
├── .gitignore                 # Git ignore rules
└── assets/
    ├── css/
    │   └── styles.css         # All styles and animations
    ├── js/
    │   ├── script.js          # Main JavaScript (Matrix, animations)
    │   └── terminal.js        # Terminal emulator logic
    └── sounds/
        └── button.mp3         # UI sound effects
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/harungecit/terminal-portfolio.git
cd terminal-portfolio
```

### 2. Run Locally

**Option A: Direct Browser**
```bash
# Simply open index.html in your browser
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

**Option B: VS Code Live Server**
```bash
# Install Live Server extension in VS Code
# Right-click on index.html → "Open with Live Server"
```

**Option C: Python Server**
```bash
# Python 3
python -m http.server 8000
# Visit: http://localhost:8000
```

**Option D: Node.js HTTP Server**
```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server
# Visit: http://localhost:8080
```

### 3. GitHub Pages Deployment

The site is automatically deployed via GitHub Pages. To deploy your own:
1. Go to repository Settings → Pages
2. Select branch `main` and folder `/` (root)
3. Click Save
4. Your site will be live at `https://yourusername.github.io/terminal-portfolio`

## 🌐 Browser Support

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome/Edge | ✅ Full Support | Recommended |
| Firefox | ✅ Full Support | All features working |
| Safari | ✅ Full Support | Including iOS Safari |
| Opera | ✅ Full Support | Chromium-based |

**Requirements**: JavaScript must be enabled for full functionality.

## 🎨 Customization Guide

### Color Scheme
Edit CSS variables in `assets/css/styles.css`:
```css
:root {
    --primary-bg: #0a0e27;      /* Dark blue background */
    --neon-green: #00ff41;      /* Matrix green */
    --neon-cyan: #00f0ff;       /* Accent cyan */
    --neon-purple: #b026ff;     /* Accent purple */
    --neon-pink: #ff006e;       /* Accent pink */
}
```

### Matrix Rain Effect
Control animation speed in `assets/js/script.js`:
```javascript
// Lower = faster, Higher = slower
setInterval(drawMatrix, 33); // Default: ~30fps
```

### Typing Text Animation
Update text array in `assets/js/script.js`:
```javascript
const textArray = [
    'Full Stack Developer',
    'PHP Specialist',
    'DevOps Engineer',
    'Your Custom Text...'
];
```

### Terminal Commands
Add custom commands in `assets/js/terminal.js`:
```javascript
commands: {
    'yourcommand': () => 'Your custom output'
}
```

## ⚡ Performance

- **60fps** Matrix rain animation using `requestAnimationFrame`
- **Intersection Observer API** for efficient scroll animations
- **Debounced resize events** to prevent excessive calculations
- **Lazy loading** for images and assets
- **Optimized CSS** with GPU-accelerated transforms

## 🎮 Easter Eggs

Try these hidden features:

1. **🎯 Konami Code**: Press `↑ ↑ ↓ ↓ ← → ← → B A` for a surprise
2. **🔍 Console Messages**: Open DevTools console (`F12`) for hidden messages
3. **⚠️ Sudo Command**: Try typing `sudo` in the terminal
4. **📜 Terminal History**: Use arrow keys ↑↓ to navigate command history

## 📸 Screenshots

![Terminal Portfolio Hero](https://via.placeholder.com/800x400/0a0e27/00ff41?text=Terminal+Portfolio)
*Interactive terminal with Matrix rain background*

## 🔧 Tech Stack Summary

```javascript
const portfolio = {
    frontend: ['HTML5', 'CSS3', 'JavaScript ES6+'],
    libraries: ['XTerm.js', 'Font Awesome'],
    features: [
        'Matrix Rain Animation',
        'Interactive Terminal',
        'Glitch Effects',
        'Responsive Design',
        'Easter Eggs'
    ],
    deployment: 'GitHub Pages',
    performance: '⚡ 60fps animations'
};
```

## 🤝 Contributing

This is a personal portfolio project. However, if you find any bugs or have suggestions:

1. Open an issue
2. Fork the repo
3. Create a feature branch (`git checkout -b feature/AmazingFeature`)
4. Commit changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## 📄 License

Copyright © 2025 **Harun Geçit**. All rights reserved.

This project is for personal portfolio use. Feel free to fork and customize for your own use, but please provide attribution.

## 👨‍💻 Author

**Harun Geçit** - Full Stack Developer

- 🌐 Website: [harungecit.com](https://harungecit.com)
- 📧 Email: [info@harungecit.com](mailto:info@harungecit.com)
- 💼 LinkedIn: [@harungecit](https://linkedin.com/in/harungecit)
- 🐙 GitHub: [@harungecit](https://github.com/harungecit)
- 📷 Instagram: [@harungecit.dev](https://instagram.com/harungecit.dev)
- 🐦 X (Twitter): [@harungecit_](https://x.com/harungecit_)
- 📝 Blog: [echo.harungecit.dev](https://echo.harungecit.dev)
- 🔗 All Links: [bio.link/harungecit](https://bio.link/harungecit)

## 🙏 Acknowledgments

- **Terminal Emulator**: [XTerm.js](https://xtermjs.org/)
- **Icons**: [Font Awesome](https://fontawesome.com/)
- **Fonts**: [Google Fonts](https://fonts.google.com/) (Fira Code, Share Tech Mono)
- **Inspiration**: Matrix movie, cyberpunk aesthetics, terminal interfaces

---

<div align="center">

**⭐ Star this repo if you like it!**

Built with 💚 and ☕ by [Harun Geçit](https://harungecit.com)

</div>
