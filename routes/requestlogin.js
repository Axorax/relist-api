const express = require('express');
const router = express.Router();

function random(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;

	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;
}

function basicSend(res, json) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET');
	res.status(200).json(json);
}

router.get('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		if (
			Object.values(loginRequests)
				.filter((obj) => obj.type !== 'vote')
				.map((obj) => obj.id)
				.includes(id)
		) {
			basicSend(res, {
				token: Object.keys(loginRequests).find((key) => loginRequests[key].id === id)
			});
			return;
		}
		const token = random(10);
		loginRequests[token] = {
			id: id,
			type: 'login'
		};
		setTimeout(() => {
			if (!loginRequests[token]) return;
			log([
				{
					title: '🟡 LOG • Login Token Expired',
					description: `Token \`${token}\` expired!`
				}
			]);
			delete loginRequests[token];
		}, 60000);
		basicSend(res, {
			token: token,
			id: id
		});
		log([
			{
				title: '🟢 LOG • Login Token Created',
				description: `Token for id \`${id}\` was created!`
			}
		]);
	} catch (e) {
		console.log(e);
	}
});

module.exports = router;
