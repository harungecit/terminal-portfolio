import React from 'react';
import { Command, LanguageContextType } from '../types/terminal';
import {
    FaEnvelope,
    FaGithub,
    FaLinkedin,
    FaYoutube,
    FaTwitter,
    FaTelegram,
    FaDiscord,
    FaInstagram,
    FaSteam,
} from 'react-icons/fa';
import { LuBird } from 'react-icons/lu';
import { FaMastodon } from 'react-icons/fa';

export const contactCommand: Command = {
    name: 'contact',
    description: 'Display contact information',
    execute: (args: string[], context: LanguageContextType) => {
        const links = {
            email: 'mailto:info@harungecit.com',
            github: 'https://github.com/harungecit',
            linkedin: 'https://linkedin.com/in/harungecit',
            youtube: 'https://youtube.com/@harungecit',
            twitter: 'https://x.com/harungecit_',
            x: 'https://x.com/harungecit_',
            telegram: 'https://t.me/harungecit',
            discord: 'https://discord.gg/harungecit',
            instagram: 'https://instagram.com/harungecit.dev',
            bluesky: 'https://bsky.app/profile/harungecit.bsky.social',
            mastodon: 'https://mastodon.social/@harungecit',
            steam: 'https://steamcommunity.com/id/gecitharun',
        };

        if (args.length > 0) {
            const target = args[0].toLowerCase();
            if (links[target]) {
                window.open(links[target], '_blank');
                return <p className="text-green-400">{context.t('contact.opening', { target })}</p>;
            } else {
                return <p className="text-red-400">{context.t('contact.notFound', { target })}</p>;
            }
        }

        return (
            <div className="space-y-2">
                <p className="text-green-400">{context.t('contact.title')}</p>
                <p>
                    <FaEnvelope className="inline-block text-yellow-400 mr-2" />
                    Email: <a href={links.email} className="text-blue-400 underline">info@harungecit.com</a>
                </p>
                <p>
                    <FaGithub className="inline-block text-gray-400 mr-2" />
                    GitHub: <a href={links.github} className="text-blue-400 underline" target="_blank">github.com/harungecit</a>
                </p>
                <p>
                    <FaLinkedin className="inline-block text-blue-500 mr-2" />
                    LinkedIn: <a href={links.linkedin} className="text-blue-400 underline" target="_blank">linkedin.com/in/harungecit</a>
                </p>
                <p>
                    <FaYoutube className="inline-block text-red-500 mr-2" />
                    YouTube: <a href={links.youtube} className="text-blue-400 underline" target="_blank">youtube.com/@harungecit</a>
                </p>
                <p>
                    <FaTwitter className="inline-block text-blue-400 mr-2" />
                    X: <a href={links.twitter} className="text-blue-400 underline" target="_blank">x.com/harungecit_</a>
                </p>
                <p>
                    <FaTelegram className="inline-block text-blue-500 mr-2" />
                    Telegram: <a href={links.telegram} className="text-blue-400 underline" target="_blank">t.me/harungecit</a>
                </p>
                <p>
                    <FaDiscord className="inline-block text-purple-500 mr-2" />
                    Discord: <a href={links.discord} className="text-blue-400 underline" target="_blank">discord.gg/harungecit</a>
                </p>
                <p>
                    <FaInstagram className="inline-block text-pink-500 mr-2" />
                    Instagram: <a href={links.instagram} className="text-blue-400 underline" target="_blank">instagram.com/harungecit.dev</a>
                </p>
                <p>
                    <LuBird className="inline-block text-blue-400 mr-2" />
                    Bluesky: <a href={links.bluesky} className="text-blue-400 underline" target="_blank">bsky.app/profile/harungecit.bsky.social</a>
                </p>
                <p>
                    <FaMastodon className="inline-block text-gray-600 mr-2" />
                    Mastodon: <a href={links.mastodon} className="text-blue-400 underline" target="_blank">mastodon.social/@harungecit</a>
                </p>
                <p>
                    <FaSteam className="inline-block text-gray-400 mr-2" />
                    Steam: <a href={links.steam} className="text-blue-400 underline" target="_blank">steamcommunity.com/id/gecitharun</a>
                </p>
            </div>
        );
    },
};