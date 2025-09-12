const request = require("supertest");
const app = require("../index");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "SchoolDbTest", //  use a separate test DB
  password: "postgres123",
  port: 5432,
});

beforeAll(async () => {
  // Reset test DB
  await pool.query("DROP TABLE IF EXISTS users CASCADE");
  await pool.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(200),
      role VARCHAR(50),
      className VARCHAR(50),
      emprole VARCHAR(50)
    );
  `);
});

afterAll(async () => {
  await pool.end();
});

// --- TEST CASES ---

describe("Auth API", () => {
  test("Signup should create new user", async () => {
    const res = await request(app)
      .post("/signup")
      .send({
        name: "Johne Doe",
        email: "johny@test.com",
        password: "test123",
        role: "student",
        className: "10A",
        emprole: "user"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe("johny@test.com");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  test("Signup with existing email should fail", async () => {
    const res = await request(app)
      .post("/signup")
      .send({
        name: "Another John",
        email: "john@test.com", // same email
        password: "pass123",
        role: "student",
        className: "10A",
        emprole: "user"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Email already exists/);
  });

  test("Login with correct credentials should succeed", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        email: "john@test.com",
        password: "test123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe("john@test.com");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  test("Login with wrong password should fail", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        email: "john@test.com",
        password: "wrongpass"
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/Invalid credentials/);
  });

  test("Access /me with token should return user", async () => {
    const login = await request(app)
      .post("/login")
      .send({ email: "john@test.com", password: "test123" });

    const cookie = login.headers["set-cookie"];

    const res = await request(app)
      .get("/me")
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe("john@test.com");
  });

  test("Logout should clear token", async () => {
    const login = await request(app)
      .post("/login")
      .send({ email: "john@test.com", password: "test123" });

    const cookie = login.headers["set-cookie"];

    const res = await request(app)
      .post("/logout")
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Logged out");
  });

  test("Admin-only route should reject non-admin", async () => {
    const login = await request(app)
      .post("/login")
      .send({ email: "john@test.com", password: "test123" });

    const cookie = login.headers["set-cookie"];

    const res = await request(app)
      .get("/admin-only-test") // hypothetical admin route
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(403);
  });
});
