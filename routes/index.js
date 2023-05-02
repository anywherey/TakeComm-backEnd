const router = require('koa-router')()
const {query,queryShopDetail,escape} =require('../db/mysql.js')
const user_router=require('./user/index.js')
//用户
// const UserController = require('../controller/UserController')

// //用户注册
// router.post('/register', UserController.register)
// //用户信息登录
// router.post('/login', UserController.login)
router.post('/register',user_router.registerApi)
router.post('/login',user_router.loginApi)
router.post('/updatePwd',user_router.updatePwd)
router.get('/getUser',user_router.getUserName)
router.post('/updateAvatar',user_router.updateAvatar)
router.post('/exitLogin',user_router.exitLogin)
router.get('/shopList',async(ctx,next)=>{
  const sql='select * from shops'
  const res= await query(sql)
  ctx.body=res
  await next()
})
router.get('/shopDetails/',async(ctx,next)=>{
  const shopid= ctx.query.shopid
  const userid=ctx.query.userid
  const res= await queryShopDetail(shopid,userid)
  ctx.body=res
  await next()
})
router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
