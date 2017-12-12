//Require Variables
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let cors = require('cors');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')));

//let rootRoutes = ["/dashboard", "/admin"];
//let hierarchicalRoutes = ["/dashboard/journeys", "/dashboard/real-time", "/dashboard/shifts"];
app.use(logger('dev'));
app.use(cors());
//app.use(rootRoutes, favicon(path.join(__dirname, 'public/images/icons', 'usl-favicon_256x256.ico')));
//app.use(hierarchicalRoutes, favicon(path.join(__dirname, 'public/images/icons', 'usl-favicon_256x256.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser('retail_sensing'));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(rootRoutes, express.static(path.join(__dirname, '/public')));
//app.use(hierarchicalRoutes, express.static(path.join(__dirname, '/public')));

//Configuring Passport
let passport = require('passport');
let expressSession = require('express-session');
app.use(expressSession({
    secret: 'retail_sensing',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 //1 Hour
    }
}));
app.use(passport.initialize());
app.use(passport.session());

//Flash Messaging For Passport
let flash = require('connect-flash');
app.use(flash());

//Initialize Passport
let initPassport = require('./public/js/passport/passport-init');
initPassport(passport);

//Page Routing
let admin = require('./routes/admin')(passport);
let loggedIn = require('./routes/loggedIn')(passport);
let index = require('./routes/index')(passport);

app.use('/admin', admin);
app.use('/index', loggedIn);
app.use('/', index);

//Handle 404
app.use(function(req, res) {
    res.status(404);
    res.render('error', {
        title: '404 - Page Not Found',
        desc: 'Page Not Found',
        message: "The page you requested cannot be found",
        error: 404
    });
});

//Handle 500 - Must have an arity of 4, otherwise express falls back to default error handling
app.use(function(err, req, res, next) {
    res.status(500);
    console.log(err);
    res.render('error', {
        title: '500 - Internal Server Error',
        desc: 'Internal Server Error',
        message: err.message,
        error: 500
    });
});

module.exports = app;
