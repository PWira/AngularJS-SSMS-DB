const sql = require("mssql");

const config = {
    user: "sa",
    password: "qwerty135",
    server: "localhost",
    database: "db_employees",
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
    console.log("SQL Server connected");
    return pool;
})
    .catch(err => {
    console.error("Database Connection Failed:", err);
    process.exit(1);
});

module.exports = {
    sql,
    poolPromise
};
