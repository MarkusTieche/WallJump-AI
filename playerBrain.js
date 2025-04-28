class PlayerBrain {

    constructor()
    {
        this.brain = new NeuralNetwork(4, 4, 2);
        this.thinkTime = 15;
        this.fitness = 0;
        this.inputs = [];
    }

    updateBrain(Brain)
    {

    }

    think(Position,ClosestSpike) {
        this.thinkTime--;
        if (this.thinkTime) {

            this.thinkTime = 15;
            //USE NORAMLIZED VALUES
            this.inputs[0] = Position.x / 768;//PLAYER X POSITION
            this.inputs[1] = Position.y / -1280;//PLAYER Y POSITION
            this.inputs[2] = ClosestSpike.x / 768; //NEXT SPIKE X POSITION 
            this.inputs[3] = ClosestSpike.y / -1280;  //NEXT SPIKE Y POSITION 

            //RETURN OUTPUT -> NEXT MOVE
            var output = this.brain.predict(this.inputs);
            if (output[0] > output[1]) {
                return(-1)
            }
            else {
                return(1)
            }
        }
    }
}