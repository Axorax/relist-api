const express = require('express');
const router = express.Router();
const bots = require('../data/bots.json');
const utils = require('../utils.js');
const data = Object.fromEntries(Object.entries(bots).sort((a, b) => b[1].v - a[1].v));

async function parse(ids, w = '') {
	const object = {};
	await Promise.all(
		ids.map(async (item) => {
			try {
				const user = await client.users.fetch(item);
				const profile = await user.fetchProfile();
				let avatarId, avatarFile;
				try {
					avatarId = await user.avatar.id;
					avatarFile = await user.avatar.filename;
				} catch (e) {
					avatarId = null;
					avatarFile = null;
				}
				object[item] = {};
				const fields = {
					votes: () => data[item].v,
					prefix: () => data[item].p,
					username: () => user.username,
					tags: () => data[item].t,
					avatar: () => `${avatarId != null ? `https://autumn.revolt.chat/avatars/${avatarId}/${avatarFile}` : user.defaultAvatarURL}`,
					createdDate: () => new Date(user.createdAt).toLocaleString().match(/^(.*?),/)[1],
					createdTime: () => new Date(user.createdAt).toLocaleString().match(/,\s(.*)$/)[1],
					banner: () => `https://autumn.revolt.chat/backgrounds/${profile.background._id}/${profile.background.filename}`,
					bio: () => profile.content,
					owner: () => user.bot.owner,
					online: () => user.online
				};

				Object.entries(fields).forEach(([key, fn]) => {
					if (w === '' || w.includes(key)) {
						object[item][key] = fn();
					}
				});
			} catch (e) {
				try {
					const b = JSON.parse(JSON.stringify(await client.bots.fetchPublic(item)));
					object[item] = {
						bio: b.description,
						username: b.username,
						avatar: `https://autumn.revolt.chat/avatars/${b.avatar.id}`,
						votes: data[item].v,
						createdAt: 'unknown',
						createdDate: 'unknown',
						banner: undefined
					};
				} catch (e) {
					return;
				}
			}
		})
	);
	return Object.fromEntries(Object.entries(object).sort((a, b) => b[1].votes - a[1].votes));
}

router.get('/range/:start/:end', async (req, res) => {
	const requestedData = req.query.data ? req.query.data.split(',') : undefined;
	const { start, end } = req.params;
	const keys = Object.keys(data).slice(start, Number(end) + 1);
	let r;
	if (!requestedData) {
		r = await parse(keys);
	} else {
		r = await parse(keys, requestedData);
	}
	utils.sendJson(res, r);
});

router.get('/', async (req, res) => {
	utils.sendJson(res, {
		total: Object.keys(data).length
	});
});

router.get('/:bot/owner', async (req, res) => {
	const { bot } = req.params;
	const botUser = await client.users.fetch(bot);
	const user = await client.users.fetch(botUser.bot.owner);
	return utils.sendJson(res, {
		avatar: `https://autumn.revolt.chat/avatars/${user.avatar.id}/${user.avatar.filename}`,
		username: user.username,
		id: botUser.bot.owner
	});
});

router.get('/ids', async (req, res) => {
	utils.sendJson(res, Object.keys(data));
});

router.get('/random', async (req, res) => {
	let amount = 1;
	if (req.query.amount) {
		amount = Number(req.query.amount);
	}
	const keys = Object.keys(data);
	const selectedKeys = new Set();
	const result = {};

	if (amount > keys.length) {
		amount = keys.length;
	}

	while (selectedKeys.size < amount) {
		const randomKey = keys[Math.floor(Math.random() * keys.length)];
		if (!selectedKeys.has(randomKey)) {
			selectedKeys.add(randomKey);
			result[randomKey] = data[randomKey];
		}
	}
	const items = await parse(Object.keys(result));
	utils.sendJson(res, items);
});

router.get('/tag/:tag', async (req, res) => {
	const { tag } = req.params;
	const result = await parse(Object.keys(data).filter((id) => data[id].t.includes(tag)));
	utils.sendJson(res, result);
});

router.get('/search/:item', async (req, res) => {
	const { item } = req.params;
	const array = await Promise.all(
		Object.keys(data).map(async (item) => {
			const user = await client.users.fetch(item);
			return item + 'RELIST' + user.username;
		})
	);
	let result = [];
	array.forEach((name) => {
		if (name.replace('RELIST', '').toLowerCase().includes(item.toLowerCase())) {
			result.push(name.match(/^(.*?)RELIST/)[1]);
		}
	});
	const r = await parse(result);
	utils.sendJson(res, r);
});

router.get('/:id', async (req, res) => {
	try {
		const data = await parse([req.params.id]);
		utils.sendJson(res, data);
	} catch (e) {
		utils.sendJson(res, {
			error: true
		});
	}
});

router.get('/usernames', async (req, res) => {
	const array = await Promise.all(
		Object.keys(data).map(async (item) => {
			const user = await client.users.fetch(item);
			return user.username;
		})
	);
	return utils.sendJson(res, array);
});

router.get('/raw', async (req, res) => {
	utils.sendJson(res, data);
});

router.get('/raw/:id', async (req, res) => {
	const { id } = req.params;
	if (!id) {
		return utils.sendJson(res, {
			error: true,
			message: 'Missing parameter id'
		});
	}
	return utils.sendJson(res, data[id]);
});

module.exports = router;
