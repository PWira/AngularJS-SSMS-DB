CREATE DATABASE db_employees;

USE db_employees;
GO

USE master;
GO

CREATE TABLE Employees(
	EmployeeID INT IDENTITY(1,1) PRIMARY KEY,
	Name VARCHAR(100),
	Position VARCHAR(50),
	DepartmentID INT FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID),
	Salary DECIMAL(12,2),
	CreatedAt DATE DEFAULT GETDATE()
);

DROP TABLE Employees;

INSERT INTO Employees (Name, Position, DepartmentID, Salary) VALUES
-- Departemen 1: Pemasaran (Marketing)
('Adi Santoso', 'Manajer Pemasaran', 1, 15000000.00),
('Bunga Lestari', 'Spesialis Konten', 1, 8500000.00),
('Candra Wijaya', 'Analis Pemasaran', 1, 9200000.00),
('Dewi Kartika', 'Koordinator Acara', 1, 7800000.00),
('Eko Prasetyo', 'Desainer Grafis', 1, 8000000.00),
('Fina Maharani', 'Asisten Pemasaran', 1, 6500000.00),
('Gatot Subroto', 'Manajer Media Sosial', 1, 11000000.00),
('Hesti Amalia', 'Spesialis SEO', 1, 9500000.00),
('Indra Gunawan', 'Staf Penjualan', 1, 7000000.00),
('Joko Susilo', 'Direktur Pemasaran', 1, 25000000.00),

-- Departemen 2: Teknologi Informasi (IT)
('Kiki Handayani', 'Kepala Divisi IT', 2, 18000000.00),
('Lukman Hakim', 'Pengembang Backend', 2, 14000000.00),
('Maya Sari', 'Pengembang Frontend', 2, 13500000.00),
('Nanda Wirawan', 'Administrator Jaringan', 2, 10500000.00),
('Olivia Putri', 'Analis Data', 2, 11500000.00),
('Putra Dharma', 'Spesialis Keamanan Siber', 2, 12000000.00),
('Qori Ananda', 'Helpdesk IT', 2, 7500000.00),
('Rizky Fadilah', 'Manajer Proyek IT', 2, 16000000.00),
('Siti Rahayu', 'Software Tester', 2, 9000000.00),
('Taufik Hidayat', 'Arsitek Solusi', 2, 22000000.00),
('Umar Bakri', 'DevOps Engineer', 2, 15000000.00),
('Vina Aliana', 'Technical Writer', 2, 8500000.00),
('Wahyu Nugroho', 'Cloud Engineer', 2, 14500000.00),
('Xena Pramesti', 'Database Administrator', 2, 13000000.00),
('Yudi Iskandar', 'Pengembang Mobile', 2, 12500000.00),

-- Departemen 3: Keuangan (Finance)
('Zainal Arifin', 'Direktur Keuangan', 3, 28000000.00),
('Amelita Sari', 'Manajer Akuntansi', 3, 16500000.00),
('Bambang Setiawan', 'Analis Keuangan Senior', 3, 14000000.00),
('Citra Dewi', 'Staf Pajak', 3, 9000000.00),
('Dodi Hartono', 'Kasir', 3, 7000000.00),
('Erlina Putri', 'Auditor Internal', 3, 12500000.00),
('Farhan Alamsyah', 'Spesialis Pengadaan', 3, 10000000.00),
('Gita Laksmi', 'Akuntan Junior', 3, 8500000.00),
('Hendro Susanto', 'Manajer Treasury', 3, 18000000.00),
('Irma Suryani', 'Staf Administrasi Keuangan', 3, 6800000.00),

-- Departemen 4: Sumber Daya Manusia (HRD)
('Jaya Kusuma', 'Kepala SDM', 4, 19000000.00),
('Lina Maulina', 'Spesialis Rekrutmen', 4, 11000000.00),
('Mamat Siregar', 'Staf HRIS', 4, 9500000.00),
('Nina Adinda', 'Manajer Pelatihan', 4, 13000000.00),
('Oki Darmawan', 'Staf Payroll', 4, 8800000.00),

-- Departemen 5: Operasi (Operations)
('Pramono Jati', 'Direktur Operasi', 5, 26000000.00),
('Rani Wijaya', 'Manajer Logistik', 5, 15500000.00),
('Slamet Riyadi', 'Koordinator Gudang', 5, 9800000.00),
('Tria Monica', 'Staf Administrasi Operasi', 5, 7200000.00),
('Udin Saiful', 'Manajer Kualitas', 5, 13500000.00),
('Vera Damayanti', 'Analis Proses Bisnis', 5, 11500000.00),
('Wawan Kusnandar', 'Spesialis Pengiriman', 5, 8000000.00),
('Yanti Mulyani', 'Asisten Operasi', 5, 6500000.00),
('Zaki Anwar', 'Kepala Produksi', 5, 17000000.00);

SELECT * FROM Employees;

CREATE TABLE Departments(
	DepartmentID INT IDENTITY(1,1) PRIMARY KEY,
	DepartmentName VARCHAR(50)
);

DROP TABLE Departments;

INSERT INTO Departments (DepartmentName) VALUES
('Pemasaran'),
('Teknologi Informasi'),
('Keuangan'),
('Sumber Daya Manusia'),
('Operasi');

SELECT * FROM Departments;

SELECT 
	e.Name,
    d.DepartmentName,
    e.Position,
    e.Salary
FROM Employees e
LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID
ORDER BY EmployeeID;