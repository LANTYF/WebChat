module.exports = app => {
  const express = require('express')
  const router = express.Router()
  const sqlQuery = require('../../db')

  router.get('/user', async (req, res) => {
    const result = await sqlQuery('select * from user')
    res.send(result)
  })

  router.get('/finduser/:username', async (req, res) => {
    let username = req.params.username
    let sql = 'select * from user where username like ?'
    username = '%' + username + '%'
    const user = await sqlQuery(sql, [username])
    res.send(user)
  })

  router.post('/addfriend', async (req, res) => {
    let mid = req.body.me
    let uid = req.body.friend
  })

  router.get('/userinfo/:id', async (req, res) => {
    let id = req.params.id
    let sql = 'select * from user where id =?'
    let result = await sqlQuery(sql, [id])
    res.send(result)
  })

  router.get('/friend/:id', async (req, res) => {
    let me = req.params.id
    let sql = 'select mid from addfriend where fid = ?'
    let result = await sqlQuery(sql, [me])
    let list = []
    result = JSON.parse(JSON.stringify(result))
    for (let i in result) {
      let mid = result[i].mid
      let sql1 = 'select * from user where id = ?'
      const result2 = await sqlQuery(sql1, [mid])
      list = [...result2]
    }
    res.send(list)
  })

  router.delete(`/friend/:id`, async (req, res) => {
    const id = req.params.id
    let sql = 'delete from addfriend where mid = ?'
    await sqlQuery(sql, [id])
    res.end()
  })

  router.get('/removemsg', async (req, res) => {
    const { sender, recipient} = req.query
    if (sender) {
      let sql = 'delete from chatrecord where sender = ? and recipient = ?'
      await sqlQuery(sql, [sender, recipient])
    }
  })

  app.use('/web/api', router)
}