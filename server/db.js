const mysql = require('mysql')

const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'chat'
})

db.connect(err => {
  if (err) {
    console.log(err);
  } else {
    console.log('连接成功');
  }
})

function sqlQuery(sql, arr) {
  return new Promise((resolve, reject) => {
    db.query(sql, arr, (err,results) => {
      if (err) {
        reject(err)
      } else {
        resolve(results)
      }
    })
  })
}

module.exports = sqlQuery

