/*
1、Vue项目中，package.json里面的browserslist配置项
  "browserslist": [
    "> 1%",
    "last 7 versions",
    "not ie <= 8",
    "last 10 Chrome versions",
    "last 5 Firefox versions",
    "Safari >= 6"
  ]





*/
function red() {
  console.log('red');
}

function green() {
  console.log('green');
}

function yellow() {
  console.log('yellow');
}

var light = function (timer, cb) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      cb();
      resolve();
    }, timer);
  });
};

var step = function () {
  Promise.resolve().then(function () {
    return light(3000, red);
  }).then(function () {
    return light(2000, green);
  }).then(function () {
    return light(1000, yellow);
  }).then(function () {
    step();
  });
}
step();
