// session是将信息保存到服务器端，而jwt是保存到浏览器
// 登录接口
const loginApi = async (ctx, next) => {
    if (ctx.request.body.userName !== 'admin' || ctx.request.body.password !== '000000') {
        return ctx.body={
            status: 1, msg: '登录失败'
        }
    }
    ctx.session.user = ctx.request.body
    ctx.session.isLogin = true

    ctx.body={
        status: 0, msg: '登录成功'
    }
    await next()
}
// 获取用户姓名接口
const getUserName = async (ctx, next) => {
    // 判断用户是否登录
    if (!ctx.session.isLogin) {
        return ctx.body={
            status: 1, msg: 'fail'
        }
    }
    console.log(ctx)
    ctx.body={
        status: 0, msg: 'success', userName: ctx.session.user.userName
    }
     await next()
}

const exitLogin = async (ctx, next) => {
    req.session.destory()
    ctx.body={
        status: 0,
        msg: '退出登录成功'
    }
     await next()
}
module.exports = {
    loginApi,
    getUserName,
    exitLogin
}