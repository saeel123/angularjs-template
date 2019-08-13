// ===================================== HttpService SERVICES =====================================
var API_URL = '';

app.factory('MainService', function (SERVERCONFIG, $http, $location, $sessionStorage, $rootScope) {

    var host = $location.host();
    var port = $location.port();
    var hostUrl = host;
    var url = hostUrl + window.location.pathname;

    if (SERVERCONFIG.LOCAL_HOST == hostUrl) {
        API_URL = SERVERCONFIG.LOCAL_API;
    } else if (SERVERCONFIG.DEVELOPMENT_HOST == hostUrl) {
        API_URL = SERVERCONFIG.DEVELOPMENT_API;
    } else if (SERVERCONFIG.STAGING_HOST == url) {
        API_URL = SERVERCONFIG.STAGING_API;
    }  else if (SERVERCONFIG.PRODUCTION_HOST == hostUrl) {
        API_URL = SERVERCONFIG.PRODUCTION_API;
    } else {
        API_URL = SERVERCONFIG.DEVELOPMENT_API_LAN;
    }

    var MainService = function () {

    }

    function getToken() {
        if ($sessionStorage.sessionUserData == undefined) {
            return false;
        }

        return $sessionStorage.sessionUserData.data[0].token;
    }

    function configHeader(auth) {
        if (auth) {
            var token = getToken();
            return {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        } else {
            return {
                'Content-Type': 'application/json',
                'dataType': 'json',
            }
        }
    }

    //show log on API error
    function showError(path, method) {
        console.log('API failed: ' + method + ' : ' + path);
    }

    // Error function to handle error condition 
    function errorCallback(error, callback) {
        if (error.data == null) {
            showError(API_URL + path);
        }
        var errorData = error.data.error;
        var message = errorData;
        var errorMessages = [];

        for (let i = 0; i < message.length; i++) {
            //error handler
            serviceHandler(message[i].code, message[i].message);
            errorMessages.push(message[i].message);
        }

        callback(errorMessages, false);
    }

    //Check Status code;
    function serviceHandler(statusCode, message) {

        var code = statusCode.toString();
        
        switch (code) {
            case '401':
                    sweetAlert({
                        title: "Unauthorized.",
                        text: message,
                        type: "error",
                        showCancelButton: false,
                        confirmButtonColor: "#5180AE",
                        confirmButtonText: "OK",
                        closeOnConfirm: false,
                    },
                        function (isConfirm) {
                            if (isConfirm) {
                                swal.close();
                                $rootScope.logout();
                            }
                        });
                break;
        
            default:
                break;
        }
    }
    

    MainService.prototype.get = function (path, auth, callback) {
        $http({
                method: "GET",
                url: API_URL + path,
                headers: configHeader(auth),
                data: ''
            })
            .then(function (response) {
                    console.log(response);
                    

                    var result = response.data;
                    callback(false, result);
                },
                function (error) {
                    console.log(error);
                    

                    if (error.data == null) {
                        showError(API_URL + path, "GET");
                    } else {
                        var errorData = error.data.error;
                        var message = errorData;
                        var errorMessages = [];

                        for (let i = 0; i < message.length; i++) {
                            serviceHandler(message[i].code, message[i].message);
                            errorMessages.push(message[i].message);
                        }

                        callback(errorMessages, false);
                    }
                });
    };



    MainService.prototype.post = function (path, auth, dataObj, callback) {
        $http({
                method: "POST",
                url: API_URL + path,
                headers: configHeader(auth),
                data: dataObj
            })
            .then(function (response) {
                    var result = response.data;
                    callback(false, result);

                },
                function (error) {
                    if (error.data == null) {
                        showError(API_URL + path, "POST");
                    } else {
                        var errorData = error.data.error;
                        var message = errorData;
                        var errorMessages = [];

                        for (let i = 0; i < message.length; i++) {
                            //error handler
                            serviceHandler(message[i].code, message[i].message);
                            errorMessages.push(message[i].message);
                        }

                        callback(errorMessages, false);
                    }
                });
    };


    MainService.prototype.delete = function (path, auth, dataObj, callback) {
        $http({
                method: "DELETE",
                url: API_URL + path,
                headers: configHeader(auth),
                data: dataObj
            })
            .then(function (response) {
                    var result = response.data;
                    callback(false, result);
                    // swal.close();
                },
                function (error) {
                    if (error.data == null) {
                        showError(API_URL + path, "DELETE");
                    } else {

                        var errorData = error.data.error;
                        var message = errorData;
                        var errorMessages = [];

                        for (let i = 0; i < message.length; i++) {
                            //error handler
                            serviceHandler(message[i].code, message[i].message);
                            errorMessages.push(message[i].message);
                        }

                        callback(errorMessages, false);
                    }
                });
    };


    MainService.prototype.update = function (path, auth, dataObj, callback) {
        $http({
                method: "PUT",
                url: API_URL + path,
                headers: configHeader(auth),
                data: dataObj
            })
            .then(function (response) {
                    var result = response.data;
                    callback(false, result);
                },
                function (error) {
                    if (error.data == null) {
                        showError(API_URL + path, "PUT");
                    } else {
                        var errorData = error.data.error;
                        var message = errorData;
                        var errorMessages = [];

                        for (let i = 0; i < message.length; i++) {
                            //error handler
                            serviceHandler(message[i].code, message[i].message);
                            errorMessages.push(message[i].message);
                        }

                        callback(errorMessages, false);
                    }
                });
    };

    MainService.prototype.patch = function (path, auth, dataObj, callback) {
        $http({
                method: "PATCH",
                url: API_URL + path,
                headers: configHeader(auth),
                data: dataObj
            })
            .then(function (response) {
                    callback(false, response.data);
                },
                function (error) {
                    errorCallback(error, callback);
                }
            );
    };


    MainService.prototype.file = function (path, fd, callback) {
        var token = $sessionStorage.sessionUserData.data[0].token;
        $http({
                method: "POST",
                url: API_URL + path,
                headers: {
                    'Content-Type': undefined,
                    'Authorization': 'Bearer ' + token
                },
                transformRequest: angular.identity,
                data: fd
            })
            .then(function (response) {
                    var result = response.data;
                    callback(false, result);
                },
                function (error) {

                    if (error.data == null) {
                        showError(API_URL + path, 'fileupload');

                    } else {
                        var errorData = error.data.error;
                        var message = errorData;
                        var errorMessages = [];

                        for (let i = 0; i < message.length; i++) {
                            //error handler
                            serviceHandler(message[i].code, message[i].message);
                            errorMessages.push(message[i].message);
                        }

                        callback(errorMessages, false);
                    }
                });
    };

    MainService.prototype.upload = function (path, auth, fd, method, callback) {

        Upload.upload({
            url: API_URL + path, //webAPI exposed to upload the file
            // url: API_URL, //webAPI exposed to upload the file
            data: fd, //pass file as data, should be user ng-model
            headers: configHeader(auth),
            method: method,
        }).then(function (response) { //upload function returns a promise
            var result = response.data;
            callback(false, result);
        }, function (error) { //catch error
            if (error.data == null) {
                showError(API_URL + path, 'upload');
            } else {
                var errorData = error.data.error;
                var message = errorData;
                var errorMessages = [];

                for (let i = 0; i < message.length; i++) {
                    //error handler
                    serviceHandler(message[i].code, message[i].message);
                    errorMessages.push(message[i].message);
                }

                callback(errorMessages, false);
            }

        });
    };





    return new MainService();
});