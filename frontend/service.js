angular.module("employeeApp")
.service("EmployeeService", function($http) {
    const API = "http://localhost:3000/api/employees";

    return {
        getAll: function(page = 1, limit = 10) {
            return $http.get(`${API}?page=${page}&limit=${limit}`); 
        },
        getById: function(id) {
            return $http.get(`${API}/${id}`);
        },
        create: function(employee) {
            return $http.post(API, employee);
        },
        update: function(employee) {
            if (!employee || !employee.EmployeeID) {
                console.error("Invalid employee data:", employee);
                return Promise.reject({ message: "Employee ID is required" });
            }
            
            console.log("Updating employee ID:", employee.EmployeeID); // DEBUG
            
            return $http.put(`${API}/${employee.EmployeeID}`, {
                Name: employee.Name,
                Position: employee.Position,
                Salary: employee.Salary
            });
        },
        delete: function(id) {
            return $http.delete(`${API}/${id}`);
        }
    };
});