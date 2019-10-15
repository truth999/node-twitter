const express = require('express');
const fs = require('fs');
const passport = require('passport');
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];
const auth = require('./config/middlewares/authorization');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 8080;

mongoose.connect(config.db, {
  useUnifiedTopology: true,
  //useNewUrlParser: true,  
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
  //useMongoClient: true
})
.then(() => console.log("Connected"))
.catch(err => console.log(err));

const models_path = __dirname+'/app/models';
fs.readdirSync(models_path).forEach(file => {
  require(models_path+'/'+file);
});

require('./config/passport')(passport, config);
require('./config/express')(app, config, passport);
require('./config/routes')(app, passport, auth);

app.listen(port);
console.log('Express app started on port ' + port);
module.exports = app;
