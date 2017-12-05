import angular from 'angular';
import {padStart, padEnd} from 'lodash-es';

// mm:ss:SSS
const playbackTime = () => (input, minus) => `${minus ? '-' : ''}${[
  padStart(parseInt((input / (1000 * 60)) % 60, 10), 2, '0'),
  padStart(parseInt((input / 1000) % 60, 10), 2, '0'),
  padEnd(parseInt((input % 1000) / 100, 10), 3, '0'),
].join(':')}`;

angular.module('app.filters.playbackTime', []).filter('playbackTime', playbackTime);
export default playbackTime;
