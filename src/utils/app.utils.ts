import { App, ExpressReceiver, LogLevel } from '@slack/bolt';
import './env';

export const createApp = (appName: string) => {
  const signingSecret = process.env.SLACK_SIGNING_SECRET!;
  const token = process.env.SLACK_BOT_TOKEN;

  const receiver = new ExpressReceiver({
    signingSecret,
    endpoints: {
      events: `/${appName}/slack/events`,
    },
  });

  const app = new App({
    token,
    receiver,
    signingSecret,
    appToken: process.env.SLACK_APP_TOKEN,
    logLevel: LogLevel.DEBUG,
  });

  return { app, receiver };
};