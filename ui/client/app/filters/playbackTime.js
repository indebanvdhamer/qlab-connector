import angular from 'angular';
import {padEnd} from 'lodash-es';

const playbackTime = () => input => {
  const milliseconds = padEnd(parseInt((input % 1000) / 100, 10), 3, '0');
  let seconds = parseInt((input / 1000) % 60, 10);
  let minutes = parseInt((input / (1000 * 60)) % 60, 10);
  // let hours = parseInt((input / (1000 * 60 * 60)) % 24, 10);

  // hours = (hours < 10) ? `0${hours}` : hours;
  minutes = (minutes < 10) ? `0${minutes}` : minutes;
  seconds = (seconds < 10) ? `0${seconds}` : seconds;

  return `${minutes}:${seconds}:${milliseconds}`;
};

angular.module('app.filters.playbackTime', []).filter('playbackTime', playbackTime);
export default playbackTime;
