import axios from 'axios';

import { NotifierService } from './notifier-service.js';
import logger from '../common/logger.js';

import type { SlackConfig } from '../common/config/index.js';
import type { NotificationReason } from '../interfaces/notification-reason.js';

export class SlackNotifier extends NotifierService {
  private config: SlackConfig;

  constructor(config: SlackConfig) {
    super();
    this.config = config;
  }

  async sendNotification(account: string, reason: NotificationReason, url: string): Promise<void> {
    const L = logger.child({ user: account, reason });
    L.trace('Sending Slack notification');

    try {
      await axios.post(
        this.config.webhookUrl,
        {
          text: `epicgames-freegames-node needs an action performed. \nReason: ${reason} \nAccount: ${account} \nURL: ${url}`,
        },
        {
          responseType: 'text',
        },
      );
    } catch (err) {
      L.error(err);
      L.error(
        { SlackConfig: this.config },
        'Error sending Slack message. Please check your configuration',
      );
      throw err;
    }
  }
}
