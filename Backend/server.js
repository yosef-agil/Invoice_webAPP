require("dotenv").config();
const express = require("express");
const mysql = require('mysql2/promise'); // Gunakan mysql2/promise
const cors = require('cors');

const app = express();

// Konfigurasi CORS
app.use(cors({
  origin: [
    'https://frontendinv-production.up.railway.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// Konfigurasi Pool Koneksi
const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  },
  connectTimeout: 20000,
  timezone: 'Z',
  charset: 'utf8mb4',
});

// Cek koneksi database saat startup
async function checkDatabaseConnection() {
  try {
    const connection = await db.getConnection();
    console.log('✅ Database connected successfully');
    await connection.query('SELECT 1');
    console.log('Database test successful');
    connection.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    // Tidak perlu retry loop di sini, karena ini hanya check awal.
    // Error handler utama akan mencoba lagi jika koneksi terputus saat request.
  }
}
checkDatabaseConnection();

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.status(200).json({ status: 'healthy', database: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).json({ status: 'unhealthy', error: err.message, timestamp: new Date().toISOString() });
  }
});

// Main endpoint
app.get("/", (req, res) => {
  res.json("Backend service is running");
});

// Endpoint /invoice
app.get('/invoice', async (req, res) => {
  try {
    const sql = `
      SELECT 
        invoice.id AS invoice_id, invoice.inv_id, invoice.customer, invoice.due_date,
        invoice.total, invoice.downpayment, invoice_items.id AS item_id, invoice_items.description
      FROM invoice
      LEFT JOIN invoice_items ON invoice.id = invoice_items.invoice_id
      ORDER BY invoice.id;
    `;
    const [results] = await db.query(sql);

    const invoices = {};
    results.forEach(row => {
      if (!invoices[row.invoice_id]) {
        invoices[row.invoice_id] = {
          id: row.invoice_id, inv_id: row.inv_id, customer: row.customer,
          due_date: row.due_date, total: row.total, downpayment: row.downpayment,
          items: []
        };
      }
      if (row.item_id) { // Hanya tambahkan item jika item_id ada (mencegah item null jika tidak ada join)
        invoices[row.invoice_id].items.push({ id: row.item_id, description: row.description });
      }
    });

    res.json(Object.values(invoices));
  } catch (err) {
    console.error('Error fetching invoices:', err);
    res.status(500).json({ error: 'Database error', message: err.message });
  }
});

app.get('/read/:id', async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const [invoiceResults] = await db.query("SELECT * FROM invoice WHERE id = ?", [invoiceId]);
    if (invoiceResults.length === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    const [itemsResults] = await db.query("SELECT * FROM invoice_items WHERE invoice_id = ?", [invoiceId]);
    const invoice = invoiceResults[0];
    invoice.items = itemsResults;
    return res.json(invoice);
  } catch (error) {
    console.error('Error reading invoice:', error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

app.get("/paketan", async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM price_list");
    return res.json(data);
  } catch (err) {
    console.error('Error fetching price list:', err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

app.post("/invoice", async (req, res) => {
  const { customer, date, due_date, note, items, discount, total, downpayment } = req.body;
  let connection; // Deklarasikan di luar try agar bisa diakses di finally

  try {
    connection = await db.getConnection(); // Dapatkan koneksi untuk transaksi
    await connection.beginTransaction();

    const [result] = await connection.query(
      "INSERT INTO invoice (customer, date, due_date, note, discount, total, downpayment) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [customer, date, due_date, note, discount, total, downpayment]
    );
    const invoiceId = result.insertId;

    if (items && items.length > 0) {
      for (const item of items) {
        await connection.query(
          "INSERT INTO invoice_items (invoice_id, description, price) VALUES (?, ?, ?)",
          [invoiceId, item.description, item.price]
        );
      }
    }

    await connection.commit();
    res.status(201).json({ message: "Invoice created successfully", invoiceId });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error processing invoice:", error);
    res.status(500).json({ error: error.message, message: "Failed to create invoice" });
  } finally {
    if (connection) {
      connection.release(); // Selalu lepaskan koneksi
    }
  }
});

// SERVER LISTENING
const PORT = process.env.PORT; // Hanya gunakan port dari Railway ENV
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('MySQL Host:', process.env.MYSQLHOST);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    db.end(); // Tutup pool koneksi database
    process.exit(0);
  });
});