const express = require("express");
const router = express.Router();
const { poolPromise, sql } = require("../db");
const authMiddleware = require("../middleware/auth.js");

router.use(authMiddleware);

// GET ALL WITH PAGINATION
router.get("/", async (req, res) => {
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
            SELECT 
                e.EmployeeID,
                e.Name,
                e.DepartmentID,
                d.DepartmentName AS DepartmentName,
                e.Position,
                e.Salary
            FROM Employees e
            LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID
            WHERE e.EmployeeID IN (
                SELECT EmployeeID 
                FROM Employees 
                ORDER BY EmployeeID 
                OFFSET @offset ROWS 
                FETCH NEXT @limit ROWS ONLY
            )
            ORDER BY e.EmployeeID;
        `;
        
        const dataResult = await dataRequest.query(paginatedQuery);
        
        res.json({
            data: dataResult.recordset,
            totalRecords: totalRecords,
            currentPage: page,
            totalPages: Math.ceil(totalRecords / limit)
        });
        console.log("Fetched employee data successfully");

    } catch (err) {
        console.error("Database error"); 
        res.status(500).json({ error: "Gagal memuat data karyawan." });
    }
});

//GET SEARCH BY NAME
router.get("/search", async (req, res) => {
    const searchName = req.query.name || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const pool = await poolPromise;
        
        // COUNT filter
        const countRequest = pool.request();
        const countQuery = `
            SELECT COUNT(*) AS totalRecords 
            FROM Employees 
            WHERE Name LIKE @searchName
        `;
        const totalResult = await countRequest
            .input('searchName', sql.NVarChar, `%${searchName}%`)
            .query(countQuery);
        const totalRecords = totalResult.recordset[0].totalRecords;
        
        // DATA pagination
        const dataRequest = pool.request();
        const paginatedQuery = `
            SELECT 
                e.EmployeeID,
                e.Name,
                e.DepartmentID,
                d.DepartmentName AS DepartmentName,
                e.Position,
                e.Salary
            FROM Employees e
            LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID
            WHERE e.EmployeeID IN (
                SELECT EmployeeID 
                FROM Employees 
                WHERE Name LIKE @searchName
                ORDER BY EmployeeID
                OFFSET @offset ROWS 
                FETCH NEXT @limit ROWS ONLY
            )
        `;
        
        const dataResult = await dataRequest
            .input('searchName', sql.NVarChar, `%${searchName}%`)
            .input('offset', sql.Int, offset)
            .input('limit', sql.Int, limit)
            .query(paginatedQuery);
        
        res.json({
            data: dataResult.recordset,
            totalRecords: totalRecords,
            currentPage: page,
            totalPages: Math.ceil(totalRecords / limit)
        });
        console.log("Search completed successfully");

    } catch (err) {
        console.error("Search error:");
        res.status(500).json({ error: "Gagal mencari data" });
    }
});

// GET BY DEPARTMENT ID
router.get("/department", async (req, res) => {
    const Did = parseInt(req.query.Did);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    if (isNaN(Did)) {
        return res.status(400).json({ error: "Invalid Department ID" });
    }
    
    try {
        const pool = await poolPromise;
        
        // COUNT filter
        const countRequest = pool.request();
        const countQuery = `
            SELECT COUNT(*) AS totalRecords 
            FROM Employees
            WHERE DepartmentID = @Did
        `;
        const totalResult = await countRequest
            .input('Did', sql.Int, Did)
            .query(countQuery);
        const totalRecords = totalResult.recordset[0].totalRecords;
        
        // DATA pagination
        const dataRequest = pool.request();
        const paginatedQuery = `
            SELECT 
                e.EmployeeID,
                e.Name,
                e.DepartmentID,
                d.DepartmentName AS DepartmentName,
                e.Position,
                e.Salary
            FROM Employees e 
            LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID
            WHERE e.EmployeeID IN (
                SELECT EmployeeID 
                FROM Employees 
                WHERE DepartmentID = @Did
                ORDER BY EmployeeID
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY
            )
        `;
        
        const dataResult = await dataRequest
            .input('Did', sql.Int, Did)
            .input('offset', sql.Int, offset)
            .input('limit', sql.Int, limit)
            .query(paginatedQuery);
        
        res.json({
            data: dataResult.recordset,
            totalRecords: totalRecords,
            currentPage: page,
            totalPages: Math.ceil(totalRecords / limit)
        });
        console.log("Fetched employees by department successfully");
        
    } catch (err) {
        console.error("Error fetching by department:", err);
        res.status(500).json({ error: "Failed to fetch employees" });
    }
});

// GET BY ID
router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid employee ID" });
    }
    try {
        const pool = await poolPromise;
        // COUNT filter
        const countRequest = pool.request();
        const countQuery = `
            SELECT COUNT(*) AS totalRecords FROM Employees
            WHERE EmployeeID = @id
        `;
        const totalResult = await countRequest
            .input("id",sql.Int, id)
            .query(countQuery);
        const totalRecords = totalResult.recordset[0].totalRecords;
        
        // DATA pagination
        const dataRequest = pool.request();
        const paginatedQuery = `
            SELECT 
                e.EmployeeID,
                e.Name,
                e.DepartmentID,
                d.DepartmentName AS DepartmentName,
                e.Position,
                e.Salary
            FROM Employees e 
            LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID
            WHERE EmployeeID = @id
        `;
        
        const dataResult = await dataRequest
            .input("id", sql.Int, id)
            .input('offset', sql.Int, offset)
            .input('limit', sql.Int, limit)
            .query(paginatedQuery);
        
        res.json({
            data: dataResult.recordset,
            totalRecords: totalRecords,
            currentPage: page,
            totalPages: Math.ceil(totalRecords / limit)
        });
        
        res.json({
            data: dataResult.recordset,
            totalRecords: totalRecords,
            currentPage: page,
            totalPages: Math.ceil(totalRecords / limit)
        });
    console.log("Fetched employee by ID successfully");
    } catch (err) {
    console.error("Error fetching by ID");
    res.status(500).json({ error: "Invalid ID" });
    }
});

// INSERT NEW EMPLOYEE
router.post("/", async (req, res) => {
    const { Name, DepartmentID, Position, Salary } = req.body;

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
            .input("DepartmentID", sql.Int, DepartmentID)
            .input("Position", sql.NVarChar, Position)
            .input("Salary", sql.Int, Salary)
            .query(
                `INSERT INTO Employees (Name, DepartmentID, Position, Salary) VALUES (@Name, @DepartmentID, @Position, @Salary); SELECT SCOPE_IDENTITY() AS EmployeeID;`
            );
        res.status(201).json({ EmployeeID: result.recordset[0].EmployeeID });
        console.log("Inserted new employee successfully");
    } catch (err) {
        console.error("Error inserting new employee");
        res.status(500).json({ error: "Data Tidak sesuai!" });
    }
});

// UPDATE EMPLOYEE DATA
router.put("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { Name, DepartmentID, Position, Salary } = req.body;
    if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid employee ID" });
    }
    try {
    const pool = await poolPromise;
    await pool
        .request()
        .input("id", sql.Int, id)
        .input("Name", sql.NVarChar, Name)
        .input("DepartmentID", sql.Int, DepartmentID)
        .input("Position", sql.NVarChar, Position)
        .input("Salary", sql.Int, Salary)
        .query(
            "UPDATE Employees SET Name = @Name, DepartmentID = @DepartmentID, Position = @Position, Salary = @Salary WHERE EmployeeID = @id"
        );
    res.json({ message: "Employee updated successfully" });
    console.log("Updated employee successfully");
    } catch (err) {
    res.status(500).json({ error: "Update data gagal" });
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
    console.log("Deleted employee successfully");
    } catch (err) {
        console.error("Error deleting employee");
    res.status(500).json({ error: "Delete Data Gagal" });
    }
});


module.exports = router;
