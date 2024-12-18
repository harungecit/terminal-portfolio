import React from 'react';
import { CommandHistory } from '../../types/terminal';

interface TerminalOutputProps {
  entry: CommandHistory;
  currentPath: string;
}

export default function TerminalOutput({ entry, currentPath }: TerminalOutputProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center text-green-400">
        <span className="mr-2">➜</span>
        <span className="text-blue-400">{currentPath}</span>
        <span className="ml-2">{entry.command}</span>
      </div>
      <div className="mt-2 pl-4">{entry.output}</div>
    </div>
  );
}