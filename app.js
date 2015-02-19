var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var connectAssets = require('connect-assets');

var hbs = require('hbs');

var tasksController = require('./controllers/tasks');
var coursesController = require('./controllers/courses');
var shared = require('./routes/shared');
var settings = require('./routes/settings');
var users = require('./routes/users');

/**
 * Controllers (route handlers).
 */
var userController = require('./controllers/user');

/**
 * API keys and Passport configuration.
 */
var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

var app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
    console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

app.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: secrets.sessionSecret,
    store: new MongoStore({ url: secrets.db, autoReconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(connectAssets({
    paths: [path.join(__dirname, 'assets/css'), path.join(__dirname, 'assets/js')]
}));


/**
 * Primary app routes.
 */
// Account
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
// Application
// Tasks
app.get('/', passportConf.isAuthenticated, tasksController.index);
app.get('/tasks', passportConf.isAuthenticated, tasksController.index);
app.post('/tasks', passportConf.isAuthenticated, tasksController.create);
app.get('/courses', passportConf.isAuthenticated, coursesController.index);
app.post('/courses', passportConf.isAuthenticated, coursesController.create);
app.get('/courses/search', passportConf.isAuthenticated, coursesController.search);
app.get('/shared', passportConf.isAuthenticated, shared.view);
app.get('/settings', passportConf.isAuthenticated, settings.view);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('css', function(name) { return css(name) });
hbs.registerHelper('js', function(name) { return js(name) });

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
