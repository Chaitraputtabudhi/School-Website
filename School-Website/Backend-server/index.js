const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // React frontend
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

// //sign-up route
// app.post('/signup', async (req, res) => {
//   const { name,email,password,confirm_password,role,className,emprole } = req.body;
//   try {

//     const existingUser = await pool.query('select * from users where email=$1', [email]);
//     if (existingUser.rows.length > 0) {
//       return res.status(400).json({ error: 'Email already registered' });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const result = await pool.query(
//       'INSERT INTO users(name,email,password,role,className,emprole) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
//       [name, email, hashedPassword, req.body.role, req.body.className || null, req.body.emprole || null]
//     );
//     const user = result.rows[0];
//     //token creation
//     const token = jwt.sign({ id: user.id, email: user.email }, JWT_secret, { expiresIn: '1h', });

//     //send token in http only cookie
//     res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'strict' })
//       .json({user});
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ error: "server error" });
//   }
// })

// //login route

// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const result = await pool.query('select * from users where email=$1', [email]);
//     if (result.rows.length === 0) return res.status(400).json({ error: "User not found" });

//     const user = result.rows[0];
//     const isValid = await bcrypt.compare(password, user.password);

//     if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

//     const token = jwt.sign({ id: user.id, email: user.email }, JWT_secret, { expiresIn: '1h', });
//     res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'strict', }).json({ user: { id: user.id, name: user.name, email: user.email } });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Server error" })
//   }
// });

// //Protected route
// app.get("/me", async (req, res) => {
//   const token = req.cookies.token;
//   if (!token) return res.status(401).json({ error: "Not authenticated" });

//   try {
//     const decoded = jwt.verify(token, JWT_secret);
//     const result = await pool.query('SELECT id, name, email, role, className, emprole FROM users WHERE id=$1', [decoded.id]);
//     const user = result.rows[0];
//     res.json({ user });
//   } catch (err) {
//     return res.status(401).json({ error: "Invalid token" });
//   }
// });

// Update your backend signup route to handle the new fields
app.post('/signup', async (req, res) => {
    const { name, email, password, role, className, emprole } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user with all the new fields
        const result = await pool.query(
            'INSERT INTO users(name, email, password, role, className,emprole) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role, className,emprole',
            [name, email, hashedPassword, role, className, emprole]
        );
        const user = result.rows[0];
        
        // Create token with all user info
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            className: user.className,
            emprole: user.emprole
        }, JWT_secret, { expiresIn: '24h' }); // Increased to 24h for testing

        // Send token in httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // set true with https
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }).json({ 
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                className: user.className,
                emprole: user.emprole
            }
        });
    } catch (err) {
        console.log('Signup error:', err);
        if (err.code === '23505') { // PostgreSQL unique violation
            res.status(400).json({ error: "Email already exists" });
        } else {
            res.status(500).json({ error: "Server error during registration" });
        }
    }
});

// Update your login route to handle the new fields
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }

        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || 'user',
            className: user.className,
            emprole: user.emprole
        }, JWT_secret, { expiresIn: '24h' });
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }).json({
            user: {
                id: user.id, 
                name: user.name, 
                email: user.email,
                role: user.role || 'user',
                className: user.className,
                emprole: user.emprole
            }
        });
    } catch (err) {
        console.log('Login error:', err);
        res.status(500).json({ error: "Server error during login" });
    }
});

// Update the /me route to return complete user info
app.get("/me", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    try {
        const decoded = jwt.verify(token, JWT_secret);
        res.json({ user: decoded });
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
});

// Update middleware to check admin role properly
const requireAdmin = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    try {
        const decoded = jwt.verify(token, JWT_secret);
        console.log('Admin check - decoded user:', decoded);
        console.log('Admin check - emprole:', decoded.emprole);
        
        if (decoded.emprole?.toLowerCase() !== 'admin') {
            return res.status(403).json({ error: "Admin access required" });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

// Test route to create admin user (remove after creating admin)
app.post('/create-test-admin', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const result = await pool.query(
            'INSERT INTO users(name, email, password, role, emprole) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, emprole',
            ['Test Admin', 'admin@test.com', hashedPassword, 'employee', 'admin']
        );
        const user = result.rows[0];
        res.json({ 
            message: 'Test admin created successfully', 
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role, 
                emprole: user.emprole 
            } 
        });
    } catch (err) {
        console.log('Error creating test admin:', err);
        res.status(500).json({ error: "Failed to create test admin" });
    }
});

// Test admin-only route
app.get("/admin-only-test", requireAdmin, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

// 🔹 Logout
app.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

//Jest can import the Express app without starting multiple servers.
if (require.main === module) {
  app.listen(5000, () => console.log("Server running on http://localhost:5000"));
}

module.exports = app; // for testing 
