import clock from "clock";
import document from "document";
import * as util from "../common/utils";
import { HeartRateSensor } from 'heart-rate';
import { display } from 'display';
import { today } from 'user-activity';
import { battery } from 'power';

const hrm = new HeartRateSensor();

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const myLabel = document.getElementById("myLabel");
const hrLabel = document.getElementById('hrLabel');
const mySteps = document.getElementById('mySteps');
const dateLabel = document.getElementById('date');
const batteryCircle = document.getElementById('batteryCircle');

hrm.onreading = (): void => {
  console.log(`Current HR: ${hrm.heartRate}`);
  hrLabel.text = `${hrm.heartRate} bpm`;
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function calculateBatteryColor(percent: number): string {
  let color: string;
  
  if (percent > 50) {
    color = 'green';
  } else if (percent <= 50 && percent > 25) {
    color = 'yellow';
  } else {
    color = 'red';
  }
  
  return color;
}

// Update the <text> element with the current time
function updateClock(): void {
  const todayDate = new Date();
  const twentyFourHr = todayDate.getHours();
  const day = days[todayDate.getDay()];
  const hours = twentyFourHr > 12 ? twentyFourHr - 12 : twentyFourHr === 0 ? 12 : twentyFourHr;
  const aMpM = twentyFourHr >= 12 ? 'pm' : 'am';
  const month = months[todayDate.getMonth()];
  const dateOfMonth = todayDate.getDate();
  const mins = util.zeroPad(`${todayDate.getMinutes()}`);
  
  const batteryLevel = battery.chargeLevel;
  
  batteryCircle.sweepAngle = Math.floor(batteryLevel * 3.6);
  batteryCircle.style.fill = calculateBatteryColor(Math.floor(batteryLevel));
  dateLabel.text = `${day} ${month} ${dateOfMonth}`;
  mySteps.text = `${today.adjusted.steps.toLocaleString() || 0} steps`;
  myLabel.text = `${hours}:${mins}${aMpM}`;
}

// Update the clock every tick event
clock.ontick = (e: Error) => {
  console.log(`A tick occured. ${new Date()}`);
  updateClock();
}

display.onchange = (): void => {
  if (display.on) {
    hrm.start();
  } else {
    hrm.stop();
  }
}

hrm.start();

