const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');


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
    console.log('Session:', req.session);
    console.log('User:', req.user);
    console.log('Cookies:', req.headers.cookie);
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    try {
        const decoded = jwt.verify(token, JWT_secret);
        
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


//admin routes with events

app.get('/events', async (req, res) => {
    try {
        // const {month,year} = req.query;
        // let query = `select event.*, user.name as created_by from events event left join users user on event.created_by = user.id order by event.event_date desc`;

        // let params = [];
        // if(year && month){
        //     query =`select event.*, user.name as created_by from events event left join users user on event.created_by = user.id
        //         where extract(month from event.event_date)=$1 and extract(year from event.event_date)=$2 order by event.event_date desc`;
        //     params=[month,year];
        //     }
        // const result = await pool.query(query,params);
        const result = await pool.query('select * from events');
        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/admin/events', requireAdmin, async (req, res) => {
    const { title, description, event_date, location } = req.body;
    try {
        const result = await pool.query('insert into events(title,description,event_date,location,created_by) values ($1,$2,$3,$4,$5) RETURNING *', [title, description, event_date, location, req.user.id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error" })
    }
});

app.delete('/admin/events/:id', requireAdmin, async (req, res) => {
    console.log('Delete route hit');
    const { id } = req.params;
    try {
        const result = await pool.query('delete from events where id=$1 returning *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Event not found." });
        res.json({ message: "Event deleted successfully" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }

});

app.put('/admin/events/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { title, event_date, description, location } = req.body;
    try {
        const result = await pool.query('update events set title = $1,event_date = $2, description = $3, location = $4, created_by = $5, id=$6 returning *',
            [title, event_date, description, location, req.user.id, id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Event not found." });
        res.json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
});

//admin route with gallery
const fs = require('fs');
const path = './public/Images';
if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
}

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Only allow image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

app.post("/admin/gallery", requireAdmin, upload.array("images"), async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        const uploadedFiles = [];
        const titles = req.body.titles ? (Array.isArray(req.body.titles) ? req.body.titles : [req.body.titles]) : [];

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            const filename = `${Date.now()}_${file.originalname}`;
            const title = titles[i] || file.originalname.split('.')[0];

            const query = `
                INSERT INTO gallery_images (filename, original_name, title, mime_type, file_size, image_data, uploaded_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id, filename, original_name, title, mime_type, file_size, uploaded_at
            `;

            const values = [
                filename,
                file.originalname,
                title,
                file.mimetype,
                file.size,
                file.buffer, // Binary data
                req.user.id
            ];

            const result = await client.query(query, values);
            uploadedFiles.push(result.rows[0]);
        }

        await client.query('COMMIT');

        console.log(`Successfully stored ${uploadedFiles.length} images in database`);
        res.json({
            message: "Images uploaded successfully",
            files: uploadedFiles
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Database upload error:", err);
        res.status(500).json({ error: "Upload failed" });
    } finally {
        client.release();
    }
});

app.get("/gallery", async (req, res) => {
    console.log("Gallery fetch route hit");
    
    try {
        const query = `
            SELECT g.id, g.filename, g.original_name, g.title, g.mime_type, 
                   g.file_size, g.uploaded_at, u.name as uploaded_by_name
            FROM gallery_images g
            LEFT JOIN users u ON g.uploaded_by = u.id
            ORDER BY g.uploaded_at DESC
        `;
        
        const result = await pool.query(query);
        res.json(result.rows);
        
    } catch (err) {
        console.error("Error fetching gallery:", err);
        res.status(500).json({ error: "Failed to fetch gallery: " + err.message });
    }
});

// GET route to serve individual images from database
app.get("/gallery/image/:id", async (req, res) => {
    try {
        const { id } = req.params;
                
        const query = `
            SELECT filename, original_name, mime_type, image_data 
            FROM gallery_images 
            WHERE id = $1
        `;
        
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            console.log("Image not found:", id);
            return res.status(404).json({ error: "Image not found" });
        }

        const image = result.rows[0];
        
        res.set({
            'Content-Type': image.mime_type,
            'Content-Disposition': `inline; filename="${image.original_name}"`,
            'Cache-Control': 'public, max-age=31536000'
        });
        
        res.send(image.image_data);
        
    } catch (err) {
        console.error("Error serving image:", err);
        res.status(500).json({ error: "Failed to serve image" });
    }
});

// DELETE route to remove images (admin only)
app.delete("/admin/gallery/:id", requireAdmin, async (req, res) => {
    
    try {
        const { id } = req.params;
        
        const query = 'DELETE FROM gallery_images WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            console.log("Image not found for deletion:", id);
            return res.status(404).json({ error: "Image not found" });
        }
        
        console.log("Image deleted successfully:", result.rows[0].filename);
        res.json({ message: "Image deleted successfully" });
        
    } catch (err) {
        console.error("Error deleting image:", err);
        res.status(500).json({ error: "Failed to delete image: " + err.message });
    }
});

// PUT route to update image title (admin only)
app.put("/admin/gallery/:id", requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        
        if (!title || title.trim().length === 0) {
            return res.status(400).json({ error: "Title is required" });
        }
        
        const query = `
            UPDATE gallery_images 
            SET title = $1 
            WHERE id = $2 
            RETURNING id, title
        `;
        
        const result = await pool.query(query, [title.trim(), id]);
        
        if (result.rows.length === 0) {
            console.log("Image not found for update:", id);
            return res.status(404).json({ error: "Image not found" });
        }
        
        console.log("Image title updated successfully:", result.rows[0]);
        res.json({ 
            message: "Image title updated successfully", 
            image: result.rows[0] 
        });
        
    } catch (err) {
        console.error("Error updating image:", err);
        res.status(500).json({ error: "Failed to update image: " + err.message });
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
