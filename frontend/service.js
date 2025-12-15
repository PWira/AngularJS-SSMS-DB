angular.module("employeeApp")
.service("EmployeeService", function($http) {
    const API = "http://localhost:3000/api/employees";

    this.getAll = () => $http.get(API);
    
    this.getById = (id) => $http.get(`${API}/${id}`);
    
    this.create = (data) => $http.post(API, data);
    
    this.update = (data) => $http.put(`${API}/${data.EmployeeID}`, data);
    
    this.delete = (id) => $http.delete(`${API}/${id}`);
});