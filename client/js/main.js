var myApp = angular.module('myApp', ['ngMaterial', 'ui.router'])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('root', {
    url: '/',
    views: {
      'sidebar': {
        templateUrl: 'partial/login.html',
        controller: 'LoginController'
      }
    }
  })
  .state('menu', {
    cache: false,
    url: '/menu',
    views: {
      'sidebar': {
        templateUrl: 'partial/menu.html',
        controller: 'GameSettingController'
      }
    }
  })


  $urlRouterProvider.otherwise('/');
})

.controller('MainController', function ($scope, $http, $rootScope) {
	spaceinvader();
	$scope.game = game;

  $http.get('/server/index.php?model=setting&action=getSettings').success( function (data) {
      $rootScope.invaderVelocityLevel = parseInt(data['invaderVelocityLevel']);
      $rootScope.playerLives = parseInt(data['lives']);
      $rootScope.scoreHistory = angular.fromJson(data['scoreHistory']);
      $rootScope.easyEnemyArray = angular.fromJson(data['easyEnemyArray']);
      $rootScope.hardEnemyArray = angular.fromJson(data['hardEnemyArray']);
      $rootScope.scoreHistory.sort( function (a, b) {
        return b.score-a.score;
      });

      setLives($rootScope.playerLives);
      setVelocity($rootScope.invaderVelocityLevel);
      setScoreHistory($rootScope.scoreHistory);
      setEasyEnemyArray($rootScope.easyEnemyArray);
      setHardEnemyArray($rootScope.hardEnemyArray);
  })
})

