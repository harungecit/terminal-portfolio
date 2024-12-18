import React from 'react';
import { motion, useInView } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function SkillsGrid({ skills }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {skills.map((skill, index) => (
        <motion.div
          key={skill.name}
          variants={item}
          whileHover={{ scale: 1.02 }}
          className="group relative overflow-hidden bg-gradient-to-br from-purple-900/50 via-black/50 to-pink-900/50 backdrop-blur-lg rounded-xl p-6 border border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative z-10"
          >
            <h3 className="text-xl font-semibold mb-4 text-white">
              {skill.name}
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {skill.items.map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (index * 0.1) + (i * 0.05) }}
                  whileHover={{ scale: 1.1 }}
                  className="px-3 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-100 rounded-full text-sm hover:from-purple-500/50 hover:to-pink-500/50 transition-all duration-300 cursor-default"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
      ))}
    </motion.div>
  );
}