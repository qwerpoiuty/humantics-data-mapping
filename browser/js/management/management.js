app.config(function($stateProvider) {
    $stateProvider.state('management', {
        url: '/management',
        templateUrl: 'js/management/management.html',
        controller: 'manageCtrl',
        resolve: {
            projects: function(projectFactory) {
                return projectFactory.getProjects().then(function(projects) {
                    return projects
                })
            },
            user: function(AuthService) {
                return AuthService.getLoggedInUser().then(function(user) {
                    return user
                })
            }
        }
    });
});

app.controller('manageCtrl', function($scope, AuthService, projectFactory, dataFactory, user, projects, $modal, $state) {

    $scope.user = user
    $scope.projects = projects[0]
    $scope.currentPro = "Select a Project"
    $scope.selectedTask = "false"


    $scope.selectProject = function(project) {
        $scope.currentPro = project.project_name
        $scope.selectedTask = "true"
        projectFactory.getProjectById(project.project_id).then(function(project) {
            $scope.targetProject = project[0]
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
    }

    $scope.detailedView = function(table_id) {
            $state.go('detailed', {
                tableId: table_id
            })
        }
        // $scope.openBrowse = function(evt, tabSelection) {

    //     // Declare all variables
    //     var i, tabcontent, tablinks;

    //     // Get all elements with class="tabcontent" and hide them
    //     tabcontent = document.getElementsByClassName("tabcontent");
    //     for (i = 0; i < tabcontent.length; i++) {
    //         tabcontent[i].style.display = "none";
    //     }

    //     // Get all elements with class="tablinks" and remove the class "active"
    //     tablinks = document.getElementsByClassName("tablinks");
    //     for (i = 0; i < tablinks.length; i++) {
    //         tablinks[i].className = tablinks[i].className.replace(" active", "");
    //     }

    //     // Show the current tab, and add an "active" class to the link that opened the tab
    //     document.getElementById(tabSelection).style.display = "block";
    //     evt.currentTarget.className += " active";
    // }
    // document.getElementById("ProjectTab").style.display = "inline";
    // document.getElementById("ProjectTab").className += " active";

});