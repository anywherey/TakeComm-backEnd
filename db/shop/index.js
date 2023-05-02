const database =require('../config/database')
const mysql = require('mysql2');
const pool = mysql.createPool(database)

const query = function (sql, values) {
    return new Promise((resolve, reject) => {
      pool.getConnection(function (err, connection) {
        if (err) {
          // reject(err)
          // console.error(err, '数据库连接失败')
          resolve({
            code: 500,
            msg: `数据库连接失败:${err}`
          })
        } else {
          connection.query(sql, values, (err, results) => {
            if (err) {
              // reject(err)
              resolve({
                code: 400,
                msg: '语句错误：' + err
              })
            } else {
              resolve({
                code: 200,
                data: results
              })
              connection.release() // 连接池释放
            }
          })
        }
      })
    })
  }
  export default query