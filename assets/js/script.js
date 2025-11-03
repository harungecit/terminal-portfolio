// ================================
// Matrix Rain Background Effect
// ================================
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*(){}[]<>/~';
const charArray = chars.split('');

const fontSize = 14;
const columns = canvas.width / fontSize;

const drops = [];
for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 14, 39, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 33);

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ================================
// Typing Animation
// ================================
const typedTextElement = document.getElementById('typed-text');
const textArray = [
    'Full Stack Developer',
    'PHP Specialist',
    'JavaScript Developer',
    'DevOps Engineer',
    'Linux Enthusiast',
    'Cybersecurity Explorer'
];
let textArrayIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 200;

function type() {
    const currentText = textArray[textArrayIndex];

    if (isDeleting) {
        typedTextElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = 100;
    } else {
        typedTextElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 200;
    }

    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingDelay = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textArrayIndex = (textArrayIndex + 1) % textArray.length;
        typingDelay = 500;
    }

    setTimeout(type, typingDelay);
}

// Start typing animation
setTimeout(type, 1000);

// ================================
// Navbar Scroll Effect
// ================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--neon-green)';
        }
    });
});

// ================================
// Mobile Menu Toggle
// ================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Animate hamburger icon
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// ================================
// Smooth Scroll
// ================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ================================
// Stats Counter Animation
// ================================
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                let current = 0;
                const increment = target / 100;
                const duration = 2000;
                const stepTime = duration / 100;

                const counter = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        const suffix = (target === 100 || target === 15 || target === 10) ? '+' : '';
                        stat.textContent = target + suffix;
                        clearInterval(counter);
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                }, stepTime);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-grid');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ================================
// Skill Bar Animation
// ================================
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBars = entry.target.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                setTimeout(() => {
                    bar.style.width = progress + '%';
                }, 200);
            });
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

// Observe each skill category individually for better mobile support
const skillCategories = document.querySelectorAll('.skill-category');
if (skillCategories.length > 0) {
    skillCategories.forEach(category => {
        skillsObserver.observe(category);
    });
} else {
    // Fallback to observing the entire section
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
}

// ================================
// AOS (Animate On Scroll)
// ================================
const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, { threshold: 0.2 });

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach(item => {
    aosObserver.observe(item);
});

// Observe project cards
document.querySelectorAll('.project-card').forEach(card => {
    aosObserver.observe(card);
});

// ================================
// Contact Form Handler
// ================================
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const topic = formData.get('topic');
    const message = formData.get('message');
    const consent = formData.get('consent');

    // Check consent
    if (!consent) {
        alert('Please accept the KVKK/GDPR consent to proceed.');
        return;
    }

    // Get topic text
    const topicSelect = document.getElementById('topic');
    const topicText = topicSelect.options[topicSelect.selectedIndex].text;

    // Create mailto link
    const mailtoLink = `mailto:info@harungecit.com?subject=${encodeURIComponent(`[${topicText}] Contact from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nTopic: ${topicText}\n\nMessage:\n${message}\n\n---\nConsent: User agreed to KVKK/GDPR data processing.`)}`;

    // Open default email client
    window.location.href = mailtoLink;

    // Show success message
    alert('Opening your email client...');

    // Reset form
    contactForm.reset();
});

// ================================
// Parallax Effect for Hero Section
// ================================
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - scrolled / 700;
    }
});

// ================================
// Glitch Effect Enhancement
// ================================
const glitchElements = document.querySelectorAll('.glitch');

glitchElements.forEach(element => {
    setInterval(() => {
        if (Math.random() > 0.95) {
            element.style.textShadow = `
                ${Math.random() * 10 - 5}px 0 var(--neon-cyan),
                ${Math.random() * 10 - 5}px 0 var(--neon-purple)
            `;
            setTimeout(() => {
                element.style.textShadow = '';
            }, 50);
        }
    }, 2000);
});

// ================================
// Random Pixel Flicker Effect
// ================================
function createPixelFlicker() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (Math.random() > 0.98) {
            section.style.filter = 'contrast(1.2) brightness(1.1)';
            setTimeout(() => {
                section.style.filter = '';
            }, 50);
        }
    });
}

setInterval(createPixelFlicker, 3000);

// ================================
// Code Window Animation
// ================================
const codeWindow = document.querySelector('.window-content code');
if (codeWindow) {
    const originalCode = codeWindow.innerHTML;
    let glitchInterval = setInterval(() => {
        if (Math.random() > 0.97) {
            codeWindow.style.opacity = '0.8';
            setTimeout(() => {
                codeWindow.style.opacity = '1';
            }, 100);
        }
    }, 2000);
}

// ================================
// Loading Animation
// ================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // Update current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});

// ================================
// Easter Egg: Konami Code
// ================================
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

