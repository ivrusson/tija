/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useReducer } from 'react';

import { getCalendar } from '@/lib/api';

import { SchedulerItem } from '../core/providers/scheduler/scheduler.service';

enum CalendarActionEnum {
  LOADING = 'LOADING',

  UPDATE_CALENDAR = 'UPDATE_CALENDAR',
  UPDATE_DATE = 'UPDATE_DATE',
  UPDATE_TIME = 'UPDATE_TIME',
}

export interface CalendarState {
  loading: boolean;
  startDate: string;
  endDate: string;
  currentDate: Dayjs;
  currentTime: Dayjs | null;
  dates: SchedulerItem[];
  times: string[];
}

interface CalendarUpdatePayload {
  dates?: SchedulerItem[];
  times?: string[];
}

interface CalendarDatePayload {
  date: Dayjs;
}

interface CalendarTimePayload {
  time: Dayjs;
}

type CalendarAction =
  | { type: CalendarActionEnum.LOADING; payload: boolean }
  | { type: CalendarActionEnum.UPDATE_CALENDAR; payload: CalendarUpdatePayload }
  | { type: CalendarActionEnum.UPDATE_DATE; payload: CalendarDatePayload }
  | { type: CalendarActionEnum.UPDATE_TIME; payload: CalendarTimePayload };

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DAYS_TO_FETCH = 15;

const calendarReducer = (state: CalendarState, action: CalendarAction) => {
  switch (action.type) {
    case CalendarActionEnum.LOADING: {
      const loading = action.payload;
      return {
        ...state,
        loading,
      };
    }
    case CalendarActionEnum.UPDATE_CALENDAR: {
      const { dates, times } = action.payload;
      return {
        ...state,
        dates: dates ? dates : state.dates,
        times: times ? times : state.times,
      };
    }
    case CalendarActionEnum.UPDATE_DATE: {
      const date = action.payload.date;
      return {
        ...state,
        startDate: date.format(DATE_FORMAT),
        endDate: date.endOf('month').format(DATE_FORMAT),
        currentDate: date,
        currentTime: null,
      };
    }
    case CalendarActionEnum.UPDATE_TIME: {
      const time = action.payload.time;
      return {
        ...state,
        currentTime: time,
      };
    }
    default:
      return state;
  }
};

const initialState: CalendarState = {
  loading: false,
  startDate: dayjs().format(DATE_FORMAT),
  endDate: dayjs().endOf('month').format(DATE_FORMAT),
  currentDate: dayjs(),
  currentTime: null,
  dates: [],
  times: [],
};

const timesFromDate = (date: Dayjs, dates: SchedulerItem[] = []) => {
  let times: string[] = [];
  if (dates) {
    const day = dates.find((d: any) => d.date === date.format(DATE_FORMAT));
    if (day) {
      times = day.times;
    }
  }
  return times;
};

export const useCalendar = (csrfToken: string) => {
  const [state, dispatch] = useReducer(calendarReducer, initialState);

  useEffect(() => {
    dispatch({
      type: CalendarActionEnum.LOADING,
      payload: true,
    });
    getCalendar(
      {
        startDate: state.startDate,
        endDate: state.endDate,
      },
      {
        csrfToken,
      }
    ).then(({ dates }) => {
      dispatch({
        type: CalendarActionEnum.UPDATE_CALENDAR,
        payload: { dates },
      });

      dispatch({
        type: CalendarActionEnum.LOADING,
        payload: false,
      });
    });
  }, []);

  useEffect(() => {
    const { dates, currentDate } = state;
    const times = timesFromDate(currentDate, dates);
    dispatch({
      type: CalendarActionEnum.UPDATE_CALENDAR,
      payload: { times },
    });
  }, [state.dates, state.currentDate]);

  const updateDate = async (date: Dayjs) => {
    const { dates } = state;
    dispatch({
      type: CalendarActionEnum.UPDATE_DATE,
      payload: { date },
    });

    const datesArray = dates.map(({ date }) => date);
    if (!datesArray.includes(date.format(DATE_FORMAT))) {
      dispatch({
        type: CalendarActionEnum.LOADING,
        payload: true,
      });
      const { dates } = await getCalendar(
        {
          startDate: date.format(DATE_FORMAT),
          endDate: date.endOf('month').format(DATE_FORMAT),
        },
        { csrfToken }
      );

      dispatch({
        type: CalendarActionEnum.UPDATE_CALENDAR,
        payload: { dates },
      });

      dispatch({
        type: CalendarActionEnum.LOADING,
        payload: false,
      });
    }
  };

  const updateTime = async (time: Dayjs) => {
    dispatch({
      type: CalendarActionEnum.UPDATE_TIME,
      payload: { time },
    });
  };

  return {
    ...state,
    updateDate,
    updateTime,
  };
};
