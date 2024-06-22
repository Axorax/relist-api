function random(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;

	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;
}

module.exports.run = (client, message, args, userMsg) => {
	try {
		if (!Object.keys(loginRequests).includes(args[0])) {
			return message.reply('Invalid login token!');
		}
		const data = loginRequests[args[0]];
		if (data.type != 'login') {
			return message.reply('Only login token can be used for this action!');
		} else if (data.id != message.author.id) {
			return message.reply('Invalid user!');
		}
		data.type = true;
		const sessionId = random(32);
		data.session = sessionId;
		sessions.data[sessionId] = data.id;
		sessions.save();
		setTimeout(() => {
			delete sessions.data[Object.keys(sessions.data)[0]];
			sessions.save();
		}, 8.64e7);
		message.reply('✅ | Login verified!');
		log([
			{
				title: '🟢 LOG • Login Token Verified',
				description: `Token \`${args[0]}\` verified!`
			}
		]);
		setTimeout(() => {
			if (!loginRequests[args[0]]) return;
			delete loginRequests[args[0]];
		}, 60000);
	} catch (e) {
		console.log(e);
	}
};
