CREATE DATABASE db_employees;

USE db_employees;
GO

CREATE TABLE Employees(
	EmployeeID INT IDENTITY(1,1) PRIMARY KEY,
	Name VARCHAR(100),
	Position VARCHAR(50),
	Salary DECIMAL(12,2),
	CreatedAt DATE DEFAULT GETDATE()
);

INSERT INTO Employees (Name, Position, Salary)
VALUES
('Andi Wijaya', 'Software Engineer', 8500000.00),
('Budi Santoso', 'Backend Developer', 9000000.00),
('Citra Lestari', 'Frontend Developer', 8000000.00),
('Dewi Anggraini', 'UI/UX Designer', 7500000.00),
('Eko Prasetyo', 'QA Engineer', 7000000.00),
('Fajar Nugroho', 'DevOps Engineer', 10000000.00),
('Gita Maharani', 'Product Manager', 12000000.00),
('Hendra Saputra', 'System Analyst', 9500000.00),
('Intan Permata', 'HR Officer', 6000000.00),
('Joko Susilo', 'IT Support', 5500000.00),

('Kartika Putri', 'Finance Staff', 6500000.00),
('Lukman Hakim', 'Accountant', 7000000.00),
('Maya Sari', 'Marketing Officer', 6800000.00),
('Nanda Pratama', 'SEO Specialist', 7200000.00),
('Oki Ramadhan', 'Content Writer', 6000000.00),
('Putri Ayu', 'Social Media Manager', 7500000.00),
('Rizky Kurniawan', 'Mobile Developer', 8800000.00),
('Sari Wulandari', 'Business Analyst', 9800000.00),
('Taufik Hidayat', 'Project Manager', 11500000.00),
('Umar Fauzi', 'Network Engineer', 8200000.00),

('Vina Melati', 'Customer Service', 5000000.00),
('Wahyu Setiawan', 'Technical Writer', 7300000.00),
('Yani Oktaviani', 'Data Analyst', 10500000.00),
('Zaki Firmansyah', 'Database Administrator', 11000000.00),
('Agus Salim', 'Warehouse Supervisor', 6500000.00),
('Bella Rahma', 'Procurement Staff', 6200000.00),
('Cahyo Nugraha', 'Logistics Coordinator', 6700000.00),
('Dina Kartikasari', 'Legal Officer', 9000000.00),
('Erwin Saptono', 'Security Analyst', 10200000.00),
('Fitri Handayani', 'Training Officer', 6800000.00),

('Galih Prabowo', 'Operations Manager', 12500000.00),
('Hani Nuraini', 'Administrative Staff', 5200000.00),
('Irfan Maulana', 'Junior Developer', 6500000.00),
('Jihan Safitri', 'Recruitment Specialist', 7000000.00),
('Kevin Adrian', 'Game Developer', 9200000.00),
('Lina Marlina', 'Quality Control', 6100000.00),
('Miko Saputra', 'IT Auditor', 9800000.00),
('Novi Puspitasari', 'Public Relations', 7500000.00),
('Oscar Valentino', 'Sales Executive', 7000000.00),
('Putra Wijanarko', 'Business Development', 9500000.00),

('Queen Latifa', 'Brand Strategist', 8800000.00),
('Randy Prakoso', 'Cloud Engineer', 11500000.00),
('Siska Amelia', 'Office Manager', 8200000.00),
('Teguh Santosa', 'Maintenance Supervisor', 6800000.00),
('Uli Manurung', 'Support Engineer', 7200000.00),
('Vicky Ramadhan', 'AI Engineer', 13000000.00),
('Wulan Pertiwi', 'Graphic Designer', 7600000.00),
('Xander Pratama', 'Cyber Security', 11800000.00),
('Yusuf Akbar', 'System Administrator', 8900000.00),
('Zahra Aulia', 'Research Analyst', 9700000.00);

SELECT * FROM Employees;
