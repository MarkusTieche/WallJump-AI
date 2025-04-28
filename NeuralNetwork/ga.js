function nextGeneration() {
  console.log('next generation');
  calculateFitness();
  // for (let i = 0; i < TOTAL; i++) {
  //   birds[i] = pickOne();
  // }
  // for (let i = 0; i < TOTAL; i++) {
  //   savedBirds[i].dispose();
  // }
  // savedBirds = [];
}

function pickOne() {
  let index = 0;
  let r = random(1);
  while (r > 0) {
    r = r - savedBirds[index].fitness;
    index++;
  }
  index--;
  let bird = savedBirds[index];
  let child = new Bird(bird.brain);
  child.mutate();
  return child;
}

function calculateFitness() {
  let sum = 0;
  for (let player of players) {
    sum += player.topPosition;
  }
  for (let player of players) {
    player.fitness = player.topPosition / sum;
  }
}