window.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join('') === konamiPattern.join('')) {
        document.body.style.animation = 'rainbow 5s infinite';
        alert('🎮 You found the Konami Code! +30 Lives! 🎮');

        // Add rainbow animation
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// ================================
// Console Easter Egg
// ================================
console.log('%c🚀 Welcome to Harun Geçit\'s Portfolio!', 'color: #00ff41; font-size: 20px; font-weight: bold;');
console.log('%c👨‍💻 Full Stack Developer | PHP | JavaScript | DevOps', 'color: #00f0ff; font-size: 14px;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00ff41;');
console.log('%c\n📦 Tech Stack:', 'color: #b026ff; font-size: 14px; font-weight: bold;');
console.log('%c   • Frontend: React.js, Tailwind CSS, XTerm.js', 'color: #00f0ff; font-size: 12px;');
console.log('%c   • Backend: PHP (Laravel, CodeIgniter), Node.js (Express)', 'color: #00f0ff; font-size: 12px;');
console.log('%c   • DevOps: Docker, Kubernetes, Nginx, Cloudflare', 'color: #00f0ff; font-size: 12px;');
console.log('%c   • Database: PostgreSQL, MySQL, MongoDB, Redis', 'color: #00f0ff; font-size: 12px;');
console.log('%c\n💼 Interested in working together?', 'color: #ffa500; font-size: 14px; font-weight: bold;');
console.log('%c   📧 info@harungecit.com', 'color: #00ff41; font-size: 12px;');
console.log('%c   💬 WhatsApp: 0850 303 39 54', 'color: #00ff41; font-size: 12px;');
console.log('%c   🐙 GitHub: github.com/harungecit', 'color: #00ff41; font-size: 12px;');
console.log('%c\n🎮 Hidden Features:', 'color: #ff006e; font-size: 14px; font-weight: bold;');
console.log('%c   • Try the interactive terminal above! Type "help" to get started', 'color: #b026ff; font-size: 12px;');
console.log('%c   • Press Konami Code for a surprise: ⬆⬆⬇⬇⬅➡⬅➡BA', 'color: #b026ff; font-size: 12px;');
console.log('%c   • Watch the Matrix rain effect in the background', 'color: #b026ff; font-size: 12px;');
console.log('%c\n⚡ Performance Info:', 'color: #00f0ff; font-size: 14px; font-weight: bold;');
console.log('%c   • Pure JavaScript - No heavy frameworks on this page', 'color: #a0a0a0; font-size: 12px;');
console.log('%c   • Optimized animations with CSS transforms', 'color: #a0a0a0; font-size: 12px;');
console.log('%c   • Responsive design - Mobile & Desktop friendly', 'color: #a0a0a0; font-size: 12px;');
console.log('%c\n💡 Pro Tip:', 'color: #ffa500; font-size: 12px; font-weight: bold;');
console.log('%c   Check out my DevTools at https://devtools.harungecit.dev/', 'color: #00ff41; font-size: 12px;');
console.log('%c\n🎯 Fun fact:', 'color: #ff006e; font-size: 12px; font-weight: bold;');
console.log('%c   This entire site was built with AI assistance using Claude Code!', 'color: #b026ff; font-size: 12px;');
console.log('%c\n🎮 Easter Egg Hunt:', 'color: #ff006e; font-size: 12px; font-weight: bold;');
console.log('%c   The terminal has hidden commands... Can you find them all?', 'color: #ffbd2e; font-size: 12px;');
console.log('%c   Hint: Try classic gaming references and old-school Unix magic words', 'color: #a0a0a0; font-size: 11px; font-style: italic;');
console.log('%c\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'color: #00ff41;');

// ================================
// Cursor Trail Effect
// ================================
let cursorTrail = [];
const maxTrailLength = 10;

document.addEventListener('mousemove', (e) => {
    cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });

    if (cursorTrail.length > maxTrailLength) {
        cursorTrail.shift();
    }

    // Remove old trail elements
    document.querySelectorAll('.cursor-trail').forEach(el => {
        if (Date.now() - parseInt(el.dataset.time) > 500) {
            el.remove();
        }
    });

    // Create trail element occasionally
    if (Math.random() > 0.9) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--neon-green);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            opacity: 0.6;
            box-shadow: 0 0 10px var(--neon-green);
            animation: fadeOut 0.5s forwards;
        `;
        trail.dataset.time = Date.now();
        document.body.appendChild(trail);
    }
});

// Add fadeOut animation
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: scale(0);
        }
    }
`;
document.head.appendChild(style);

// ================================
// Performance: Reduce animations on low-end devices
// ================================
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.querySelectorAll('[data-aos]').forEach(el => {
        el.removeAttribute('data-aos');
    });
}

// ================================
// Back to Top Button
// ================================
const backToTopBtn = document.getElementById('back-to-top');

// Show/hide button based on scroll position
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

// Scroll to top when clicked
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ================================
// Hover Sound Effect
// ================================
const hoverSound = new Audio('assets/sounds/button.mp3');
hoverSound.volume = 0.3; // Set volume to 30%
let canPlaySound = true;
let soundCooldown = 100; // Cooldown in milliseconds

// Unlock audio on first user interaction (mouse move, scroll, click, etc.)
function unlockAudio() {
    hoverSound.play().then(() => {
        hoverSound.pause();
        hoverSound.currentTime = 0;
        console.log('%c🔊 Sound ready!', 'color: #00ff41; font-size: 12px;');
    }).catch(e => {
        console.debug('Sound unlock skipped:', e);
    });
}

