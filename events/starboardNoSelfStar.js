module.exports = {
	name: 'starboardNoSelfStar',
	starboard: true,
	async execute(emoji, message, user) {
		user.send(`You cannot ${emoji} your own messages in _${message.client.guilds.resolve(message.guildId).name}_.`);
	}
}