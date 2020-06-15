const express = require('express')
const app = express()
const mysql = require('mysql')
var bodyParser = require('body-parser')
const db = mysql.createConnection({   // config ค่าการเชื่อมต่อฐานข้อมูล
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todo'
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var sha512 = require('js-sha512');
var md5 = require('md5');
const jwt = require('jsonwebtoken');
const { json } = require('body-parser')
const accessTokenSecret = 'GBP';





db.connect()
app.get('/member', (req, res) => {   // Router เวลาเรียกใช้งาน
    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.send(md5('message'));
    let sql = 'SELECT * FROM member'  // คำสั่ง sql
    let query = db.query(sql, (err, results) => { // สั่ง Query คำสั่ง sql
        if (err) throw err  // ดัก error
        console.log(results) // แสดงผล บน Console 
        res.json(results)   // สร้างผลลัพธ์เป็น JSON ส่งออกไปบน Browser
    })
})

app.post('/Login', (req, res) => {   // Router เวลาเรียกใช้งาน
    res.setHeader('Access-Control-Allow-Origin', '*');
    let pass = sha512(req.body.Password + req.body.Username)
    let sql = 'SELECT * FROM member where Username = "' + req.body.Username + '"'  // คำสั่ง sql
    let query = db.query(sql, (err, results) => { // สั่ง Query คำสั่ง sql
        if (err) throw err  // ดัก error
        console.log(results) // แสดงผล บน Console
        results.forEach(element => {
            if (pass == element.password && req.body.Username == element.username) {
                login = true
            } else {
                login = false
            }
            if (login) {
                const accessToken = jwt.sign({ username: element.username, login, id: element.member_id }, accessTokenSecret);
                // res.headers("authorization", "Bearer"+accessToken).send();
                res.json({
                    accessToken
                });
            } else {
                res.send('Username or password incorrect');
            }
        });
    })

})
// app.post('/addMember/:Username/:Password', function (req, res) {
app.post('/addMember', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // let date = date.now()
    let PWD = sha512(req.body.Password + req.body.Username)
    let CF_PWD = sha512(req.body.CF_Password + req.body.Username)
    // res.send(PWD + " = " + CF_PWD)
    if (PWD == CF_PWD) {
        let sql = 'SELECT COUNT(member_id) as size FROM member where username = "' + req.body.Username + '"'  // คำสั่ง sql
        let query = db.query(sql, (err, results) => { // สั่ง Query คำสั่ง sql
            if (err) throw err  // ดัก error
            //    res.send(results)
            results.forEach(data => {
                if (data.size == 0) {
                    let sql = 'INSERT INTO member (username, password) VALUES ("' + req.body.Username + '", "' + PWD + '")'
                    let query = db.query(sql, (err, results) => { // สั่ง Query คำสั่ง sql
                        if (err) throw err  // ดัก error
                        console.log(results) // แสดงผล บน Console 
                        res.json({ register : 1})   // สร้างผลลัพธ์เป็น JSON ส่งออกไปบน Browser
                    })
                } else {
                    res.json({ register : 2})
                }
            })
        })
    }else{
        res.json({pass_true : 0})
    }
})

app.post('/addTodo', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let sql = 'INSERT INTO todo (todo_message, member_id, status) VALUES ("' + req.body.Todo + '", "' + req.body.MemberId + '","' + req.body.Status + '")'
    let query = db.query(sql, (err, results) => { // สั่ง Query คำสั่ง sql
        if (err) throw err  // ดัก error
        console.log(results) // แสดงผล บน Console 
        res.json(results)   // สร้างผลลัพธ์เป็น JSON ส่งออกไปบน Browser
    })
})

app.get('/Todo', (req, res) => {   // Router เวลาเรียกใช้งาน
    res.setHeader('Access-Control-Allow-Origin', '*');
    let sql = 'SELECT * FROM todo where member_id = "' + req.body.MemberId + '" && status = ' + 1  // คำสั่ง sql
    let query = db.query(sql, (err, results) => { // สั่ง Query คำสั่ง sql
        if (err) throw err  // ดัก error
        console.log(results) // แสดงผล บน Console 
        res.json(results)   // สร้างผลลัพธ์เป็น JSON ส่งออกไปบน Browser
    })
})

app.post('/delTodo', (req, res) => {   // Router เวลาเรียกใช้งาน
    res.setHeader('Access-Control-Allow-Origin', '*');
    let sql = 'UPDATE todo SET status="' + 0 + '" Where todo_id= "' + req.body.Todo_id + '"' // คำสั่ง sql
    let query = db.query(sql, (err, results) => { // สั่ง Query คำสั่ง sql
        if (err) throw err  // ดัก error
        console.log(results) // แสดงผล บน Console 
        res.json(results)   // สร้างผลลัพธ์เป็น JSON ส่งออกไปบน Browser
    })
})

app.listen(3000, () => {
    console.log('Start server at port 3000.')
})