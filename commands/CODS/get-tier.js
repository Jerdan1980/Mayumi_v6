const { SlashCommandBuilder } = require('@discordjs/builders');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = '../../gapi-token.json';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get-tier')
		.setDescription('Returns your current CODS tier!'),
	async execute(interaction) {
		const auth = new google.auth.GoogleAuth({
			keyFile: 'gapi-token.json',
			scopes: SCOPES,
		});
		google.options({auth: auth});

		const sheets = google.sheets({version: 'v4'});
		sheets.spreadsheets.values.get({
			spreadsheetId: '1ps4XIdwJGIEhmiSOQ-4US781NZlBlMZIr8WEAfR9KK4',
			range: 'Tier List!A2:D',
		}, async function (err, res) {
			if (err) {
				await interaction.reply("Something went wrong!");
				return console.log('The API returned an error: ' + err);
			}
			const uid = interaction.member.user.id;
			const row = res.data.values.findIndex(row => row[3] == uid);
			if (row != -1) {
				// send the user data
				const data = res.data.values[row];
				await interaction.reply(`Your tier is: **${data[1]}**\nYour decay status is: \`${data[2] ?? 'N/A'}\``);

				// check if their username has chaned and update that
				const name = `${interaction.member.user.username}#${interaction.member.user.discriminator}`
				if (data[0] !== name) {
					// update their name in the tier list
					sheets.spreadsheets.values.update({
						spreadsheetId: '1ps4XIdwJGIEhmiSOQ-4US781NZlBlMZIr8WEAfR9KK4',
						range: `Tier List!A${row + 2}`, // zero-indexed + header row
						valueInputOption: 'RAW',
						requestBody: {values: [[name]]},
						//includeValuesInResponse: true,
					}, (err, res) => {
						if (err) {
							console.log(err);
						} else {
							console.log(`Name changed: ${data[0]} => ${name}.`)
						}
					});

					// report that their name changed
					sheets.spreadsheets.values.append({
						spreadsheetId: '1ps4XIdwJGIEhmiSOQ-4US781NZlBlMZIr8WEAfR9KK4',
						range: `Name History!A:C`,
						valueInputOption: 'USER_ENTERED',
						requestBody: {values: [[data[0], name, (new Date()).toDateString()]]},
					})
				}
			} else {
				await interaction.reply("Could not find your tier. Consider signing up?")
			}
		});
	},
};