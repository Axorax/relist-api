const express = require('express');
const router = express.Router();
const data = require('../data/bots.json');
const utils = require('../utils.js');
const fs = require('fs');

router.get('/', async (req, res) => {
	try {
		const { id, bot, session } = req.query;

		if (!bot) {
			return utils.sendJson(res, {
				error: true,
				message: 'Missing param bot!'
			});
		}

		if (session) {
			if (!Object.keys(sessions.data).includes(session)) {
				return utils.sendJson(res, {
					error: true,
					message: 'Invalid session!'
				});
			}
			const user = sessions.data[session];
			if (voted.data.bot.includes(user.id)) {
				return utils.sendJson(res, {
					error: true,
					message: 'User has already voted in the last 12 hours!'
				});
			}
			if (!Object.keys(data).includes(bot)) {
				return utils.sendJson(res, {
					error: true,
					message: 'That bot is not in our list!'
				});
			}
			data[bot].v += 1;
			fs.writeFile('./data/bots.json', JSON.stringify(data), function writeJSON(err) {
				if (err) return console.log(err);
			});
			voted.data.bot.push(user.id);
			voted.save();
			log([
				{
					title: '🟢 LOG • Vote successful',
					description: `User ${user.id} voted!`
				}
			]);
			setTimeout(() => {
				voted.data.bot.shift();
				voted.save();
			}, 4.32e7);
			return utils.sendJson(res, {
				success: true
			});
		}

		if (!id) {
			return utils.sendJson(res, {
				error: true,
				message: 'Missing param id!'
			});
		}

		try {
			await client.users.fetch(id);
		} catch (e) {
			return utils.sendJson(res, {
				error: true,
				message: 'Invalid user!'
			});
		}

		if (!Object.keys(data).includes(bot)) {
			return utils.sendJson(res, {
				error: true,
				message: 'That bot is not in our list!'
			});
		}

		if (voted.data.bot.includes(id)) {
			return utils.sendJson(res, {
				voted: true,
				message: 'This user has already voted within the last 12 hours!'
			});
		}

		if (
			Object.values(loginRequests)
				.filter((obj) => obj.type === 'vote')
				.some((obj) => obj.id === id)
		) {
			const token = Object.keys(loginRequests).find((key) => loginRequests[key].id === id);
			return utils.sendJson(res, { token });
		}

		const token = utils.randomString(10);
		loginRequests[token] = { id, type: 'vote', section: 'bot', receiver: bot };

		setTimeout(() => {
			if (!loginRequests[token]) return;
			log([
				{
					title: '🟡 LOG • Vote Token Expired',
					description: `Token \`${token}\` expired!`
				}
			]);
			delete loginRequests[token];
		}, 60000);

		utils.sendJson(res, { token });
		log([
			{
				title: '🟢 LOG • Vote Token Created',
				description: `Token for id \`${id}\` was created!`
			}
		]);
	} catch (e) {
		console.log(e);
	}
});

module.exports = router;
