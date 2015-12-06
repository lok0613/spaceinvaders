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

.controller('MainController', ['$scope', function ($scope) {
	spaceinvader();
	$scope.game = game;
}])

.controller('GameSettingController', function ($scope, $mdDialog, $http, $rootScope, $state) {
  if (!$rootScope.user) {
    $state.go('root');
  }

  $scope.invaderVelocityLevel = 3;
  $scope.playerLives = game.lives;
  $http.get('/server/index.php?model=setting&action=getSettings').success( function (data) {
      $scope.invaderVelocity = parseInt(data['invaderVelocityLevel']);
      $scope.playerLives = parseInt(data['life']);
      $scope.scoreHistory = angular.fromJson(data['scoreHistory']);
      $scope.scoreHistory.sort( function (a, b) {
        return b.score-a.score;
      });
  })


  $scope.setInvaderVelocity = function () {
      var actualVelocity = game.config.invaderVelocityLevel[$scope.invaderVelocityLevel-1];

      // for (var i=0; i<game.currentState().invaders.length; i++) {
          if (actualVelocity) {
              game.currentState().invaderInitialVelocity = actualVelocity;
              game.currentState().invaderCurrentVelocity = actualVelocity;
              game.currentState().invaderVelocity.x = actualVelocity;
          }
      // }
      // console.log('level', $scope.invaderVelocityLevel);
      // console.log('actualVelocity', actualVelocity);
      // console.log('init velocity', game.currentState().invaderInitialVelocity);
      // console.log('------------------');
  }

  $scope.renderPlayerLives = function () {
      game.lives = $scope.playerLives;
  }

  $scope.showEnemyArray = function (ev) {
      $mdDialog.show({
        templateUrl: 'partial/enemyArray.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      }).then(function(answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
  }
})

.controller('LoginController', function ($scope, $http, $httpParamSerializer, $state, $rootScope) {

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
      }
    });

  }
})

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

    function toggleMute() {
        game.mute();
        document.getElementById("muteLink").innerText = game.sounds.mute ? "unmute" : "mute";
    }
}

