import { YouTubeCategory } from '@/utils/youtube';

interface Country {
  code: string;
  name: string;
}

interface FiltersProps {
  selectedCategory: string;
  selectedCountry: string;
  showShorts: boolean;
  categories: YouTubeCategory[];
  shortsCount: number;
  totalCount: number;
  onCategoryChange: (category: string) => void;
  onCountryChange: (country: string) => void;
  onShowShortsChange: (show: boolean) => void;
}

const COUNTRIES: Country[] = [
  { code: 'KR', name: '한국' },
  { code: 'US', name: '미국' },
  { code: 'JP', name: '일본' },
  { code: 'GB', name: '영국' },
];

const Filters: React.FC<FiltersProps> = ({
  selectedCategory,
  selectedCountry,
  showShorts,
  categories,
  shortsCount,
  totalCount,
  onCategoryChange,
  onCountryChange,
  onShowShortsChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Category Filter */}
      <div className="w-full md:w-1/3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          카테고리
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-youtube-red focus:border-youtube-red bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="all">전체</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>

      {/* Country Filter */}
      <div className="w-full md:w-1/3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          국가
        </label>
        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-youtube-red focus:border-youtube-red bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {COUNTRIES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* Content Type Filter */}
      <div className="w-full md:w-1/3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          콘텐츠 유형
        </label>
        <select
          value={showShorts ? 'shorts' : 'all'}
          onChange={(e) => onShowShortsChange(e.target.value === 'shorts')}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-youtube-red focus:border-youtube-red bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="all">전체 ({totalCount}개)</option>
          <option value="shorts">쇼츠 ({shortsCount}개)</option>
        </select>
      </div>
    </div>
  );
};

export default Filters; 