angular.module('starter.controllers', [])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
        $scope.closeLogin();
      }, 1000);
    };
  })

//.controller('PlaylistsCtrl', function($scope) {
//  $scope.playlists = [
//    { title: 'Reggae', id: 1 },
//    { title: 'Chill', id: 2 },
//    { title: 'Dubstep', id: 3 },
//    { title: 'Indie', id: 4 },
//    { title: 'Rap', id: 5 },
//    { title: 'Cowbell', id: 6 }
//  ];
//})
//
//.controller('PlaylistCtrl', function($scope, $stateParams) {
//})

  .controller('CoursesCtrl', function($scope, $ionicPopup) {
    $scope.addCourse = function() {
      $scope.data = {};

      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<label for="dept">Class Department</label><input id="dept" type="text" ng-model="data.dept">' +
        '<label for="code">Class Code</label><input id="code" type="text" ng-model="data.code">',
        title: 'Add New Course',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>Add</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.title && !$scope.data.class) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              }
              else {
                return {title: $scope.data.dept, class: $scope.data.code};
              }
            }
          }
        ]
      });
    };

    $scope.courses = [
      {id: 1, title: 'HILD 7B'},
      {id: 2, title: 'COGS 120'},
      {id: 3, title: 'COGS 187B'},
      {id: 4, title: 'COGS 102C'}
    ];
  })

  .controller('SharedListsCtrl', function($scope) {
    $scope.lists = [
      {id: 1, course: 'HILD 7B', uses: 67},
      {id: 2, course: 'COGS 120', uses: 120},
      {id: 3, course: 'COGS 187B', uses: 87},
      {id: 4, course: 'COGS 102C', uses: 90}
    ];
  })

  .controller('TasksCtrl', function($scope, $ionicPopup) {
    $scope.addTask = function() {
      $scope.data = {};

      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<label for="title">Title</label><input id="title" type="text" ng-model="data.title">' +
        '<label for="class">Class</label><input id="class" type="text" ng-model="data.class">' +
        '<label for="date">Due Date</label><input id="date" type="datetime" ng-model="data.date">',
        title: 'Enter Task Information',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.title && !$scope.data.class) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              }
              else {
                return {title: $scope.data.title, class: $scope.data.class};
              }
            }
          }
        ]
      });
      myPopup.then(function(res) {
        console.log('Tapped!', res);
      });
      $timeout(function() {
        myPopup.close(); //close the popup after 3 seconds for some reason
      }, 3000);
    };

    $scope.tasks = [
      {id: 1, title: 'Essay', class: 'HILD 7B'},
      {id: 2, title: 'Storyboard', class: 'COGS 120'},
      {id: 3, title: 'Design', class: 'COGS 187B'},
      {id: 4, title: 'Project', class: 'COGS 102C'}
    ];
  });
