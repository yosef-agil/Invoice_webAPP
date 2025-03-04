import connection from '../../lib/db';

export default async function handler(req, res) {
    try {
        const [rows] = await connection.query('SELECT NOW() AS currentTime');
        res.status(200).json({ success: true, time: rows[0].currentTime });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}