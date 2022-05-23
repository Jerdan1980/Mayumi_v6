const { SlashCommandBuilder } = require('@discordjs/builders');
const { IntegrationApplication } = require('discord.js');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = '../../gapi-token.json';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('update-tiers')
		.setDescription('Updates the CODS Tier List!'),
	async execute(interaction) {
		if (['262425476822204421', '535566086259736596', '204679685114691584'].indexOf(interaction.member.user.id) == -1) {
			//jeremy, ayame, stabell
			await interaction.reply('Access Denied');
			return 0;
		}

		const auth = new google.auth.GoogleAuth({
			keyFile: 'gapi-token.json',
			scopes: SCOPES,
		});
		google.options({auth: auth});
		
		const sheets = google.sheets({version: 'v4'});
		sheets.spreadsheets.values.get({
			spreadsheetId: '1ps4XIdwJGIEhmiSOQ-4US781NZlBlMZIr8WEAfR9KK4',
			range: 'Tier List!A2:C',
		}, async function (err, res) {
			if (err) {
				await interaction.reply("Something went wrong!");
				return console.log('The API returned an error: ' + err);
			}
			// else
			// go ahead and update the public tierlist
			console.log(res.data)
			sheets.spreadsheets.values.update({
				spreadsheetId: '19iVZw4S74cAc4DpDznh_sBOorS5ACm-f-Ftuyay62NU',
				range: 'Sheet1!A2:C',
				valueInputOption: 'RAW',
				requestBody: {values: res.data.values},
			}, async function (err, res) {
				if (err) {
					console.log(err);
					await interaction.reply("Something went wrong!");
				} else {
					await interaction.reply(`Public Tier List updated.\n**${res.data.updatedRows}** rows updated.`);
					//console.log(res.data);
				}
			});
		})

	},
};