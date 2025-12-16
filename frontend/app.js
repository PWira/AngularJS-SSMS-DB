var app = angular.module('employeeApp', ['ngRoute']);

app.config(function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

app.controller("EmployeeCtrl", function($scope, EmployeeService, $location) {

    $scope.view = 'list';
    $scope.employees = [];
    $scope.filterID = 0;
    $scope.form = {};
    $scope.isEdit = false;

    $scope.currentPage = parseInt($location.search().page) || 1;
    $scope.limit = parseInt($location.search().limit) || 10;
    $scope.totalRecords = 0;
    $scope.totalPages = 1;
    $scope.pageNumbers = [];

    const generatePageNumbers = () => {
        $scope.pageNumbers = [];
        for (let i = 1; i <= $scope.totalPages; i++) {
            $scope.pageNumbers.push(i);
        }
    };

    const updateURL = () => {
        $location.search({
            page: $scope.currentPage,
            limit: $scope.limit
        });
    };

    const refreshData = () => {
        EmployeeService.getAll($scope.currentPage, $scope.limit)
            .then(res => { 
                // format { data: [], totalRecords: X, totalPages: Y }
                $scope.employees = res.data.data;
                $scope.totalRecords = res.data.totalRecords;
                $scope.totalPages = res.data.totalPages;
                generatePageNumbers(); 
            })
            .catch(err => { 
                console.error("Gagal memuat data:", err);
                console.error("Error detail:", err.response);
             });
    };

    $scope.goToPage = (page) => {
        if (page >= 1 && page <= $scope.totalPages) {
            $scope.currentPage = page;
            updateURL();
            refreshData();
        }
    };

    $scope.changeLimit = () => {
        $scope.currentPage = 1;
        updateURL();
        refreshData();
    };

    $scope.showEmployeeById = (filterID) => {
        if (!filterID) {
            $scope.currentPage = 1;
            refreshData();
            return;
        }
        EmployeeService.getById(filterID)
            .then(res => {
                $scope.employees = res.data ? [res.data] : [];
                $scope.totalRecords = $scope.employees.length;
                $scope.totalPages = 1;
                $scope.pageNumbers = [1];
                $scope.currentPage = 1;
            })
            .catch(err => { console.error("Gagal memuat data:", err); });
    };

    // Form POST
    $scope.showAddForm = () => {
        $scope.view = 'form';
        $scope.isEdit = false;
        $scope.form = {};
    };

    // Form UPDATE
    $scope.showEditForm = (emp) => {
    console.log("Employee to edit:", emp); // DEBUG
    
    $scope.view = 'form';
    $scope.isEdit = true;
    $scope.form = {
        EmployeeID: emp.EmployeeID,
        Name: emp.Name,
        Position: emp.Position,
        Salary: emp.Salary
    };
    
    console.log("Form after copy:", $scope.form); // DEBUG
};
    $scope.backToList = () => {
        $scope.view = 'list';
    };

    $scope.saveEmployee = () => {
        console.log("Saving employee:", $scope.form); // DEBUG
        console.log("Is Edit:", $scope.isEdit); // DEBUG
        
        if ($scope.isEdit) {
            if (!$scope.form.EmployeeID) {
                alert("Error: Employee ID tidak ditemukan!");
                console.error("Form data:", $scope.form);
                return;
            }
            
            // UPDATE
            EmployeeService.update($scope.form)
                .then(() => {
                    alert("Data berhasil diupdate");
                    refreshData();
                    $scope.view = 'list';
                    $scope.form = {};
                })
                .catch(err => {
                    console.error("Update error:", err);
                    alert("Gagal update: " + (err.data?.error || err.statusText));
                });
        } else {
            // CREATE
            EmployeeService.create($scope.form)
                .then(() => {
                    alert("Data berhasil ditambah");
                    refreshData();
                    $scope.view = 'list';
                    $scope.form = {}; // Reset
                })
                .catch(err => {
                    console.error("Create error:", err);
                    alert("Gagal tambah data: " + (err.data?.error || err.statusText));
                });
        }
    };

    $scope.deleteEmployee = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            EmployeeService.delete(id).then(() => {
                refreshData();
            });
        }
    };

    if (!$location.search().page || !$location.search().limit) {
        updateURL();
    }
    refreshData();
});