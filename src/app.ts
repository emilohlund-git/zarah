import { App, LogLevel } from '@slack/bolt';
import { getTodoMessageResponse, saveOrGetUser } from './utils/app.utils';
import './utils/env';

interface User {
  tadas: number;
  user: string;
}

export let userTadas = new Map<string, User>();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG
});

app.message('hello', async ({ event, say }) => {
  try {
    await say(`Hello, ${event.channel}`)
  } catch (error) {
    console.error(error);
  }
})

app.message(':tada:', async (args) => {
  const { message, client } = args;

  /* @ts-ignore */
  const userId = message.user as string;

  const existingUser = userTadas.get(userId);

  if (existingUser) {
    existingUser.tadas--;
  } else {
    userTadas.set(userId, {
      tadas: 4,
      user: userId
    })
  }

  try {
    const result = await client.chat.postMessage({
      channel: 'D05EMA6UW5T',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            /* @ts-ignore */
            text: getTodoMessageResponse(message)
          },
        },
        {
          type: 'divider'
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `You got ${userTadas.get(userId)?.tadas} :tada: left to spend today.`
          }
        }
      ]
    });
    result.message?.user
  } catch (error) {
    console.error(error);
  }
});

app.event('app_home_opened', async ({ client, event, body }) => {
  try {
    const result = await client.views.publish({
      user_id: event.user,
      view: {
        type: 'home',
        callback_id: 'home_view',
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Welcome to Zarah's home! :tada:"
            },
          },
          {
            type: "divider"
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Send :tada:'s to people."
            }
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Click me!"
                }
              }
            ]
          }
        ]
      }
    });
  } catch (error) {
    console.error(error);
  }
});

app.command("/tadas", async ({ command, ack, say, payload }) => {
  saveOrGetUser(payload.user_id);

  try {
    await ack();
    say(`You have ${userTadas.get(payload.user_id)?.tadas} :tada: left!`);
  } catch (error) {
    console.log("err")
    console.error(error);
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
