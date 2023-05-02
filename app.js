const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const index = require('./routes/index')
const users = require('./routes/users')
const cors = require('koa2-cors')
// const session = require('koa-session')
const koaJWT=require('koa-jwt')
const {secretKey}=require('./utils/secretKey')

app.use(koaJWT({secret:secretKey}).unless({path:['/register','/login','/exitLogin']}))

// 设置签名密钥
// app.keys = ['secret key'];
// 注册session中间件
// app.use(session(
//   {
//     key:'secret key', // 设置session cookie名称
//     // maxAge: 86400000, // 设置session过期时间为1天
//     // overwrite: true, // 允许覆盖之前的session
//     // httpOnly: true, // 只允许通过http请求来获取session cookie
//     // signed: true, // 使用签名保护cookie数据
//     // rolling: false, // 不重新设置session过期时间
//     renew: false, // 不自动续期session
//   },app
// ));

// error handler
onerror(app)

// middlewares
// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))
// koa-bodyparser 中间件会自动解析 application/x-www-form-urlencoded 格式的表单数据
app.use(bodyparser({
  multipart: true
}))
// 配置插件
app.use(cors({
  // 任何地址都可以访问
  origin:"*",
  // 指定地址才可以访问
  // origin: 'http://localhost:8080',
  maxAge: 2592000,
  // 必要配置
  credentials: true
}));
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  // const start = new Date()
  // console.log(start)
  // await next()
  // const ms = new Date() - start
  // console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  try{
    await next()
  }
  catch(err){
    console.log(err)
    ctx.app.emit('error',err,ctx)
    if(err.name ==='UnauthorizedError'){
      console.error('401 无效的token')
      ctx.app.emit('error',err,ctx)
      return ctx.body={
        code:401,
        message:'无效的token'
      }
    }

    ctx.body={
      code:500,
      message:'未知错误'
    }

  }
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
 app.on('error', (err, ctx) => {
  console.log(ctx.body)
   if(err.name ==='UnauthorizedError'){
     console.error('401 无效的token')
     const errContent={
       code:401,
       message:'无效的token'
     }
     ctx.status=errContent.code
     err.message=errContent.message
     ctx.body=errContent
   }else{
    ctx.code = err.code || 500;
    ctx.body = {
      message: err.message,
    }

   }
  
   console.error('server error', {'错误信息':err}, {'错误的请求和响应ctx':ctx})
   console.log(ctx.body)
 });

module.exports = app
