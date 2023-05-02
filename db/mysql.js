const database =require('../config/database')
const mysql = require('mysql2');
const pool = mysql.createPool(database)
const query = function (sql, values,data=undefined) {
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
            console.log(data)
            resolve({
              code: 200,
              data: data||results
            })
            connection.release() // 连接池释放
          }
        })
      }
    })
  })
}
  const queryShopDetail=function (shopid,userid, values) {
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
            let result1;
          connection.query(`select * from shops where shopid=${shopid}`, values, (err, results) => {
            if (err) {
              // reject(err)
              resolve({
                code: 400,
                msg: '语句错误：' + err
              })
              return false
            } else {
             result1=results
            }
          })
          connection.query(`SELECT 
          sg.goodsId,
          sg.category,
          sg.goodsName,
          GROUP_CONCAT(DISTINCT sgs.name ORDER BY sgs.id SEPARATOR ',') AS goodsDiscribe,
          sg.goodsSale,
          sg.goodsfavor,
          sg.goodsPrice,
          JSON_ARRAYAGG(JSON_OBJECT('header', sgd.header, 'content', sgd.content)) AS detailList,
          JSON_OBJECTAGG(spec_name, spec_values) AS specificationsList,
          sg.specifications
        FROM 
          shops_goods sg
          JOIN shops_goods_specifications sgs ON sg.goodsId = sgs.goodsId AND sg.shopid = sgs.shopid
          JOIN shops_goods_detail sgd ON sg.goodsId = sgd.goodsId AND sg.shopid = sgd.shopid
        GROUP BY 
          sg.goodsId`, values, (err, results) => {
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
  module.exports = {
    query,
    queryShopDetail,
    escape: mysql.escape // escape用于防止xss注入，后面会单独说明
  }