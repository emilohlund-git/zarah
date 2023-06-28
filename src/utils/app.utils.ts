import { userTadas } from "../app";

export function extractUserIDs(input: string): string[] {
  const regex = /<@([^>]+)>/g;
  const matches = input.match(regex);

  if (matches) {
    return matches.map(match => `<@${match.substring(2, match.length - 1)}>`);
  }

  return [];
}

export function getTodoMessageResponse(message: { text: string }) {
  const userIds = extractUserIDs(message.text);
  if (userIds.length > 0) {
    return `Hi! You sent a :tada: to ${userIds.join(', ')}.`
  } else {
    return `Hi! You sent a :tada:!`
  }
}

export function saveOrGetUser(userId: string) {
  const existingUser = userTadas.get(userId);

  if (existingUser) {
    existingUser.tadas--;
  } else {
    userTadas.set(userId, {
      tadas: 5,
      user: userId
    })
  }
}