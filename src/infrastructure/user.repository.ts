import { Prisma, SlackUser } from "@prisma/client";
import prisma from "../configurations/prisma.config";
import { Repository } from "../domain/interfaces/repository.interface";

export class UserRepository implements Repository<SlackUser> {
  constructor() { }

  async create(createArgs: Prisma.SlackUserCreateArgs): Promise<SlackUser> {
    return await prisma.slackUser.create(createArgs);
  }

  async upsert(upsertArgs: Prisma.SlackUserUpsertArgs): Promise<SlackUser> {
    return await prisma.slackUser.upsert(upsertArgs);
  }

  async update(updateArgs: Prisma.SlackUserUpdateArgs): Promise<SlackUser> {
    return await prisma.slackUser.update(updateArgs);
  }

  async delete(deleteArgs: Prisma.SlackUserDeleteArgs): Promise<SlackUser> {
    return await prisma.slackUser.delete(deleteArgs);
  }

  async findUnique(findUniqueArgs: Prisma.SlackUserFindUniqueArgs): Promise<SlackUser | undefined> {
    const result = await prisma.slackUser.findUnique(findUniqueArgs);

    if (result) return result;
    return undefined;
  }

  async findMany(findManyArgs: Prisma.SlackUserFindManyArgs): Promise<SlackUser[]> {
    return await prisma.slackUser.findMany(findManyArgs);
  }
}