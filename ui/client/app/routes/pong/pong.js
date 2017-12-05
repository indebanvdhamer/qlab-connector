import angular from 'angular';
import routeWrap from 'ng-component-routing';
import template from './pong.html';
import './pong.scss';

const dark3 = '#303030';

const controller = function($element, $scope) {
  'ngInject';

  this.scores = {
    computer: 0,
    player: 0
  };

  const vm = this;

  const animate = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || function(cb) {window.setTimeout(cb, 1000 / 60);};

  const canvas = document.createElement('canvas');
  const width = 400;
  const height = 600;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  const keysDown = {};

  const Paddle = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.xSpeed = 0;
    this.ySpeed = 0;
  };

  Paddle.prototype.render = function() {
    context.fillStyle = '#eee';
    context.fillRect(this.x, this.y, this.width, this.height);
  };

  Paddle.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
    this.xSpeed = x;
    this.ySpeed = y;
    if (this.x < 0) {
      this.x = 0;
      this.xSpeed = 0;
    } else if (this.x + this.width > 400) {
      this.x = 400 - this.width;
      this.xSpeed = 0;
    }
  };

  const Computer = function() {
    this.paddle = new Paddle(175, 10, 50, 10);
  };

  Computer.prototype.render = function() {
    this.paddle.render();
  };

  Computer.prototype.update = function(ball) {
    const xPos = ball.x;
    let diff = -((this.paddle.x + (this.paddle.width / 2)) - xPos);
    if (diff < 0 && diff < -4) {
      diff = -5;
    } else if (diff > 0 && diff > 4) {
      diff = 5;
    }
    this.paddle.move(diff, 0);
    if (this.paddle.x < 0) {
      this.paddle.x = 0;
    } else if (this.paddle.x + this.paddle.width > 400) {
      this.paddle.x = 400 - this.paddle.width;
    }
  };

  const Player = function() {
    this.paddle = new Paddle(175, 580, 50, 10);
  };

  Player.prototype.render = function () {
    this.paddle.render();
  };

  Player.prototype.update = function () {
    for (const key in keysDown) {
      const value = Number(key);
      if (value === 37) {
        this.paddle.move(-4, 0);
      } else if (value === 39) {
        this.paddle.move(4, 0);
      } else {
        this.paddle.move(0, 0);
      }
    }
  };

  const Ball = function(x, y) {
    this.x = x;
    this.y = y;
    this.xSpeed = 0;
    this.ySpeed = 3;
  };

  Ball.prototype.render = function () {
    context.beginPath();
    context.arc(this.x, this.y, 5, 2 * Math.PI, false);
    context.fillStyle = '#eee';
    context.fill();
  };

  Ball.prototype.update = function (paddle1, paddle2) {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    const topX = this.x - 5;
    const topY = this.y - 5;
    const bottomX = this.x + 5;
    const bottomY = this.y + 5;

    if (this.x - 5 < 0) {
      this.x = 5;
      this.xSpeed = -this.xSpeed;
    } else if (this.x + 5 > 400) {
      this.x = 395;
      this.xSpeed = -this.xSpeed;
    }

    const resetSpeed = () => {
      this.xSpeed = 0;
      this.ySpeed = 3;
      this.x = 200;
      this.y = 300;
    };

    if(this.y < 0) {
      vm.scores.player++;
      resetSpeed();
      $scope.$digest();
    }
    if(this.y > 600) {
      vm.scores.computer++;
      resetSpeed();
      $scope.$digest();
      // console.log('score');
    }

    if(topY > 300 && topY < (paddle1.y + paddle1.height) && bottomY > paddle1.y && topX < (paddle1.x + paddle1.width) && bottomX > paddle1.x) {
      this.ySpeed = -3;
      this.xSpeed += (paddle1.xSpeed / 2);
      this.y += this.ySpeed;
    } else if(topY < (paddle2.y + paddle2.height) && bottomY > paddle2.y && topX < (paddle2.x + paddle2.width) && bottomX > paddle2.x) {
      this.ySpeed = 3;
      this.xSpeed += (paddle2.xSpeed / 2);
      this.y += this.ySpeed;
    }
  };

  const canvasContainer = document.getElementsByClassName('board');
  canvasContainer[0].appendChild(canvas);
  const keydown = event => keysDown[event.keyCode] = true;
  const keyup = event => delete keysDown[event.keyCode];
  window.addEventListener('keydown', keydown);
  window.addEventListener('keyup', keyup);

  const player = new Player();
  const computer = new Computer();
  const ball = new Ball(200, 300);

  const render = () => {
    context.fillStyle = dark3;
    context.fillRect(0, 0, width, height);
    player.render();
    computer.render();
    ball.render();
  };

  const update = () => {
    player.update();
    computer.update(ball);
    ball.update(player.paddle, computer.paddle);
  };

  const step = () => {
    update();
    render();
    animate(step);
  };
  animate(step);

  this.$onDestroy = () => {
    window.removeEventListener('keydown', keydown);
    window.removeEventListener('keyup', keyup);
  };

};

const pongComponent = {
  bindings: {},
  routeOpts: {
    name: 'pong',
    url: '/verveling',
    pageTitle: 'pong',
  },
  template,
  controller,
  controllerAs: 'vm'
};

routeWrap(angular).module('app.routes.pong', []).route('pong', pongComponent);
export default pongComponent;
