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

// API untuk  menampilkan dari Invoice
app.get('/invoice', (req, res) => {
  const sql = `
    SELECT 
      invoice.id AS invoice_id,
      invoice.inv_id,
      invoice.customer,
      invoice.due_date,
      invoice.total,
      invoice.downpayment,
      invoice_items.id AS item_id,
      invoice_items.description
    FROM invoice
    LEFT JOIN invoice_items ON invoice.id = invoice_items.invoice_id
    ORDER BY invoice.id;
  `;

  db.query(sql, (err, results) => {
    if (err) return res.json({ message: "ERROR", error: err });

    // Mengelompokkan invoice dengan items masing-masing
    const invoices = {};
    results.forEach(row => {
      if (!invoices[row.invoice_id]) {
        invoices[row.invoice_id] = {
          id: row.invoice_id,
          inv_id: row.inv_id,
          customer: row.customer,
          due_date: row.due_date,
          total: row.total,
          downpayment: row.downpayment,
          items: []
        };
      }

      if (row.item_id) { // Hanya tambahkan item jika ada
        invoices[row.invoice_id].items.push({
          id: row.item_id,
          description: row.description
        });
      }
    });

    return res.json(Object.values(invoices)); // Ubah ke array JSON
  });
});

// to read the database for read function
// :id to call the id from database
app.get('/read/:id', async (req, res) => {
  try {
    const invoiceId = req.params.id;
    
    // Ambil data invoice berdasarkan ID
    const invoiceQuery = "SELECT * FROM invoice WHERE id = ?";
    const invoiceResults = await query(invoiceQuery, [invoiceId]);

    if (invoiceResults.length === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Ambil item yang terkait dengan invoice
    const itemsQuery = "SELECT * FROM invoice_items WHERE invoice_id = ?";
    const itemsResults = await query(itemsQuery, [invoiceId]);

    // Gabungkan data invoice dan items
    const invoice = invoiceResults[0];
    invoice.items = itemsResults;

    return res.json(invoice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "ERROR", error: error.message });
  }
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
  const { customer, date, due_date, note, items, discount, total, downpayment } = req.body; // Tambahkan discount dan total

  try {
    console.log("Request body:", req.body);

    await query("START TRANSACTION");

    // Simpan invoice dengan total dan discount
    const result = await query(
      "INSERT INTO invoice (customer, date, due_date, note, discount, total, downpayment) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [customer, date, due_date, note, discount, total, downpayment]
    );

    const invoiceId = result.insertId;

    // Simpan setiap item ke invoice_items
    for (const item of items) {
      console.log("Inserting item:", item);
      await query(
        "INSERT INTO invoice_items (invoice_id, description, price) VALUES (?, ?, ?)",
        [invoiceId, item.description, item.price]
      );
    }

    await query("COMMIT");

    res.status(201).json({ message: "Invoice created successfully", invoiceId });
  } catch (error) {
    console.error("Error processing invoice:", error);
    await query("ROLLBACK");
    res.status(500).json({ error: error.message });
  }
});



// Menjalankan server di port 8081
app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
