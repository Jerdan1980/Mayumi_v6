const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("primos")
    .setDescription("Calculate number of primos needed")
    .addIntegerOption((option) =>
      option
        .setName("target-primos")
        .setDescription("Target number of primos, use this OR 'target pulls'")
        .setRequired(false)
        .setMinValue(0)
    )
    .addIntegerOption((option) =>
      option
        .setName("target-pulls")
        .setDescription("Target number of pulls, use this OR 'target primos'")
        .setRequired(false)
        .setMinValue(0)
    )
    .addIntegerOption((option) =>
      option
        .setName("primos")
        .setDescription("Current number of primos (default 0)")
        .setRequired(false)
        .setMinValue(0)
    )
    .addIntegerOption((option) =>
      option
        .setName("pulls")
        .setDescription("Current number of pulls (default 0)")
        .setRequired(false)
        .setMinValue(0)
    ),
  async execute(interaction) {
    const primos = interaction.options.getInteger("primos") ?? 0;
    const pulls = interaction.options.getInteger("pulls") ?? 0;
    const target_primos = interaction.options.getInteger("target-primos");
    const target_pulls = interaction.options.getInteger("target-pulls");

    let str = `
        You have:
            ${primos + pulls * 160} primos
            ${primos / 160 + pulls} pulls
`;

    if (target_primos && target_pulls) {
      str +=
        "Please select EITHER 'target primos' OR 'target pulls', not both.";
    } else if (target_primos) {
      str += `You need:
            ${target_primos - (primos + pulls * 160)} primos
            ${(target_primos - (primos + pulls * 160)) / 160} pulls
        `;
    } else if (target_pulls) {
      str += `You need:
            ${(target_pulls - (primos / 160 + pulls)) * 160} primos
            ${target_pulls - (primos / 160 + pulls)} pulls
        `;
    }

    await interaction.reply(str);
  },
};
