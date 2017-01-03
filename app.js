// 引用模块
const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')
const cookieParser = require('cookie-parser')
const redis   = require("redis")
const session = require('express-session')
const redisStore = require('connect-redis')(session)
const bodyParser = require('body-parser')
const formidable = require('formidable')
const form = new formidable.IncomingForm()
const client  = redis.createClient()
//我现在加了一行注释
const publicPath = path.join(__dirname, 'public')
const port = process.env.PORT || 3000
const index = require('./routes/index')
const admin = require('./routes/admin')
const user = require('./routes/user')

//我在20行加了一行注释
const app = express()
app.listen(port)
console.log("端口为" + port)

// 调用中间件使用
const options = {
    host: 'localhost',
    port: 6379,
    client: client,
    ttl:7 * 24 * 60 * 60 * 1000
}
// session设置
app.use(session({
    resave: true,
    saveUninitialized: false,
    store: new redisStore(options),
    secret: 'kanesir_shop',
}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(serveStatic(publicPath))
// session检查
app.use(function(req, res, next) {
    res.locals.user_id = req.session.user_id
    var err = req.session.error
    delete req.session.error
    res.locals.message = ""
    if (err) {
        res.locals.message = console.log(err)
    }
    next()
})
// 路由设置
app.use('/', index)
app.use('/admin', admin)
app.use('/user', user)

//catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})


// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err)
        res.status(err.status || 500)
        res.render('error', {
            message: err.message,
            error: err
        })
    })
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: {}
    })
})

module.exports = app
