const bots = require('../../data/bots.json');
const fs = require('fs');

module.exports.run = (client, message, args, userMsg) => {
	try {
		if (message.author.id != client.user.bot.owner) {
			return;
		}

		if (!args[0] || !args[1]) return message.reply('Missing arguments! <bot-id> <prefix>');

		if (Object.keys(bots).includes(args[0])) {
			return message.reply(`❌ | <@${args[0]}> is already in list!`);
		}

		bots[args[0]] = {
			v: 0,
			p: args[1],
			t: []
		};

		fs.writeFile('./data/bots.json', JSON.stringify(bots), function writeJSON(err) {
			if (err) return console.log(err);
		});

		message.reply(`✅ | <@${args[0]}> was added to the list!`);
		log([
			{
				title: '🆕 • New bot in list',
				description: `<@${args[0]}> was added to the list!`
			}
		]);
	} catch (e) {
		console.log(e);
	}
};
