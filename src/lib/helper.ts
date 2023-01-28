/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs, { Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc)
dayjs.extend(timezone)

type OpenGraphType = {
  siteName: string;
  description: string;
  templateTitle?: string;
  logo?: string;
};
// !STARTERCONF This OG is generated from https://github.com/theodorusclarence/og
// Please clone them and self-host if your site is going to be visited by many people.
// Then change the url and the default logo.
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