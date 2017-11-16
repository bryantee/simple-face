'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var clock = _interopDefault(require('clock'));
var document = _interopDefault(require('document'));
var heartRate = require('heart-rate');
var display = require('display');
var userActivity = require('user-activity');
var power = require('power');

function zeroPad(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

var hrm = new heartRate.HeartRateSensor();
clock.granularity = "minutes";
var myLabel = document.getElementById("myLabel");
var hrLabel = document.getElementById('hrLabel');
var mySteps = document.getElementById('mySteps');
var dateLabel = document.getElementById('date');
var batteryCircle = document.getElementById('batteryCircle');
hrm.onreading = function () {
    console.log("Current HR: " + hrm.heartRate);
    hrLabel.text = hrm.heartRate + " bpm";
};
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function calculateBatteryColor(percent) {
    var color;
    if (percent > 50) {
        color = 'green';
    }
    else if (percent < 50 && percent > 25) {
        color = 'yello';
    }
    else {
        color = 'red';
    }
    return color;
}
function updateClock() {
    var todayDate = new Date();
    var twentyFourHr = todayDate.getHours();
    var hours = twentyFourHr >= 12 ? twentyFourHr - 12 : twentyFourHr === 0 ? 12 : twentyFourHr;
    var aMpM = twentyFourHr >= 12 ? 'pm' : 'am';
    var month = months[todayDate.getMonth()];
    var dateOfMonth = todayDate.getDate();
    var mins = zeroPad(todayDate.getMinutes());
    var batteryLevel = power.battery.chargeLevel;
    batteryCircle.sweepAngle = Math.floor(batteryLevel * 3.6);
    batteryCircle.style.fill = calculateBatteryColor(Math.floor(batteryLevel));
    dateLabel.text = month + " " + dateOfMonth;
    mySteps.text = (userActivity.today.adjusted.steps.toLocaleString() || 0) + " steps";
    myLabel.text = hours + ":" + mins + aMpM;
}
clock.ontick = function (e) {
    console.log("A tick occured. " + new Date());
    updateClock();
};
display.display.onchange = function () {
    if (display.display.on) {
        hrm.start();
    }
    else {
        hrm.stop();
    }
};
hrm.start();
