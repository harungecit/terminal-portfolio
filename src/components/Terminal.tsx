import React, { useState, useRef, useEffect } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { commands } from '../commands';
import { CommandHistory } from '../types/terminal';

export default function Terminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [currentPath] = useState('~/guest');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    const handleClick = () => inputRef.current?.focus();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleCommand = (cmd: string) => {
    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();
    const commandArgs = args.slice(1);

    if (command === 'clear') {
      setHistory([]);
      return;
    }

    const output = commands[command]
      ? commands[command].execute(commandArgs)
      : `Command not found: ${command}. Type 'help' for available commands.`;

    setHistory((prev) => [
      ...prev,
      { command: cmd, output, timestamp: new Date() },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Terminal Header */}
          <div className="bg-gray-700 px-4 py-2 flex items-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <div className="ml-4 text-sm text-gray-400">guest@portfolio</div>
          </div>

          {/* Terminal Body */}
          <div
            ref={terminalRef}
            className="p-4 h-[600px] overflow-y-auto font-mono text-sm"
          >
            {/* Welcome Message */}
            <div className="mb-4">
              <Typewriter
                words={[
                  'Welcome to my interactive portfolio! Type "help" to see available commands.',
                ]}
                cursor
                cursorStyle="_"
                typeSpeed={70}
              />
            </div>

            {/* Command History */}
            {history.map((entry, i) => (
              <div key={i} className="mb-4">
                <div className="flex items-center text-green-400">
                  <span className="mr-2">➜</span>
                  <span className="text-blue-400">{currentPath}</span>
                  <span className="ml-2">{entry.command}</span>
                </div>
                <div className="mt-2 pl-4">{entry.output}</div>
              </div>
            ))}

            {/* Input Line */}
            <form onSubmit={handleSubmit} className="flex items-center">
              <span className="text-green-400 mr-2">➜</span>
              <span className="text-blue-400 mr-2">{currentPath}</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent outline-none"
                autoFocus
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}