// Listen for ANY user interaction to unlock
let isUnlocked = false;
function tryUnlock() {
    if (!isUnlocked) {
        isUnlocked = true;
        unlockAudio();
    }
}

// Multiple unlock triggers
document.addEventListener('mousemove', tryUnlock, { once: true });
document.addEventListener('scroll', tryUnlock, { once: true, passive: true });
document.addEventListener('click', tryUnlock, { once: true });
document.addEventListener('touchstart', tryUnlock, { once: true });
document.addEventListener('keydown', tryUnlock, { once: true });

// Function to play hover sound with cooldown
function playHoverSound() {
    if (canPlaySound) {
        hoverSound.currentTime = 0;
        hoverSound.play().catch(e => {
            console.debug('Sound play prevented:', e);
        });

        canPlaySound = false;
        setTimeout(() => {
            canPlaySound = true;
        }, soundCooldown);
    }
}

// Add hover sound to interactive elements
function addHoverSounds() {
    // Select all interactive elements - comprehensive list
    const interactiveElements = document.querySelectorAll(`
        a,
        button,
        .btn,
        .hero-btn,
        .card,
        .skill-card,
        .skill-category,
        .experience-item,
        .project-card,
        .social-link,
        .social-card,
        .back-to-top,
        .nav-link,
        .terminal-container,
        input[type="text"],
        input[type="email"],
        textarea
    `);

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', playHoverSound);
    });
}

// Initialize hover sounds after a short delay to avoid issues on page load
setTimeout(addHoverSounds, 1000);

console.log('%c⚡ Website fully loaded and optimized!', 'color: #00ff41; font-size: 14px; font-weight: bold;');

// ================================
// Screensaver - Idle Detection
// ================================
let idleTimer = null;
let screensaverActive = false;
const IDLE_TIME = 60000; // 1 minute in milliseconds

// Create screensaver element
const screensaver = document.createElement('div');
screensaver.id = 'screensaver';
screensaver.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #0a0e27;
    z-index: 10000;
    display: none;
    opacity: 0;
    transition: opacity 0.5s ease;
`;

const screensaverCanvas = document.createElement('canvas');
screensaverCanvas.id = 'screensaver-canvas';
screensaverCanvas.style.cssText = `
    width: 100%;
    height: 100%;
`;
screensaver.appendChild(screensaverCanvas);

// Add hint text
const screensaverHint = document.createElement('div');
screensaverHint.style.cssText = `
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    color: var(--neon-green);
    font-family: var(--font-code);
    font-size: 1rem;
    text-align: center;
    opacity: 0.7;
    animation: fadeInOut 2s infinite;
`;
screensaverHint.textContent = 'Press any key or move mouse to continue...';
screensaver.appendChild(screensaverHint);

document.body.appendChild(screensaver);

// Matrix rain for screensaver
let screensaverInterval = null;
function startScreensaver() {
    if (screensaverActive) return;

    screensaverActive = true;
    screensaver.style.display = 'block';

    // Fade in
    setTimeout(() => {
        screensaver.style.opacity = '1';
    }, 10);

    // Initialize canvas
    const canvas = screensaverCanvas;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*(){}[]<>/~ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
    const charArray = chars.split('');
    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(10, 14, 39, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff41';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    screensaverInterval = setInterval(drawMatrix, 33);

    console.log('%c💤 Screensaver activated!', 'color: #00ff41; font-size: 12px;');
}

function stopScreensaver() {
    if (!screensaverActive) return;

    screensaverActive = false;

    // Fade out
    screensaver.style.opacity = '0';

    setTimeout(() => {
        screensaver.style.display = 'none';
        if (screensaverInterval) {
            clearInterval(screensaverInterval);
            screensaverInterval = null;
        }
    }, 500);

    console.log('%c👋 Screensaver deactivated!', 'color: #00ff41; font-size: 12px;');
}

function resetIdleTimer() {
    // Stop screensaver if active
    if (screensaverActive) {
        stopScreensaver();
    }

    // Clear existing timer
    if (idleTimer) {
        clearTimeout(idleTimer);
    }

    // Set new timer
    idleTimer = setTimeout(startScreensaver, IDLE_TIME);
}

// Listen for user activity
const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
activityEvents.forEach(event => {
    document.addEventListener(event, resetIdleTimer, { passive: true });
});

// Resize screensaver canvas on window resize
window.addEventListener('resize', () => {
    if (screensaverActive && screensaverCanvas) {
        screensaverCanvas.width = window.innerWidth;
        screensaverCanvas.height = window.innerHeight;
    }
});

// Add fadeInOut animation for hint text
const screensaverStyle = document.createElement('style');
screensaverStyle.innerHTML = `
    @keyframes fadeInOut {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 0.3; }
    }
`;
document.head.appendChild(screensaverStyle);

// Start idle timer
resetIdleTimer();

console.log('%c⏰ Screensaver will activate after 1 minute of inactivity', 'color: #00f0ff; font-size: 12px;');
