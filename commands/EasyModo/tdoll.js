const { SlashCommandBuilder } = require('@discordjs/builders');
const { dolls } = require('girlsfrontline-core');
const gfcore = require('girlsfrontline-core/build/i18n/en-US/gfcore.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unit')
		.setDescription('Returns information on a unit')
		.addStringOption(option => 
			option.setName('codename')
				.setDescription('Enter a unit\'s name!')
				.setRequired(true)),
	async execute(interaction) {
		const name = interaction.options.getString('codename');
		const tdoll = dolls.find(({codename}) => codename === name);

		if (!tdoll) 
			return await interaction.reply(`Could not find \`${name}\``);

		let tileEffectArr = [];
		for (const [key, value] of Object.entries(tdoll.effect.gridEffect)) {
			str.push(`${value}% ${key}`)
		}

		await interaction.reply(`${tdoll.codename}: ${tdoll.rank} Star ${tdoll.type.toUpperCase()}\nTilebuffs: ${tileEffectArr.join(', ')}\n${printtiles(tdoll.effect.effectPos, tdoll.effect.effectCenter)}`);
		//await interaction.followUp(`Raw Data:\n\`\`\`\n${JSON.stringify(tdoll, null, 2)}\n\`\`\``);
	},
};

function printtiles(buffs, center) {
	let str = ''; //'```\n';
	for (let i = 2; i >= 0; i--) {
		for (let j = 1; j <= 3; j++) {
			const curr = (3 * i) + j;
			if (buffs.indexOf(curr) >= 0)
				str += ':blue_square:';
			else if (center == curr)
				str += ':white_large_square:';
			else
				str += `:black_large_square:`;
		}
		str += '\n';
	}
	//str += '```';
	return str;
}