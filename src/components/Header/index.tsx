import { FireIcon, SunIcon, MoonIcon } from '@heroicons/react/outline';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, onToggleDarkMode }) => {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FireIcon className="h-8 w-8 text-youtube-red mr-2" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">YouTube Explorer</h1>
        </div>
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {isDarkMode ? (
            <SunIcon className="h-6 w-6 text-yellow-500" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        알고리즘에서 벗어나 다양한 콘텐츠를 발견해보세요
      </p>
    </header>
  );
};

export default Header; 