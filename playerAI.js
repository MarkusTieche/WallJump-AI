class PlayerAI {

    constructor() {

    }
    //AI
    nextGeneration(Players,Best) 
    {
        var avg = this.calculateFitness(Players);
        for (let i = 0; i < Players.length-1; i++) {
            // if (i == Best) { players[i].reset({ x: 768 / 2 - 100 + Math.random() * 200, y: 0 }, players[i].brain); continue; }
            //HAS REACHED TOP -> NO NEED FOR NEW BRAIN
            // if (Players[i].topPosition < currentLevel.levelLimit) {
            console.log("jj")
            if (i == Best) {
                var newBrain = Players[i].brain.nn;
            }
            else {
                var newBrain = Players[Best].brain.nn.copy();
                if (Players[i].topPosition <= Best.topPosition) {
                    if (Players[i].topPosition > avg) {
                        newBrain.mutate(0.5);
                        console.log("mutate")
                    }
                    else {
                        newBrain.mutate(0.1);
                        console.log("nomutate")
                    }
                }
            }

        // newBrain.mutate(Math.min(1-(players[i].topPosition/highScore),0.4))
        // players[i].reset({ x: 768 / 2 - 100 + Math.random() * 200, y: 0 }, newBrain)
            Players[i].brain.updateBrain(newBrain)
    }
}

    calculateFitness(Players) 
    {
        let sum = 0;
        for (let player of Players) {
            sum += player.topPosition;
        }
        for (let player of Players) {
            player.fitness = player.topPosition / sum;
        }

        return sum / players.length;
    }
}