import { client } from "../..";
import { Command } from "../../structures/Command";

export default new Command({
  name: "ping",
  description: "replies with pong",
  run: async ({ interaction }) => {
    return interaction.reply({
      content: `Pong! ${client.ws.ping} ms`,
      ephemeral: true,
    });
  },
});
