const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000/home", // React frontend
  credentials: true, // allow cookies
}));
app.use(cookieParser());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "SchoolDb",
  password: "postgres123",
  port: 5432,
})

const JWT_secret = "your-secret";

//sign-up route
app.post('/signup', async (req, res) => {
  const { name,email,password,role,className,emprole } = req.body;
  try {

    const existingUser = await pool.query('select * from users where email=$1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users(name,email,password,role,className,emprole) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [name, email, hashedPassword, req.body.role, req.body.className || null, req.body.emprole || null]
    );
    const user = result.rows[0];
    //token creation
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_secret, { expiresIn: '1h', });

    //send token in http only cookie
    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'strict' })
      .json({user});
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "server error" });
  }
})

//login route

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('select * from users where email=$1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: "User not found" });

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_secret, { expiresIn: '1h', });
    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'strict', }).json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" })
  }
});

//Protected route
app.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, JWT_secret);
    const result = await pool.query('SELECT id, name, email, role, className, emprole FROM users WHERE id=$1', [decoded.id]);
    const user = result.rows[0];
    res.json({ user });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
});


// 🔹 Logout
app.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"))