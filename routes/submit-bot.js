const express = require('express');
const router = express.Router();
const utils = require('../utils.js');

router.get('/', async (req, res) => {
	try {
		const { id, bot, prefix, session, tags } = req.query;
		if (!bot || !prefix) {
			return utils.sendJson(res, {
				error: true,
				message: 'Missing param prefix or bot or all of them'
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
			submit([
				{
					title: `🤖 • Bot submission`,
					description: `Bot ID: \`${bot}\`
      Ping: <@${bot}>
      Invite Link: https://app.revolt.chat/bot/${bot}
      Prefix: \`${prefix}\`
      Author: \`${user.id}\`
      Author Ping: <@${user.id}>
      Tags: ${tags ? tags : 'none'}`
				}
			]);
			log([
				{
					title: '✨ LOG • Bot submission',
					description: `Bot ID: \`${bot}\``
				}
			]);
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

		// try {
		//   await client.users.fetch(id);
		// } catch (e) {
		//   return utils.sendJson(res, {
		//     error: true,
		//     message: "Invalid user!",
		//   });
		// }

		if (
			Object.values(loginRequests)
				.filter((obj) => obj.type === 'submit-bot')
				.some((obj) => obj.id === id)
		) {
			const token = Object.keys(loginRequests).find((key) => loginRequests[key].id === id);
			return utils.sendJson(res, { token });
		}

		const token = utils.randomString(10);
		loginRequests[token] = {
			id,
			type: 'submit-bot',
			prefix: prefix,
			bot,
			tags: tags ? tags : 'none'
		};

		setTimeout(() => {
			if (!loginRequests[token]) return;
			log([
				{
					title: '🟡 LOG • SBV failed!',
					description: `Submit bot verification token \`${token}\` expired!`
				}
			]);
			delete loginRequests[token];
		}, 60000);

		utils.sendJson(res, { token });
		log([
			{
				title: '🟢 LOG • SBV token created!',
				description: `Submit bot verification token with author id \`${id}\` was created!`
			}
		]);
	} catch (e) {
		console.log(e);
	}
});

module.exports = router;
