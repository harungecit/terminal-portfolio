// ================================
// Terminal - Initialize when ready
// ================================
(function () {
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

        // Dark theme configuration
        const darkTheme = {
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
        };

        // Light theme configuration - optimized for readability
        const lightTheme = {
            background: '#fefefe',
            foreground: '#1a1a1a',
            cursor: '#00b330',
            cursorAccent: '#00b330',
            selection: 'rgba(0, 179, 48, 0.3)',
            black: '#1a1a1a',
            red: '#cc0000',
            green: '#00b330',
            yellow: '#996600',
            blue: '#0066cc',
            magenta: '#8800cc',
            cyan: '#0099cc',
            white: '#4a4a4a',
            brightBlack: '#606060',
            brightRed: '#ff0000',
            brightGreen: '#00cc33',
            brightYellow: '#cc7700',
            brightBlue: '#0080ff',
            brightMagenta: '#aa00cc',
            brightCyan: '#00aacc',
            brightWhite: '#1a1a1a'
        };

        const term = new Terminal({
            cursorBlink: true,
            cursorStyle: 'block',
            fontFamily: '"Fira Code", "Share Tech Mono", monospace',
            fontSize: isMobileDevice ? 11 : 14,
            theme: darkTheme,
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
        let isBusy = false; // Prevent input during async operations

        // ================================
        // File System
        // ================================
        const fileSystem = {
            '~': {
                type: 'dir',
                children: {
                    'about.txt': { type: 'file', content: 'Harun Geçit - Software Architect & Full Stack Developer\r\nRoles: DevOps Engineer, System Admin, Cyber Security, Software Advisor, Blog Writer\r\nLocation: Istanbul, Türkiye\r\nExperience: 15+ years' },
                    'contact.txt': { type: 'file', content: 'Email: info@harungecit.com\r\nWhatsApp: 0850 303 39 54\r\nWebsite: https://harungecit.com' },
                    'projects': {
                        type: 'dir',
                        children: {
                            'braislator.txt': { type: 'file', content: 'BRAISLATOR: Turkish to Braille translator with speech-to-text support.' },
                            'ecommerce.txt': { type: 'file', content: 'E-commerce Platform: Full-featured platform with ERP integration.' },
                            'rfid.txt': { type: 'file', content: 'RFID Tracking System: Enterprise textile tracking solution.' },
                            'ai-training.txt': { type: 'file', content: 'AI Training Platform: Smart training with AI-supported exercises.' },
                            'devtools.txt': { type: 'file', content: 'DevTools Platform: Developer utilities and tools.\r\nLink: https://devtools.harungecit.dev/' }
                        }
                    },
                    'skills': {
                        type: 'dir',
                        children: {
                            'languages.md': { type: 'file', content: '# Languages\r\n- PHP\r\n- JavaScript\r\n- Go\r\n- SQL\r\n- Bash Shell' },
                            'laravel.md': { type: 'file', content: '# Laravel Ecosystem\r\n- Laravel\r\n- Livewire\r\n- Inertia.js\r\n- Filament\r\n- Nova\r\n- Forge\r\n- Vapor\r\n- Horizon\r\n- Sanctum' },
                            'backend.md': { type: 'file', content: '# Backend\r\n- CodeIgniter\r\n- Zend\r\n- Node.js\r\n- Express.js\r\n- Gin (Go)' },
                            'frontend.md': { type: 'file', content: '# Frontend\r\n- React.js\r\n- Alpine.js\r\n- Inertia.js\r\n- Livewire\r\n- Tailwind CSS\r\n- Bootstrap' },
                            'devops.md': { type: 'file', content: '# DevOps\r\n- Docker\r\n- Kubernetes\r\n- Nginx\r\n- AWS\r\n- GCP' }
                        }
                    },
                    'README.md': { type: 'file', content: '# Harun Geçit Portfolio\r\nWelcome to my interactive terminal portfolio!\r\nTry commands like "ls", "cd", "cat", "snake", "weather", "top", "chat".' }
                }
            }
        };

        let currentPath = ['~'];

        function getDir(pathArray) {
            let current = fileSystem['~'];
            for (let i = 1; i < pathArray.length; i++) {
                current = current.children[pathArray[i]];
            }
            return current;
        }

        function getPrompt() {
            const pathStr = currentPath.length === 1 ? '~' : '~/' + currentPath.slice(1).join('/');
            if (isMobileDevice) return `\x1b[1;32m${pathStr} $\x1b[0m `;
            return `\x1b[1;32m┌──[\x1b[1;36mharun@dev\x1b[1;32m]-[\x1b[1;37m${pathStr}\x1b[1;32m]\r\n└─\x1b[1;32m$\x1b[0m `;
        }

        // ================================
        // Snake Game State
        // ================================
        let gameInterval = null;
        let gameMode = false;
        let snake = [];
        let food = {};
        let direction = 'right';
        let score = 0;
        const gameWidth = 40;
        const gameHeight = 20;

        function startSnakeGame() {
            gameMode = true;
            score = 0;
            direction = 'right';
            snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
            spawnFood();

            term.clear();
            term.write('\x1b[?25l'); // Hide cursor

            gameInterval = setInterval(gameLoop, 100);
        }

        function stopSnakeGame() {
            gameMode = false;
            clearInterval(gameInterval);
            term.write('\x1b[?25h'); // Show cursor
            term.clear();
            term.write(`\r\n\x1b[1;32mGame Over! Score: ${score}\x1b[0m\r\n`);
            writePrompt();
        }

        function spawnFood() {
            food = {
                x: Math.floor(Math.random() * gameWidth),
                y: Math.floor(Math.random() * gameHeight)
            };
            // Make sure food doesn't spawn on snake
            for (let segment of snake) {
                if (segment.x === food.x && segment.y === food.y) {
                    spawnFood();
                    break;
                }
            }
        }

        function gameLoop() {
            // Move snake
            const head = { ...snake[0] };
            switch (direction) {
                case 'up': head.y--; break;
                case 'down': head.y++; break;
                case 'left': head.x--; break;
                case 'right': head.x++; break;
            }

            // Check collisions
            if (head.x < 0 || head.x >= gameWidth || head.y < 0 || head.y >= gameHeight) {
                stopSnakeGame();
                return;
            }

            for (let segment of snake) {
                if (head.x === segment.x && head.y === segment.y) {
                    stopSnakeGame();
                    return;
                }
            }

            snake.unshift(head);

            // Check food
            if (head.x === food.x && head.y === food.y) {
                score += 10;
                spawnFood();
            } else {
                snake.pop();
            }

            renderGame();
        }

        function renderGame() {
            let output = '\x1b[H'; // Move cursor to top-left

            // Top border
            output += '\x1b[1;36m+' + '-'.repeat(gameWidth) + '+\x1b[0m\r\n';

            for (let y = 0; y < gameHeight; y++) {
                output += '\x1b[1;36m|\x1b[0m';
                for (let x = 0; x < gameWidth; x++) {
                    let char = ' ';

                    if (x === food.x && y === food.y) {
                        char = '\x1b[1;31m*\x1b[0m'; // Food
                    } else {
                        for (let i = 0; i < snake.length; i++) {
                            if (snake[i].x === x && snake[i].y === y) {
                                char = i === 0 ? '\x1b[1;32mO\x1b[0m' : '\x1b[1;32mo\x1b[0m'; // Head vs Body
                                break;
                            }
                        }
                    }
                    output += char;
                }
                output += '\x1b[1;36m|\x1b[0m\r\n';
            }

            // Bottom border
            output += '\x1b[1;36m+' + '-'.repeat(gameWidth) + '+\x1b[0m\r\n';
            output += `Score: ${score}  (Press 'q' to quit)`;

            term.write(output);
        }

        // ================================
        // System Monitor (top)
        // ================================
        let monitorInterval = null;
        let monitorMode = false;

        function startMonitor() {
            monitorMode = true;
            term.clear();
            term.write('\x1b[?25l'); // Hide cursor
            monitorInterval = setInterval(renderMonitor, 1000);
            renderMonitor();
        }

        function stopMonitor() {
            monitorMode = false;
            clearInterval(monitorInterval);
            term.write('\x1b[?25h'); // Show cursor
            term.clear();
            writePrompt();
        }

        function renderMonitor() {
            const now = new Date().toTimeString().split(' ')[0];
            const cpu = (Math.random() * 30 + 10).toFixed(1);
            const mem = (Math.random() * 40 + 20).toFixed(1);
            const tasks = 42;
            const running = 1;

            let output = '\x1b[H'; // Move to top
            output += `\x1b[1;37mtop - ${now} up 15 days,  1 user,  load average: 0.15, 0.10, 0.05\x1b[0m\r\n`;
            output += `Tasks: \x1b[1;32m${tasks} total\x1b[0m,   \x1b[1;32m${running} running\x1b[0m,  \x1b[1;32m${tasks - running} sleeping\x1b[0m\r\n`;
            output += `%Cpu(s): \x1b[1;32m${cpu} us\x1b[0m,  \x1b[1;32m${(Math.random() * 5).toFixed(1)} sy\x1b[0m,  \x1b[1;32m${(100 - cpu).toFixed(1)} id\x1b[0m\r\n`;
            output += `MiB Mem : \x1b[1;32m16384.0 total\x1b[0m, \x1b[1;33m${(163.84 * mem).toFixed(1)} free\x1b[0m, \x1b[1;32m${(163.84 * (100 - mem)).toFixed(1)} used\x1b[0m\r\n`;
            output += '\r\n';
            output += '\x1b[7m  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND     \x1b[0m\r\n';

            const processes = [
                { pid: 1, user: 'root', cmd: 'init', cpu: 0.1, mem: 0.1 },
                { pid: 101, user: 'harun', cmd: 'php-fpm', cpu: 5.2, mem: 4.5 },
                { pid: 102, user: 'harun', cmd: 'laravel-worker', cpu: 4.8, mem: 8.2 },
                { pid: 103, user: 'harun', cmd: 'node-server', cpu: 3.5, mem: 6.1 },
                { pid: 104, user: 'harun', cmd: 'postgres', cpu: 2.1, mem: 5.5 },
                { pid: 105, user: 'harun', cmd: 'nginx', cpu: 1.5, mem: 2.3 },
                { pid: 106, user: 'harun', cmd: 'docker-daemon', cpu: 1.2, mem: 3.8 },
                { pid: 107, user: 'harun', cmd: 'vscode-server', cpu: 0.8, mem: 4.2 },
                { pid: 108, user: 'harun', cmd: 'zsh', cpu: 0.1, mem: 0.5 },
                { pid: 109, user: 'harun', cmd: 'git', cpu: 0.0, mem: 0.2 }
            ];

            processes.forEach(p => {
                const cpuVal = (p.cpu + Math.random() - 0.5).toFixed(1);
                const memVal = (p.mem + Math.random() - 0.5).toFixed(1);
                output += `\x1b[1;32m${p.pid.toString().padStart(5)} ${p.user.padEnd(8)}  20   0  ${(Math.random() * 100000).toFixed(0).padStart(6)}  ${(Math.random() * 10000).toFixed(0).padStart(5)}   ${(Math.random() * 5000).toFixed(0).padStart(4)} S   ${cpuVal}   ${memVal}   0:00.00 ${p.cmd}\x1b[0m\r\n`;
            });

            output += '\r\n\x1b[1;36mPress \'q\' to exit system monitor\x1b[0m';
            term.write(output);
        }

        // ================================
        // AI Chatbot State (Puter.js)
        // ================================
        let chatMode = false;
        let isBotTyping = false;
        let chatHistory = [];
        let puterLoaded = false;

        // Load Puter.js dynamically when needed
        function loadPuter() {
            return new Promise((resolve, reject) => {
                if (puterLoaded || typeof puter !== 'undefined') {
                    puterLoaded = true;
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = 'https://js.puter.com/v2/';
                script.onload = () => {
                    puterLoaded = true;
                    resolve();
                };
                script.onerror = () => reject(new Error('Failed to load Puter.js'));
                document.head.appendChild(script);
            });
        }

        const HARUN_CONTEXT = `You are Harun Geçit's AI assistant on his portfolio website terminal. Be friendly, helpful, and concise.

About Harun:
- Software Architect with 15+ years of experience
- Based in Istanbul, Turkey
- Roles: Full Stack Developer, DevOps Engineer, System Administrator, Cybersecurity Specialist, Software Advisor, Technical Blog Writer

Technical Skills:
- Languages: PHP, JavaScript, Go, SQL, Bash
- Laravel Ecosystem Expert: Laravel, Livewire, Inertia.js, Filament, Nova, Forge, Vapor, Horizon, Sanctum
- Frontend: React.js, Alpine.js, Inertia.js, Tailwind CSS
- Backend: CodeIgniter, Zend, Node.js, Express.js, Gin (Go)
- DevOps: Docker, Kubernetes, Nginx, AWS, GCP, GitOps
- Databases: PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch

Current Work:
- Full Stack Developer at USTEK RFID (2022-Present) - RFID technologies for textile tracking
- Software Advisor at CatchPad (2022-Present) - AI-supported training platform

Contact:
- Email: info@harungecit.com
- WhatsApp: 0850 303 39 54
- Website: harungecit.com
- Blog: echo.harungecit.dev

Keep responses brief (2-3 sentences max) since this is a terminal interface. Answer in the same language the user writes.`;

        async function startChat() {
            term.write('\r\n\x1b[1;90mLoading AI Chat...\x1b[0m');

            try {
                await loadPuter();
                term.write('\r\x1b[K'); // Clear loading message
            } catch (error) {
                term.write('\r\x1b[K\x1b[1;31mFailed to load AI Chat. Please try again.\x1b[0m\r\n');
                writePrompt();
                return;
            }

            chatMode = true;
            chatHistory = [];
            term.write('\x1b[1;35m╔═══════════════════════════════════════════════╗\x1b[0m\r\n');
            term.write('\x1b[1;35m║\x1b[0m  \x1b[1;36m🤖 AI Chat\x1b[0m \x1b[1;33m(Gemini 2.0 Flash Lite via Puter.js)\x1b[0m \x1b[1;35m║\x1b[0m\r\n');
            term.write('\x1b[1;35m╚═══════════════════════════════════════════════╝\x1b[0m\r\n');
            term.write('\x1b[1;90mType "bye" to exit.\x1b[0m\r\n\r\n');
            botReply("Hello! I'm Harun's AI assistant. How can I help you today?");
        }

        function stopChat() {
            chatMode = false;
            chatHistory = [];
            term.write('\r\n\x1b[1;35m[Chat Mode Deactivated]\x1b[0m\r\n');
            writePrompt();
        }

        function botReply(msg) {
            isBotTyping = true;
            term.write('\r\n\x1b[1;36m🤖 AI:\x1b[0m ');

            let i = 0;
            const typingInterval = setInterval(() => {
                if (msg[i] === '\n') {
                    term.write('\r\n');
                } else {
                    term.write(msg[i]);
                }
                i++;
                if (i >= msg.length) {
                    clearInterval(typingInterval);
                    isBotTyping = false;
                    term.write('\r\n\r\n\x1b[1;32m👤 You:\x1b[0m ');
                }
            }, 20);
        }

        async function processChat(input) {
            const lower = input.toLowerCase();

            if (lower === 'bye' || lower === 'exit' || lower === 'quit') {
                stopChat();
                return;
            }

            // Show thinking indicator
            term.write('\r\n\x1b[1;90m⏳ Thinking...\x1b[0m');

            try {
                // Check if Puter.js is available
                if (typeof puter === 'undefined' || !puter.ai) {
                    throw new Error('Puter.js not loaded');
                }

                // Simple prompt with context (more reliable than messages array)
                const prompt = `${HARUN_CONTEXT}\n\nUser: ${input}\n\nAssistant:`;

                // Call Puter.js AI with timeout
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), 15000)
                );

                const aiPromise = puter.ai.chat(prompt, {
                    model: 'gemini-2.0-flash-lite'
                });

                const response = await Promise.race([aiPromise, timeoutPromise]);

                // Debug: log response to console
                console.log('Puter AI Response:', response);

                // Extract message - Puter.js returns string directly or object
                let aiMessage;
                if (typeof response === 'string') {
                    aiMessage = response;
                } else if (response?.message?.content) {
                    aiMessage = response.message.content;
                } else if (response?.content) {
                    aiMessage = response.content;
                } else if (response?.text) {
                    aiMessage = response.text;
                } else {
                    aiMessage = String(response);
                }

                // Clean up the message
                aiMessage = aiMessage.trim();
                if (!aiMessage) throw new Error('Empty response');

                // Add to history
                chatHistory.push({ role: 'user', content: input });
                chatHistory.push({ role: 'assistant', content: aiMessage });

                // Clear thinking indicator and show response
                term.write('\r\x1b[K');
                botReply(aiMessage);

            } catch (error) {
                console.error('AI Chat Error:', error);
                term.write('\r\x1b[K');

                // Fallback responses
                let fallbackResponse = `Connection issue: ${error.message}. Try again or type 'bye' to exit.`;

                if (lower.includes('merhaba') || lower.includes('selam') || lower.includes('hello') || lower.includes('hi')) {
                    fallbackResponse = "Hello! I'm Harun's assistant. I can help you with information about projects, skills, or contact details.";
                } else if (lower.includes('proje') || lower.includes('project')) {
                    fallbackResponse = "Harun has worked on projects like BRAISLATOR (Braille translator), E-commerce platforms, and RFID tracking systems.";
                } else if (lower.includes('laravel')) {
                    fallbackResponse = "Harun is a Laravel ecosystem expert! He uses Livewire, Inertia.js, Filament, Nova, Forge, and Vapor.";
                } else if (lower.includes('iletişim') || lower.includes('contact') || lower.includes('email')) {
                    fallbackResponse = "You can reach Harun at info@harungecit.com or via WhatsApp at 0850 303 39 54.";
                }

                botReply(fallbackResponse);
            }
        }

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
                    '\x1b[1;35m📂 File System:\x1b[0m',
                    '\x1b[1;32mls\x1b[0m - List directory contents',
                    '\x1b[1;32mcd [dir]\x1b[0m - Change directory',
                    '\x1b[1;32mpwd\x1b[0m - Print working directory',
                    '\x1b[1;32mcat [file]\x1b[0m - Read file content',
                    '',
                    '\x1b[1;33m🎮 Games:\x1b[0m',
                    '\x1b[1;32msnake\x1b[0m - Play Snake game',
                    '',
                    '\x1b[1;35m📊 System:\x1b[0m',
                    '\x1b[1;32mtop\x1b[0m - System monitor',
                    '\x1b[1;32mweather [city]\x1b[0m - Check weather forecast',
                    '\x1b[1;32mchat\x1b[0m - Chat with Gemini AI (Puter.js)',
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
\x1b[1;32mTitle:\x1b[0m       \x1b[1;33mSoftware Architect\x1b[0m
\x1b[1;32mLocation:\x1b[0m    Istanbul, Türkiye
\x1b[1;32mExperience:\x1b[0m  15+ years in software development

\x1b[1;35mRoles:\x1b[0m
  • Full Stack Developer    • DevOps Engineer
  • System Administrator    • Cyber Security
  • Software Advisor        • Technical Blog Writer

Passionate about the \x1b[1;31mLaravel Ecosystem\x1b[0m and building scalable systems.
Expert in PHP, JavaScript, Go, SQL, and Bash.

\x1b[1;33m"Continually adding value to myself and recognizing there is
 still much to learn."\x1b[0m
`,

            skills: (args) => `
\x1b[1;36mTECHNICAL SKILLS:\x1b[0m

\x1b[1;33m▸ Languages\x1b[0m
  PHP, JavaScript, Go, SQL, Bash Shell

\x1b[1;31m▸ Laravel Ecosystem\x1b[0m
  Laravel, Livewire, Inertia.js, Filament, Nova
  Forge, Vapor, Horizon, Sanctum, Passport

\x1b[1;33m▸ Backend\x1b[0m
  CodeIgniter, Zend, Node.js, Express.js, Gin (Go)

\x1b[1;33m▸ Frontend\x1b[0m
  React.js, Alpine.js, Inertia.js, Tailwind CSS, Bootstrap

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
                isBusy = true;
                fetch('https://api.ipify.org?format=json')
                    .then(response => response.json())
                    .then(data => {
                        term.write(`\r\n\x1b[1;36mYour IP Address:\x1b[0m ${data.ip}\r\n`);
                        isBusy = false;
                        writePrompt();
                    })
                    .catch(error => {
                        term.write(`\r\n\x1b[1;31mError:\x1b[0m Unable to fetch IP address\r\n`);
                        isBusy = false;
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
                // Apply light theme to terminal
                term.options.theme = lightTheme;
                return '\x1b[1;33m✨ Lumos! ✨\x1b[0m\r\n\x1b[1;36mLight mode activated. The wand tip ignites!\x1b[0m';
            },

            nox: (args) => {
                document.body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
                // Apply dark theme to terminal
                term.options.theme = darkTheme;
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
            },

            // File System Commands
            ls: (args) => {
                const dir = getDir(currentPath);
                const items = Object.keys(dir.children).map(name => {
                    const item = dir.children[name];
                    if (item.type === 'dir') return `\x1b[1;34m${name}/\x1b[0m`;
                    return `\x1b[1;32m${name}\x1b[0m`;
                });
                return items.join('  ');
            },

            cd: (args) => {
                if (!args || args.length === 0) {
                    currentPath = ['~'];
                    return '';
                }

                const target = args[0];

                if (target === '..') {
                    if (currentPath.length > 1) {
                        currentPath.pop();
                    }
                    return '';
                }

                if (target === '~') {
                    currentPath = ['~'];
                    return '';
                }

                const dir = getDir(currentPath);
                if (dir.children[target] && dir.children[target].type === 'dir') {
                    currentPath.push(target);
                    return '';
                }

                return `\x1b[1;31mcd: no such file or directory: ${target}\x1b[0m`;
            },

            pwd: (args) => {
                return '/' + currentPath.slice(1).join('/');
            },

            cat: (args) => {
                if (!args || args.length === 0) return '\x1b[1;31mUsage: cat <filename>\x1b[0m';

                const target = args[0];
                const dir = getDir(currentPath);

                if (dir.children[target]) {
                    if (dir.children[target].type === 'file') {
                        return dir.children[target].content;
                    }
                    return `\x1b[1;31mcat: ${target}: Is a directory\x1b[0m`;
                }

                return `\x1b[1;31mcat: ${target}: No such file or directory\x1b[0m`;
            },

            snake: (args) => {
                startSnakeGame();
                return '';
            },

            top: (args) => {
                startMonitor();
                return '';
            },


            weather: (args) => {
                const city = args.join(' ');
                const displayCity = city || 'your location';
                term.write(`\r\n\x1b[1;33mFetching weather for ${displayCity}...\x1b[0m\r\n\r\n`);

                isBusy = true;
                const encodedCity = city ? encodeURIComponent(city) : '';
                const url = encodedCity ? `https://wttr.in/${encodedCity}?format=3` : 'https://wttr.in/?format=3';

                fetch(url)
                    .then(res => {
                        if (!res.ok) throw new Error('City not found');
                        return res.text();
                    })
                    .then(data => {
                        term.write(`\x1b[1;36m${data.trim()}\x1b[0m\r\n`);
                        isBusy = false;
                        writePrompt();
                    })
                    .catch(err => {
                        term.write(`\r\n\x1b[1;31mError: Unable to fetch weather data for "${displayCity}".\x1b[0m\r\n`);
                        term.write(`\x1b[1;33mTip: Try "weather Istanbul" or "weather London"\x1b[0m\r\n`);
                        isBusy = false;
                        writePrompt();
                    });

                return '';
            },


            chat: (args) => {
                startChat();
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

            // Check for multi-word commands first
            // Try matching the full input or progressively shorter prefixes
            let matchedCmd = null;
            let args = [];

            // Check for exact matches in commands object
            if (commands[trimmed]) {
                matchedCmd = trimmed;
                args = [];
            } else {
                // Try to find multi-word commands by checking progressively
                const words = trimmed.split(' ');
                for (let i = words.length; i > 0; i--) {
                    const potentialCmd = words.slice(0, i).join(' ');
                    if (commands[potentialCmd]) {
                        matchedCmd = potentialCmd;
                        args = words.slice(i);
                        break;
                    }
                }
            }

            // Execute command if found
            if (matchedCmd && commands[matchedCmd]) {
                const output = commands[matchedCmd](args);
                // Convert \n to \r\n for proper terminal display
                return output ? output.replace(/\n/g, '\r\n') : '';
            } else {
                const firstWord = trimmed.split(' ')[0];
                return `\x1b[1;31mCommand not found:\x1b[0m ${firstWord}\r\nType '\x1b[1;32mhelp\x1b[0m' to see available commands.`;
            }
        }

        // ================================
        // Terminal Input Handling
        // ================================
        function writePrompt() {
            term.write('\r\n' + getPrompt());
            // Add extra lines to prevent prompt from being hidden
            setTimeout(() => {
                term.scrollToBottom();
            }, 50);
        }

        term.onData(data => {
            // Handle Game Mode
            if (gameMode) {
                const code = data.charCodeAt(0);
                if (data === 'q' || code === 3) { // q or Ctrl+C
                    stopSnakeGame();
                    return;
                }

                if (data === '\x1b[A' && direction !== 'down') direction = 'up';
                else if (data === '\x1b[B' && direction !== 'up') direction = 'down';
                else if (data === '\x1b[D' && direction !== 'right') direction = 'left';
                else if (data === '\x1b[C' && direction !== 'left') direction = 'right';
                else if (data === 'w' && direction !== 'down') direction = 'up';
                else if (data === 's' && direction !== 'up') direction = 'down';
                else if (data === 'a' && direction !== 'right') direction = 'left';
                else if (data === 'd' && direction !== 'left') direction = 'right';

                return;
            }

            // Handle Monitor Mode
            if (monitorMode) {
                const code = data.charCodeAt(0);
                if (data === 'q' || code === 3) { // q or Ctrl+C
                    stopMonitor();
                }
                return;
            }

            // Handle Chat Mode
            if (chatMode) {
                if (isBotTyping) return; // Block input while typing

                const code = data.charCodeAt(0);

                if (code === 13) { // Enter
                    term.write('\r\n');
                    processChat(currentLine);
                    currentLine = '';
                } else if (code === 127) { // Backspace
                    if (currentLine.length > 0) {
                        currentLine = currentLine.slice(0, -1);
                        term.write('\b \b');
                    }
                } else if (code >= 32 && code < 127) {
                    currentLine += data;
                    term.write(data);
                }
                return;
            }

            // Block input if terminal is busy
            if (isBusy) return;

            const code = data.charCodeAt(0);

            // Enter
            if (code === 13) {
                term.write('\r\n');
                const output = processCommand(currentLine);
                if (output !== null) {
                    term.write(output);
                    term.write('\r\n');
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
                    term.write('\r' + getPrompt());
                    for (let i = 0; i < currentLine.length; i++) {
                        term.write(' ');
                    }
                    term.write('\r' + getPrompt());
                    historyIndex--;
                    currentLine = commandHistory[historyIndex];
                    term.write(currentLine);
                }
            }
            // Down Arrow
            else if (data === '\x1b[B') {
                if (historyIndex < commandHistory.length) {
                    term.write('\r' + getPrompt());
                    for (let i = 0; i < currentLine.length; i++) {
                        term.write(' ');
                    }
                    term.write('\r' + getPrompt());
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
            term.options.theme = lightTheme;
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
