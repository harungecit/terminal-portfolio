import React from 'react';
import { Command } from '../types/terminal';
import { tools } from '../data/tools';

export const toolsCommand: Command = {
  name: 'tools',
  description: 'List my using tools',
  usage: '[category]',
execute: (args) => {

    const category = args[0]?.toLowerCase();
    const filteredTools = category
      ? tools.filter((s: { category: string; items: string[] }) => s.category.toLowerCase() === category)
      : tools;

    if (category && filteredTools.length === 0) {
      return `Category "${category}" not found. Available categories: ${[
        ...new Set(tools.map((s: { category: string; items: string[] }) => s.category)),
      ].join(', ')}`;
    }

    return (
      <div className="space-y-4">
        {filteredTools.map((tool: { category: string; items: string[] }) => (
          <div key={tool.category}>
            <p className="text-yellow-400">{tool.category}:</p>
            <div className="pl-4 flex flex-wrap gap-2">
                {tool.items.map((item) => (
                  <span key={item} className="text-blue-400">{item}</span>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};