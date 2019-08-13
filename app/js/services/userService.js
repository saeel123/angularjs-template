app.factory('Users', function (MainService, $http) {
    var Users = function () { };
    var userPath = '/users';

    Users.prototype.getall = function (options, callback) {
        var path = userPath + '/?' + options;
        MainService.get(path, true, function (error, result) {
            if (error) {
                return;
            }
            callback(false, result);
        });
    };

    return Users;
});