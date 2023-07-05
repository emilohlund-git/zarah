import { SlackUser } from "@prisma/client";
import { UserRepository } from "../../infrastructure/user.repository";

export class UserService {
  private readonly userRepository: UserRepository;

  constructor(
    userRepository: UserRepository
  ) {
    this.userRepository = userRepository;
  }

  async createOrGet(slackUser: any): Promise<SlackUser> {
    const user = await this.userRepository.findUnique({ where: { slackId: slackUser.id } });

    if (user) return user;

    return await this.userRepository.create({
      data: {
        slackId: slackUser.id,
        is_admin: slackUser.is_admin,
        real_name: slackUser.real_name,
        is_bot: slackUser.is_bot,
        is_owner: slackUser.is_owner
      }
    });
  }

  async findNameBySlackId(slackId: string): Promise<string | undefined> {
    const user = await this.userRepository.findUnique({ where: { slackId }, select: { real_name: true } });

    if (user) return user.real_name;
    return undefined;
  }
}