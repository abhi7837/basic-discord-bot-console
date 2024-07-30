require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");

const { DISCORD_TOKEN: TOKEN } = process.env;

// require neccesary discord.js classes
const {
  Client,
  GatewayIntentBits,
  Colllection,
  Collection,
} = require("discord.js");

// create new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

//load the event files on startup
const eventspath = path.join(__dirname, "events");
const eventfiles = fs
  .readdirSync(eventspath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventfiles) {
  const filepath = path.join(eventspath, file);
  const event = require(filepath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

//load the command files on startup
client.commands = new Collection();
const commandpath = path.join(__dirname, "commands");
const commandfiles = fs
  .readdirSync(commandpath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandfiles) {
  const filepath = path.join(commandsPath, file);
  const command = require(filepath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filepath} is missing a required "data" or "execute property"`
    );
  }
}

client.login(TOKEN);
