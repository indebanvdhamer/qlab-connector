const osc = require('osc');
const config = require('../config/development');
const log = require('./log');

const udpPort = new osc.UDPPort(config.udp);

udpPort.on('ready', () => log('QLab UDP', `Connected via port: ${udpPort.options.localPort}`));
udpPort.on('error', err => log('QLab UDP', err, 'red'));
udpPort.open();

const udpSend = (data, raw) => {
  if(data.packets && !data.packets.length) {
    return;
  }
  log(`QLab ${raw ? 'raw ' : ''}->`, data);

  udpPort.send(data, config.qlab.host.address, config.qlab.host.port);
};

module.exports = {
  udpPort,
  udpSend,
};
