const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear-conditions')
    .setDescription('Information on how to clear conditions.'),
  async execute(interaction) {
    await interaction.reply(msg)
  },
}

const msg = `
## CLEARING CONDITIONS
You can always clear a condition by taking a certain action. At the end of any scene in which you take the corresponding action, clear that condition.
- **To clear Angry**, hurt someone or break something important.
- **To clear Afraid**, run from something difficult.
- **To clear Guilty**, make a sacrifice to absolve your guilt.
- **To clear Hopeless**, fling yourself into easy relief.
- **To clear Insecure**, take foolhardy action without talking to your team.
You can also clear a condition when someone else comforts or supports you, or when you defend someone.
`
