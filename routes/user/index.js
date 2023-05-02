
// JWT 认证机制
const jwt = require('jsonwebtoken')
const koaJWT = require('koa-jwt')
const bcrypt = require('bcryptjs')
const { secretKey } = require('../../utils/secretKey')
const { query, queryShopDetail, escape } = require('../../db/mysql.js')


// 注册接口
exports.registerApi = async (ctx, next) => {
    const userInfo = ctx.request.body
    if (!userInfo.userName || !userInfo.password) {
        return ctx.body = ({ status: 1, message: '用户名或密码不能为空！' })
    }
    const sqlUserName = `select * from userinfo where userName=?`
    const IsuserName = await query(sqlUserName, [userInfo.userName])
    console.log(IsuserName)
    if (IsuserName.code === 200 && IsuserName.data.length > 0) {
        return ctx.body = { status: 1, message: '用户名被占用，请更换其他用户名！' }
    } else if (IsuserName.code !== 200) {
        return ctx.body = (IsuserName)
    }
    userInfo.password = bcrypt.hashSync(userInfo.password, 10)

    const sqlAddUser = "INSERT INTO userinfo (userName,password) values (?,?)"
    const IsAdd = await query(sqlAddUser, [userInfo.userName, userInfo.password])

    if (IsAdd.code === 200) {
        return ctx.body = {
            code: 200,
            msg: '注册成功！'
        }
    } else {
        return clx.body = IsAdd
    }

    await next()
}
// 登录接口
exports.loginApi = async (ctx, next) => {
    const userInfo = ctx.request.body
    const sqlUserName = "select * from userinfo where userName=?"
    const userLogin = await query(sqlUserName, [userInfo.userName])
    console.log(userLogin)
    // 拿着用户输入的密码,和数据库中存储的密码进行对比
    const constcompareResult = bcrypt.compareSync(userInfo.password, (userLogin.data)[0].password)
    console.log(constcompareResult)
    if (!constcompareResult) {
        return ctx.body = {
            code: 500, msg: '密码错误'
        }
    }
    const tokenStr = jwt.sign({ userName: ctx.request.body.userName }, secretKey, {
        // expiresIn:'30s' //秒
        expiresIn: '30h'  //小时
    })
    ctx.body = {
        code: 200, msg: '登录成功',
        // 调佣jsw.sign()生辰JWT字符串，三个参数分别是：用户信息对象，加密密钥，配置对象
        token: 'Bearer ' + tokenStr
    }
    // 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
    // const user= { ...(userLogin.data)[0], password: '', user_pic: '' }
    await next()
}
// 更新用户密码
exports.updatePwd = async (ctx, next) => {
    // {
    //     oldPwd:'',
    //     newPwd:'',
    //     userId:
    // }
    const userInfo = ctx.request.body
    const sqlUserId = "select * from userinfo where userId=?"
    const userLogin = await query(sqlUserId, [userInfo.userId])
    if (!(userLogin.data)[0]) {
        return ctx.body = {
            code: 500, msg: '用户不存在,请确认'
        }
    }
    // 拿着用户输入的密码,和数据库中存储的密码进行对比
    const constcompareResult = bcrypt.compareSync(userInfo.oldPwd, (userLogin.data)[0].password)
    if (!constcompareResult) {
        return ctx.body = {
            code: 500, msg: '原密码错误,请确认'
        }
    }
    const newPwd = bcrypt.hashSync(userInfo.newPwd, 10)
    // 定义更新密码的 SQL 语句
    const sqlUpdate = `update  userinfo  set password=? where userId=?`
    const updateUser=await query(sqlUpdate, [newPwd, (userLogin.data)[0].userId],'新密码修改成功!')
    console.log((userLogin.data)[0])
    console.log(updateUser)
    return ctx.body =updateUser
    await next()
}
//更新用户头像 base64
exports.updateAvatar = async (ctx, next) => {
    const userInfo = ctx.request.body
    // 1. 定义更新头像的 SQL 语句
    const sqlUserId = "select * from userinfo where userId=?"
    const userLogin = await query(sqlUserId, [userInfo.userId])
    if (!(userLogin.data)[0]) {
        return ctx.body = {
            code: 500, msg: '用户不存在,请确认'
    }
    }
    const sql = `update userinfo set user_pic=? where userId=?`
    console.log((userLogin.data)[0])
    const userAvatar = await query(sql, [userInfo.user_pic, (userLogin.data)[0].userId],'头像修改成功!')
    return ctx.body =userAvatar
    await next()
}
// 获取用户姓名接口
exports.getUserName = async (ctx, next) => {
    // 判断用户是否登录
    if (!ctx.session.isLogin) {
        return ctx.body = {
            code: 500, msg: 'fail'
        }
    }
    console.log(ctx)
    ctx.body = {
        code: 200, msg: 'success', userName: ctx.session.user.userName
    }
    await next()
}
// 退出接口
exports.exitLogin = async (ctx, next) => {
    req.session.destory()
    ctx.body = {
        status: 0,
        msg: '退出登录成功'
    }
    await next()
}
