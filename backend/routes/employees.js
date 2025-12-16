const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();
const { poolPromise, sql } = require("../db");

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
        const decoded = jwt.verify(token, 'SECRET_KEY');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid token' });
    }
};

// GET ALL WITH PAGINATION
router.get("/", authMiddleware, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    try {
        const pool = await poolPromise;
        
        // Request COUNT
        const countRequest = pool.request();
        const totalResult = await countRequest.query("SELECT COUNT(*) AS totalRecords FROM Employees");
        const totalRecords = totalResult.recordset[0].totalRecords;
        
        // Request DATA
        const dataRequest = pool.request();
        dataRequest.input('offset', sql.Int, offset);
        dataRequest.input('limit', sql.Int, limit);
        const paginatedQuery = `
            SELECT * FROM Employees
            ORDER BY EmployeeID 
            OFFSET @offset ROWS 
            FETCH NEXT @limit ROWS ONLY
        `;
        
        const dataResult = await dataRequest.query(paginatedQuery);
        
        res.json({
            data: dataResult.recordset,
            totalRecords: totalRecords,
            currentPage: page,
            totalPages: Math.ceil(totalRecords / limit)
        });

    } catch (err) {
        console.error("Database error:"); 
        res.status(500).json({ error: "Gagal memuat data karyawan." });
    }
});

router.get("/search", authMiddleware, async (req, res) => {
    const searchName = req.query.name || '';
    
    if (!searchName) {
        return res.status(400).json({ error: "Nama pencarian tidak boleh kosong" });
    }

    try {
        const pool = await poolPromise;
        const request = pool.request();
        
        request.input('searchName', sql.NVarChar, `%${searchName}%`);
        
        const result = await request.query(
            "SELECT * FROM Employees WHERE Name LIKE @searchName ORDER BY EmployeeID"
        );
        
        res.json({
            data: result.recordset
        });

    } catch (err) {
        console.error("Search error:");
        res.status(500).json({ error: "Gagal mencari data" });
    }
});

// GET BY ID
router.get("/:id", authMiddleware, async (req, res) => {
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
    res.status(500).json({ error: "Invalid ID" });
    }
});

// INSERT NEW EMPLOYEE
router.post("/", authMiddleware, async (req, res) => {
    const { Name, Position, Salary } = req.body;

    if (!Name || Name.trim().length < 2) {
        return res.status(400).json({ error: "Nama minimal 2 karakter" });
    }
    if (!Position || Position.trim().length < 2) {
        return res.status(400).json({ error: "Posisi minimal 2 karakter" });
    }
    if (!Salary || Salary < 0) {
        return res.status(400).json({ error: "Gaji harus positif" });
    }

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
        res.status(500).json({ error: "Data Tidak sesuai!" });
    }
});

// UPDATE EMPLOYEE DATA
router.put("/:id", authMiddleware, async (req, res) => {
    const id = parseInt(req.params.id);
    const { Name, Position, Salary } = req.body;
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
    res.status(500).json({ error: "Update data gagal" });
    }
});

// DELETE EMPLOYEE
router.delete("/:id", authMiddleware, async (req, res) => {
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
    res.status(500).json({ error: "Delete Data Gagal" });
    }
});


module.exports = router;
