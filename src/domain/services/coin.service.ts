import { UserRepository } from "../../infrastructure/user.repository";

export type NetcoinType = 'competent_coins' | 'engaged_coins' | 'innovative_coins';

export enum Netcoins {
  NETCOIN_ENGAGED = ':netcoin-engaged:',
  NETCOIN_COMPETENT = ':netcoin-competent:',
  NETCOIN_INNOVATIVE = ':netcoin-innovative:'
}

export class CoinService {
  private readonly userRepository: UserRepository;

  constructor(
    userRepository: UserRepository
  ) {
    this.userRepository = userRepository;
  }

  private async getCoinsByType(slackId: string, coinType: NetcoinType): Promise<number> {
    const user = await this.userRepository.findUnique({ where: { slackId } });

    if (user) {
      return user[coinType];
    } else {
      return 0;
    }
  }

  private async incrementUsersNetcoin(slackId: string, coinType: NetcoinType, amount: number) {
    return await this.userRepository.update({
      where: { slackId },
      data: {
        [coinType]: {
          increment: 1
        }
      }
    })
  }

  private async decrementUsersNetcoin(slackId: string, coinType: NetcoinType, amount: number) {
    return this.userRepository.update({
      where: { slackId },
      data: {
        [coinType]: {
          decrement: 1
        }
      }
    })
  }

  public async transferNetcoin(slackIdFrom: string, slackIdTo: string, coinType: NetcoinType, amount: number) {
    const coins = await this.getCoinsByType(slackIdFrom, coinType);

    if (coins > 0) {
      await this.decrementUsersNetcoin(slackIdFrom, coinType, amount);
      await this.incrementUsersNetcoin(slackIdTo, coinType, amount);
    }
  }
}