.controller('GameSettingController', function ($scope, $mdDialog, $http, $rootScope, $state, $httpParamSerializer) {
  if (!$rootScope.user) {
    $state.go('root');
  }

  $scope.invaderVelocityLevel = $rootScope.invaderVelocityLevel;
  $scope.playerLives = $rootScope.playerLives;
  $scope.scoreHistory = $rootScope.scoreHistory;

  $scope.setInvaderVelocity = function () {
    if ($scope.invaderVelocityLevel>5 || $scope.invaderVelocityLevel<1) {
      $scope.invaderVelocityLevel = 3;
    }
    setVelocity($scope.invaderVelocityLevel);
    var data = {
      "model": "setting",
      "action": "updateSetting",
      "name": 'invaderVelocityLevel',
      "value": $scope.invaderVelocityLevel
    };
    $http.post('/server/index.php?'+$httpParamSerializer(data)).then( function (response) {
    });
  };

  $scope.renderPlayerLives = function () {
    if ($scope.playerLives>10 || $scope.playerLives<1) {
      $scope.playerLives = 5;
    }
    setLives($scope.playerLives);
    var data = {
      "model": "setting",
      "action": "updateSetting",
      "name": 'lives',
      "value": $scope.playerLives
    };
    $http.post('/server/index.php?'+$httpParamSerializer(data)).then( function (response) {
    });
  };

  $scope.showEasyEnemyArray = function () {
    $mdDialog.show({
      templateUrl: 'partial/easyEasyEnemyArray.html',
      clickOutsideToClose:true
    });
  };

  $scope.showHardEnemyArray = function () {
    $mdDialog.show({
      templateUrl: 'partial/showHardEnemyArray.html',
      clickOutsideToClose:true
    }).then(function(answer) {
    }, function() {
    });
  }

  $scope.forgotPassword = function (ev) {
    var alert = {
      templateUrl: 'partial/forgotPassword.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    };
    $mdDialog.show(alert);
  };

  $scope.resetScore = function () {
    var confirm = $mdDialog.confirm()
          .title('Reset All Score')
          .content('Are you sure ?')
          .ok('Please do it!')
          .cancel('No thanks!');
    $mdDialog.show(confirm).then( function () {
      var data = {
        "model": "setting",
        "action": "resetScore",
      };
      $http.post('/server/index.php?'+$httpParamSerializer(data)).then( function (response) {
        $rootScope.scoreHistory = [];
        setScoreHistory($rootScope.scoreHistory);
        $scope.scoreHistory = $rootScope.scoreHistory;
        var alert = $mdDialog.alert()
          .title('Reset Score Success!')
          .content('Reset Score Success!')
          .ok('Close');
        $mdDialog
          .show(alert);
      });
    }, function () {
      // do nothing
    });
  };

})

.controller('LoginController', function ($scope, $http, $httpParamSerializer, $state, $rootScope, $mdDialog) {

  $scope.login = function () {
    var data = {
      "model": "user",
      "action": "login",
      "username": $scope.user.username,
      "password": $scope.user.password
    };
    $http.post('/server/index.php?'+$httpParamSerializer(data)).then( function (response) {
      if (200==response.data) {
        $rootScope.user = data;
        $state.go('menu');
      } else {
        var content = response.data.charAt(0).toUpperCase() + response.data.slice(1) + '!';
        var alert = $mdDialog.alert()
          .title('Login Fail!')
          .content(content)
          .ok('Close');
        $mdDialog
          .show(alert);
      }
    });
  };

  $scope.resetPassword = function () {
    var confirm = $mdDialog.confirm()
          .title('Reset Password')
          .content('Are you sure ?')
          .ok('Please do it!')
          .cancel('No thanks!');
    $mdDialog.show(confirm).then( function () {
      var data = {
        "model": "user",
        "action": "resetPeter"
      };
      $http.post('/server/index.php?'+$httpParamSerializer(data)).then( function (response) {
        var alert = $mdDialog.alert()
          .title('Reset Password Success!')
          .content('The password will send to cshfng@comp.polyu.edu.hk !')
          .ok('Close');
        $mdDialog
          .show(alert);
      });
    }, function () {
      // do nothing
    });
  };
})

.controller('ForgotPasswordController', function ($scope, $http, $httpParamSerializer, $mdDialog) {
  $scope.changePassword = function () {
    if ($scope.user.password!=$scope.user.passwordRepeat) {
      var content = 'Password not same!';
        var alert = $mdDialog.alert()
          .title('Change Password Fail!')
          .content(content)
          .ok('Close');
        $mdDialog
          .show(alert);
      return false;
    }
    var data = {
      "model": "user",
      "action": "forgotPassword",
      "password": $scope.user.password,
    };
    $http.post('/server/index.php?'+$httpParamSerializer(data)).then( function (response) {
      if (200==response.data) {
        $mdDialog.hide();
      }
    });
  }
})

.controller('EasyEnemyArrayController', function ($http, $scope, $mdDialog, $state, $httpParamSerializer, $rootScope, $window) {
  var easyEnemys = $rootScope.easyEnemyArray;
  $scope.easyEnemys = [];
  for (var num in easyEnemys) {
    $scope.easyEnemys.push({mark: easyEnemys[num]});
  }
  $scope.go = function () {
    var easyEnemys = [];
    for (var obj in $scope.easyEnemys) {
      easyEnemys.push($scope.easyEnemys[obj].mark);
    }
    $mdDialog.hide();
    var data = {
      "model": "setting",
      "action": "updateSetting",
      "name": "easyEnemyArray",
      "value": '['+easyEnemys+']'
    };
    $http.post('/server/index.php?'+$httpParamSerializer(data)).then( function (response) {
      $window.location.reload();
    });
  };
})

.controller('HardEnemyArrayController', function ($http, $scope, $mdDialog, $state, $httpParamSerializer, $rootScope, $window) {
  var hardEnemys = $rootScope.hardEnemyArray;
  $scope.hardEnemys = [];
  for (var num in hardEnemys) {
    $scope.hardEnemys.push({mark: hardEnemys[num]});
  }
  $scope.go = function () {
    var hardEnemys = [];
    for (var obj in $scope.hardEnemys) {
      hardEnemys.push($scope.hardEnemys[obj].mark);
    }
    console.log(hardEnemys)
    $mdDialog.hide();
    var data = {
      "model": "setting",
      "action": "updateSetting",
      "name": "hardEnemyArray",
      "value": '['+hardEnemys+']'
    };
    $http.post('/server/index.php?'+$httpParamSerializer(data)).then( function (response) {
      $window.location.reload();
    });
  };
});

var spaceinvader = function () {
	//  Create the starfield.
    var container = document.getElementById('starfield');
    var starfield = new Starfield();
    starfield.initialise(container);
    starfield.start();

    //  Setup the canvas.
    var canvas = document.getElementById("gameCanvas");
    canvas.width = 800;
    canvas.height = 600;

    //  Create the game.
    game = new Game();

    //  Initialise it with the game canvas.
    game.initialise(canvas);

    //  Start the game.
    game.start();

    //  Listen for keyboard events.
    window.addEventListener("keydown", function keydown(e) {
        var keycode = e.which || window.event.keycode;
        //  Supress further processing of left/right/space (37/29/32)
        if(keycode == 37 || keycode == 39 || keycode == 32) {
            e.preventDefault();
        }
        game.keyDown(keycode);
    });
    window.addEventListener("keyup", function keydown(e) {
        var keycode = e.which || window.event.keycode;
        game.keyUp(keycode);
    });

}

var setLives = function(lives) {
  game.config.lives = lives;
  game.lives = lives;
};

var setVelocity = function(velocity) {
  var actualVelocity = game.config.invaderVelocityLevel[velocity-1];
  game.config.invaderInitialVelocity = actualVelocity;
    if (actualVelocity) {
        game.currentState().invaderInitialVelocity = actualVelocity;
        game.currentState().invaderCurrentVelocity = actualVelocity;
        if (game.currentState().invaderVelocity) {
          game.currentState().invaderVelocity.x = actualVelocity;
        }
    }
};

var setScoreHistory = function (score) {
  game.config.scoreHistory = score;
}

var setEasyEnemyArray = function (enemy) {
  game.config.enemyMarks[1] = enemy;
};

var setHardEnemyArray = function (enemy) {
  game.config.enemyMarks[2] = enemy;
};
