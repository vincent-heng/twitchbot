const tmi = require('tmi.js');

// Define configuration options
const winston = require('./winston');
const opts = require('./config.json');

// Create a client with our options
const client = new tmi.client(opts);

// Function called when the "dice" command is issued
function rollDice() {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === '!dice') {
    const num = rollDice();
    client.say(target, `You rolled a ${num}`);
    winston.info(`* Executed ${commandName} command`);
  } else {
    winston.info(`* Unknown command ${commandName}`);
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  winston.info(`* Connected to ${addr}:${port}`);
}

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();
