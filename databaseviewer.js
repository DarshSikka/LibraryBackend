const sqlite3=require("sqlite3").verbose();
const db=new sqlite3.Database("store.db");
db.all(`SELECT * FROM users`, [], (err, rows)=>{
    if(err) throw err;
    console.log(rows);
})