const express = require('express');
const router = express.Router();
const utils = require('../utils.js');

router.get('/:session', async (req, res) => {
	try {
		const { session } = req.params;
		if (Object.keys(sessions.data).includes(session)) {
			const user = await client.users.fetch(sessions.data[session]);
			utils.sendJson(res, {
				active: true,
				id: sessions.data[session],
				username: user.username,
				session: session,
				avatar: `https://autumn.revolt.chat/avatars/${user.avatar.id}/${user.avatar.filename}`
			});
		} else {
			utils.sendJson(res, {
				active: false
			});
		}
	} catch (e) {
		console.log(e);
	}
});

module.exports = router;
