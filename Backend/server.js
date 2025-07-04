require("dotenv").config();
const express = require("express");
const mysql = require('mysql2');
const cors = require('cors');
const util = require("util");

const app = express();

// Gunakan PORT yang disediakan Railway atau port acak jika tidak tersedia
const PORT = process.env.PORT || 8080;

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
  connectTimeout: 20000, // Tambah timeout menjadi 20 detik
  // Tambahkan opsi berikut:
  timezone: 'Z', // Untuk sinkronisasi timezone
  charset: 'utf8mb4' // Untuk support karakter khusus
});

// Test koneksi saat startup
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', {
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    
    // Coba reconnect setiap 5 detik
    setTimeout(() => {
      console.log('Mencoba reconnect ke database...');
      db.getConnection();
    }, 5000);
  } else {
    console.log('✅ Successfully connected to database');
    connection.release();
    
    // Jalankan query test
    connection.query('SELECT 1', (err) => {
      if (err) {
        console.error('Test query failed:', err);
      } else {
        console.log('Database test query berhasil');
      }
    });
  }
});

const query = util.promisify(db.query).bind(db);

// API Endpoint utama
app.get("/", (req, res) => {
  return res.json("FROM BACKEND");
});

// Tambahkan health check endpoint
app.get('/health', async (req, res) => {
  try {
    await db.promise().query('SELECT 1');
    res.status(200).json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: 'unhealthy',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Tambahkan Middleware untuk Header
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://frontendinv-production.up.railway.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
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



// Hanya satu app.listen() di akhir file
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('MySQL Configuration:', {
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    database: process.env.MYSQLDATABASE
  });
});

// Handle error khusus untuk EADDRINUSE
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} sedang digunakan, mencoba port ${PORT + 1}...`);
    app.listen(PORT + 1);
  } else {
    console.error('Server error:', error);
    process.exit(1);
  }
});