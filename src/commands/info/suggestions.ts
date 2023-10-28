import { ApplicationCommandOptionType, Embed, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import pinterest from "pinterest.js";
import { pagination, ButtonStyles, ButtonTypes } from "../../utilities/index";

export default new Command({
  name: "get",
  description: "Get suggestion for a pin.",
  options: [
    {
      name: "suggestions",
      description: "Get more suggestions!",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "id",
          description: "Specify the pin id to get more related pins.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },

        {
          name: "bookmark",
          description:
            "Specify a bookmark in order to get more suggestions (Optional)",
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
  run: async ({ interaction }) => {
    const id: string = interaction.options.get("id").value?.toString();
    const bookmark: string | undefined =
      interaction.options.get("bookmark")?.value?.toString() || undefined;
    const ephemeral = interaction.options.get("ephemeral")?.value;
    const data = await pinterest.suggestions(id, bookmark);
    const embeds: Embed[] = [];

    const filteredArray = data.response.filter(
      (v) => v.imageURL !== "undefined"
    );

    for (const response of filteredArray) {
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
