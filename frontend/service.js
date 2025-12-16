const API = "http://localhost:3000/api/employees";
const API_KEY = "Backend_test_key_456";

angular.module("employeeApp")
.service("EmployeeService", function($http) {

    return {
        getAll: function(page = 1, limit = 10) {
            return $http.get(`${API}?page=${page}&limit=${limit}`,{
                headers: { 'x-api-key': API_KEY }
            }); 
        },
        search: function(name, page = 1, limit = 10) {
            return $http.get(`${API}/search?name=${encodeURIComponent(name)}&page=${page}&limit=${limit}`, {
                headers: { 'x-api-key': API_KEY }
            });
        },
        getById: function(id) {
            return $http.get(`${API}/${id}`,{
                headers: { 'x-api-key': API_KEY }
            });
        },
        getDepartmentId: function(Did, page = 1, limit = 10) {
            return $http.get(`${API}/department?Did=${Did}&page=${page}&limit=${limit}`,{
                headers: { 'x-api-key': API_KEY }
            });
        },
        create: function(employee) {
            return $http.post(API, employee,{
                headers: { 'x-api-key': API_KEY }
            });
        },
        update: function(employee) {
            if (!employee || !employee.EmployeeID) {
                console.error("Invalid employee data:");
                return Promise.reject({ message: "Employee ID is required" });
            }
            
            return $http.put(`${API}/${employee.EmployeeID}`, {
                Name: employee.Name,
                DepartmentID: employee.DepartmentID,
                Position: employee.Position,
                Salary: employee.Salary
            },{
                headers: { 'x-api-key': API_KEY }
            });
        },
        delete: function(id) {
            return $http.delete(`${API}/${id}`,{
                headers: { 'x-api-key': API_KEY }
            });
        }
    };
});