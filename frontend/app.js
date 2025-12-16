angular.module("employeeApp", [])
.controller("EmployeeCtrl", function($scope, EmployeeService) {

    $scope.view = 'list';
    $scope.employees = [];
    $scope.filterID = 0;
    $scope.form = {};
    $scope.isEdit = false;

    const refreshData = () => {
        EmployeeService.getAll()
            .then(res => { $scope.employees = res.data; })
            .catch(err => { console.error("Gagal memuat data:", err); });
    };
    refreshData();

    $scope.showEmployeeById = (filterID) => {
    if (!filterID) {
        refreshData();
        return;
    }
    EmployeeService.getById(filterID)
        .then(res => {
            $scope.employees = res.data ? [res.data] : [];
        })
        .catch(err => { console.error("Gagal memuat data:", err); });
};


    // Form POST
    $scope.showAddForm = () => {
        $scope.view = 'form';
        $scope.isEdit = false;
        $scope.form = {}; // Reset form
    };

    // Form UPDATE
    $scope.showEditForm = (emp) => {
        $scope.view = 'form';
        $scope.isEdit = true;
        $scope.form = angular.copy(emp); // temp before save
    };

    $scope.backToList = () => {
        $scope.view = 'list';
    };

    $scope.saveEmployee = () => {
        if ($scope.isEdit) {
            // UPDATE
            EmployeeService.update($scope.form).then(() => {
                alert("Data berhasil diupdate");
                refreshData();
                $scope.view = 'list';
            });
        } else {
            // CREATE
            EmployeeService.create($scope.form).then(() => {
                alert("Data berhasil ditambah");
                refreshData();
                $scope.view = 'list';
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