/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import { createHandler } from 'next-api-decorators';
import Container from 'typedi';
import 'reflect-metadata';

import { CalendarController } from '@/core/modules/calendar/calendar.controller';
import { CalendarService } from '@/core/modules/calendar/calendar.service';
import { EventController } from '@/core/modules/events/event.controller';
import { EventService } from '@/core/modules/events/event.service';

export interface IProvider {
  name: string;
  controller: any;
  service: any;
}

export class TijaModule {
  private static instance: TijaModule;
  private pMap = new Map<string, any>();
  constructor(providers: IProvider[]) {
    providers.forEach((provider) => this.pMap.set(provider.name, provider));
  }

  public static getInstance(providers: IProvider[]): TijaModule {
    if (!TijaModule.instance) {
      TijaModule.instance = new TijaModule(providers);
    }

    return TijaModule.instance;
  }

  public router() {
    return (req: NextApiRequest, res: NextApiResponse) => {
      const { params = [] } = req.query;
      const mod = this.pMap.get(params[0]);
      if (mod) {
        return createHandler(mod.controller)(req, res);
      }
      res.status(404).json({ message: 'Not found' });
    };
  }

  public service() {
    return (name: string) => {
      const mod = this.pMap.get(name);
      if (mod) {
        return mod.service;
      }
      return null;
    };
  }
}

const tijaModule = TijaModule.getInstance([
  {
    name: 'events',
    controller: EventController,
    service: Container.get(EventService),
  },
  {
    name: 'calendar',
    controller: CalendarController,
    service: Container.get(CalendarService),
  },
]);

export const tijaRouter = tijaModule.router();
export const tijaService = tijaModule.service();
