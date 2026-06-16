// ================================
// Neural Network Particle Background
// ================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reusable neural-network renderer (used for page background + screensaver)
function createNeuralNetwork(canvasEl, options = {}) {
    const ctx = canvasEl.getContext('2d');
    const density = options.density || 24000;   // px² per particle (higher = sparser)
    const linkDist = options.linkDist || 150;
    const maxParticles = options.maxParticles || 90;
    const pointer = { x: null, y: null };
    let particles = [];
    let rafId = null;

    function resize() {
        canvasEl.width = window.innerWidth;
        canvasEl.height = window.innerHeight;
        init();
    }

    function init() {
        const count = Math.min(maxParticles, Math.floor((canvasEl.width * canvasEl.height) / density));
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * canvasEl.width,
            y: Math.random() * canvasEl.height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.5 + 0.6,
            // violet or cyan node
            color: Math.random() > 0.5 ? '139, 92, 246' : '34, 211, 238'
        }));
    }

    function drawFrame() {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

        // Move particles
        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvasEl.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvasEl.height) p.vy *= -1;
        }

        // Connection lines
        for (let i = 0; i < particles.length; i++) {
            const a = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < linkDist) {
                    const alpha = (1 - dist / linkDist) * 0.14;
                    ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }

            // Pointer attraction lines — the network "reaches" toward the cursor
            if (pointer.x !== null) {
                const dx = a.x - pointer.x;
                const dy = a.y - pointer.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < linkDist * 1.2) {
                    const alpha = (1 - dist / (linkDist * 1.2)) * 0.22;
                    ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(pointer.x, pointer.y);
                    ctx.stroke();
                }
            }
        }

        // Nodes
        for (const p of particles) {
            ctx.fillStyle = `rgba(${p.color}, 0.55)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function loop() {
        drawFrame();
        rafId = requestAnimationFrame(loop);
    }

    return {
        start() {
            resize();
            if (prefersReducedMotion) {
                drawFrame(); // static frame only
            } else {
                loop();
            }
        },
        stop() {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = null;
        },
        resize,
        setPointer(x, y) {
            pointer.x = x;
            pointer.y = y;
        }
    };
}

const bgCanvas = document.getElementById('matrix-canvas');
const bgNetwork = createNeuralNetwork(bgCanvas);
bgNetwork.start();

document.addEventListener('mousemove', (e) => {
    bgNetwork.setPointer(e.clientX, e.clientY);
});

document.addEventListener('mouseleave', () => {
    bgNetwork.setPointer(null, null);
});

window.addEventListener('resize', () => {
    bgNetwork.resize();
});

// ================================
// Typing Animation
// ================================
const typedTextElement = document.getElementById('typed-text');
const textArray = [
    'Full Stack Developer',
    'AI Engineer',
    'LLM & RAG Developer',
    'Prompt Engineer',
    'Multi-Agent Orchestrator',
    'Laravel Ecosystem Expert',
    'DevOps Engineer',
    'Cybersecurity Specialist'
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
            link.style.color = 'var(--accent)';
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
                        const suffix = (target === 100 || target === 15 || target === 2 || target === 8) ? '+' : '';
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
// Contact Form Handler (Netlify Forms)
// ================================
const contactForm = document.getElementById('contact-form');

// Email validation regex (RFC 5322 compliant)
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Phone validation regex (international format)
const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;

// Validate email
function validateEmail(email) {
    if (!email) return { valid: false, message: 'Email is required' };
    if (email.length > 254) return { valid: false, message: 'Email is too long' };
    if (!emailRegex.test(email)) return { valid: false, message: 'Please enter a valid email address' };

    const parts = email.split('@');
    if (parts[0].length > 64) return { valid: false, message: 'Email local part is too long' };

    const domainParts = parts[1].split('.');
    if (domainParts.some(part => part.length > 63)) return { valid: false, message: 'Email domain is invalid' };
    if (domainParts[domainParts.length - 1].length < 2) return { valid: false, message: 'Email domain extension is invalid' };

    return { valid: true, message: '' };
}

// Validate phone
function validatePhone(phone) {
    if (!phone) return { valid: true, message: '' }; // Phone is optional

    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    if (cleanPhone.length < 7) return { valid: false, message: 'Phone number is too short' };
    if (cleanPhone.length > 15) return { valid: false, message: 'Phone number is too long' };
    if (!phoneRegex.test(phone)) return { valid: false, message: 'Please enter a valid phone number' };

    return { valid: true, message: '' };
}

// Get visitor info from ip.guide
async function getVisitorInfo() {
    try {
        const response = await fetch('https://ip.guide/', {
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();

        const info = [];
        if (data.ip) info.push(`IP: ${data.ip}`);
        if (data.location?.country) info.push(`Country: ${data.location.country}`);
        if (data.location?.city) info.push(`City: ${data.location.city}`);
        if (data.location?.timezone) info.push(`Timezone: ${data.location.timezone}`);
        if (data.network?.autonomous_system?.organization) info.push(`ISP: ${data.network.autonomous_system.organization}`);

        if (info.length > 0) {
            return '\r\n\r\n========== Visitor Info ==========\r\n' + info.join('\r\n') + '\r\n==================================';
        }
        return '';
    } catch (error) {
        console.log('Could not fetch visitor info');
        return '';
    }
}

// Real-time validation
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const emailError = document.getElementById('email-error');
const phoneError = document.getElementById('phone-error');

emailInput.addEventListener('blur', () => {
    const result = validateEmail(emailInput.value);
    emailError.textContent = result.message;
    emailInput.classList.toggle('invalid', !result.valid);
});

phoneInput.addEventListener('blur', () => {
    const result = validatePhone(phoneInput.value);
    phoneError.textContent = result.message;
    phoneInput.classList.toggle('invalid', !result.valid);
});

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const consent = formData.get('consent');
    const email = formData.get('email');
    const phone = formData.get('phone');

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        emailError.textContent = emailValidation.message;
        emailInput.classList.add('invalid');
        emailInput.focus();
        return;
    }

    // Validate phone if provided
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.valid) {
        phoneError.textContent = phoneValidation.message;
        phoneInput.classList.add('invalid');
        phoneInput.focus();
        return;
    }

    // Check consent
    if (!consent) {
        alert('Please accept the KVKK/GDPR consent to proceed.');
        return;
    }

    // Get the submit button
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonHTML = submitButton.innerHTML;

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
        // Get visitor info and append to message
        const visitorInfo = await getVisitorInfo();
        const originalMessage = formData.get('message');
        formData.set('message', originalMessage + visitorInfo);

        // Submit to Netlify Forms
        const response = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        });

        if (response.ok) {
            // Success
            alert('Thank you! Your message has been sent successfully. I will get back to you soon.');
            contactForm.reset();
            emailError.textContent = '';
            phoneError.textContent = '';
        } else {
            // Error
            throw new Error('Form submission failed');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        alert('Oops! There was an error sending your message. Please try again or contact me directly at info@harungecit.com');
    } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHTML;
    }
});

// ================================
// Privacy Policy Modal
// ================================
const privacyLink = document.getElementById('privacy-link');
const privacyModal = document.getElementById('privacy-modal');
const modalClose = document.getElementById('modal-close');

if (privacyLink && privacyModal) {
    privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        privacyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    modalClose.addEventListener('click', () => {
        privacyModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    privacyModal.addEventListener('click', (e) => {
        if (e.target === privacyModal) {
            privacyModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && privacyModal.classList.contains('active')) {
            privacyModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

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
console.log('%c🚀 Welcome to Harun Geçit\'s Portfolio!', 'color: #34d399; font-size: 20px; font-weight: bold;');
console.log('%c🤖 Full Stack Developer & AI Engineer | LLM | RAG | Multi-Agent Orchestration', 'color: #22d3ee; font-size: 14px;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #34d399;');
console.log('%c\n📦 Tech Stack:', 'color: #a78bfa; font-size: 14px; font-weight: bold;');
console.log('%c   • AI/LLM: RAG, pgvector, Fine-Tuning, PageIndex, Multi-LLM, AI Agents', 'color: #a78bfa; font-size: 12px;');
console.log('%c   • AI Tools: Claude Code, Codex, Gemini CLI, OpenCode, Cursor, TRAE', 'color: #a78bfa; font-size: 12px;');
console.log('%c   • Languages: PHP, JavaScript, Go, SQL, Bash, Python', 'color: #22d3ee; font-size: 12px;');
console.log('%c   • Laravel: Livewire, Inertia.js, Filament, Nova, Forge, Vapor', 'color: #22d3ee; font-size: 12px;');
console.log('%c   • Frontend: React.js, Alpine.js, Inertia.js, Tailwind CSS', 'color: #22d3ee; font-size: 12px;');
console.log('%c   • DevOps: Docker, Kubernetes, Nginx, AWS, GCP', 'color: #22d3ee; font-size: 12px;');
console.log('%c   • Database: PostgreSQL, MySQL, MongoDB, Redis', 'color: #22d3ee; font-size: 12px;');
console.log('%c\n💼 Interested in working together?', 'color: #fbbf24; font-size: 14px; font-weight: bold;');
console.log('%c   📧 info@harungecit.com', 'color: #34d399; font-size: 12px;');
console.log('%c   💬 WhatsApp: 0850 303 39 54', 'color: #34d399; font-size: 12px;');
console.log('%c   🐙 GitHub: github.com/harungecit', 'color: #34d399; font-size: 12px;');
console.log('%c\n🎮 Hidden Features:', 'color: #f472b6; font-size: 14px; font-weight: bold;');
console.log('%c   • Try the interactive terminal above! Type "help" to get started', 'color: #a78bfa; font-size: 12px;');
console.log('%c   • Press Konami Code for a surprise: ⬆⬆⬇⬇⬅➡⬅➡BA', 'color: #a78bfa; font-size: 12px;');
console.log('%c   • Watch the neural network particles react to your cursor', 'color: #a78bfa; font-size: 12px;');
console.log('%c\n⚡ Performance Info:', 'color: #22d3ee; font-size: 14px; font-weight: bold;');
console.log('%c   • Pure JavaScript - No heavy frameworks on this page', 'color: #a0a0a0; font-size: 12px;');
console.log('%c   • Optimized animations with CSS transforms', 'color: #a0a0a0; font-size: 12px;');
console.log('%c   • Responsive design - Mobile & Desktop friendly', 'color: #a0a0a0; font-size: 12px;');
console.log('%c\n💡 Pro Tip:', 'color: #fbbf24; font-size: 12px; font-weight: bold;');
console.log('%c   Check out my DevTools at https://devtools.harungecit.dev/', 'color: #34d399; font-size: 12px;');
console.log('%c\n🎯 Fun fact:', 'color: #f472b6; font-size: 12px; font-weight: bold;');
console.log('%c   This entire site was built with AI assistance using Claude Code!', 'color: #a78bfa; font-size: 12px;');
console.log('%c\n🎮 Easter Egg Hunt:', 'color: #f472b6; font-size: 12px; font-weight: bold;');
console.log('%c   The terminal has hidden commands... Can you find them all?', 'color: #fcd34d; font-size: 12px;');
console.log('%c   Hint: Try classic gaming references and old-school Unix magic words', 'color: #a0a0a0; font-size: 11px; font-style: italic;');
console.log('%c\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'color: #34d399;');

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
        console.log('%c🔊 Sound ready!', 'color: #34d399; font-size: 12px;');
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

console.log('%c⚡ Website fully loaded and optimized!', 'color: #34d399; font-size: 14px; font-weight: bold;');

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
    background: #07070d;
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

// ================================
// Screensaver renderers (random pick on each activation)
// Each factory takes the shared canvas and returns { start, stop, resize }.
// All share the violet/cyan palette and the AI / neural / agentic theme.
// ================================
const SS = {
    violet: '139, 92, 246',
    cyan: '34, 211, 238',
    emerald: '16, 185, 129',
};
const ssRand = (a, b) => a + Math.random() * (b - a);
const ssPick = (arr) => arr[(Math.random() * arr.length) | 0];
const SS_GLYPHS = '01{}</>[]#$+=*ΔΣλ⌁⎔◇◆∴⟶→01アカサ0x'.split('');

function ssDims(canvas, ctx) {
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth, H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    return { W, H, DPR };
}

// --- v1: Neural Signals — firing neurons + traveling signal pulses + glyphs ---
function makeNeuralSignals(canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, raf = null, nodes = [], links = [], signals = [], glyphs = [];
    const LINK = 165;
    function build() {
        const n = Math.max(36, Math.min(120, Math.floor((W * H) / 16000)));
        nodes = Array.from({ length: n }, () => {
            const hub = Math.random() < 0.14;
            return { x: Math.random() * W, y: Math.random() * H, vx: ssRand(-0.28, 0.28), vy: ssRand(-0.28, 0.28),
                r: hub ? ssRand(2.6, 4.2) : ssRand(0.8, 1.8), hub, color: Math.random() > 0.5 ? SS.violet : SS.cyan,
                fire: 0, nextFire: ssRand(0, 240) };
        });
        const g = Math.max(14, Math.min(40, Math.floor((W * H) / 52000)));
        glyphs = Array.from({ length: g }, () => ({ x: Math.random() * W, y: Math.random() * H, ch: ssPick(SS_GLYPHS),
            size: ssRand(10, 22), vy: ssRand(-0.18, -0.5), drift: ssRand(-0.12, 0.12), alpha: ssRand(0.05, 0.22),
            color: Math.random() > 0.5 ? SS.cyan : SS.violet, swap: ssRand(0, 300) }));
        signals = [];
    }
    function emit(p) {
        let fired = 0;
        for (const q of nodes) {
            if (q === p) continue;
            if (Math.hypot(p.x - q.x, p.y - q.y) < LINK && Math.random() < 0.5) {
                signals.push({ from: p, to: q, t: 0, speed: ssRand(0.012, 0.03), color: p.color });
                if (++fired >= (p.hub ? 4 : 2)) break;
            }
        }
    }
    function frame() {
        ctx.clearRect(0, 0, W, H);
        for (const p of nodes) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;
            if (p.fire > 0) p.fire -= 0.02;
            if (--p.nextFire <= 0) { p.fire = 1; p.nextFire = ssRand(120, 360); emit(p); }
        }
        links.length = 0;
        for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < LINK) links.push({ a, b, d });
        }
        ctx.lineWidth = 1;
        for (const l of links) {
            ctx.strokeStyle = `rgba(${SS.violet}, ${(1 - l.d / LINK) * 0.16})`;
            ctx.beginPath(); ctx.moveTo(l.a.x, l.a.y); ctx.lineTo(l.b.x, l.b.y); ctx.stroke();
        }
        for (let i = signals.length - 1; i >= 0; i--) {
            const s = signals[i]; s.t += s.speed;
            if (s.t >= 1) { s.to.fire = Math.max(s.to.fire, 0.7); signals.splice(i, 1); continue; }
            const x = s.from.x + (s.to.x - s.from.x) * s.t, y = s.from.y + (s.to.y - s.from.y) * s.t;
            const g = ctx.createRadialGradient(x, y, 0, x, y, 7);
            g.addColorStop(0, `rgba(${s.color}, 0.9)`); g.addColorStop(1, `rgba(${s.color}, 0)`);
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI * 2); ctx.fill();
        }
        for (const p of nodes) {
            if (p.fire > 0 || p.hub) {
                const rad = p.hub ? p.r * 4 : 18 * p.fire + p.r;
                const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
                gr.addColorStop(0, `rgba(${p.color}, ${(p.hub ? 0.5 : 0) + 0.35 * p.fire})`);
                gr.addColorStop(1, `rgba(${p.color}, 0)`);
                ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, Math.PI * 2); ctx.fill();
            }
            ctx.fillStyle = `rgba(${p.color}, ${p.hub ? 0.95 : 0.6})`;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        }
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (const g of glyphs) {
            g.y += g.vy; g.x += g.drift;
            if (--g.swap <= 0) { g.ch = ssPick(SS_GLYPHS); g.swap = ssRand(40, 300); }
            if (g.y < -20) { g.y = H + 20; g.x = Math.random() * W; }
            ctx.font = `${g.size}px ui-monospace, monospace`;
            ctx.fillStyle = `rgba(${g.color}, ${g.alpha})`;
            ctx.fillText(g.ch, g.x, g.y);
        }
    }
    function loop() { frame(); raf = requestAnimationFrame(loop); }
    return {
        start() { ({ W, H } = ssDims(canvas, ctx)); build(); prefersReducedMotion ? frame() : loop(); },
        stop() { if (raf) cancelAnimationFrame(raf); raf = null; },
        resize() { ({ W, H } = ssDims(canvas, ctx)); build(); },
    };
}

// --- v2: Digital Rain — falling code columns ---
function makeRain(canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, raf = null, cols, drops, fontSize = 16;
    const CH = '0123456789ABCDEFアカサタナハマ{}</>[]#$+=λΔΣ◇⟶'.split('');
    function build() {
        fontSize = Math.max(13, Math.min(20, Math.round(W / 110)));
        cols = Math.ceil(W / fontSize);
        drops = Array.from({ length: cols }, () => ({ y: Math.random() * -H, speed: 0.4 + Math.random() * 0.9,
            len: 8 + (Math.random() * 22 | 0), hue: Math.random() > 0.5 ? SS.cyan : SS.violet }));
        ctx.fillStyle = '#04050a'; ctx.fillRect(0, 0, W, H);
    }
    function frame() {
        ctx.fillStyle = 'rgba(4,5,10,0.12)'; ctx.fillRect(0, 0, W, H);
        ctx.font = fontSize + 'px ui-monospace, monospace'; ctx.textAlign = 'center';
        for (let i = 0; i < cols; i++) {
            const d = drops[i], x = i * fontSize + fontSize / 2;
            for (let k = 0; k < d.len; k++) {
                const y = d.y - k * fontSize;
                if (y < -fontSize || y > H + fontSize) continue;
                const ch = ssPick(CH);
                if (k === 0) {
                    ctx.fillStyle = 'rgba(220,255,250,0.95)'; ctx.shadowColor = `rgba(${d.hue},0.9)`; ctx.shadowBlur = 12;
                    ctx.fillText(ch, x, y); ctx.shadowBlur = 0;
                } else {
                    ctx.fillStyle = `rgba(${d.hue},${Math.max(0, 1 - k / d.len) * 0.9})`;
                    ctx.fillText(ch, x, y);
                }
            }
            d.y += d.speed * fontSize * 0.5;
            if (d.y - d.len * fontSize > H) { d.y = Math.random() * -200; d.speed = 0.4 + Math.random() * 0.9;
                d.len = 8 + (Math.random() * 22 | 0); d.hue = Math.random() > 0.5 ? SS.cyan : SS.violet; }
        }
    }
    function loop() { frame(); raf = requestAnimationFrame(loop); }
    return {
        start() { ({ W, H } = ssDims(canvas, ctx)); build(); prefersReducedMotion ? frame() : loop(); },
        stop() { if (raf) cancelAnimationFrame(raf); raf = null; },
        resize() { ({ W, H } = ssDims(canvas, ctx)); build(); },
    };
}

// --- v3: Circuit Board — PCB traces with traveling light pulses ---
function makeCircuit(canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, raf = null, traces = [], pulses = [], pads = [];
    const GAP = 46;
    function build() {
        traces = []; pads = []; pulses = [];
        const colsN = Math.ceil(W / GAP) + 1, rowsN = Math.ceil(H / GAP) + 1;
        const num = Math.max(20, Math.floor((W * H) / 26000));
        for (let t = 0; t < num; t++) {
            let cx = Math.floor(Math.random() * colsN), cy = Math.floor(Math.random() * rowsN);
            const pts = [{ x: cx * GAP, y: cy * GAP }];
            const steps = 4 + (Math.random() * 9 | 0); let horiz = Math.random() < 0.5;
            for (let s = 0; s < steps; s++) {
                const dist = 1 + (Math.random() * 3 | 0);
                if (horiz) cx += Math.random() < 0.5 ? dist : -dist; else cy += Math.random() < 0.5 ? dist : -dist;
                cx = Math.max(0, Math.min(colsN, cx)); cy = Math.max(0, Math.min(rowsN, cy));
                pts.push({ x: cx * GAP, y: cy * GAP }); horiz = !horiz;
            }
            const color = Math.random() > 0.5 ? SS.cyan : SS.violet;
            let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
            traces.push({ pts, color, len });
            pts.forEach((p, i) => { if (i === 0 || i === pts.length - 1 || Math.random() < 0.3) pads.push({ x: p.x, y: p.y, color, via: Math.random() < 0.4 }); });
        }
        for (let i = 0; i < Math.min(traces.length, 30); i++) spawn();
    }
    function spawn() { const tr = traces[(Math.random() * traces.length) | 0]; if (tr) pulses.push({ tr, t: Math.random() * 0.3, speed: 0.0025 + Math.random() * 0.006, color: tr.color }); }
    function pointAt(tr, frac) {
        let target = frac * tr.len, acc = 0;
        for (let i = 1; i < tr.pts.length; i++) {
            const a = tr.pts[i - 1], b = tr.pts[i], seg = Math.hypot(b.x - a.x, b.y - a.y);
            if (acc + seg >= target) { const u = (target - acc) / (seg || 1); return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u }; }
            acc += seg;
        }
        return tr.pts[tr.pts.length - 1];
    }
    function frame() {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = 'rgba(120,140,170,0.05)';
        for (let x = 0; x <= W; x += GAP) for (let y = 0; y <= H; y += GAP) ctx.fillRect(x - 0.5, y - 0.5, 1, 1);
        ctx.lineWidth = 1.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        for (const tr of traces) {
            ctx.strokeStyle = `rgba(${tr.color},0.16)`;
            ctx.beginPath(); ctx.moveTo(tr.pts[0].x, tr.pts[0].y);
            for (let i = 1; i < tr.pts.length; i++) ctx.lineTo(tr.pts[i].x, tr.pts[i].y);
            ctx.stroke();
        }
        for (const p of pads) {
            ctx.fillStyle = `rgba(${p.color},0.5)`; ctx.beginPath(); ctx.arc(p.x, p.y, p.via ? 3.2 : 2, 0, Math.PI * 2); ctx.fill();
            if (p.via) { ctx.strokeStyle = `rgba(${p.color},0.35)`; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2); ctx.stroke(); }
        }
        for (let i = pulses.length - 1; i >= 0; i--) {
            const pu = pulses[i]; pu.t += pu.speed;
            if (pu.t >= 1) { pulses.splice(i, 1); continue; }
            for (let k = 0; k < 6; k++) {
                const f = pu.t - k * 0.012; if (f < 0) break;
                const pt = pointAt(pu.tr, f), a = 1 - k / 6, r = (k === 0 ? 3.2 : 2.4) * 3;
                const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, r);
                g.addColorStop(0, `rgba(${pu.color},${0.85 * a})`); g.addColorStop(1, `rgba(${pu.color},0)`);
                ctx.fillStyle = g; ctx.beginPath(); ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2); ctx.fill();
            }
            const head = pointAt(pu.tr, pu.t);
            ctx.fillStyle = 'rgba(235,255,252,0.95)'; ctx.beginPath(); ctx.arc(head.x, head.y, 1.6, 0, Math.PI * 2); ctx.fill();
        }
        if (pulses.length < Math.max(18, traces.length * 0.7) && Math.random() < 0.25) spawn();
    }
    function loop() { frame(); raf = requestAnimationFrame(loop); }
    return {
        start() { ({ W, H } = ssDims(canvas, ctx)); build(); prefersReducedMotion ? frame() : loop(); },
        stop() { if (raf) cancelAnimationFrame(raf); raf = null; },
        resize() { ({ W, H } = ssDims(canvas, ctx)); build(); },
    };
}

// --- v4: Neural Sphere — rotating 3D point-sphere network ---
function makeSphere(canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, raf = null, R, cx, cy, pts = [], edges = [], signals = [];
    let yaw = 0, pitch = 0.4;
    const N = 160;
    function build() {
        cx = W / 2; cy = H * 0.45; R = Math.min(W, H) * 0.32;
        pts = []; edges = []; signals = [];
        const gold = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < N; i++) {
            const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = gold * i;
            pts.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r, color: Math.random() > 0.5 ? SS.violet : SS.cyan,
                hub: Math.random() < 0.12, fire: 0, nextFire: Math.random() * 240 });
        }
        for (let i = 0; i < N; i++) {
            const ds = [];
            for (let j = 0; j < N; j++) { if (i === j) continue;
                const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, dz = pts[i].z - pts[j].z;
                ds.push({ j, d: dx * dx + dy * dy + dz * dz }); }
            ds.sort((a, b) => a.d - b.d);
            const k = pts[i].hub ? 4 : 3;
            for (let n = 0; n < k; n++) if (ds[n].j > i) edges.push({ a: i, b: ds[n].j });
        }
    }
    function rot(p) {
        const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
        const x1 = p.x * cosY - p.z * sinY, z1 = p.x * sinY + p.z * cosY;
        const cosP = Math.cos(pitch), sinP = Math.sin(pitch);
        return { x: x1, y: p.y * cosP - z1 * sinP, z: p.y * sinP + z1 * cosP };
    }
    function project(rp) { const persp = R * 2.2 / (R * 2.2 + rp.z * R); return { x: cx + rp.x * R * persp, y: cy + rp.y * R * persp, scale: persp, z: rp.z }; }
    function emit(i) {
        let fired = 0;
        for (const e of edges) {
            let b = -1; if (e.a === i) b = e.b; else if (e.b === i) b = e.a;
            if (b >= 0 && Math.random() < 0.6) { signals.push({ a: i, b, t: 0, speed: 0.02 + Math.random() * 0.02, color: pts[i].color }); if (++fired >= (pts[i].hub ? 3 : 2)) break; }
        }
    }
    function frame() {
        ctx.clearRect(0, 0, W, H);
        yaw += 0.0026;
        const pr = pts.map(p => { const rp = rot(p); return Object.assign(project(rp), { color: p.color, ref: p }); });
        ctx.lineWidth = 1;
        for (const e of edges) {
            const A = pr[e.a], B = pr[e.b], depth = (A.z + B.z) / 2;
            ctx.strokeStyle = `rgba(${SS.violet},${Math.max(0, 0.6 - depth * 0.5) * 0.3})`;
            ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
        }
        for (let i = signals.length - 1; i >= 0; i--) {
            const s = signals[i]; s.t += s.speed;
            if (s.t >= 1) { pts[s.b].fire = Math.max(pts[s.b].fire, 0.7); signals.splice(i, 1); continue; }
            const A = pr[s.a], B = pr[s.b], x = A.x + (B.x - A.x) * s.t, y = A.y + (B.y - A.y) * s.t;
            const g = ctx.createRadialGradient(x, y, 0, x, y, 6);
            g.addColorStop(0, `rgba(${s.color},0.9)`); g.addColorStop(1, `rgba(${s.color},0)`);
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.beginPath(); ctx.arc(x, y, 1.4, 0, Math.PI * 2); ctx.fill();
        }
        const order = pr.map((p, i) => i).sort((a, b) => pr[a].z - pr[b].z);
        for (const idx of order) {
            const p = pr[idx], ref = p.ref;
            if (ref.fire > 0) ref.fire -= 0.02;
            if (--ref.nextFire <= 0) { ref.fire = 1; ref.nextFire = 120 + Math.random() * 300; emit(idx); }
            const depthA = 0.35 + 0.65 * ((p.z + 1) / 2), rad = (ref.hub ? 2.8 : 1.4) * p.scale;
            if (ref.fire > 0 || ref.hub) {
                const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad * 5);
                gr.addColorStop(0, `rgba(${p.color},${(ref.hub ? 0.3 : 0) + 0.35 * ref.fire})`); gr.addColorStop(1, `rgba(${p.color},0)`);
                ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(p.x, p.y, rad * 5, 0, Math.PI * 2); ctx.fill();
            }
            ctx.fillStyle = `rgba(${p.color},${(ref.hub ? 0.95 : 0.6) * depthA})`;
            ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, Math.PI * 2); ctx.fill();
        }
    }
    function loop() { frame(); raf = requestAnimationFrame(loop); }
    return {
        start() { ({ W, H } = ssDims(canvas, ctx)); build(); prefersReducedMotion ? frame() : loop(); },
        stop() { if (raf) cancelAnimationFrame(raf); raf = null; },
        resize() { ({ W, H } = ssDims(canvas, ctx)); build(); },
    };
}

// --- v5: Flow Field — thousands of particles streaming through a noise field ---
function makeFlow(canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, raf = null, particles = [], t = 0;
    const cV = [139, 92, 246], cC = [34, 211, 238];
    const field = (x, y, tt) => (Math.sin(x * 0.0016 + tt * 0.2) + Math.cos(y * 0.0014 - tt * 0.18) + Math.sin((x + y) * 0.0011 + tt * 0.12)) * 1.1;
    const lerpC = (c1, c2, u) => `rgba(${Math.round(c1[0] + (c2[0] - c1[0]) * u)},${Math.round(c1[1] + (c2[1] - c1[1]) * u)},${Math.round(c1[2] + (c2[2] - c1[2]) * u)}`;
    function spawn() { const u = Math.random(); return { x: Math.random() * W, y: Math.random() * H, life: Math.random() * 200 + 60, age: 0, hue: lerpC(cC, cV, u), speed: 0.7 + Math.random() * 1.4 }; }
    function build() {
        ctx.fillStyle = '#04050a'; ctx.fillRect(0, 0, W, H);
        const n = Math.max(400, Math.min(1100, Math.floor((W * H) / 2200)));
        particles = Array.from({ length: n }, spawn);
    }
    function frame() {
        ctx.fillStyle = 'rgba(4,5,10,0.06)'; ctx.fillRect(0, 0, W, H);
        t += 0.016; ctx.lineWidth = 1.1;
        for (const p of particles) {
            const ang = field(p.x, p.y, t), px = p.x, py = p.y;
            p.x += Math.cos(ang) * p.speed; p.y += Math.sin(ang) * p.speed; p.age++;
            ctx.strokeStyle = `${p.hue},${Math.min(0.5, 1 - p.age / p.life) * 0.6})`;
            ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(p.x, p.y); ctx.stroke();
            if (p.age > p.life || p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) Object.assign(p, spawn());
        }
    }
    function loop() { frame(); raf = requestAnimationFrame(loop); }
    return {
        start() { ({ W, H } = ssDims(canvas, ctx)); build(); prefersReducedMotion ? frame() : loop(); },
        stop() { if (raf) cancelAnimationFrame(raf); raf = null; },
        resize() { ({ W, H } = ssDims(canvas, ctx)); build(); },
    };
}

// Registry — picked at random on each activation
const SS_VARIANTS = [
    { name: 'Neural Signals', subtitle: 'Neural · Agentic · Systems', make: makeNeuralSignals, prompt: 'agent@neural' },
    { name: 'Digital Rain',   subtitle: 'Decode · Stream · Inference', make: makeRain,          prompt: 'agent@rain' },
    { name: 'Circuit Board',  subtitle: 'Circuit · Logic · Compute',   make: makeCircuit,       prompt: 'agent@circuit' },
    { name: 'Neural Sphere',  subtitle: 'Neural · Sphere · Cognition', make: makeSphere,        prompt: 'agent@sphere' },
    { name: 'Flow Field',     subtitle: 'Flow · Data · Emergence',     make: makeFlow,          prompt: 'agent@flow' },
];
let ssLastIndex = -1;
let ssCurrent = null;
let ssAgentTimer = null;

// Shared overlay: centered H·G title + agentic terminal stream (variant-agnostic)
const ssTitle = document.createElement('div');
ssTitle.style.cssText = `position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;user-select:none;z-index:2;`;
ssTitle.innerHTML = `
    <div class="ss-glyph" style="font-size:clamp(40px,8vw,110px);font-weight:800;letter-spacing:.12em;
        background:linear-gradient(135deg, rgba(${SS.cyan},1), rgba(${SS.violet},1));
        -webkit-background-clip:text;background-clip:text;color:transparent;
        filter:drop-shadow(0 0 28px rgba(${SS.violet},.45));animation:ssBreathe 6s ease-in-out infinite;">H · G</div>
    <div class="ss-sub" style="margin-top:14px;font-size:clamp(11px,1.6vw,15px);letter-spacing:.5em;
        text-transform:uppercase;color:rgba(${SS.cyan},.7);"></div>`;
screensaver.appendChild(ssTitle);
const ssSub = ssTitle.querySelector('.ss-sub');

const ssLog = document.createElement('div');
ssLog.style.cssText = `position:absolute;left:26px;bottom:60px;font-size:12px;line-height:1.7;
    color:rgba(190,200,220,.5);pointer-events:none;user-select:none;max-width:46ch;z-index:2;
    font-family:var(--font-code, ui-monospace, monospace);`;
screensaver.appendChild(ssLog);

const SS_LOG_LINES = [
    ['spawn', 'agent', 'orchestrator', 'online', 'ok'], ['route', 'task', 'embeddings.index', 'queued', 'val'],
    ['infer', 'model', 'opus-4.8', '128k ctx', 'val'], ['link', 'synapse', 'cluster #7', 'reinforced', 'ok'],
    ['vector', 'memory', 'cosine 0.94', 'match', 'val'], ['tool', 'call', 'search()', 'resolved', 'ok'],
    ['plan', 'agent', 'decompose(4)', 'committed', 'val'], ['signal', 'neuron', 'fire Δ+1', 'propagate', 'ok'],
    ['verify', 'check', 'self-consistent', 'passed', 'ok'], ['async', 'agent', 'fan-out(8)', 'dispatched', 'ok'],
];
let ssLogIdx = 0;
function ssPushLog(promptLabel) {
    const [act, tag, mid, end, kind] = SS_LOG_LINES[ssLogIdx++ % SS_LOG_LINES.length];
    const ts = new Date().toLocaleTimeString('en-GB');
    const ln = document.createElement('div');
    ln.style.whiteSpace = 'nowrap';
    ln.innerHTML = `<span style="opacity:.5">${ts}</span> ` +
        `<span style="color:rgba(${SS.violet},.95)">${tag}</span> ${act} ` +
        `<span style="color:rgba(${SS.cyan},.95)">${mid}</span> → ` +
        `<span style="color:rgba(${kind === 'ok' ? SS.emerald : SS.cyan},.95)">${end}</span>`;
    ssLog.insertBefore(ln, ssLog.lastElementChild);
    while (ssLog.children.length > 8) ssLog.removeChild(ssLog.firstChild);
    [...ssLog.children].forEach((c, i, arr) => c.style.opacity = (0.25 + 0.75 * (i / (arr.length - 1 || 1))).toFixed(2));
}

function startScreensaver() {
    if (screensaverActive) return;
    screensaverActive = true;
    screensaver.style.display = 'block';
    setTimeout(() => { screensaver.style.opacity = '1'; }, 10);

    // Pick a random variant, avoiding an immediate repeat
    let idx = (Math.random() * SS_VARIANTS.length) | 0;
    if (SS_VARIANTS.length > 1 && idx === ssLastIndex) idx = (idx + 1) % SS_VARIANTS.length;
    ssLastIndex = idx;
    const variant = SS_VARIANTS[idx];
    ssSub.textContent = variant.subtitle;

    ssCurrent = variant.make(screensaverCanvas);
    ssCurrent.start();

    // Agentic terminal stream
    ssLog.innerHTML = '';
    const cursor = document.createElement('div');
    cursor.innerHTML = `<span style="opacity:.5">${variant.prompt}</span> $ <span style="display:inline-block;width:8px;height:13px;background:rgba(${SS.cyan},.9);margin-left:2px;vertical-align:-2px;animation:ssBlink 1s step-end infinite"></span>`;
    ssLog.appendChild(cursor);
    ssLogIdx = 0;
    ssPushLog();
    if (ssAgentTimer) clearInterval(ssAgentTimer);
    if (!prefersReducedMotion) ssAgentTimer = setInterval(() => ssPushLog(), 1400);

    console.log(`%c💤 Screensaver: ${variant.name}`, 'color: #a78bfa; font-size: 12px;');
}

function stopScreensaver() {
    if (!screensaverActive) return;
    screensaverActive = false;
    screensaver.style.opacity = '0';
    if (ssAgentTimer) { clearInterval(ssAgentTimer); ssAgentTimer = null; }
    setTimeout(() => {
        screensaver.style.display = 'none';
        if (ssCurrent) { ssCurrent.stop(); ssCurrent = null; }
    }, 500);
    console.log('%c👋 Screensaver deactivated!', 'color: #a78bfa; font-size: 12px;');
}

function resetIdleTimer() {
    if (screensaverActive) stopScreensaver();
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(startScreensaver, IDLE_TIME);
}

// Listen for user activity
const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
activityEvents.forEach(event => {
    document.addEventListener(event, resetIdleTimer, { passive: true });
});

// Resize active variant on window resize
window.addEventListener('resize', () => {
    if (screensaverActive && ssCurrent) ssCurrent.resize();
});

// Add fadeInOut animation for hint text
const screensaverStyle = document.createElement('style');
screensaverStyle.innerHTML = `
    @keyframes fadeInOut {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 0.3; }
    }
    @keyframes ssBreathe {
        0%, 100% { opacity: 0.92; filter: drop-shadow(0 0 22px rgba(139,92,246,0.35)); }
        50%      { opacity: 1;    filter: drop-shadow(0 0 40px rgba(34,211,238,0.55)); }
    }
    @keyframes ssBlink { 50% { opacity: 0; } }
`;
document.head.appendChild(screensaverStyle);

// Start idle timer
resetIdleTimer();

console.log('%c⏰ Screensaver will activate after 1 minute of inactivity', 'color: #22d3ee; font-size: 12px;');

// ================================
// Projects Carousel - Swiper.js
// ================================
const projectsSwiper = new Swiper('.projects-swiper', {
    slidesPerView: 3,
    centeredSlides: true,
    spaceBetween: 30,
    loop: true,
    loopAdditionalSlides: 3,
    speed: 500,
    grabCursor: true,
    watchSlidesProgress: true,
    slideToClickedSlide: true,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    keyboard: {
        enabled: true,
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 20,
            centeredSlides: true,
        },
        600: {
            slidesPerView: 1,
            spaceBetween: 30,
            centeredSlides: true,
        },
        768: {
            slidesPerView: 1.5,
            spaceBetween: 30,
            centeredSlides: true,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 30,
            centeredSlides: true,
        },
    },
});

console.log('%c🎠 Swiper Carousel initialized!', 'color: #34d399;');
