const express = require('express');
const path = require('path');
const ip = require('ip');
const exphbs = require('express-handlebars');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo')(session);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride('_method'));

require('./models/User');
require('./models/Opinion');

require('./config/passport')(passport);
const keys = require('./config/keys');

mongoose.connect(keys.mongoURI, {useNewUrlParser: true})
 .then(()=> console.log('Chattering...'))
 .catch(err => console.log(err));

 
