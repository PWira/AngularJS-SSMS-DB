const API = "http://localhost:3000/api/employees";
const API_KEY = "secret123";

angular.module("employeeApp")
.service("EmployeeService", function($http) {
    const API = "http://localhost:3000/api/employees";

    return {
        getAll: function(page = 1, limit = 10) {
            return $http.get(`${API}?page=${page}&limit=${limit}`,{
                headers: { 'x-api-key': API_KEY }
            }); 
        },
        search: function(name) {
            return $http.get(`${API}/search?name=${encodeURIComponent(name)}`,{
                headers: { 'x-api-key': API_KEY }
            });
        },
        getById: function(id) {
            return $http.get(`${API}/${id}`,{
                headers: { 'x-api-key': API_KEY }
            });
        },
        getDepartmentId: function(Did) {
            return $http.get(`${API}/department?Did=${Did}`,{
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
            
            // console.log("Updating employee ID:", employee.EmployeeID); // DEBUG
            
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