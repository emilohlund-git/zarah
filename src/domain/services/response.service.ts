import openai from "../../configurations/openai.config";
import { UserService } from "./user.service";

export class ResponseService {
  private readonly userService: UserService;

  constructor(
    userService: UserService
  ) {
    this.userService = userService;
  }

  public async transferCoinResponse(sender: string, coin: string[], receiver?: string) {
    const senderName = await this.userService.findNameBySlackId(sender);
    let receiverName = undefined;

    if (receiver) {
      receiverName = await this.userService.findNameBySlackId(receiver);
    }

    const prompt = `You are an AI assistant named Zarah. The User ${senderName} just sent 1 Netcoin to the user ${receiverName}. Define a proper chat response to this action.`;

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.9,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.6,
        stop: [" Human:", " AI:"],
      });

      return response;
    } catch (error) {
      console.error(`Failed to create GPT response: ${error}`);
      return `You sent ${coin.map((c) => `1 ${c}`).join(", ")} to <@${receiver}>`
    }
  }
}