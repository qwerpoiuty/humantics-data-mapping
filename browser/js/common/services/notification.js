app.service('notificationService', function($uibModal) {
    this.displayNotification = (message) => {
        return $uibModal.open({
            templateUrl: "js/common/modals/notification/notification.html",
            controller: `notification`,
            size: 'sm',
            resolve: {
                message: () => {
                    return message
                }
            }
        })
    }
})