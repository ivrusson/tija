/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs, { Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import colors from 'tailwindcss/colors';

import { DEFAULT_BASE_COLOR, DEFAULT_BG_COLOR, DEFAULT_FONT_TEXT } from '@/constant/env';

dayjs.extend(utc)
dayjs.extend(timezone)

type OpenGraphType = {
  siteName: string;
  description: string;
  templateTitle?: string;
  logo?: string;
};

export function openGraph({
  siteName,
  templateTitle,
  description,
  // !STARTERCONF Or, you can use my server with your own logo.
  logo = 'https://og.<your-domain>/images/logo.jpg',
}: OpenGraphType): string {
  const ogLogo = encodeURIComponent(logo);
  const ogSiteName = encodeURIComponent(siteName.trim());
  const ogTemplateTitle = templateTitle
    ? encodeURIComponent(templateTitle.trim())
    : undefined;
  const ogDesc = encodeURIComponent(description.trim());

  return `https://og.<your-domain>/api/general?siteName=${ogSiteName}&description=${ogDesc}&logo=${ogLogo}${ogTemplateTitle ? `&templateTitle=${ogTemplateTitle}` : ''
    }`;
}

export function getFromLocalStorage(key: string): string | null {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key);
  }
  return null;
}

export function getFromSessionStorage(key: string): string | null {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(key);
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function calendarLinkGanerator(type: 'google' | 'outlook', data: any) {
  const types: any = {
    google: {
      dateFormat: 'YYYYMMDDTHHmm00Z',
      urlPattern:
        'https://calendar.google.com/calendar/render?action=TEMPLATE&dates=[DATES]&details=[DESCRIPTION]&location=[LOCATION]&text=[TITLE]',
    },
    outlook: {
      dateFormat: 'YYYY-MM-DDTHH:mm:00+00:00',
      urlPattern:
        'https://outlook.live.com/calendar/0/deeplink/compose?body=[DESCRIPTION][DATE]&location=[LOCATION]&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&subject=[TITLE]',
    },
  };

  let url = '';
  const format = types[type];

  if (!format) return url;

  switch (type) {
    case 'google':
      {
        url = format.urlPattern;
        url = url.replace('[TITLE]', data.event.title || '');
        url = url.replace('[DESCRIPTION]', data.event.description || '');
        url = url.replace('[LOCATION]', data.event.location || '');
        const date = dayjs.utc(data.currentTime);
        url = url.replace(
          '[DATES]',
          date.format(format.dateFormat) +
          '/' +
          date
            .clone()
            .add(data.event.duration || 0, 'm')
            .format(format.dateFormat)
        );
      }
      break;
    case 'outlook':
      {
        url = url.replace('[TITLE]', data.event.title || '');
        url = url.replace('[DESCRIPTION]', data.event.description || '');
        url = url.replace('[LOCATION]', data.event.location || '');
        const date = dayjs.utc(data.currentTime);
        url = url.replace(
          '[DATES]',
          '&startdt=' +
          date.format(format.dateFormat) +
          '&enddt=' +
          date
            .clone()
            .add(data.event.duration || 0, 'm')
            .format(format.dateFormat)
        );
      }
      break;
    default:
  }
  return url;
}

export function dateToUtc(date: string | Date | Dayjs): string {
  return dayjs(date).clone().utc().format();
}

export type DateTypes = string | Date | Dayjs;

export type DateObject = {
  start: string;
  end?: string;
  time_zone?: string;
}

export function getDateObjectFromUserTimeZone(start: DateTypes, end?: DateTypes) {
  const time_zone = dayjs.tz.guess();

  const dateToTimeZoneIsoString = (date: DateTypes) => {
    const cloned = dayjs(date).clone();
    return cloned.tz(time_zone).format()
  };

  const dateObj: DateObject = {
    start: dateToTimeZoneIsoString(start),
    ...(end ? {
      end: dateToTimeZoneIsoString(end)
    } : {}),
    // time_zone,
  };
  return dateObj;
}

type ThemeFields = {
  color: string;
  bgColor: string;
  title?: string;
  description?: string;
  logo?: string | null;
  antdTheme?: {
    token: { [key: string]: string | number };
  }
};

const colorRegex = /(?:$|^|)(red-|blue-|indigo-|cool-gray-|pink-|yellow-|teal-|gray-|orange-|green-|purple-)(50|100|200|300|400|500|600|700|800|900)(?:$|^|)/gi;
const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

export const themeBuilder = (theme: ThemeFields): ThemeFields => {
  const out = theme;

  // Check the main theme color
  if (
    out.color.replace(/\s/g, "") === ''
    || out.color.search('-') > -1
    || !Object.keys(colors).includes(out.color.trim())
  ) {
    out.color = DEFAULT_BASE_COLOR;
  } else {
    out.color = out.color.trim();
  }

  if (
    out.bgColor.replace(/\s/g, "") === ''
    || out.bgColor.search(colorRegex) === -1
  ) {
    out.bgColor = DEFAULT_BG_COLOR;
  } else {
    out.bgColor = out.bgColor.trim();
  }

  if (
    typeof out.logo !== 'string'
    || out.logo?.search(urlRegex) === -1
  ) {
    out.logo = null;
  } else {
    out.logo = out.logo.trim();
  }

  const colorList = colors as any;
  out.antdTheme = {
    token: {
      colorPrimary: colorList[out.color][600],
      colorLink: colorList[out.color][600],
      colorLinkActive: colorList[out.color][400],
      colorLinkHover: colorList[out.color][500],
      fontFamily: DEFAULT_FONT_TEXT,
      fontSize: 16,
    },
  };

  return out;
}