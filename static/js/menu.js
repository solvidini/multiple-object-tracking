import { levels } from './settings.js';
import game from './game.js';

const currentDate = new Date().getFullYear();
const copyYear = document.createTextNode(currentDate + ' \u00A9 ');
document.querySelector('.copyright').appendChild(copyYear);

const menu = document.querySelector('#menu');

const startLevel = (level) => {
   new Audio('./static/audio/choose.ogg').play();
   menu.classList.add('menu--inactive');
   game(level);
};

for (const level in levels) {
   const button = document.createElement('button');
   const label = document.createTextNode(level);
   button.appendChild(label);
   button.classList.add('btn');
   button.classList.add('btn--menu');
   button.addEventListener('click', () => startLevel(levels[level]));
   button.addEventListener('pointerover', () => {
      new Audio('./static/audio/hover.mp3').play();
   });
   menu.appendChild(button);
}
