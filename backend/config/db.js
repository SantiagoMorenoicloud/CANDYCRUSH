// config/db.js
import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "sena",
  database: "candy_crush",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

try {
  const connection = await pool.getConnection();
  console.log("✅ Conexión a la base de datos MySQL exitosa");
  connection.release();
} catch (error) {
  console.error("❌ Error al conectar a la base de datos:", error.message);
}

