import { 
  WrenchIcon, 
  GitBranchIcon, 
  CloudIcon, 
  BellIcon, 
  MailIcon, 
  MonitorIcon 
} from 'lucide-react';

export const toolsConfig = [
  {
    icon: <WrenchIcon className="w-8 h-8 text-indigo-600" />,
    title: "Development Tools",
    items: ["PhpStorm", "VS Code", "Navicat", "DBeaver"]
  },
  {
    icon: <GitBranchIcon className="w-8 h-8 text-indigo-600" />,
    title: "Version Control",
    items: ["Git", "GitHub", "GitHub Actions"]
  },
  {
    icon: <CloudIcon className="w-8 h-8 text-indigo-600" />,
    title: "Cloud Services",
    items: ["Google Cloud", "Amazon AWS"]
  },
  {
    icon: <BellIcon className="w-8 h-8 text-indigo-600" />,
    title: "Notifications",
    items: ["OneSignal", "Firebase", "Twilio"]
  },
  {
    icon: <MailIcon className="w-8 h-8 text-indigo-600" />,
    title: "Communication",
    items: ["SendGrid", "Telegram", "Slack"]
  },
  {
    icon: <MonitorIcon className="w-8 h-8 text-indigo-600" />,
    title: "Design",
    items: ["Canva", "Photoshop", "Premiere Pro"]
  }
];