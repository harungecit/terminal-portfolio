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

// Neural network for screensaver — denser, more alive than the page background
const screensaverNetwork = createNeuralNetwork(screensaverCanvas, {
    density: 14000,
    linkDist: 170,
    maxParticles: 130
});

function startScreensaver() {
    if (screensaverActive) return;

    screensaverActive = true;
    screensaver.style.display = 'block';

    // Fade in
    setTimeout(() => {
        screensaver.style.opacity = '1';
    }, 10);

    screensaverNetwork.start();

    console.log('%c💤 Screensaver activated!', 'color: #a78bfa; font-size: 12px;');
}

function stopScreensaver() {
    if (!screensaverActive) return;

    screensaverActive = false;

    // Fade out
    screensaver.style.opacity = '0';

    setTimeout(() => {
        screensaver.style.display = 'none';
        screensaverNetwork.stop();
    }, 500);

    console.log('%c👋 Screensaver deactivated!', 'color: #a78bfa; font-size: 12px;');
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
