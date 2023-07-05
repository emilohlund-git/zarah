import { AllMiddlewareArgs, SlackEventMiddlewareArgs } from "@slack/bolt";

const appHomeOpenedHandler = async (args: SlackEventMiddlewareArgs<"app_home_opened"> & AllMiddlewareArgs<any>) => {
  const { event, client } = args;

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
};

export { appHomeOpenedHandler };

