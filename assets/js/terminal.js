// ================================
// Terminal - Initialize when ready
// ================================
(function() {
    'use strict';

    // Wait for DOM and libraries to load
    function initTerminal() {
        // Check if XTerm is available
        if (typeof Terminal === 'undefined') {
            console.error('XTerm.js not loaded. Retrying...');
            setTimeout(initTerminal, 500);
            return;
        }

        // Check if FitAddon is available
        if (typeof FitAddon === 'undefined') {
            console.error('FitAddon not loaded. Retrying...');
            setTimeout(initTerminal, 500);
            return;
        }

        // Check if container exists
        const terminalContainer = document.getElementById('terminal-container');
        if (!terminalContainer) {
            console.error('Terminal container not found');
            return;
        }

        // ================================
        // Terminal Configuration
        // ================================

        // Detect mobile device and adjust terminal settings
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

        const term = new Terminal({
            cursorBlink: true,
            cursorStyle: 'block',
            fontFamily: '"Fira Code", "Share Tech Mono", monospace',
            fontSize: isMobileDevice ? 11 : 14,
            theme: {
                background: '#141829',
                foreground: '#e0e0e0',
                cursor: '#00ff41',
                cursorAccent: '#00ff41',
                selection: 'rgba(0, 255, 65, 0.3)',
                black: '#0a0e27',
                red: '#ff3838',
                green: '#00ff41',
                yellow: '#ffa500',
                blue: '#00f0ff',
                magenta: '#b026ff',
                cyan: '#00f0ff',
                white: '#e0e0e0',
                brightBlack: '#606060',
                brightRed: '#ff6b6b',
                brightGreen: '#51ff51',
                brightYellow: '#ffbd2e',
                brightBlue: '#51f0ff',
                brightMagenta: '#d451ff',
                brightCyan: '#51f0ff',
                brightWhite: '#ffffff'
            },
            allowProposedApi: true,
            scrollback: isMobileDevice ? 500 : 1000
        });

        const fitAddon = new FitAddon.FitAddon();
        term.loadAddon(fitAddon);

        // Mount terminal
        term.open(terminalContainer);
        fitAddon.fit();

        // Resize on window resize
        window.addEventListener('resize', () => {
            fitAddon.fit();
        });

        // ================================
        // Terminal State
        // ================================
        let currentLine = '';
        let commandHistory = [];
        let historyIndex = -1;

        // Use shorter prompt on mobile
        const prompt = isMobileDevice
            ? '\x1b[1;32m$\x1b[0m '
            : '\x1b[1;32m┌──[\x1b[1;36mharun@dev\x1b[1;32m]\r\n└─\x1b[1;32m$\x1b[0m ';

        // ================================
        // Command Database
        // ================================
        const commands = {
            help: (args) => {
                const lines = [
                    '\x1b[1;36mAVAILABLE COMMANDS:\x1b[0m',
                    '',
                    '\x1b[1;32mhelp\x1b[0m - Display this help message',
                    '\x1b[1;32mabout\x1b[0m - Learn more about me',
                    '\x1b[1;32mskills\x1b[0m - View my technical skills',
                    '\x1b[1;32mexperience\x1b[0m - Show my work experience',
                    '\x1b[1;32mprojects\x1b[0m - List my featured projects',
                    '\x1b[1;32mcontact [type]\x1b[0m - Get contact info or open directly',
                    '\x1b[1;32msocial [platform]\x1b[0m - View/open social media links',
                    '\x1b[1;32mip\x1b[0m - Display your IP address',
                    '\x1b[1;32mping [host]\x1b[0m - Ping a host (default: google.com)',
                    '\x1b[1;32mwhoami\x1b[0m - Who am I?',
                    '\x1b[1;32mdate\x1b[0m - Display current date and time',
                    '\x1b[1;32mhistory\x1b[0m - Show command history',
                    '\x1b[1;32mclear\x1b[0m - Clear terminal screen',
                    '',
                    '\x1b[1;35m🪄 Magic Spells:\x1b[0m',
                    '\x1b[1;32mlumos\x1b[0m - Light mode (wand-lighting charm)',
                    '\x1b[1;32mnox\x1b[0m - Dark mode (wand-extinguishing charm)',
                    '\x1b[1;32maccio [section]\x1b[0m - Summon a page section',
                    '\x1b[1;32mexpecto patronum\x1b[0m - Conjure a protective charm',
                    '\x1b[1;32mriddikulus\x1b[0m - Banish your fears with laughter',
                    '',
                    '\x1b[1;33m🎮 Fun Commands:\x1b[0m',
                    '\x1b[1;32mhack [target]\x1b[0m - Hollywood-style hacking simulation',
                    '\x1b[1;32mmatrix\x1b[0m - Enter the Matrix',
                    '\x1b[1;32mcoffee\x1b[0m - Brew some coffee',
                    '\x1b[1;32msudo\x1b[0m - Try it and see what happens',
                    '',
                    '\x1b[1;33mTip:\x1b[0m Use UP/DOWN arrows to navigate command history'
                ];
                return lines.join('\r\n');
            },

            about: (args) => `
\x1b[1;36mABOUT ME:\x1b[0m

\x1b[1;32mName:\x1b[0m        Harun Geçit
\x1b[1;32mRole:\x1b[0m        Full Stack Developer
\x1b[1;32mLocation:\x1b[0m    Istanbul, Türkiye
\x1b[1;32mExperience:\x1b[0m  15+ years in software development

I started my journey with PHP and worked with modern frameworks
like Laravel, CodeIgniter, Zend, along with JavaScript technologies
such as Node.js, Express.js, and jQuery.

\x1b[1;33m"Continually adding value to myself and recognizing there is
 still much to learn."\x1b[0m
`,

            skills: (args) => `
\x1b[1;36mTECHNICAL SKILLS:\x1b[0m

\x1b[1;33m▸ Languages\x1b[0m
  PHP, JavaScript, SQL, Bash Shell

\x1b[1;33m▸ Backend\x1b[0m
  Laravel, CodeIgniter, Zend, Node.js, Express.js

\x1b[1;33m▸ Frontend\x1b[0m
  React.js, jQuery, Tailwind CSS, Bootstrap

\x1b[1;33m▸ Databases\x1b[0m
  PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch

\x1b[1;33m▸ DevOps\x1b[0m
  Docker, Podman, Kubernetes, Portainer, Coolify
  Dokploy, Nginx, Traefik, AWS, GCP, Git, GitOps

\x1b[1;33m▸ Security\x1b[0m
  OAuth 2.0, JWT, Firewall, Proxy, Cloudflare

\x1b[1;33m▸ AI Tools\x1b[0m
  Claude Code, GitHub Copilot, Gemini
`,

            experience: (args) => `
\x1b[1;36mWORK EXPERIENCE:\x1b[0m

\x1b[1;32m[1]\x1b[0m \x1b[1;33mFull Stack Developer\x1b[0m - USTEK RFID (2022-Present)

\x1b[1;32m[2]\x1b[0m \x1b[1;33mSoftware Advisor\x1b[0m - CatchPad (2022-Present)

\x1b[1;32m[3]\x1b[0m \x1b[1;33mFull Stack Developer\x1b[0m - Gourmeturca.com (2021-2022)

\x1b[1;32m[4]\x1b[0m \x1b[1;33mFull Stack Developer\x1b[0m - Sadıkoğulları Teknoloji (2020-2021)

\x1b[1;32m[5]\x1b[0m \x1b[1;33mFreelance Developer\x1b[0m - (2011-2019)
`,

            projects: (args) => `
\x1b[1;36mFEATURED PROJECTS:\x1b[0m

\x1b[1;32m[1] BRAISLATOR\x1b[0m - Turkish to Braille translator with speech-to-text

\x1b[1;32m[2] E-commerce Platform\x1b[0m - Full-featured platform with ERP integration

\x1b[1;32m[3] RFID Tracking System\x1b[0m - Enterprise textile tracking solution

\x1b[1;32m[4] AI Training Platform\x1b[0m - Smart training with AI-supported exercises

\x1b[1;32m[5] DevTools Platform\x1b[0m - Developer utilities and tools
    \x1b[1;33m→\x1b[0m https://devtools.harungecit.dev/
`,

            contact: (args) => {
                const contactLinks = {
                    email: 'mailto:info@harungecit.com',
                    whatsapp: 'https://wa.me/908503033954',
                    website: 'https://harungecit.com',
                    blog: 'https://echo.harungecit.dev/'
                };

                if (args && args.length > 0) {
                    const type = args[0].toLowerCase();
                    if (contactLinks[type]) {
                        window.open(contactLinks[type], '_blank');
                        return `\x1b[1;32m✓\x1b[0m Opening ${type}...`;
                    } else {
                        return `\x1b[1;31mUnknown contact type:\x1b[0m ${type}\n\nAvailable: email, whatsapp, website, blog`;
                    }
                }

                return `\x1b[1;36mCONTACT INFORMATION:\x1b[0m

\x1b[1;32m📧 Email:\x1b[0m       info@harungecit.com
\x1b[1;32m💬 WhatsApp:\x1b[0m    0850 303 39 54
\x1b[1;32m🌐 Website:\x1b[0m     https://harungecit.com
\x1b[1;32m📝 Blog:\x1b[0m        https://echo.harungecit.dev/
\x1b[1;32m📍 Location:\x1b[0m    Istanbul, Türkiye

\x1b[1;33mTip:\x1b[0m Use \x1b[1;32mcontact <type>\x1b[0m to open directly
Example: \x1b[1;32mcontact email\x1b[0m`;
            },

            social: (args) => {
                const socialLinks = {
                    github: 'https://github.com/harungecit',
                    linkedin: 'https://linkedin.com/in/harungecit',
                    x: 'https://x.com/harungecit_',
                    twitter: 'https://x.com/harungecit_',
                    instagram: 'https://instagram.com/harungecit.dev',
                    blog: 'https://echo.harungecit.dev/',
                    links: 'https://bio.link/harungecit'
                };

                if (args && args.length > 0) {
                    const platform = args[0].toLowerCase();
                    if (socialLinks[platform]) {
                        window.open(socialLinks[platform], '_blank');
                        return `\x1b[1;32m✓\x1b[0m Opening ${platform} in new tab...`;
                    } else {
                        return `\x1b[1;31mUnknown platform:\x1b[0m ${platform}\n\nAvailable: github, linkedin, x, instagram, blog, links`;
                    }
                }

                return `\x1b[1;36mSOCIAL MEDIA:\x1b[0m

\x1b[1;32m🐙 GitHub:\x1b[0m       https://github.com/harungecit
\x1b[1;32m💼 LinkedIn:\x1b[0m     https://linkedin.com/in/harungecit
\x1b[1;32m🐦 X (Twitter):\x1b[0m  https://x.com/harungecit_
\x1b[1;32m📸 Instagram:\x1b[0m    https://instagram.com/harungecit.dev
\x1b[1;32m📝 Blog:\x1b[0m         https://echo.harungecit.dev/
\x1b[1;32m🔗 All Links:\x1b[0m    https://bio.link/harungecit

\x1b[1;33mTip:\x1b[0m Use \x1b[1;32msocial <platform>\x1b[0m to open directly
Example: \x1b[1;32msocial github\x1b[0m`;
            },

            whoami: (args) => '\x1b[1;32mharun@dev\x1b[0m - Full Stack Developer, Code Wizard 🚀',

            date: (args) => new Date().toString(),

            history: (args) => {
                if (commandHistory.length === 0) {
                    return 'No commands in history.';
                }
                return commandHistory.map((cmd, i) => `  ${i + 1}  ${cmd}`).join('\n');
            },

            clear: (args) => {
                term.clear();
                return null;
            },

            sudo: (args) => {
                const responses = [
                    '\x1b[1;31m[sudo]\x1b[0m password: \x1b[8m••••••••\x1b[0m\n\x1b[1;31mSorry, try again.\x1b[0m',
                    '\x1b[1;33m🚨 Nice try! But you need root access! 😎\x1b[0m',
                    '\x1b[1;31m⚠️  Access Denied!\x1b[0m This incident will be reported... just kidding! 😄',
                    '\x1b[1;33m💡 With great power comes great responsibility.\x1b[0m',
                    '\x1b[1;32m✓\x1b[0m Granted sudo access!\n\x1b[1;31m❌ Just kidding!\x1b[0m 😂'
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            },

            ip: (args) => {
                // This will be handled asynchronously
                fetch('https://api.ipify.org?format=json')
                    .then(response => response.json())
                    .then(data => {
                        term.write(`\r\n\x1b[1;36mYour IP Address:\x1b[0m ${data.ip}\r\n`);
                        writePrompt();
                    })
                    .catch(error => {
                        term.write(`\r\n\x1b[1;31mError:\x1b[0m Unable to fetch IP address\r\n`);
                        writePrompt();
                    });
                return '\x1b[1;33mFetching your IP address...\x1b[0m';
            },

            ping: (args) => {
                const target = args && args.length > 0 ? args[0] : 'google.com';
                const packets = 4;
                let sent = 0;
                let received = 0;
                const delays = [];

                term.write(`\r\n\x1b[1;36mPING ${target}\x1b[0m (simulated)\r\n\r\n`);

                const pingInterval = setInterval(() => {
                    if (sent >= packets) {
                        clearInterval(pingInterval);

                        // Calculate statistics
                        const min = Math.min(...delays);
                        const max = Math.max(...delays);
                        const avg = delays.reduce((a, b) => a + b, 0) / delays.length;
                        const loss = ((sent - received) / sent * 100).toFixed(0);

                        term.write('\r\n');
                        term.write(`\x1b[1;36m--- ${target} ping statistics ---\x1b[0m\r\n`);
                        term.write(`${sent} packets transmitted, ${received} received, ${loss}% packet loss\r\n`);
                        term.write(`rtt min/avg/max = ${min.toFixed(2)}/${avg.toFixed(2)}/${max.toFixed(2)} ms\r\n`);
                        writePrompt();
                        return;
                    }

                    sent++;
                    const success = Math.random() > 0.05; // 95% success rate

                    if (success) {
                        received++;
                        const delay = 20 + Math.random() * 80; // 20-100ms
                        delays.push(delay);
                        const ttl = 50 + Math.floor(Math.random() * 15); // 50-64
                        const bytes = 32;

                        term.write(`Reply from ${target}: bytes=${bytes} time=${delay.toFixed(2)}ms TTL=${ttl}\r\n`);
                    } else {
                        term.write(`\x1b[1;31mRequest timeout\x1b[0m\r\n`);
                    }
                }, 1000);

                return '\x1b[1;33mPinging...\x1b[0m';
            },

            hack: (args) => {
                const target = args && args.length > 0 ? args.join(' ') : 'mainframe';
                const steps = [
                    'Initializing quantum tunneling...',
                    'Bypassing firewall protocols...',
                    'Cracking 256-bit encryption...',
                    'Accessing secure database...',
                    'Downloading classified files...',
                    'Covering tracks...',
                    '\x1b[1;32m✓ HACK SUCCESSFUL!\x1b[0m'
                ];

                term.write(`\r\n\x1b[1;33m[HACKING ${target}]\x1b[0m\r\n\r\n`);

                let step = 0;
                const hackInterval = setInterval(() => {
                    if (step >= steps.length) {
                        clearInterval(hackInterval);
                        term.write('\r\n\x1b[1;31mJust kidding! 😄 This is just a simulation.\x1b[0m\r\n');
                        writePrompt();
                        return;
                    }

                    term.write(`\x1b[1;36m[${step + 1}/${steps.length}]\x1b[0m ${steps[step]}\r\n`);
                    step++;
                }, 800);

                return '';
            },

            matrix: (args) => {
                const chars = '01アイウエオカキクケコサシスセソタチツテト';
                let lines = 15;
                let count = 0;

                term.write(`\r\n\x1b[1;32m`);

                const matrixInterval = setInterval(() => {
                    if (count >= lines) {
                        clearInterval(matrixInterval);
                        term.write('\x1b[0m\r\n');
                        term.write('\x1b[1;36mWake up, Neo... 🕶️\x1b[0m\r\n');
                        writePrompt();
                        return;
                    }

                    let line = '';
                    for (let i = 0; i < 60; i++) {
                        line += chars[Math.floor(Math.random() * chars.length)] + ' ';
                    }
                    term.write(line + '\r\n');
                    count++;
                }, 150);

                return '';
            },

            coffee: (args) => {
                const art = [
                    '      ( (',
                    '       ) )',
                    '    ..........',
                    '    |       |]',
                    '    \\       /',
                    '     `-----\'',
                ];

                term.write('\r\n\x1b[1;33m');
                art.forEach(line => term.write(line + '\r\n'));
                term.write('\x1b[0m\r\n');

                setTimeout(() => {
                    term.write('\x1b[1;36m☕ Brewing your coffee...\x1b[0m\r\n');
                    setTimeout(() => {
                        term.write('\x1b[1;32m✓ Coffee ready! Time to code! 💻\x1b[0m\r\n');
                        writePrompt();
                    }, 1500);
                }, 500);

                return '';
            },

            // Hidden easter egg - not in help!
            xyzzy: (args) => {
                const secrets = [
                    '\x1b[1;35m✨ Nothing happens. ✨\x1b[0m',
                    '\x1b[1;36m🔮 A hollow voice says "Fool."\x1b[0m',
                    '\x1b[1;32m🎮 Achievement Unlocked: Old School Gamer!\x1b[0m',
                    '\x1b[1;33m📜 You found the secret command!\x1b[0m\n\x1b[1;36mOther hidden commands: konami, starwars\x1b[0m'
                ];
                return secrets[Math.floor(Math.random() * secrets.length)];
            },

            // Hidden easter egg - Konami code reference
            konami: (args) => {
                return `\x1b[1;35m
    ██╗  ██╗ ██████╗ ███╗   ██╗ █████╗ ███╗   ███╗██╗
    ██║ ██╔╝██╔═══██╗████╗  ██║██╔══██╗████╗ ████║██║
    █████╔╝ ██║   ██║██╔██╗ ██║███████║██╔████╔██║██║
    ██╔═██╗ ██║   ██║██║╚██╗██║██╔══██║██║╚██╔╝██║██║
    ██║  ██╗╚██████╔╝██║ ╚████║██║  ██║██║ ╚═╝ ██║██║
    ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝
\x1b[0m
\x1b[1;36m🎮 30 Lives Unlocked! (Not really... but you found it!) 🎮\x1b[0m
\x1b[1;33m↑ ↑ ↓ ↓ ← → ← → B A START\x1b[0m`;
            },

            // Hidden easter egg - Star Wars scroll
            starwars: (args) => {
                term.write('\r\n\x1b[1;33m');
                const scroll = [
                    '         A long time ago',
                    '      in a terminal far,',
                    '         far away....',
                    '',
                    '    ═══════════════════',
                    '',
                    '      DEVELOPER WARS',
                    '     Episode IV',
                    '',
                    '  A New Hope for Clean Code',
                    '',
                    'It is a period of digital war.',
                    'Rebel developers, striking',
                    'from hidden keyboards, have',
                    'won their first victory against',
                    'the evil Legacy Code Empire.',
                    '',
                    'May the Code be with you...',
                ];

                let line = 0;
                const scrollInterval = setInterval(() => {
                    if (line >= scroll.length) {
                        clearInterval(scrollInterval);
                        term.write('\x1b[0m\r\n');
                        writePrompt();
                        return;
                    }
                    term.write(scroll[line] + '\r\n');
                    line++;
                }, 300);

                return '';
            },

            // Harry Potter Spells - Theme switching
            lumos: (args) => {
                document.body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
                return '\x1b[1;33m✨ Lumos! ✨\x1b[0m\r\n\x1b[1;36mLight mode activated. The wand tip ignites!\x1b[0m';
            },

            nox: (args) => {
                document.body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
                return '\x1b[1;35m🌙 Nox! 🌙\x1b[0m\r\n\x1b[1;36mDark mode restored. The light extinguishes.\x1b[0m';
            },

            // Accio - Scroll to section
            accio: (args) => {
                const sections = {
                    about: 'about',
                    skills: 'skills',
                    experience: 'experience',
                    projects: 'projects',
                    contact: 'contact',
                    terminal: 'terminal'
                };

                if (args && args.length > 0) {
                    const target = args[0].toLowerCase();
                    if (sections[target]) {
                        const element = document.getElementById(sections[target]);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            return `\x1b[1;35m🪄 Accio ${target}!\x1b[0m\r\n\x1b[1;36mSummoning the ${target} section...\x1b[0m`;
                        }
                    }
                    return `\x1b[1;31mSection not found!\x1b[0m\r\nAvailable: ${Object.keys(sections).join(', ')}`;
                }
                return `\x1b[1;33mUsage:\x1b[0m accio <section>\r\nAvailable: ${Object.keys(sections).join(', ')}`;
            },

            // Expecto Patronum - Special effect
            'expecto patronum': (args) => {
                // Create magical particles effect
                const symbols = ['✨', '⭐', '🌟', '💫', '✦', '✧'];
                let count = 0;
                const maxCount = 10;

                term.write('\r\n\x1b[1;36m🦌 EXPECTO PATRONUM! 🦌\x1b[0m\r\n\r\n');

                const patronusInterval = setInterval(() => {
                    if (count >= maxCount) {
                        clearInterval(patronusInterval);
                        term.write('\r\n\x1b[1;35mA silver stag gallops through the terminal,\x1b[0m\r\n');
                        term.write('\x1b[1;35mdriving away all bugs and errors!\x1b[0m\r\n');
                        writePrompt();
                        return;
                    }

                    let line = '';
                    for (let i = 0; i < 12; i++) {
                        line += symbols[Math.floor(Math.random() * symbols.length)] + ' ';
                    }
                    term.write('\x1b[1;36m' + line + '\x1b[0m\r\n');
                    count++;
                }, 200);

                return '';
            },

            // Riddikulus - Random fun effects
            riddikulus: (args) => {
                const effects = [
                    () => {
                        term.write('\r\n\x1b[1;33m🎭 Riddikulus! 🎭\x1b[0m\r\n\r\n');
                        term.write('\x1b[1;32mYour biggest fear (bugs) transforms into...\x1b[0m\r\n');
                        term.write('\x1b[1;35m🐛 ➜ 🦋 Beautiful butterflies!\x1b[0m\r\n');
                        writePrompt();
                    },
                    () => {
                        term.write('\r\n\x1b[1;33m🎭 Riddikulus! 🎭\x1b[0m\r\n\r\n');
                        term.write('\x1b[1;32mThe production server error turns into...\x1b[0m\r\n');
                        term.write('\x1b[1;36m💥 ➜ 🎉 A celebration party!\x1b[0m\r\n');
                        writePrompt();
                    },
                    () => {
                        term.write('\r\n\x1b[1;33m🎭 Riddikulus! 🎭\x1b[0m\r\n\r\n');
                        term.write('\x1b[1;32mThe scary code review becomes...\x1b[0m\r\n');
                        term.write('\x1b[1;35m😱 ➜ 😂 A standup comedy show!\x1b[0m\r\n');
                        writePrompt();
                    },
                    () => {
                        term.write('\r\n\x1b[1;33m🎭 Riddikulus! 🎭\x1b[0m\r\n\r\n');
                        term.write('\x1b[1;32mThe merge conflict transforms into...\x1b[0m\r\n');
                        term.write('\x1b[1;36m⚠️  ➜ 🎨 Modern art!\x1b[0m\r\n');
                        writePrompt();
                    }
                ];

                const effect = effects[Math.floor(Math.random() * effects.length)];
                setTimeout(effect, 100);
                return '';
            }
        };

        // ================================
        // Command Processing
        // ================================
        function processCommand(input) {
            const trimmed = input.trim().toLowerCase();

            if (!trimmed) return null;

            // Add to history
            if (commandHistory[commandHistory.length - 1] !== input) {
                commandHistory.push(input);
            }
            historyIndex = commandHistory.length;

            // Parse command and arguments
            const parts = trimmed.split(' ');
            const cmd = parts[0];
            const args = parts.slice(1);

            // Execute command
            if (commands[cmd]) {
                const output = commands[cmd](args);
                // Convert \n to \r\n for proper terminal display
                return output.replace(/\n/g, '\r\n');
            } else {
                return `\x1b[1;31mCommand not found:\x1b[0m ${cmd}\r\nType '\x1b[1;32mhelp\x1b[0m' to see available commands.`;
            }
        }

        // ================================
        // Terminal Input Handling
        // ================================
        function writePrompt() {
            term.write('\r\n' + prompt);
            // Add extra lines to prevent prompt from being hidden
            setTimeout(() => {
                term.scrollToBottom();
            }, 50);
        }

        term.onData(data => {
            const code = data.charCodeAt(0);

            // Enter
            if (code === 13) {
                term.write('\r\n');
                const output = processCommand(currentLine);
                if (output !== null) {
                    term.write(output);
                    // Add extra blank lines after output
                    term.write('\r\n\r\n\r\n\r\n');
                }
                currentLine = '';
                writePrompt();
                setTimeout(() => {
                    term.scrollToBottom();
                }, 100);
            }
            // Backspace
            else if (code === 127) {
                if (currentLine.length > 0) {
                    currentLine = currentLine.slice(0, -1);
                    term.write('\b \b');
                }
            }
            // Up Arrow
            else if (data === '\x1b[A') {
                if (historyIndex > 0) {
                    term.write('\r' + prompt);
                    for (let i = 0; i < currentLine.length; i++) {
                        term.write(' ');
                    }
                    term.write('\r' + prompt);
                    historyIndex--;
                    currentLine = commandHistory[historyIndex];
                    term.write(currentLine);
                }
            }
            // Down Arrow
            else if (data === '\x1b[B') {
                if (historyIndex < commandHistory.length) {
                    term.write('\r' + prompt);
                    for (let i = 0; i < currentLine.length; i++) {
                        term.write(' ');
                    }
                    term.write('\r' + prompt);
                    historyIndex++;
                    if (historyIndex >= commandHistory.length) {
                        currentLine = '';
                    } else {
                        currentLine = commandHistory[historyIndex];
                    }
                    term.write(currentLine);
                }
            }
            // Ctrl+C
            else if (code === 3) {
                term.write('^C');
                currentLine = '';
                writePrompt();
            }
            // Ctrl+L
            else if (code === 12) {
                term.clear();
                writePrompt();
            }
            // Regular characters
            else if (code >= 32 && code < 127) {
                currentLine += data;
                term.write(data);
            }
        });

        // Tab completion
        term.onKey(({ key, domEvent }) => {
            if (domEvent.key === 'Tab') {
                domEvent.preventDefault();
                const matches = Object.keys(commands).filter(cmd => cmd.startsWith(currentLine));

                if (matches.length === 1) {
                    const completion = matches[0].substring(currentLine.length);
                    currentLine += completion;
                    term.write(completion);
                } else if (matches.length > 1) {
                    term.write('\r\n');
                    term.write(matches.join('  '));
                    writePrompt();
                    term.write(currentLine);
                }
            }
        });

        // ================================
        // Initialize Terminal
        // ================================

        // Restore theme from localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
        }

        // Show welcome box only on desktop
        if (!isMobileDevice) {
            term.write('\x1b[1;32m');
            term.write('    __                           ______      __         \r\n');
            term.write('   / /_  ____ ________  ______  / ____ \\____/ /__ _   __\r\n');
            term.write('  / __ \\/ __ `/ ___/ / / / __ \\/ / __ `/ __  / _ \\ | / /\r\n');
            term.write(' / / / / /_/ / /  / /_/ / / / / / /_/ / /_/ /  __/ |/ / \r\n');
            term.write('/_/ /_/\\__,_/_/   \\__,_/_/ /_/\\ \\__,_/\\__,_/\\___/|___/  \r\n');
            term.write('                               \\____/                   \r\n');
            term.write('\r\n');
            term.write('       Welcome to Harun Geçit\'s Interactive Terminal!        \r\n');
            term.write('\x1b[0m\r\n');
        }

        term.write('\x1b[1;36mFull Stack Developer | PHP | JavaScript | DevOps | Cybersecurity\x1b[0m\r\n');
        term.write('\r\n');
        term.write('\x1b[1;33mType \'\x1b[1;32mhelp\x1b[1;33m\' to see available commands.\x1b[0m\r\n');
        writePrompt();

        console.log('%c💻 Terminal initialized successfully!', 'color: #00ff41; font-size: 12px;');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initTerminal, 100));
    } else {
        setTimeout(initTerminal, 100);
    }
})();
