import { levels } from './settings.js';
import game from './game.js';

const menu = document.querySelector('#menu');

const startLevel = (event, level) => {
    new Audio('./static/audio/off.ogg').play();
   const props = {};
   event.preventDefault();
   menu.classList.add('menu--inactive');
   props.level = level;
   game(props);
};

for (const level in levels) {
   const button = document.createElement('button');
   const label = document.createTextNode(level);
   button.appendChild(label);
   button.classList.add('menu__button');
   button.addEventListener('click', (event) => startLevel(event, levels[level]));
   button.addEventListener('pointerover', () => {
      new Audio('./static/audio/on.ogg').play();
   });
   menu.appendChild(button);
}
