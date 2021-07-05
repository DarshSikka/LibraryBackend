const express=require("express");
const sqlite3=require("sqlite3").verbose();
const db=new sqlite3.Database("store.db", (err, result)=>{
    if(err) throw err;
    console.log("connected to store")
});
db.all(`CREATE TABLE IF NOT EXISTS users(username, email, password)`);
const app=express();
const parser=require("body-parser");
const port=process.env.PORT || 5000;
app.use(parser.json());
app.use(express.static("static"))
app.post("/signup", (req, res)=>{
 const {username, password, confirm, email}=req.body;
 if(!username){
     return res.send({message:"Username empty"})
 }
 else if(!password){
     return res.send({message:"Password empty"});
 }
 else if(!confirm){
     return res.send({message:"Confirm empty"});
 }
 else if(!email){
     return res.send({message:"Email Empty"});
 }
 else if(password!=confirm){
     return res.send({message:"Passwords don't match"})
 }
 else{
     db.all(`SELECT * FROM users WHERE username=? OR  email=?`, [username, email], (err, rows)=>{
         console.log(rows);
         if(rows.length!=0){
             res.send({message:"Username/email is taken"});
         }
         else{
             db.all(`INSERT INTO users(username, email, password) VALUES(?, ?, ?)`, [username, email, password], (err)=>{
                 if(err) throw err;
                 res.send({message:"User Created"});
             });
         }
     })
 }
}); 
app.post("/login", (req, res)=>{
const {email, password}=req.body;
console.log(req.body);
db.all(`SELECT * FROM users WHERE email=? AND PASSWORD=?`,[email, password], (err, rows)=>{
    if(err) throw err;
    if(rows.length===0){
        return res.send({message:"Invalid Email/Password"})
    }
    else{
        return res.send(({message:"Authorized"}));
    }
})
})



app.listen(port, ()=>console.log(`listening on port ${port}`));