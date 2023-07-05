import { AllMiddlewareArgs, GenericMessageEvent, SlackEventMiddlewareArgs } from "@slack/bolt";
import { CoinService, NetcoinType, Netcoins } from "./coin.service";
import { ResponseService } from "./response.service";
import { UserService } from "./user.service";

export default class MessageService {
  private readonly coinService: CoinService;
  private readonly userService: UserService;
  private readonly responseService: ResponseService;

  constructor(
    coinService: CoinService,
    userService: UserService,
    responseService: ResponseService,
  ) {
    this.coinService = coinService;
    this.userService = userService;
    this.responseService = responseService;
  }

  public async sendNetcoins(args: SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs<any>) {
    const { message: msg, client, say } = args;
    /* Fixing types */
    const message = msg as GenericMessageEvent;

    if (!message.text) throw Error(`Empty message`);

    const slackUser = await client.users.info({
      user: message.user
    });

    const user = await this.userService.createOrGet(slackUser.user);
    const netcoins = this.extractNetcoins(message.text);
    const receivers = this.extractUserIDs(message.text);
    const coins = this.netcoinsEmojiToDomain(netcoins);

    await Promise.all(
      coins.map(async (coin) => {
        for (const receiver of receivers) {
          await this.coinService.transferNetcoin(user.slackId, receiver, coin, 1);
        }
      })
    );

    const response = await this.responseService.transferCoinResponse(user.slackId, netcoins, receivers.length > 0 ? receivers[0].replace(/[<@>]/g, '') : undefined);

    const postMessagePromises = [];

    // Let user know in chat that a coin has been withdrawn
    postMessagePromises.push(
      client.chat.postMessage({
        channel: 'D05EMA6UW5T',
        mrkdwn: true,
        text: response.toString()
      })
    );

    // Let receivers know in chat that they received coins
    if (receivers.length > 0) {
      postMessagePromises.push(
        receivers.map(async (receiver) => {
          await client.chat.postMessage({
            channel: receiver.replace(/[<@>]/g, ''),
            mrkdwn: true,
            text: `Hello! <@${message.user}> sent you some coins!`
          });
        })
      );
    }

    await Promise.allSettled(postMessagePromises);
  }

  private netcoinsEmojiToDomain(netcoins: string[]): NetcoinType[] {
    return netcoins.map((netcoin) => {
      if (netcoin === Netcoins.NETCOIN_COMPETENT) return 'competent_coins';
      if (netcoin === Netcoins.NETCOIN_ENGAGED) return 'engaged_coins';
      if (netcoin === Netcoins.NETCOIN_INNOVATIVE) return 'innovative_coins';
      return 'competent_coins';
    });
  }

  private extractNetcoins(input: string): string[] {
    const regex = /:(.*?):/g;
    const matches: string[] = input.match(regex) || [];
    return matches;
  }

  private extractUserIDs(input: string): string[] {
    const regex = /<@([^>]+)>/g;
    const matches = input.match(regex);

    if (matches) {
      return matches.map(match => `<@${match.substring(2, match.length - 1)}>`);
    }

    return [];
  }
}