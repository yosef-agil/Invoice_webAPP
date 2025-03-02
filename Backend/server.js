require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const util = require("util");

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

const query = util.promisify(db.query).bind(db);

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

// API Endpoint untuk menyimpan invoice dan items ke database
app.post("/invoice", async (req, res) => {
  const { customer, date, due_date, note, items } = req.body; // items adalah array

  try {
    console.log("Request body:", req.body); // Debugging data yang diterima

    // Mulai transaksi
    await query("START TRANSACTION");

    // Simpan invoice ke database
    const result = await query(
      "INSERT INTO invoice (customer, date, due_date, note) VALUES (?, ?, ?, ?)",
      [customer, date, due_date, note]
    );

    const invoiceId = result.insertId;

    // Simpan setiap item ke invoice_items
    for (const item of items) {
      console.log("Inserting item:", item); // Debugging data yang akan disimpan
      await query(
        "INSERT INTO invoice_items (invoice_id, description, price) VALUES (?, ?, ?)",
        [invoiceId, item.description, item.price]
      );
    }

    // Commit transaksi jika semua sukses
    await query("COMMIT");

    res.status(201).json({ message: "Invoice created successfully", invoiceId });
  } catch (error) {
    console.error("Error processing invoice:", error); // Menampilkan error di terminal
    await query("ROLLBACK");
    res.status(500).json({ error: error.message });
  }
});



// Menjalankan server di port 8081
app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
