import React from 'react';

interface Skill {
  name: string;
  items: string[];
}

interface SkillSectionProps {
  title: string;
  skills: Skill[];
}

export default function SkillSection({ title, skills }: SkillSectionProps) {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skills.map((skill) => (
          <div key={skill.name} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">{skill.name}</h3>
            <div className="flex flex-wrap gap-2">
              {skill.items.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}