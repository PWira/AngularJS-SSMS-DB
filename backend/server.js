const express = require("express");
const rateLimit = require('express-rate-limit');
const path = require('path');
const cors = require("cors");

const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100 // 100 req per IP
});
app.use(cors());
app.use(express.json());
app.use('/api', limiter);


app.use(express.static(path.join(__dirname, '../frontend')));

const employeeRoutes = require("./routes/employees");
app.use("/api/employees", employeeRoutes);

// app.get('*', (req, res, next) => {
//     // Skip jika request ke API
//     if (req.path.startsWith('/api')) {
//         return next();
//     }
//     res.sendFile(path.join(__dirname, '../frontend/index.html'));
// });

app.listen(3000, () => {
    console.log("API running at http://localhost:3000");
});
