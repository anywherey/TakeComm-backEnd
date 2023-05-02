const router = require('koa-router')()
const {query,queryShopDetail,escape} =require('../db/mysql.js')
//用户
// const UserController = require('../controller/UserController')

// //用户注册
// router.post('/register', UserController.register)
// //用户信息登录
// router.post('/login', UserController.login)
router.post('/login',async(ctx,next)=>{
  if(ctx.request.body.userName !== 'admin' || ctx.request.body.password !=='000000'){
      return ctx.body({
          status:1,msg:'登录失败'
      })
  }
  ctx.session.user=ctx.request.body
  ctx.session.isLogin=true

  ctx.body({
      status:0,msg:'登录成功'
  })
})
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
module.exports = router
