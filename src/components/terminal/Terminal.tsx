import React from 'react';
import TerminalHeader from './TerminalHeader';
import TerminalPrompt from './TerminalPrompt';
import TerminalOutput from './TerminalOutput';
import WelcomeMessage from './WelcomeMessage';
import { useTerminal } from '../../hooks/useTerminal';

export default function Terminal() {
  const {
    input,
    setInput,
    history,
    currentPath,
    inputRef,
    terminalRef,
    handleSubmit,
  } = useTerminal();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <TerminalHeader />

          <div
            ref={terminalRef}
            className="p-4 h-[600px] overflow-y-auto font-mono text-sm"
          >
            <WelcomeMessage />

            {history.map((entry, i) => (
              <TerminalOutput
                key={i}
                entry={entry}
                currentPath={currentPath}
              />
            ))}

            <TerminalPrompt
              currentPath={currentPath}
              input={input}
              onInputChange={(e) => setInput(e.target.value)}
              onSubmit={handleSubmit}
              inputRef={inputRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
}