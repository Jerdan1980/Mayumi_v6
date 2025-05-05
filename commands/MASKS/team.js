const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('team')
    .setDescription('Details on team mechanics.'),
  async execute(interaction) {
    await interaction.reply(msg)
  },
}

const msg = `
## TEAM MECHANICS
When you **enter battle against a dangerous foe as a team**, add two to the Team pool.
- If the leader has Influence over every teammate, add another Team.
- If everyone has the same purpose in the fight, add another Team.
- If any team member mistrusts the leader or the team, remove a Team.
- If your team is ill-prepared or off-balance, remove a Team.

The leader of the team can mark a condition to avoid removing a Team from the pool.

Anyone working with the team can spend Team one-for-one to help a teammate; give them +1 to their roll.

Team members can also spend Team to act selfishly. When you act selfishly, say how your actions ignore or insult your teammates, remove one Team from the pool, and shift one Label up and one Label down, your chose. You can use this option after rolling to alter the Label you're rolling with.

Whenever time passes, the GM will empty the Team pool and restore it to one Team.
`
