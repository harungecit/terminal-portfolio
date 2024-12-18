import React from 'react';

export default function TerminalHeader() {
  return (
    <div className="bg-gray-700 px-4 py-2 flex items-center">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-red-500 rounded-full" />
        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
        <div className="w-3 h-3 bg-green-500 rounded-full" />
      </div>
      <div className="ml-4 text-sm text-gray-400">guest@harungecit.local</div>
    </div>
  );
}