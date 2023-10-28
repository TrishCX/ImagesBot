import { ActivityType } from "discord.js";
import { Event } from "../structures/Event";

export default new Event("ready", (client) => {
  client.user.setActivity({
    name: "Fetching images...",
    type: ActivityType.Streaming,
  });
  console.log(`The bot is now online`);
});
