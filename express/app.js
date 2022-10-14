var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// websocket
const WebSocketService = require('./utils/ws')
WebSocketService.listen()

// cors跨域
app.all('*',function (req,res,next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length,Access-Token,Authorization,Accept,X-Requested-With");
    if (req.method == 'OPTIONS') {
        res.sendStatus(200)
    } else {
        next()
    }
});

// 404
const fs = require('fs');
var routes_list = ['/login', '/', '/id', '/reset','/addr','/call']
fs.readdirSync('./routes/').forEach(file => {
    routes_list.push('/' + file.replace('.js',''))
});
app.use((req, res, next) => {
    if(!routes_list.includes(req.url.indexOf('?') == -1 ? req.url : req.url.substring(0, req.url.indexOf('?')))) {
        res.sendStatus(404)
        return
    }
    next()
});

// token
const white_list = ['/login', '/', '/reset'];
const jsonwebtoken = require('./utils/token');

app.use((req, res, next) => {    
    if(!white_list.includes(req.url.indexOf('?') == -1 ? req.url : req.url.substring(0, req.url.indexOf('?')))) {        
        jsonwebtoken.verifyToken(req.headers.authorization).then(res => {
            next()
        }).catch(err => {
            res.sendStatus(403)
            return
        })
    } else {
        next()
    }
});

// router
const indexRouter = require('./routes/index');
app.use('/', indexRouter)

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     console.log('catch 404')
//     next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
