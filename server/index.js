import "dotenv/config";
import express from "express";
import cors from "cors";
import pg from "pg";

//Database Connections (pool is the connection we will reuse for each request)
const pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

//Creates the server.
const app = express();

//Only allow request from the React dev site. Other websites get blocked by the browser.
app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json());

const STATUSES = ["Pending", "Denied", "Offered"];


//GET /api/jobs: send back every job.
app.get("/api/jobs", async (req, res) => {
    try {
        const results = await pool.query(
            "SELECT * FROM jobs ORDER BY applied_date DESC, id DESC"
        );
        res.json(results.rows);
    } catch (err){
        console.error(err);
        res.status(500).json({ error: "Could not load jobs" });
    }
});

//POST /api/jobs: save one new job.
app.post("/api/jobs", async (req, res) => {

    const { role, company, platform, status } = req.body ?? {}

    if(!role || !company || !platform) {
        return res.status(400).json({ error: "Role, company, and platform are required" });
    }
    if(!STATUSES.includes(status)) {
        return res.status(400).json({ error: "Pick a status" });
    }

    try {
        const results = await pool.query(
            "INSERT INTO jobs (role, company, platform, status) VALUES ($1, $2, $3, $4) RETURNING *",
            [role, company, platform, status]
        );
        res.status(201).json(results.rows[0])
    }
    catch (err){
        console.error(err);
        res.status(500).json({ error : "Could not save job"});
    }
});


//Starting the server
app.listen(3001, "127.0.0.1", () => {
    console.log("Server running at http://localhost:3001");
});