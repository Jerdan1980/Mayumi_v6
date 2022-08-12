const { SlashCommandBuilder } = require('@discordjs/builders');
const { google } = require('googleapis');

const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
//const TOKEN_PATH = '../../gapi-token.json';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tier')
		.setDescription('Returns your CODS competition tier!'),
	async execute(interaction) {
		const auth = new google.auth.GoogleAuth({
			keyFile: 'gapi-token.json',
			scopes: scopes,
		});
		google.options({auth: auth});

		const sheets = google.sheets({version: 'v4'});
		sheets.spreadsheets.values.get({
			spreadsheetId: process.env.currDirectory,
			range: 'Directory 2022-23!A:E',
		}, async function (err, res) {
			// check if API failed
			if (err) {
				await interaction.reply({
					content: "Something went wrong!", 
					ephemeral: true
				});
				return console.log('The API returned an error: ' + err);
			}

			// find a matching uid in the E column
			const uid = interaction.member.user.id;
			const row = res.data.values.findIndex(row => row[4] == uid);

			// if none was found, state so
			if (row == -1) {
				await interaction.reply({
					content: "Could not find your tier. Have you signed up for this years competitions?",
					ephemeral: true
				});
				return;
			}

			// else send the user data
			const data = res.data.values[row];
			// calculate decay
			let decay = '';
			if (data[1] == 0 ) {
				// Bronze tier, no decay
				decay = 'N/A';
			} else if (data[1] >= 1 && data[1] <= 4) {
				// Silver tier, has decay
				decay = `${4 - data[1]} / 4`;
			} else if (data[1] >= 5 && data[1] <= 6) {
				// Gold tier, has decay
				decay = `${6 - data[1]} / 2`;
			} else {
				decay = 'Data Not Found'
			}
			// write the message
			await interaction.reply({
				content: `Your tier is: **${data[2]}**\nYour decay status is: \`${decay}\``,
				ephemeral: true
			});
		});
	},
};
