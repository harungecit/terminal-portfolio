import React from 'react';
import { Command, LanguageContextType } from '../types/terminal';
import { FaEnvelope, FaGithub, FaLinkedin, FaYoutube, FaTwitter, FaTelegram, FaDiscord, FaInstagram, FaFacebook } from 'react-icons/fa';

export const contactCommand: Command = {
  name: 'contact',
  description: 'Display contact information',
  execute: (args: string[], context: LanguageContextType) => (
    <div className="space-y-2">
      <p className="text-green-400">{context.t('contact.title')}</p>
      <p>
        <FaEnvelope className="inline-block text-yellow-400 mr-2" /> Email: <span className="text-blue-400">info@harungecit.com</span>
      </p>
      <p>
        <FaGithub className="inline-block text-gray-400 mr-2" /> GitHub: <span className="text-blue-400">github.com/harungecit</span>
      </p>
      <p>
        <FaLinkedin className="inline-block text-blue-500 mr-2" /> LinkedIn: <span className="text-blue-400">linkedin.com/in/harungecit</span>
      </p>
      <p>
        <FaYoutube className="inline-block text-red-500 mr-2" /> YouTube: <span className="text-blue-400">youtube.com/@harungecit</span>
      </p>
      <p>
        <FaTwitter className="inline-block text-blue-400 mr-2" /> X: <span className="text-blue-400">x.com/harungecit_</span>
      </p>
      <p>
        <FaTelegram className="inline-block text-blue-500 mr-2" /> Telegram: <span className="text-blue-400">t.me/harungecit</span>
      </p>
      <p>
        <FaDiscord className="inline-block text-purple-500 mr-2" /> Discord: <span className="text-blue-400">discord.gg/placeholder</span>
      </p>
      <p>
        <FaInstagram className="inline-block text-pink-500 mr-2" /> Instagram: <span className="text-blue-400">instagram.com/harungecit.dev</span>
      </p>
    </div>
  ),
};