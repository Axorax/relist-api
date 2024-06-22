const bots = require('../../data/bots.json');
const fs = require('fs');

function voteSuccess(message, text) {
	log([{ title: '🟢 LOG • Vote successful', description: text }]);
	message.reply('✅ | Vote confirmed!');
}

function voteFor(message, id) {
	if (voted.data.bot.includes(message.author.id)) {
		return message.reply('User has already voted in the last 12 hours!');
	}
	if (!Object.keys(bots).includes(id)) {
		return message.reply('That bot is not in our list!');
	}
	bots[id].v += 1;
	voted.data.bot.push(message.author.id);
	voted.save();
	setTimeout(() => {
		voted.data.bot.shift();
		voted.save();
	}, 4.32e7);
	voteSuccess(message, `User \`${message.author.id}\` voted!`);
}

module.exports.run = async (client, message, args) => {
	try {
		if (message.mentionIds) {
			voteFor(message, message.mentionIds[0]);
		} else if (/[0-9A-Z]{26}/.test(args[0])) {
			voteFor(message, args[0]);
		} else {
			if (Object.keys(loginRequests).includes(args[0])) {
				const data = loginRequests[args[0]];
				if (data.type != 'vote') {
					return message.reply('Only vote token can be used for voting!');
				} else if (data.id != message.author.id) {
					return message.reply('Invalid user!');
				}
				bots[data.receiver].v += 1;

				fs.writeFile('./data/bots.json', JSON.stringify(bots), function writeJSON(err) {
					if (err) return console.log(err);
				});
				voted.data.bot.push(data.id);
				voted.save();
				voteSuccess(message, `Token \`${args[0]}\` used!`);
				setTimeout(() => {
					voted.data.bot.shift();
					voted.save();
				}, 4.32e7);
				delete loginRequests[args[0]];
			} else {
				message.reply('Invalid confirmation token!');
			}
		}
	} catch (e) {
		console.log(e);
	}
};
