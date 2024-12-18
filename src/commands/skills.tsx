import React from 'react';
import { Command } from '../types/terminal';
import { skills } from '../data/skills';

export const skillsCommand: Command = {
  name: 'skills',
  description: 'List my technical skills',
  usage: '[category]',
execute: (args) => {

    const category = args[0]?.toLowerCase();
    const filteredSkills = category
      ? skills.filter((s) => s.category.toLowerCase() === category)
      : skills;

    if (category && filteredSkills.length === 0) {
      return `Category "${category}" not found. Available categories: ${[
        ...new Set(skills.map((s) => s.category)),
      ].join(', ')}`;
    }

    return (
      <div className="space-y-4">
        {filteredSkills.map((skill) => (
          <div key={skill.category}>
            <p className="text-yellow-400">{skill.category}:</p>
            <div className="pl-4 flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <span key={item} className="text-blue-400">{item}</span>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};