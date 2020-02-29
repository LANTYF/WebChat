module.exports = server => {
  const io = require("socket.io")(server);
  const sqlQuery = require("./db");
  io.on("connect", socket => {
    socket.on("login", async data => {
      let sql1 = "select * from user where isonline = ? and username = ?";
      let result1 = await sqlQuery(sql1, ["true", data.username]);
      if (result1.length !== 0) {
        io.to(result1[0].socketid).emit("logout", {
          msg: "有人登陆进来，强制将你踢出去！"
        });
      }

      let sql = "update user set socketid = ?, isonline = ? where username = ?";
      await sqlQuery(sql, [socket.id, "true", data.username]);
      socket.emit("login", {
        state: "ok",
        msg: "登陆成功"
      });

      socket.on("request", async data => {
        let { me, friend } = data;
        let sql2 = "select * from user where id = ?";
        let result2 = await sqlQuery(sql2, [me]);
        let result3 = await sqlQuery(sql2, [friend]);

        io.to(result3[0].socketid).emit("addfriend", {
          data: result2[0],
          msg: `${result2[0].username}想添加你为好友`
        });
        let sql3 = "insert into addfriend (mid, fid) values (?, ?)";
        if (me != friend) {
          await sqlQuery(sql3, [me, friend]);
        }
      });

      let sql4 = "insert into friends (mid, uid) values (?, ?)";
      socket.on("agree", async data => {
        const { mid, uid } = data;
        await sqlQuery(sql4, [mid, uid]);
      });
    });

    socket.on("friends", async data => {
      const { me, socketid } = data;
      let sql = "select uid from friends where mid = ?";
      let result1 = await sqlQuery(sql, [me]);
      result1 = JSON.parse(JSON.stringify(result1));
      let sql2 = "select * from user where id =?";
      result1 = await Promise.all(
        result1.map(async item => {
          item = await sqlQuery(sql2, [item.uid]);
          item = JSON.parse(JSON.stringify(item));
          return item[0];
        })
      );

      let sql1 = "select mid from friends where uid = ?";
      let result2 = await sqlQuery(sql1, [me]);
      result2 = JSON.parse(JSON.stringify(result2));
      let sql3 = "select * from user where id =?";
      result2 = await Promise.all(
        result2.map(async item => {
          item = await sqlQuery(sql3, [item.mid]);
          item = JSON.parse(JSON.stringify(item));
          return item[0];
        })
      );
      // let result = result1.concat(result2)
      result1.push(...result2);
      io.to(`${socketid}`).emit("get", {
        data: result1
      });

     

    });

    socket.on("chatWithFriend", async data => {
      const { friendid, socketid } = data;
      let sql = "select * from user where id = ?";
      let result = await sqlQuery(sql, [friendid]);
      io.to(socketid).emit("chatWithFriend", {
        data: result
      });
    });

    socket.on("sendmsg", async data => {
      const { sender, recipient, message, date } = data;
      if (recipient.socketid === null) {
        let sql =
          "insert into chatrecord (sender, recipient, message, date) values (?, ?, ?, ?)";
        await sqlQuery(sql, [
          sender.username,
          recipient.username,
          message,
          date
        ]);
      } else {
        io.to(recipient.socketid).emit("getmessage", {
          sender: {
            username: sender.username,
            headerimg: sender.headerimg,
            id: sender.id
          },
          recipient: {
            username: recipient.username,
            headerimg: recipient.headerimg,
            id: recipient.id
          },
          message,
          date
        });
        io.to(recipient.socketid).emit("getinmessage", {
          sender: {
            username: sender.username,
            headerimg: sender.headerimg,
            id: sender.id
          },
          recipient: {
            username: recipient.username,
            headerimg: recipient.headerimg,
            id: recipient.id
          },
          message,
          date
        });
      }
    });

    socket.on("getbeforemessage", async me => {
      let sql = "select * from chatrecord where recipient = ?";
      let result = await sqlQuery(sql, [me.username]);
      if (result.length !== 0) {
        result = JSON.parse(JSON.stringify(result));
        sql = "select * from user where username = ?";
        const { sender, recipient } = result[0];
        let user = await sqlQuery(sql, [sender]);
        user = JSON.parse(JSON.stringify(user));
        let self = await sqlQuery(sql, [recipient]);
        self = JSON.parse(JSON.stringify(self));
        result.map(item => {
          item.sender = user[0];
          item.recipient = self[0];
        });
        sql = "select socketid from user where username = ?";
        const result1 = await sqlQuery(sql, [me.username]);
        const { socketid } = result1[0];
        io.to(socketid).emit("getbeforemessage", result);
      }
    });


    socket.on("disconnect", async () => {
      let sql = "update user set socketid = ?, isonline = ? where socketid = ?";
      await sqlQuery(sql, [null, null, socket.id]);
    });
  });
};
