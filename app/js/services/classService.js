app.factory('Classroom', function ( MainService , $http) {
    var Classroom = function () { };
    var classRoomPath = 'class.json';

    Classroom.prototype.getall = function (callback) {
        var path = classRoomPath;
        MainService.get(path, false, function (error, result) {
            if (error) {
                return;
            }
            callback(false, result);
        });


       
    };

    return Classroom;
});