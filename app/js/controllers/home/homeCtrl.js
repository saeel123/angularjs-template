app.controller('homeController', function ($scope, $rootScope, $http, $window, $sessionStorage, Classroom) {

  console.log("home CTrl loaded");

  //init Service
  $scope.classRoomService = new Classroom();

  $scope.getClassRooms = function () {
       $scope.classRoomService.getall(function (error, result) {
          $rootScope.loaderStatus = false;
          if (error) {
              return false;
          }

          console.log(result);

          $scope.classRooms = result;


       });

  }

  $scope.getClassRooms();

  $scope.classDataObj = {};
  $scope.classDataObjActive = true;
  console.log( $scope.classDataObj);
  

  $scope.getClassDetails = function (classDataObj) {
  $scope.classDataObjActive = false;

     console.log(classDataObj);
     $scope.classDataObj = classDataObj;
     console.log($scope.classDataObj);
     
  }



});