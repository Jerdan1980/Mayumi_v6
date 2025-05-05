const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('end-of-session')
    .setDescription('End of session options.'),
  async execute(interaction) {
    await interaction.reply(msg)
  },
}

const msg = `
## END OF SESSION
At the end of every session, choose one:
- **Grow closer to the team.** Explain who made you feel welcome; give Influence to that character and clear a condition or mark potential.
- **Grow into your own image of yourself.** Explain how you see yourself and why; shift one Label up and another down.
- **Grow away from the team.** Explain why you feel detached. Take Influence over you away from another character.
`
