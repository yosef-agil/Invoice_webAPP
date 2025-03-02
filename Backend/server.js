require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi ke Database MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "invoice_webapp",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to database.");
});

// API Endpoint utama
app.get("/", (req, res) => {
  return res.json("FROM BACKEND");
});

// API Endpoint untuk mengambil daftar harga (price_list)
app.get("/paketan", (req, res) => {
  const sql = "SELECT * FROM price_list";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// API Endpoint untuk menyimpan invoice ke database
app.post('/invoice', (req, res) => {
  const sql = "INSERT INTO invoice (`customer`,`date`,`description`,`due_date`, `price`, `note`) VALUES (?)";
  console.log(req.body)
  const vlaues = [
      req.body.customer,
      req.body.date,
      req.body.description,
      req.body.due_date,
      req.body.price,
      req.body.note,
  ]
  db.query(sql, [vlaues], (err, result) => {
      if(err) return res.json(err);
      return res.json(result);
  })
})


// Menjalankan server di port 8081
app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
