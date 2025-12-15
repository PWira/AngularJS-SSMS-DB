const express = require("express");
const router = express.Router();
const { poolPromise, sql } = require("../db");

// GET ALL
router.get("/", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Employees");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET BY ID
router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid employee ID" });
    }
    try {
    const pool = await poolPromise;
    const result = await pool
        .request()
        .input("id", sql.Int, id)
        .query("SELECT * FROM Employees WHERE EmployeeID = @id");
    res.json(result.recordset[0]);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
});

// INSERT NEW EMPLOYEE
router.post("/", async (req, res) => {
    const { Name, Position, Office, Salary } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("Name", sql.NVarChar, Name)
            .input("Position", sql.NVarChar, Position)
            .input("Salary", sql.Int, Salary)
            .query(
                "INSERT INTO Employees (Name, Position, Salary) VALUES (@Name, @Position, @Salary); SELECT SCOPE_IDENTITY() AS EmployeeID;"
            );
        res.status(201).json({ EmployeeID: result.recordset[0].EmployeeID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE EMPLOYEE DATA
router.put("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { Name, Position, Office, Salary } = req.body;
    if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid employee ID" });
    }
    try {
    const pool = await poolPromise;
    await pool
        .request()
        .input("id", sql.Int, id)
        .input("Name", sql.NVarChar, Name)
        .input("Position", sql.NVarChar, Position)
        .input("Salary", sql.Int, Salary)
        .query(
            "UPDATE Employees SET Name = @Name, Position = @Position, Salary = @Salary WHERE EmployeeID = @id"
        );
    res.json({ message: "Employee updated successfully" });
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
});

// DELETE EMPLOYEE
router.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid employee ID" });
    }
    try {
    const pool = await poolPromise;
    await pool
        .request()
        .input("id", sql.Int, id)
        .query("DELETE FROM Employees WHERE EmployeeID = @id");
    res.json({ message: "Employee deleted successfully" });
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
});


module.exports = router;
