import getConfig from 'next/config';
import { Service } from 'typedi';

@Service()
export class ConfigService {
  private config;
  constructor() {
    this.config = getConfig();
  }

  public get(key: string) {
    if (this.config[key]) {
      return this.config[key];
    }
    return null;
  }
}
