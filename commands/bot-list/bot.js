const bots = require('../../data/bots.json');

async function botInfo(message, bot_id) {
	if (!Object.keys(bots).includes(bot_id)) return message.reply('That bot is not in our list!');
	const user = await client.users.fetch(bot_id);
	const profile = await user.fetchProfile();
	let avatarId, avatarFile;
	try {
		avatarId = await user.avatar.id;
		avatarFile = await user.avatar.filename;
	} catch (e) {
		avatarId = null;
		avatarFile = null;
	}
	message.channel.sendMessage({
		embeds: [
			{
				title: '🤖 • Bot Information',
				icon_url: `${avatarId != null ? `https://autumn.revolt.chat/avatars/${avatarId}/${avatarFile}` : user.defaultAvatarURL}`,
				description: `Username: \`${user.username}\`
      Votes: \`${bots[bot_id].v}\`
      Created: \`${new Date(user.createdAt).toLocaleString()}\`
      Online: \`${user.online}\`
	  Discriminator: \`${user.discriminator}\`
	  Status: \`${user.status == undefined ? "-" : user.status}\`
	  Bio:
${profile.content == undefined ? "`Bio not set!`" : "\`\`\`\n" + profile.content + "\n\`\`\`"}`
			}
		]
	});
}

module.exports.run = (client, message, args) => {
	try {
		if (message.mentionIds) {
			botInfo(message, message.mentionIds[0]);
		} else if (/[0-9A-Z]{26}/.test(args[0])) {
			botInfo(message, args[0]);
		}
	} catch (e) {
		console.log(e);
	}
};
