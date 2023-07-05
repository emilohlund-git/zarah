import { App, LogLevel } from '@slack/bolt';
import { CoinService } from './domain/services/coin.service';
import MessageService from './domain/services/message.service';
import { ResponseService } from './domain/services/response.service';
import { UserService } from './domain/services/user.service';
import { UserRepository } from './infrastructure/user.repository';
import { appHomeOpenedHandler } from './services/event.service';
import './utils/env';

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG
});

const userRepository = new UserRepository();
const coinService = new CoinService(userRepository);
const userService = new UserService(userRepository);
const responseService = new ResponseService(userService);
const messageService = new MessageService(coinService, userService, responseService);

(async () => {
  const regexPattern: RegExp = /:\bnetcoin-(engaged|innovative|competent)\b:/;

  app.message(regexPattern, async (args) => {
    await messageService.sendNetcoins(args);
  });

  app.event('app_home_opened', appHomeOpenedHandler);

  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
