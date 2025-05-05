const { SlashCommandBuilder } = require('discord.js')

const subcommands = [
  {
    cmd: 'engage-a-threat',
    desc: 'Description for when you directly engage a threat.',
    msg: `
## DIRECTLY ENGAGE A THREAT
When you **directly enagage a threat**, roll + Danger.
On a hit, trade blows. On a 10+, pick two. on a 7-9, pick one.
- resist or avoid their blows
- take something from them
- create an opportunity for your allies
- impress, suprise, or frighten the opposition
`,
  },
  {
    cmd: 'unleash-powers',
    desc: 'Description for when you unleash your powers.',
    msg: `
## UNLEASH YOUR POWERS
When you **unleash your powers** to overcome an obstacle, reshape your environment, or extend your senses, roll + Freak. On a hit, you do it. On a 7-9, mark a condition or the GM will tell you how the effect is unstable or temporary.
`,
  },
  {
    cmd: 'comfort-support',
    desc: 'Description for when you comfort or support.',
    msg: `
## COMFORT OR SUPPORT
When you **comfort or support someone**, roll + Mundane. On a hit, they hear you: they mark potential, clear a condition, or shift Labeles if htey open up to you. On a 10+, you can also add a Team to the pool or clear a condition yourself.
`,
  },
  {
    cmd: 'pierce-mask',
    desc: 'Description for when you pierce the mask.',
    msg: `
## PIERCE THE MASK
When you **pierce someone's mask** to see the person beneath, roll + Mundane. On a 10+, ask three. On a 7-9, ask one.
- what are you really planning?
- what do you want me to do?
- what do you intend to do?
- how could I get yoru character to \_\_\_\_\_?
- how could I gain Influence over you?
`,
  },
  {
    cmd: 'defend',
    desc: 'Description for when you defend.',
    msg: `
## DEFEND
When you **defend someone or something** from an immediate threat, roll + Savior. For NPC threats: on a hit, you keep them safe and choose one. On a 7-9, it costs you: expose yourself to danger or escalate the situation.
- add a Team to the pool
- take Influence over someone you protect
- clear a condition
For PC threats: on a hit, give them -2 to their roll. On a 7-9, you expose yourself to cost, retribution, or judgement.
`,
  },
  {
    cmd: 'assess-situation',
    desc: 'Description for when you assess the situation.',
    msg: `
## ASSESS THE SITUATION
When you **assess the situation**, roll + Superior. On a 10+, ask two. On a 7-9, ask one. Take +1 while acting on the answers.
- what here can I use to \_\_\_\_\_\_\_\_\_\_?
- what here is the biggest threat?
- what here is in the greatest danger?
- who here is most vulnerable to me?
- how can we best end this quickly?
`,
  },
  {
    cmd: 'provoke-someone',
    desc: 'Description for when you provoke someone.',
    msg: `
## PROVOKE SOMEONE
When you **provoke someone** susceptible to your words, say what you're trying to get them to do and roll + Superior. FOr NPCs: on a 10+, they rise to the bait and do what you want. On a 7-9, they can instead choose one.
- they stumble: you take +1 forward against them
- they err: you gain a critical opportunity
- they overreact: you gain Influence over them
For PCs: On a 10+, both. On a 7-9, choose one.
- if they do it, add a Team to the pool
- if they don't do it, they mark a condition
`,
  },
  {
    cmd: 'powerful-blow',
    desc: 'Description for when you take a powerful blow.',
    msg: `
## TAKE A POWERFUL BLOW
When you **take a powerful blow**, roll + conditions marked. On a 10+, choose  one.
- you must remove yourself from the situation: flee, pass out, etc.
- you lose control of yourself or your powers in a terrible way
- two options from the 7-9 list
On a 7-9, choose one.
- you lash out verbally: provoke a teammate to foolhardy action or take advantage of your Influence to inflict a conditoin
- you give ground; your opposition gets an opportunity
- you struggle past hte pain; mark two conditions
On a miss, you stand strong. Mark potential as normal, and say how you weather the blow.
`,
  },
]

function createCommand() {
  let commands = new SlashCommandBuilder()
    .setName('basic')
    .setDescription('All basic moves.')

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
