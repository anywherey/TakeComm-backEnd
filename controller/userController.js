// 用户注册
const User = require('../model/userModel')

class UserController {
    // 用户注册
    async register(ctx) {
        let { name, tel, password } = ctx.request.body
        const names = await User.getUser(name) //用户名是否重复
        const tels = await User.getTel(tel) //手机号是否重复

        if (tels.length > 0) {
            ctx.body = { type: 'warning', message: '该手机号已注册' }
        } else {
            if (names.length > 0) {
                ctx.body = { type: 'error', message: '用户名已存在' }
            } else {
                await User.insert(name, tel, password)
                ctx.body = { type: 'success', code: 0, message: '注册成功' }
            }
        }
    }
    // 登录
    async login(ctx) {
        let tel = ctx.request.body.tel
        let password = ctx.request.body.password
        const res = (await User.getTel(tel))[0]
        if (res) {
            if (res.password == password) {
                ctx.body = {
                    code: 0,
                    data: {
                        name: res.name,
                        tel: res.tel
                    },
                    message: '登录成功',
                    type: 'success'
                }
            } else {
                ctx.body = { type: 'error', message: '用户名或密码不正确' }
            }
        } else {
            ctx.body = { type: 'error', message: '用户名不存在' }
        }
    }
}
module.exports = new UserController()