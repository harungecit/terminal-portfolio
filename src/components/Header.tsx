import React from 'react';
import { Code2, Database, Layout, Cloud, GitBranch } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold mb-6">Full Stack Developer</h1>
          <p className="text-xl mb-8 max-w-2xl">
            Crafting robust and scalable solutions with modern technologies
          </p>
          <div className="flex gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <Code2 size={20} />
              <span>Backend</span>
            </div>
            <div className="flex items-center gap-2">
              <Layout size={20} />
              <span>Frontend</span>
            </div>
            <div className="flex items-center gap-2">
              <Database size={20} />
              <span>Database</span>
            </div>
            <div className="flex items-center gap-2">
              <Cloud size={20} />
              <span>Cloud</span>
            </div>
            <div className="flex items-center gap-2">
              <GitBranch size={20} />
              <span>DevOps</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}