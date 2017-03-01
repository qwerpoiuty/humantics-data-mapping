app.config(function($stateProvider) {
    $stateProvider.state('management', {
        url: '/management',
        templateUrl: 'js/management/management.html',
        controller: 'manageCtrl',
        resolve: {
            user: function(AuthService) {
                return AuthService.getLoggedInUser().then(function(user) {
                    return user
                })
            }
        },
        data: {
            authenticate: true
        }
    });
});

app.controller('manageCtrl', function($scope, AuthService, projectFactory, dataFactory, mappingFactory, user, $modal, $state, notificationService) {
    $scope.user = user
    $scope.currentPro = "Select a Project"
    $scope.selectedProject = false
    $scope.changingStatus = false
    $scope.editing = false

    projectFactory.getProjects($scope.user.id).then(projects => {
        $scope.projects = projects[0]
    })
    $scope.toggleChange = function() {
        $scope.changingStatus = !$scope.changingStatus
    }
    $scope.completeProject = (project) => {
        var query = {
            column: 'status',
            value: 'complete'
        }
        projectFactory.updateProject(project.project_id, query).then(() => {
            $scope.refreshProjects()
        })
    }
    $scope.selectProject = function(project) {
        $scope.currentPro = project.project_name
        $scope.selectedProject = project
        $scope.refreshSingleProject(project.project_id)
    }
    $scope.tempProject = {}

    $scope.editProject = function() {
        $scope.editing = true
        $scope.tempProject.project_name = $scope.currentPro
        $scope.tempProject.due_date = $scope.selectedProject.due_date
    }

    $scope.cancel = () => {
        $scope.editing = false
        $scope.tempProject = {}
    }
    $scope.save = () => {
        console.log('hello')
        $scope.currentPro = $scope.tempProject.project_name
        $scope.selectedProject.due_date = $scope.tempProject.due_date
        $scope.editing = false
        projectFactory.editProject($scope.selectedProject.project_id, ["project_name", "due_date"], [$scope.tempProject.project_name, $scope.tempProject.due_date]).then(result => {})
    }

    $scope.open = function($event) {
        $scope.status.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.status = {
        opened: false
    };

    $scope.addMembers = () => {
        var modalInstance = $modal.open({
            templateUrl: "js/common/modals/addUsers/addUsers.html",
            controller: `addMemberCtrl`,
            size: 'md',
            resolve: {
                project: () => {
                    return $scope.selectedProject
                }
            }
        })
        modalInstance.result.then((result) => {
            if (result) {
                $scope.selectedProject.members = result
                $scope.refreshSingleProject($scope.selectedProject.project_id)
            }
        })
    }
    $scope.addTables = () => {
        var modalInstance = $modal.open({
            templateUrl: "js/common/modals/addTables/addTables.html",
            controller: `addTableCtrl`,
            size: 'lg',
            resolve: {
                project: () => {
                    return $scope.selectedProject
                }
            }
        })
        modalInstance.result.then((result) => {
            if (result) {
                $scope.refreshSingleProject($scope.selectedProject.project_id)
            }
        })
    }

    $scope.removeTable = tableId => {
        $scope.selectedProject.tables.splice($scope.selectedProject.tables.indexOf(tableId), 1)
        projectFactory.updateProject($scope.selectedProject.project_id, `tables`, $scope.selectedProject.tables).then(result => {
            $scope.refreshSingleProject($scope.selectedProject.project_id)
            var modalInstance = $modal.open({
                templateUrl: 'js/common/modals/notification/notification.html',
                controller: 'notification',
                size: 'sm',
                resolve: {
                    message: function() {
                        return `Table removed`
                    }
                }
            });
        })
    }

    $scope.newProject = function() {
        var modalInstance = $modal.open({
            templateUrl: 'js/common/modals/newProject/newProject.html',
            controller: 'newProjectCtrl',
            size: 'lg',
            resolve: {
                user: function() {
                    return $scope.user
                }
            }
        });
        modalInstance.result.then((results) => {
            $scope.refreshProjects()
        })
    }
    $scope.deleteProject = () => {
        if (!$scope.selectedProject) {
            notificationService.displayNotification("Pick a project first")
        } else {
            var modalInstance = $modal.open({
                templateUrl: 'js/common/modals/confirmation/confirmation.html',
                controller: 'confirmation',
                size: 'sm',
                resolve: {
                    message: function() {
                        return `Are you sure you want to delete the project?`
                    }
                }
            });
            modalInstance.result.then(result => {
                if (result) {
                    projectFactory.deleteProject($scope.selectedProject.project_id).then(() => {
                        notificationService.displayNotification("Project Deleted")
                        $scope.refreshProjects()
                    })
                }
            })
        }
    }
    $scope.detailedView = function(table_id) {
        $state.go('detailed', {
            tableId: table_id
        })
    }


    $scope.toggleChange = function() {
        $scope.changingStatus = !$scope.changingStatus
    }
    $scope.changeStatus = function(status) {
        var temp = {
            status: mappingStatus,
            id: $scope.targetMapping.attr_id,
            version: $scope.sources[0].version
        }
        mappingFactory.changeStatus(temp)
    }

    //REFRESH FUNCTIONS
    $scope.refreshProjects = () => {
        $scope.targetProject = []
        projectFactory.getProjects($scope.user.id).then(projects => {
            $scope.projects = projects[0]
        })
    }
    $scope.refreshSingleProject = (id) => {
        $scope.targetProject = []
        projectFactory.getProjectById(id).then(function(project) {
            // var obj = []
            // var tables = []
            // $scope.targetProject = []
            // project = project[0]
            // project.forEach(attr => {
            //     if (tables.indexOf(attr.table_id) == -1) {
            //         obj[attr.table_id] = {
            //             table_name: attr.table_name,
            //             table_id: attr.table_id,
            //             db_name: attr.db_name,
            //             schema_name: attr.schema_name,
            //             attribute_count: 0
            //         }
            //         tables.push(attr.table_id)
            //     }
            //     obj[attr.table_id].attribute_count++
            // })
            // obj.forEach(table => {
            //     $scope.targetProject.push(table)
            // })
            $scope.targetProject = project[0]

            $scope.attributeCount = []
        })
    }
    $scope.open = (index) => {
        if ($scope.attributeCount[index]) return
            // $scope.attributeCount[index] = "Searching..."
        $scope.mappingCount = "Searching..."
        dataFactory.getTableById($scope.targetProject[index].table_id).then(result => {
            $scope.attributeCount[index] = result[0].length
            console.log($scope.attributeCount[0])
        })
    }


});