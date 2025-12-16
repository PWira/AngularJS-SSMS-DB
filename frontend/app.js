var app = angular.module('employeeApp', ['ngRoute']);

app.config(function($httpProvider) {
    $httpProvider.interceptors.push(function() {
        return {
            request: function(config) {
                config.headers['x-api-key'] = 'secret123';
                return config;
            }
        };
    });
});

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
    $scope.searchName = $location.search().search || '';
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
        const params = {
            page: $scope.currentPage,
            limit: $scope.limit
        };
        if ($scope.searchName) {
            params.search = $scope.searchName;
        }
        
        $location.search(params);
    };

    const refreshData = () => {
        const promise = $scope.searchName 
            ? EmployeeService.search($scope.searchName, $scope.currentPage, $scope.limit)
            : EmployeeService.getAll($scope.currentPage, $scope.limit);
        
        promise.then(res => { 
            $scope.employees = res.data.data;
            $scope.totalRecords = res.data.totalRecords;
            $scope.totalPages = res.data.totalPages;
            generatePageNumbers();
        }).catch(err => { 
            console.error("Gagal memuat data:", err); 
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

    $scope.findEmployeeName = (name) => {
        $scope.searchName = name || "";
        if (!$scope.searchName) {
            $scope.currentPage = 1;
            $location.search({ page: 1, limit: $scope.limit });
            refreshData();
            return;
        }
        
        $location.search({ search: $scope.searchName });

        EmployeeService.search($scope.searchName)
            .then(res => {
                $scope.employees = res.data.data || res.data || [];
                $scope.totalRecords = $scope.employees.length;
                $scope.totalPages = 1;
                $scope.pageNumbers = [1];
                $scope.currentPage = 1;
            })
            .catch(err => { 
                console.error("Gagal mencari data:", err);
                alert("Data tidak ditemukan");
            });
    };

    $scope.clearSearch = () => {
        $scope.searchName = '';
        $scope.currentPage = 1;
        $location.search({ page: 1, limit: $scope.limit });
        refreshData();
    };

    $scope.findEmployeesByDept = (DepartmentID) => {
        $scope.searchDepartmentID = DepartmentID || ""; 
        if (!$scope.searchDepartmentID) {
            $scope.currentPage = 1;
            refreshData();
            return;
        }
        EmployeeService.getDepartmentId($scope.searchDepartmentID)
            .then(res => {
                $scope.employees = res.data || [];
                $scope.totalRecords = $scope.employees.length;
                $scope.currentPage = 1; 
                $scope.totalPages = Math.ceil($scope.totalRecords / $scope.itemsPerPage);
                $scope.pageNumbers = Array.from({length: $scope.totalPages}, (_, i) => i + 1);
            })
            .catch(err => { console.error("Gagal memuat data:"); });
    };

    // $scope.showEmployeeById = (filterID) => {
    //     if (!filterID) {
    //         $scope.currentPage = 1;
    //         refreshData();
    //         return;
    //     }
    //     EmployeeService.getById(filterID)
    //         .then(res => {
    //             $scope.employees = res.data ? [res.data] : [];
    //             $scope.totalRecords = $scope.employees.length;
    //             $scope.totalPages = 1;
    //             $scope.pageNumbers = [1];
    //             $scope.currentPage = 1;
    //         })
    //         .catch(err => { console.error("Gagal memuat data:", err); });
    // };

    const urlParams = $location.search();
    if (urlParams.search) {
        $scope.searchName = urlParams.search;
        $scope.findEmployeeName();
    } else {
        if (!urlParams.page || !urlParams.limit) {
            updateURL();
        }
        refreshData();
    }

    // Form POST
    $scope.showAddForm = () => {
        $scope.view = 'form';
        $scope.isEdit = false;
        $scope.form = {};
    };

    // Form UPDATE
    $scope.showEditForm = (emp) => {
        // console.log("Employee to edit:", emp); // DEBUG
        $scope.view = 'form';
        $scope.isEdit = true;
        $scope.form = {
            EmployeeID: emp.EmployeeID,
            DepartmentID: emp.DepartmentID ? emp.DepartmentID.toString() : "",
            Name: emp.Name,
            Position: emp.Position,
            Salary: emp.Salary
        };
        
        // console.log("Form after copy:", $scope.form); // DEBUG
    };
    $scope.backToList = () => {
        $scope.view = 'list';
    };

    $scope.saveEmployee = () => {
        // console.log("Saving employee:", $scope.form); // DEBUG
        // console.log("Is Edit:", $scope.isEdit); // DEBUG
        
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
                    console.error("Update error:");
                    // alert("Gagal update: " + (err.data?.error || err.statusText));
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
                    console.error("Create error:");
                    // alert("Gagal tambah data: " + (err.data?.error || err.statusText));
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
});

