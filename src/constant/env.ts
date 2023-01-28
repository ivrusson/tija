export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true' ?? false;

export const DEFAULT_BASE_COLOR = 'purple';

// Cool gradient 'bg-gradient-to-r from-fuchsia-400 via-violet-900 to-indigo-500';

export const DEFAULT_BG_COLOR = 'bg-gradient-to-r from-gray-800 to-gray-900';
// export const DEFAULT_BG_COLOR_PATTERN = 'bg-gradient-to-r from-[COLOR]-800 to-[COLOR]-900';

export const DEFAULT_FONT_TEXT = 'Mulish, sans-serif';