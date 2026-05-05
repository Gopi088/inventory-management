const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// 🔥 DB CONNECTION (FIXED + SAFE)
// ===============================
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'inventory',
  password: 'admin123',
  port: 5432,
});

// 🔥 TEST DB CONNECTION
pool.connect()
  .then(() => console.log('✅ DB Connected'))
  .catch(err => console.error('❌ DB Connection Error:', err));

// ===============================
// 🔥 HELPER: snake_case → camelCase
// ===============================
const mapAsset = (a) => ({
  id: a.id,
  name: a.name,
  serial: a.serial,
  brand: a.brand,
  model: a.model,
  type: a.type,
  status: a.status,
  condition: a.condition,

  issuedTo: a.issued_to,
  issuedBy: a.issued_by,
  issuedOn: a.issued_on,
  returnDate: a.return_date,

  // 🔥 THIS IS WHAT YOU ARE MISSING
  employeeId: a.employee_id,
  issuedEmail: a.issued_email,

  notes: a.notes,
  vendor: a.vendor,
  maintenanceIssue: a.maintenance_issue,

  createdAt: a.created_at,
});

// ===============================
// ✅ TEST ROUTE
// ===============================
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// ===============================
// ✅ GET ALL ASSETS
// ===============================
app.get('/assets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM assets ORDER BY id DESC');

    console.log('RAW DB:', result.rows); // 🔥 debug

    const data = result.rows.map((a) => {
  const mapped = mapAsset(a);

  console.log("DB RAW:", a.employee_id, a.issued_email);
  console.log("MAPPED:", mapped.employeeId, mapped.issuedEmail);

  return mapped;
});

    console.log('MAPPED:', data); // 🔥 debug

    res.json(data);

  } catch (err) {
    console.error('FETCH ERROR:', err);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

// ===============================
// ✅ ADD ASSET
// ===============================
app.post('/assets', async (req, res) => {
  try {
    const {
      name,
      serial,
      brand,
      model,
      type,
      status,
      condition,
      issuedTo,
      issuedBy,
      issuedOn,
      returnDate,
      notes,

      employeeId,
      issuedEmail,

      vendor,
      maintenanceIssue
    } = req.body;

    console.log('📥 INSERT DATA:', req.body); // 🔥 debug

    const result = await pool.query(
      `INSERT INTO assets
      (name, serial, brand, model, type, status, condition,
       issued_to, issued_by, issued_on, return_date,
       employee_id, issued_email,
       notes, vendor, maintenance_issue, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,NOW())
      RETURNING *`,
      [
        name || null,
        serial || null,
        brand || null,
        model || null,
        type || 'other',
        status || 'available',
        condition || 'Good',
        issuedTo || null,
        issuedBy || null,
        issuedOn || null,
        returnDate || null,
        employeeId || null,
        issuedEmail || null,
        notes || null,
        vendor || null,
        maintenanceIssue || null
      ]
    );

    res.json(mapAsset(result.rows[0]));

  } catch (err) {
    console.error('INSERT ERROR:', err);
    res.status(500).json({ error: 'Insert failed' });
  }
});

// ===============================
// ✅ UPDATE ASSET
// ===============================
app.put('/assets/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      serial,
      brand,
      model,
      type,
      status,
      condition,
      issuedTo,
      issuedBy,
      issuedOn,
      returnDate,
      notes,
      employeeId,
      issuedEmail,
      vendor,
      maintenanceIssue
    } = req.body;

    console.log("🔄 UPDATE DATA:", req.body); // DEBUG

    const result = await pool.query(
      `UPDATE assets SET
        name = COALESCE($1, name),
        serial = COALESCE($2, serial),
        brand = COALESCE($3, brand),
        model = COALESCE($4, model),
        type = COALESCE($5, type),
        status = COALESCE($6, status),
        condition = COALESCE($7, condition),
        issued_to = COALESCE($8, issued_to),
        issued_by = COALESCE($9, issued_by),
        issued_on = COALESCE($10, issued_on),
        return_date = COALESCE($11, return_date),
        employee_id = COALESCE($12, employee_id),
        issued_email = COALESCE($13, issued_email),
        notes = COALESCE($14, notes),
        vendor = COALESCE($15, vendor),
        maintenance_issue = COALESCE($16, maintenance_issue)
      WHERE id = $17
      RETURNING *`,
      [
        name || null,
        serial || null,
        brand || null,
        model || null,
        type || null,
        status || null,
        condition || null,
        issuedTo || null,
        issuedBy || null,
        issuedOn || null,
        returnDate || null,
        employeeId || null,
        issuedEmail || null,
        notes || null,
        vendor || null,
        maintenanceIssue || null,
        id
      ]
    );

    console.log("✅ UPDATED ROW:", result.rows[0]);

    res.json(mapAsset(result.rows[0]));

  } catch (err) {
    console.error('UPDATE ERROR:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// ===============================
// ✅ DELETE
// ===============================
app.delete('/assets/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM assets WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE ERROR:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

// ===============================
app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});