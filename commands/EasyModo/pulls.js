const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pulls")
    .setDescription("Calculate amount of currency needed")
    .addIntegerOption((option) =>
      option
        .setName("currency")
        .setDescription("Current amount of currency (default 0)")
        .setRequired(false)
        .setMinValue(0)
    )
    .addIntegerOption((option) =>
      option
        .setName("pulls")
        .setDescription("Current number of pulls (default 0)")
        .setRequired(false)
        .setMinValue(0)
    )
    .addIntegerOption((option) =>
      option
        .setName("cost")
        .setDescription("Currency cost for a single pull (default 160)")
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
    .addBooleanOption((option) =>
      option.setName("guaranteed").setDescription("WIP").setRequired(false)
    ),
  async execute(interaction) {
    const currency = interaction.options.getInteger("currency") ?? 0;
    const pulls = interaction.options.getInteger("pulls") ?? 0;
    const cost = interaction.options.getInteger("cost") ?? 160;
    const target_pulls = interaction.options.getInteger("target-pulls");

    let str = `**You have:**
- ${currency} currency
- ${pulls} pulls

This totals to: _${currency / cost + pulls} pulls_
`;

    if (target_pulls) {
      str += `Your goal is: _${target_pulls} pulls_

**You need:**
- ${(target_pulls - pulls) * cost} total currency (accounting for current pulls)
- ${Math.ceil((target_pulls - (currency / cost + pulls)) * cost)} more currency
- ${Math.ceil(target_pulls - (currency / cost + pulls))} pulls
  `;
    }

    await interaction.reply(str);
  },
};
