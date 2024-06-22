const express = require('express');
const router = express.Router();
const bots = require('../data/bots.json');
const utils = require('../utils.js');
const fs = require('fs');

router.get('/:id', async (req, res) => {
	const { id } = req.params;
	const { session, prefix, tags } = req.query;

	if (!id) {
		return utils.sendJson(res, {
			error: true,
			message: 'Bot ID needed!'
		});
	}

	if (!session) {
		return utils.sendJson(res, {
			error: true,
			message: 'Missing parameter session!'
		});
	}

	if (!Object.keys(sessions.data).includes(session)) {
		return utils.sendJson(res, {
			error: true,
			message: 'Invalid session!'
		});
	}

	const owner = sessions.data[session];
	const bot = await client.users.fetch(id);

	if (bot.bot.owner != owner) {
		return utils.sendJson(res, {
			error: true,
			message: 'Invalid user! (not bot owner)'
		});
	}

	if (prefix) {
		if (prefix.length > 10) {
			return utils.sendJson(res, {
				error: true,
				message: 'Prefix is too long!'
			});
		}
		bots[id].p = prefix;
	}

	if (tags) {
		bots[id].t = tags.replaceAll(' ', '').split(',').slice(0, 3);
	}

	log([
		{
			title: '✒️ LOG • Bot edited',
			description: `<@${id}> was edited!`
		}
	]);

	fs.writeFile('./data/bots.json', JSON.stringify(bots), function writeJSON(err) {
		if (err) return console.log(err);
	});

	return utils.sendJson(res, {
		success: true
	});
});

module.exports = router;
