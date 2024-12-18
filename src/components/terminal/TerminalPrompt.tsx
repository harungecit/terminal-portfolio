import React from 'react';

interface TerminalPromptProps {
  currentPath: string;
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export default function TerminalPrompt({
  currentPath,
  input,
  onInputChange,
  onSubmit,
  inputRef,
}: TerminalPromptProps) {
  return (
    <form onSubmit={onSubmit} className="flex items-center">
      <span className="text-green-400 mr-2">➜</span>
      <span className="text-blue-400 mr-2">{currentPath}</span>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={onInputChange}
        className="flex-1 bg-transparent outline-none"
        autoFocus
      />
    </form>
  );
}