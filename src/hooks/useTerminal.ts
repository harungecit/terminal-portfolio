import { useState, useRef, useEffect } from 'react';
import { CommandHistory } from '../types/terminal';
import { commands } from '../commands';
import { useLanguage } from '../contexts/LanguageContext';
import { resolveCommandAlias } from '../utils/commandUtils';

export function useTerminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [currentPath] = useState('~/harungecit');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const languageContext = useLanguage();

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
    const inputCommand = args[0].toLowerCase();
    const commandArgs = args.slice(1);

    const resolvedCommand = resolveCommandAlias(inputCommand, languageContext.language);

    if (inputCommand === 'clear' || inputCommand === 'temizle') {
      setHistory([]);
      return;
    }

    const output = resolvedCommand && commands[resolvedCommand]
      ? commands[resolvedCommand].execute(commandArgs, languageContext)
      : languageContext.t('command.not.found');

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

  return {
    input,
    setInput,
    history,
    currentPath,
    inputRef,
    terminalRef,
    handleSubmit,
  };
}