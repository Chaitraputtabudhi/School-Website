const request = require("supertest");
const app = require("../index");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "SchoolDbTest", // separate test DB
  password: "postgres123",
  port: 5432,
});

// Reset DB before tests
beforeAll(async () => {
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

// --- Helper for logging ---
function logTestCase(name, input, res) {
  console.log(`\n===== TEST CASE: ${name} =====`);
  console.log("INPUT:", input);
  console.log("OUTPUT:", {
    status: res.statusCode,
    body: res.body
  });
  console.log("====================================\n");
}

// --- TEST CASES ---
describe("Auth API", () => {
  test("Signup should create new user", async () => {
    const input = {
      name: "Johne oe",
      email: "jhn@test.com",
      password: "test123",
      role: "student",
      className: "10A",
      emprole: "user"
    };

    const res = await request(app).post("/signup").send(input);
    logTestCase("Signup should create new user", input, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe("jhn@test.com");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  test("Signup with existing email should fail", async () => {
    const input = {
      name: "Another John",
      email: "jhn@test.com",
      password: "pass123",
      role: "student",
      className: "10A",
      emprole: "user"
    };

    const res = await request(app).post("/signup").send(input);
    logTestCase("Signup with existing email should fail", input, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Email already exists/);
  });

  test("Login with correct credentials should succeed", async () => {
    const input = { email: "jhn@test.com", password: "test123" };

    const res = await request(app).post("/login").send(input);
    logTestCase("Login with correct credentials should succeed", input, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe("jhn@test.com");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  test("Login with wrong password should fail", async () => {
    const input = { email: "jhn@test.com", password: "wrongpass" };

    const res = await request(app).post("/login").send(input);
    logTestCase("Login with wrong password should fail", input, res);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/Invalid credentials/);
  });

  test("Access /me with token should return user", async () => {
    const loginInput = { email: "jhn@test.com", password: "test123" };
    const login = await request(app).post("/login").send(loginInput);
    const cookie = login.headers["set-cookie"];

    const res = await request(app).get("/me").set("Cookie", cookie);
    logTestCase("Access /me with token should return user", loginInput, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe("jhn@test.com");
  });

  test("Logout should clear token", async () => {
    const loginInput = { email: "jhn@test.com", password: "test123" };
    const login = await request(app).post("/login").send(loginInput);
    const cookie = login.headers["set-cookie"];

    const res = await request(app).post("/logout").set("Cookie", cookie);
    logTestCase("Logout should clear token", loginInput, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Logged out");
  });

  test("Admin-only route should reject non-admin", async () => {
    const loginInput = { email: "jhn@test.com", password: "test123" };
    const login = await request(app).post("/login").send(loginInput);
    const cookie = login.headers["set-cookie"];

    const res = await request(app).get("/admin-only-test").set("Cookie", cookie);
    logTestCase("Admin-only route should reject non-admin", loginInput, res);

    expect(res.statusCode).toBe(403);
  });
});
