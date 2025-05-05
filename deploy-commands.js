require('dotenv').config()
const fs = require('node:fs')
const { Routes } = require('discord.js')
const { REST } = require('@discordjs/rest')

function AddCommands(folder, array) {
  console.log(`Adding ${folder} commands!`)
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith('.js'))
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`)
    array.push(command.data.toJSON())
    if (process.argv[2] === 'dev') EasyModoCommands.push(command.data.toJSON())
  }
}

const CODSCommands = []
const EasyModoCommands = []
const MASKSCommands = []

console.log(`Adding general commands!`)
const CommonCommandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'))
for (const file of CommonCommandFiles) {
  const command = require(`./commands/${file}`)
  CODSCommands.push(command.data.toJSON())
  EasyModoCommands.push(command.data.toJSON())
}

console.log(`Adding Easy Modo commands!`)
const EasyModoCommandFiles = fs
  .readdirSync('./commands/EasyModo')
  .filter((file) => file.endsWith('.js'))
for (const file of EasyModoCommandFiles) {
  const command = require(`./commands/EasyModo/${file}`)
  EasyModoCommands.push(command.data.toJSON())
}

AddCommands('CODS', CODSCommands)
AddCommands('MASKS', MASKSCommands)

//console.log('CODS: ', CODSCommands)
//console.log();
//console.log('EasyModo: ', EasyModoCommands);
//console.log();
//console.log('MASKS: ', MASKSCommands)

const rest = new REST({ version: '10' }).setToken(process.env.discordToken)

if (process.argv[2] !== 'dev') {
  rest
    .put(
      Routes.applicationGuildCommands(process.env.clientID, process.env.CODSID),
      { body: CODSCommands },
    )
    .then(() =>
      console.log('Successfully registered application commands to CODS.'),
    )
    .catch((error) => {
      console.error(error)
    })

  rest
    .put(
      Routes.applicationGuildCommands(
        process.env.clientID,
        process.env.MASKSID,
      ),
      { body: MASKSCommands },
    )
    .then(() =>
      console.log(
        'Successfully registered application commands to Starboard Stars.',
      ),
    )
    .catch((error) => {
      console.error(error)
    })
}

rest
  .put(
    Routes.applicationGuildCommands(
      process.env.clientID,
      process.env.EasyModoID,
    ),
    { body: EasyModoCommands },
  )
  .then(() =>
    console.log('Successfully registered application commands to EasyModo.'),
  )
  .catch((error) => {
    console.error(error)
  })
