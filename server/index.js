const express = require('express');
const app = express();
const helmet = require('helmet');
const bodyParser = require('body-parser');
const config = require('./config/development');
const middlewares = require('./middlewares');
const log = require('./utils/log');
const {sockInstance} = require('./utils/Socket');

app.use(middlewares.log);
app.use(middlewares.cors);

app.use(helmet());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//Initialize app
const server = app.listen(config.http.port, () => log('Server', `Listening on port ${config.http.port}`));
const io = sockInstance();
io.listen(server);
