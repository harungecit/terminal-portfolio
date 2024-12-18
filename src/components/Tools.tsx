import React from 'react';
import { motion } from 'framer-motion';
import { toolsConfig } from '../config/tools';

const ToolCard = ({ icon, title, items }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="relative overflow-hidden bg-gradient-to-br from-purple-900/50 via-black/50 to-pink-900/50 backdrop-blur-lg rounded-xl p-6 border border-white/10"
  >
    <motion.div
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      className="flex items-center mb-4 relative z-10"
    >
      {React.cloneElement(icon, { className: "w-8 h-8 text-purple-400" })}
      <h3 className="text-xl font-semibold ml-3 text-white">{title}</h3>
    </motion.div>
    
    <div className="flex flex-wrap gap-2 relative z-10">
      {items.map((item, index) => (
        <motion.span
          key={item}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.1 }}
          className="px-3 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-100 rounded-full text-sm hover:from-purple-500/50 hover:to-pink-500/50 transition-all duration-300 cursor-default"
        >
          {item}
        </motion.span>
      ))}
    </div>

    <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-2xl rounded-full" />
  </motion.div>
);

export default function Tools() {
  return (
    <div className="py-16 bg-gradient-to-b from-black via-purple-900/20 to-black">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
        >
          Tools & Services
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {toolsConfig.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ToolCard {...tool} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}