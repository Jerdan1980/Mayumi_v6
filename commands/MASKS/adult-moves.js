const { SlashCommandBuilder } = require('discord.js')

const subcommands = [
  {
    cmd: 'wield-powers',
    desc: 'Description for when you wield your powers.',
    msg: `
## WIELD YOUR POWERS
When you **wield your powers** with precision or grace, roll + Freak. On a hit, choose one. On a 10+, choose two.
- take hold of something vulnerable to you
- create something useful from your environment
- neutralize an opponent or threat, at least for now
`,
  },
  {
    cmd: 'overwhelm-vulnerable-foe',
    desc: 'Description for when you overwhelm a vulnerable foe.',
    msg: `
## OVERWHELM A VULNERABLE FOE
WHen you **overwhelm a vulnerable foe**, roll + Danger. On a hit, the fight's over. They're done. On a 10+, choose one. On a 7-9, choose two.
- you take a powerful blow in turn
- you hurt your foe more than you intended
- you cause serious collateral damage
`,
  },
  {
    cmd: 'persuade-best-interests',
    desc: 'Description for when you persuade with best interests.',
    msg: `
## PERSuADE WITH BEST INTERESTS
When you **persuade someone with their best interests**, roll + Superior. If they're an NPC, on a 10+, they buy it and act accordingly. On a 7-9, they need concerete assurance, right now.
  If they're a PC, on a hit, they can mark potential or shift their own Labels if they do what you want. On a 10+, take Influence over them as well.
`,
  },
  {
    cmd: 'emphathize',
    desc: 'Description for when you emphathize.',
    msg: `
## EMPHATHIZE
When you open emphathize with someone, roll + Mundane. On a hit, they must reveal a vulnerability or mark a condition. On a 10+, take Influence over them as well.
`,
  },
  {
    cmd: 'stand-up',
    desc: 'Description for when you stand up for something.',
    msg: `
## STAND UP FOR SOMETHING
When you **stand up for something**, roll + Savior. On a 10+, choose two. On a 7-9, choose one.
- listeners can't keep doing what they're doing
- listeners can't flee without addressing you
- listeners can't attack you without losing status or position
`,
  },
]

function createCommand() {
  let commands = new SlashCommandBuilder()
    .setName('adult')
    .setDescription('All adult moves.')

  for (const sub of subcommands) {
    commands.addSubcommand((subcommand) =>
      subcommand.setName(sub.cmd).setDescription(sub.desc),
    )
  }

  console.log(commands.subcommands)

  return commands
}

module.exports = {
  data: createCommand(),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand()

    await interaction.reply(
      subcommands.find(({ cmd }) => cmd === subcommand)?.msg ??
        'Subcommand not found',
    )
  },
}
