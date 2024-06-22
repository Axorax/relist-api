const express = require('express');
const router = express.Router();
const utils = require('../utils.js');

router.get('/:token', async (req, res) => {
	try {
		const { token } = req.params;
		if (
			!Object.keys(loginRequests)
				.filter((key) => loginRequests[key].type === 'login' || loginRequests[key].type === true)
				.includes(token)
		) {
			utils.sendJson(res, {
				status: 404,
				message: "Login token '" + token + "' does not exist!",
				error: true
			});
			return;
		}
		if (loginRequests[token].type == true) {
			setTimeout(() => {
				if (!loginRequests[token]) return;
				delete loginRequests[token];
			}, 10000);
			return utils.sendJson(res, {
				status: 200,
				token: token,
				id: loginRequests[token].id,
				verified: true,
				session: loginRequests[token].session
			});
		} else {
			return utils.sendJson(res, {
				status: 200,
				token: token,
				id: loginRequests[token].id,
				verified: false
			});
		}
	} catch (e) {
		console.log(e);
	}
});

module.exports = router;
