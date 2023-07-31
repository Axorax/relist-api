const express = require("express");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const config = require("./config.json");
const { Client } = require("revolt.js");
const DB = require("./db");

const efc = fs.readFileSync('.env', 'utf8');
const ev = efc.split('\n');
ev.forEach((evar) => {
  if (evar && !evar.startsWith('#')) {
    const [key, value] = evar.split('=');
    process.env[key] = value;
  }
});

const bots = new DB({ file: "./data/bots.json" });

const client = new Client();
const app = express();

let commands = new Map();

global.client = client;
global.voted = new DB({ file: "./data/voted.json" });
global.sessions = new DB({ file: "./data/sessions.json" });
global.loginRequests = {};
global.log = (embed = {}) => {
  client.channels.get(config.LOG_CHANNEL).sendMessage({ embeds: embed });
};
global.submit = (embed = {}) => {
  client.channels.get(config.SUBMIT_CHANNEL).sendMessage({ embeds: embed });
};

setInterval(() => {
  bots.data = Object.fromEntries(
    Object.entries(bots.data).sort((a, b) => b[1].v - a[1].v)
  );
  bots.save();
  log([
    {
      title: "🧹 LOG • Data sorted",
      description: `Data sorted based on votes!`,
    },
  ]);
}, 6.6e7);

if (voted.data.bot.length != 0) {
  voted.data.bot.forEach((e) => {
    setTimeout(() => {
      voted.data.bot.shift();
      voted.save();
    }, 4.32e7);
  });
}

if (Object.keys(sessions.data).length != 0) {
  Object.keys(sessions.data).forEach((key) => {
    setTimeout(() => {
      delete sessions.data[key];
      sessions.save();
    }, 8.64e+7);
  });
}

const limiter = rateLimit({
  windowMs: config.WINDOW_MS,
  max: config.MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (request, response, next, options) => {
    response.status(429).json({
      error: true,
      status: 429,
      message: "Too many requests!",
    });
  },
});

app.set("view engine", "ejs");
app.set("json spaces", 4);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(limiter);

fs.readdirSync("./commands", {
  withFileTypes: true,
}).forEach((dir) => {
  if (dir.isFile()) return;

  const commandFiles = fs
    .readdirSync(`${"./commands"}/${dir.name}/`)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${dir.name}/${file}`);
    const cmdName = file.split(".")[0];
    commands.set(cmdName, command);
    if (command.alias) {
      if (Array.isArray(command.alias)) {
        command.alias.forEach((e) => {
          commands.set(e, command);
        });
      } else {
        commands.set(command.alias, command);
      }
    }
    console.log("\x1b[94m[+] Loaded " + cmdName + "\x1b[0m");
  }
});

app.get("/", (req, res) => {
  res.json({
    "api": "working"
  })
});

client.on("ready", async () => {
  // async function y() {
  //   const x = await client.bots.fetchPublic("01GSK9YZAM47EP85GQ4NGZCPEK");
  //   x.addToServer("01GVK81S6KZJF5E0EVDGD75AHH")
  // }
  // y();
  // console.log(await client.users.fetch("01G9MCW5KZFKT2CRAD3G3B9JN5"))
  // console.log(await client.api.get(`/servers/01GVK81S6KZJF5E0EVDGD75AHH/members`))

  console.info(`Logged in as ${client.user.username}!`);

  app.use("/user", require("./routes/user"));
  app.use("/server", require("./routes/server"));
  app.use("/botlist", require("./routes/botlist"));
  app.use("/requestlogin", require("./routes/requestlogin"));
  app.use("/checklogin", require("./routes/checklogin"));
  app.use("/submit-bot", require("./routes/submit-bot"));
  app.use("/vote", require("./routes/vote"));
  app.use("/getsession", require("./routes/getsession"));
  app.use("/edit-bot", require("./routes/edit-bot"));
  log([
    {
      title: "🟢 LOG • Server started",
    },
  ]);
});

client.on("messageCreate", async (message) => {
  if (message.authorId == client.user.id || message.author.bot != undefined)
    return;
  if (String(message.content).startsWith("r!")) {
    const args = String(message.content).split(" ");
    const cmdName = args.shift().replace("r!", "");
    const userMsg = String(message.content)
      .replace("r!" + cmdName, "")
      .replace(" ", "");
    const cmd = commands.get(cmdName);
    if (!cmd) return;
    cmd.run(client, message, args, userMsg);
  }
});

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});

process.on("uncaughtException", (err) => {
  log([
    {
      title: "🔴 LOG • Server uncaughtException",
    },
  ]);
  console.error(err);
});

process.on("SIGINT", () => {
  log([
    {
      title: "🔴 LOG • Server SIGINT",
    },
  ]);
  setTimeout(() => {
    process.exit();
  }, 1000);
});

client.loginBot(process.env["TOKEN"]);
