const express = require('express')
const app = express()
const mysql = require('mysql')
const db = mysql.createConnection({   // config ค่าการเชื่อมต่อฐานข้อมูล
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todo'
})

db.connect()

app.get('/member', (req, res) => {   // Router เวลาเรียกใช้งาน
    let sql = 'SELECT * FROM member'  // คำสั่ง sql
    let query = db.query(sql, (err, results) => { // สั่ง Query คำสั่ง sql
        if (err) throw err  // ดัก error
        console.log(results) // แสดงผล บน Console 
        res.json(results)   // สร้างผลลัพธ์เป็น JSON ส่งออกไปบน Browser
    })
})

app.get('/users/:Username/passwords/:Password', function (req, res) {
    var Password = req.param.Password
    var Username = req.params.Username
    // let sql ='INSERT INTO member (username, password) VALUES ('+Username+', '+password+')'
    // let query = db.query(sql, (err, results) => { // สั่ง Query คำสั่ง sql
    //     if (err) throw err  // ดัก error
    //     console.log(results) // แสดงผล บน Console 
    //     res.json(results)   // สร้างผลลัพธ์เป็น JSON ส่งออกไปบน Browser
    // })

    res.send(Username+" "+Password)
})

app.get('/users/:userId/books/:bookId', function (req, res) {
    res.send(req.params)
    res.send(req.params.userId)
  })

app.listen(3000, () => {
    console.log('Start server at port 3000.')
})