import { useTheme } from '../contexts/ThemeContext';
import { ExternalLink, Users } from 'lucide-react';
interface VkPostsFeedProps {
  className?: string;
}

export default function VkPostsFeed({ className = '' }: VkPostsFeedProps) {
  const { theme } = useTheme();

  return (
    <div className={`relative overflow-hidden rounded-[2rem] p-8 md:p-10 shadow-2xl ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white'
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-black'
    } ${className}`}>
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
            theme === 'dark'
              ? 'bg-white/20 backdrop-blur-sm text-white'
              : 'bg-blue-600 text-white'
          }`}>
            VK
          </div>
          <h2 className="text-2xl md:text-3xl font-black">
            Новости компании
          </h2>
        </div>

        {/* Description */}
        <p className={`${theme === 'dark' ? 'text-white/90' : 'text-black/90'} mb-6 text-base`}>
          Подписывайтесь на нашу группу ВКонтакте! Следите за новинками строительных услуг, акциями, 
          фотоотчётами с объектов и полезными советами от нашей команды.
        </p>

        {/* CTA Button */}
        <a
          href="https://vk.com/legion__78"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-6 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <span>Перейти в группу VK</span>
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}
