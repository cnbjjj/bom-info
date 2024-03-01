'use strict';

// Utility Functions
const query = (selector) => document.querySelector(selector);
const event = (on, event, call) => on.addEventListener(event, call);
const contains = (array, string) => {
  const result = array.find(item => string.toLowerCase().indexOf(item.toLowerCase()) > -1);
  if (typeof result !== 'string')
    return "Unknown";
  return result
};

// Main Program
const getOS = () => {
  const os = contains(["Android", "iPhone", "iPad", "Windows", "Mac OS", "Linux"], navigator.userAgent);
  return os.replace("iPhone", "iOS").replace("iPad", "iOS");
};
const getBrowser = () => {
  const browser = contains(["Edg", "Chrome", "Firefox", "Safari", "MSIE"], navigator.userAgent);
  return browser.replace("Edg", "Edge");
};

function setInfo(prop, value) {
  query(`.${prop}`).innerText = value;
}

function updateSystemInfo() {
  setInfo('os', getOS());
  setInfo('browser', getBrowser());
  setInfo('language', navigator.language);
}

function updateWindowInfo() {
  setInfo('width', window.innerWidth + "px");
  setInfo('height', window.innerHeight + "px");
  setInfo('orientation', window.innerWidth > window.innerHeight ? 'Landscape' : 'Portrait');
}

function updateNetworkInfo() {
  const online = navigator.onLine ? "Online" : "Offline";
  setInfo('online', online);
  query('.online').classList.toggle('off', !navigator.onLine);
}

function updateBatteryInfo(battery) {
  setInfo('level', battery.level * 100 + "%");
  setInfo('charging', battery.charging ? 'Charging' : 'Idle');
}

// Events
event(window, 'online', updateNetworkInfo);
event(window, 'offline', updateNetworkInfo);
event(window, 'resize', updateWindowInfo);
event(window, 'load', () => {
  updateSystemInfo();
  updateWindowInfo();
  updateNetworkInfo();
  if ('getBattery' in navigator) {
    navigator.getBattery().then((battery) => {
      event(battery, 'chargingchange', ()=>updateBatteryInfo(battery));
      event(battery, 'levelchange', ()=>updateBatteryInfo(battery));
      updateBatteryInfo(battery);
    });
  }else{
    console.log("Battery not available.");
  }
});