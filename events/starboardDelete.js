module.exports = {
	name: 'starboardDelete',
	starboard: true,
	async execute(data) {
		const channel = data.manager.client.channels.cache.get(data.channelId);
		if (channel) channel.send(`This channel is no longer a starboard!`);
	}
}