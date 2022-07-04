function randomIntFromRange(min, max) {
   return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomSign() {
   const sign = Math.random() - 0.5;
   if (sign >= 0) return 1;
   else return -1;
}

function randomVelocity(min, max) {
   return randomSign() * Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
   return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
   const xDist = x2 - x1;
   const yDist = y2 - y1;

   return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function removeAllChildNodes(parent) {
   while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
   }
}

export { randomIntFromRange, randomVelocity, randomColor, distance, removeAllChildNodes };
