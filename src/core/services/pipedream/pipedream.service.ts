/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service } from "typedi";

import { ConfigService } from './../../config/config.service';

@Service()
export class PipeDreamService {
  private hooks = new Map();

  constructor(private configService: ConfigService) {
    this.init();
  }

  private init() {
    const automations = this.configService.get('automations');
    if (Object.keys(automations).length > 0) {
      Object.keys(automations).forEach((key: string) => {
        this.register(key, automations[key])
      });
    }
  }

  /**
   * 
   * @param key The key patter should be like: bookings:after-create 
   * @param target Must a pipedream webhook url
   *  
   */
  public register(key: string, target: string) {
    const hook = this.hooks.get(key);

    // If the hook is already registered update the value with the new target url
    if (hook) {
      this.hooks.set(key, [...hook, target]);
    }
    // If doesn't exist then create an array inside the hook key value
    this.hooks.set(key, [target]);
  }

  public run(key: string, payload: any): void {
    this.handleRequest(key, payload);
  }

  private async handleRequest(key: string, payload: any): Promise<void> {
    const targets = this.hooks.get(key);
    const results: boolean[] = [];

    if (Array.isArray(targets) && targets.length > 0) {
      for (let i = 0; i < targets.length; i++) {
        const target = targets[i];

        const data = JSON.stringify(payload);

        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": data.length.toString(),
          },
          body: data
        };
        try {
          const response = await fetch(target, options);
          if (response.status === 200) {
            results.push(true);
          }
        } catch (err) {
          results.push(false);
        }
      }
    }
  }

}