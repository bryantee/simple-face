import clock from "clock";
import document from "document";
import * as util from "../common/utils";
import { HeartRateSensor } from 'heart-rate';
import { display } from 'display';
import { today } from 'user-activity';
import { battery } from 'power';

let hrm = new HeartRateSensor();

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const myLabel = document.getElementById("myLabel");
const hrLabel = document.getElementById('hrLabel');
const mySteps = document.getElementById('mySteps');
const dateLabel = document.getElementById('date');
const batteryCircle = document.getElementById('batteryCircle');

hrm.onreading = () => {
  console.log(`Current HR: ${hrm.heartRate}`);
  hrLabel.text = `${hrm.heartRate} bpm`;
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function calculateBatteryColor(percent) {
  let color;
  
  if (percent > 50) {
    color = 'green';
  } else if (percent < 50 > 25) {
    color = 'yello';
  } else {
    color = 'red';
  }
  
  console.log(`Color for circle: ${color}`);
  
  return color;
}

// Update the <text> element with the current time
function updateClock() {
  const todayDate = new Date();
  const twentyFourHr = todayDate.getHours();
  const hours = twentyFourHr <= 12 ? twentyFourHr : twentyFourHr - 12;
  const aMpM = twentyFourHr >= 12 ? 'pm' : 'am';
  const month = months[todayDate.getMonth()];
  const dateOfMonth = todayDate.getDate();
  const mins = util.zeroPad(todayDate.getMinutes());
  
  const batteryLevel = battery.chargeLevel;
  console.log(`battery level: ${batteryLevel}%`);
  
  batteryCircle.sweepAngle = Math.floor(batteryLevel * 3.6);
  batteryCircle.style.fill = calculateBatteryColor(Math.floor(batteryLevel));
  dateLabel.text = `${month} ${dateOfMonth}`;
  mySteps.text = `${today.adjusted.steps.toLocaleString() || 0} steps`;
  myLabel.text = `${hours}:${mins}${aMpM}`;
}

// Update the clock every tick event
clock.ontick = e => {
  console.log(`A tick occured. ${new Date()}`);
  updateClock();
}

display.onchange = () => {
  if (display.on) {
    hrm.start();
  } else {
    hrm.stop();
  }
}

hrm.start();

