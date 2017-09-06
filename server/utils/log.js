const chalk = require('chalk');

const senderColors = {
  'Socket': 'green',
  'QLab UDP': 'green',
  'QLab <-': 'grey',
  'QLab ->': 'grey',
  'Server': 'green',
};

module.exports = (sender, message, color) => {
  console.log(`[${chalk[color || senderColors[sender] || 'grey'](sender)}]`, message);
};
