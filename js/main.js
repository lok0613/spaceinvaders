var myApp = angular.module('myApp', ['ngMaterial']);

myApp.controller('MainController', ['$scope', function ($scope) {
	spaceinvader();
	$scope.game = game;
}])

.controller('GameSettingController', ['$scope', '$mdDialog', function ($scope, $mdDialog) {

    $scope.invaderVelocityLevel = 3;
    $scope.playerLives = game.lives;

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
}]);

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