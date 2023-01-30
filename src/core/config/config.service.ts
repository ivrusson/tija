import getConfig from 'next/config';
import { Service } from 'typedi';

@Service()
export class ConfigService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private config: any;
  constructor() {
    const { serverRuntimeConfig } = getConfig() || {};
    this.config = {
      ...(serverRuntimeConfig?.notionConfig || {}),
      ...(serverRuntimeConfig?.tijaConfig || {}),
    };
  }

  public get(key: string) {
    if (this.config[key]) {
      return this.config[key];
    }
    return null;
  }
}
