# Harun Geçit - Personal Portfolio Website

Modern, interactive, and cybersecurity-themed personal portfolio website for Harun Geçit, Full Stack Developer.

## Features

- **Matrix Rain Background**: Dynamic Matrix-style rain animation using Canvas API
- **Interactive Terminal**: Fully functional Linux-style terminal emulator using XTerm.js
- **Glitch Effects**: Cyberpunk-style glitch animations and effects
- **Pixel Icons**: HackerNoon Pixel Icon Library integration
- **Dark Theme**: Neon green, cyan, and purple color scheme
- **Smooth Animations**: Intersection Observer-based animations
- **Responsive Design**: Mobile-friendly layout
- **Easter Eggs**: Konami Code and console messages

## Technologies Used

### Frontend
- HTML5
- CSS3 (Custom properties, animations, grid, flexbox)
- JavaScript (ES6+)

### Libraries & Tools
- **XTerm.js**: Terminal emulator
- **XTerm Fit Addon**: Terminal resizing
- **Pixel Icon Library**: HackerNoon Icons (@hackernoon/pixel-icon-library)
- **Google Fonts**: Fira Code, Share Tech Mono

### Features Implemented
- Matrix rain effect
- Typing animation
- Smooth scroll
- Stats counter animation
- Skill bar animations
- Timeline animations
- Project card animations
- Contact form (mailto)
- Mobile hamburger menu
- Parallax effects
- Cursor trail effect
- Random glitch effects

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

## File Structure

```
C:\harungecit\
├── index.html          # Main HTML file
├── styles.css          # Stylesheet
├── script.js           # Main JavaScript (animations, effects)
├── terminal.js         # Terminal emulator logic
├── README.md           # This file
├── personal.md         # Personal information
└── Harun Gecit CV-Resume 2025.pdf  # CV/Resume
```

## How to Use

1. **Open in Browser**:
   - Simply open `index.html` in any modern web browser
   - Or use a local server for better experience

2. **Using VS Code Live Server**:
   ```bash
   # Install Live Server extension in VS Code
   # Right-click on index.html
   # Select "Open with Live Server"
   ```

3. **Using Python**:
   ```bash
   # Navigate to the directory
   cd C:\harungecit

   # Python 3
   python -m http.server 8000

   # Then open http://localhost:8000 in browser
   ```

4. **Using Node.js**:
   ```bash
   # Install http-server globally
   npm install -g http-server

   # Navigate to the directory
   cd C:\harungecit

   # Run server
   http-server

   # Then open http://localhost:8080 in browser
   ```

## Browser Compatibility

- Chrome/Edge (recommended) - Full support
- Firefox - Full support
- Safari - Full support
- Opera - Full support

**Note**: JavaScript must be enabled for full functionality.

## Easter Eggs

1. **Konami Code**: Try pressing ⬆️ ⬆️ ⬇️ ⬇️ ⬅️ ➡️ ⬅️ ➡️ B A
2. **Console Messages**: Open DevTools console to see special messages
3. **Sudo Command**: Try using `sudo` in the terminal 😄

## Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-bg: #0a0e27;
    --neon-green: #00ff41;
    --neon-cyan: #00f0ff;
    --neon-purple: #b026ff;
    --neon-pink: #ff006e;
}
```

### Matrix Rain Speed
Edit in `script.js`:
```javascript
setInterval(drawMatrix, 33); // Change 33 to adjust speed
```

### Typing Animation
Edit text array in `script.js`:
```javascript
const textArray = [
    'Full Stack Developer',
    'PHP Specialist',
    // Add more...
];
```

## Performance Optimization

- Matrix rain canvas uses requestAnimationFrame for smooth 60fps
- Intersection Observer for efficient scroll animations
- Debounced resize events
- Conditional animations on low-end devices

## Credits

- **Developer**: Harun Geçit
- **Icons**: [@hackernoon/pixel-icon-library](https://pixeliconlibrary.com/)
- **Terminal**: [XTerm.js](https://xtermjs.org/)
- **Fonts**: [Google Fonts](https://fonts.google.com/)

## License

Copyright © 2025 Harun Geçit. All rights reserved.

---

## Contact

- **Email**: info@harungecit.com
- **Website**: https://harungecit.com
- **GitHub**: [@harungecit](https://github.com/harungecit)
- **LinkedIn**: [@harungecit](https://linkedin.com/in/harungecit)
- **Instagram**: [@harungecit.dev](https://instagram.com/harungecit.dev)
- **All Links**: [bio.link/harungecit](https://bio.link/harungecit)

---

Built with ❤️ and ☕ by Harun Geçit
