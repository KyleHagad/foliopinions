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

const auth = require('./routes/auth');
const index = require('./routes/index');
const opinions = require('./routes/opinions');

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

const sess = {
  secret: 'greenRolledAndRolling',
  name: 'puffPuffPass',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { path: '/', 
            httpOnly: true,
            secure: 'auto',
            maxAge: 60000*60*24
          }
};
app.use(session(sess));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user
  next();
});

app.use('/', index);
app.use('/auth', auth);
app.use('/opinions', opinions);

const port = process.env.PORT || 4200;

app.listen(port, ()=>{ console.log(`Full steam at http://localhost:${port} & building at http://${ip.address()}!`)})
