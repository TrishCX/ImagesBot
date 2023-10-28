import { ApplicationCommandOptionType, EmbedBuilder, Embed } from "discord.js";
import { Command } from "../../structures/Command";
import pinterest, { ISearch, SearchResults } from "pinterest.js";
import {
  pagination,
  ButtonStyles,
  ButtonsTypes,
  ButtonTypes,
} from "../../utilities/index";

export default new Command({
  name: "fetch",
  description: "A slash command ",
  options: [
    {
      name: "images",
      description: "Start fetching images!",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "query",
          description: "Let's start by specifying a query.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "bookmark",
          description: "A book allows you to fetch more results for the query.",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
        {
          name: "ephemeral",
          description: "Do you want to see this interaction by yourself only?",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
      ],
    },
  ],
  run: async ({ client, interaction }) => {
    const embeds: Embed[] = [];
    const query: string = interaction.options.get("query")?.value?.toString();
    const bookmark: string | undefined =
      interaction.options.get("bookmark")?.value?.toString() || undefined;
    const ephemeral = interaction.options.get("ephemeral")?.value;
    const data = await pinterest.pins(query, bookmark);
    for (const response of data.response) {
      const embed = new EmbedBuilder()
        .setImage(response.imageURL)
        .setFooter({
          text: `Requested by ${interaction.member.user.displayName} | ID: ${response.id}`,
          iconURL: interaction.member.user.displayAvatarURL(),
        })
        .setDescription(
          `**Username:** ${response.pinner.username}\n**Fullname:** ${response.pinner.fullName}\n**ID:** ${response?.pinner.id}`
        )
        .setAuthor({
          name: interaction.member.user.displayName,
          iconURL: interaction.member.user.displayAvatarURL(),
          url: interaction.member.user.displayAvatarURL(),
        })
        .setTitle("Pinterest ∙ 📍")
        .setURL(response.imageURL)
        .setThumbnail(
          "https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png"
        )
        .setColor("Red");
      embeds.push(embed as any);
    }

    await pagination({
      interaction: interaction,
      embeds: embeds,
      content: `**Bookmark:** ${data.bookmark}`,
      author: interaction.member.user,
      time: 40000,
      fastSkip: true,
      ephemeral: ephemeral as boolean,
      disableButtons: true,
      pageTravel: false,
      buttons: [
        {
          type: ButtonTypes.previous,

          style: ButtonStyles.Secondary,
          emoji: "⏪",
        },

        {
          type: ButtonTypes.next,

          style: ButtonStyles.Secondary,
          emoji: "⏩",
        },
      ],
    });
  },
});
