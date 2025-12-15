const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const employeeRoutes = require("./routes/employees");
app.use("/api/employees", employeeRoutes);

app.get("/", (req, res) => {
    res.send("Backend API running");
});

app.listen(3000, () => {
    console.log("API running at http://localhost:3000");
});
