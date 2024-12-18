import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-6 text-center">
            <div className="container mx-auto px-4">
                <p className="mb-2">&copy; {new Date().getFullYear()}
                    <a href="https://harungecit.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400 transition-colors">
                        <strong> Harun Geçit</strong>
                    </a>. All rights reserved.</p>
                <p className="mb-4">Full Stack Developer specializing in PHP, React, Node.js, and TypeScript</p>
                <div className="flex justify-center space-x-4">
                    <a href="https://github.com/harungecit/terminal-portfolio" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400 transition-colors">
                        <FaGithub size={24} />
                    </a>
                    <a href="https://www.linkedin.com/in/harungecit" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400 transition-colors">
                        <FaLinkedin size={24} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;