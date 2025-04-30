class Level{
  
    constructor(PlayerCount) 
    {
        this.highScoreLine = document.getElementById("highScoreLine");
        this.progress = document.getElementById("progress");

        this.players = [];
        this.levelParts = [];
        this.highScore = 0;
        this.score = 0;
        this.lastHighscore = 0;
        this.playerCount = PlayerCount;
        this.levelLimit = -5000;
        this.currentLevel = 1;
        this.gameStarted = false;

        this.createLevel(Math.ceil((this.levelLimit * -1) / 1280));
       
        for (let i = 0; i < this.playerCount; i++) {
            this.addPlayer({x:768/2,y:0},i,("#"+Math.floor(Math.random()*16777215).toString(16)));
        }


        camera.target = this.players[0];
    }

    createLevel(PartCount)
    {
        //LEVEL SETUP
        var stepSize = -1280;
        document.getElementById("labelLevel").innerHTML = "LEVEL " + this.currentLevel;
        document.getElementById("goal").setAttribute("transform", "translate(0," + (this.levelLimit) + ")");
        
        this.highScore = 98;
        this.highScoreLine.setAttribute("transform", "translate(0," + (+this.highScore - 98) + ")");
        
        //REMOVE LEFTOVER LEVELPARTS
        for (let levelPart of this.levelParts) {
            if (levelPart.active) {
                document.getElementById("levelParts").removeChild(levelPart.group);
            }
        }
        this.levelParts = [];
        
        //CREATE LEVEL ARRAY
        for (let i = 0; i < PartCount; i++) {
            var newLevelPart = new LevelPart({ x: 0, y: stepSize * i });
            this.levelParts.push(newLevelPart);
            newLevelPart.isVisible();
        }
    }

    restartLevel()
    {
        this.gameStarted = false;
        document.getElementById("Input").style.visibility = "visible";
        document.getElementById("Black").style.visibility = "hidden";

        playerAI.nextGeneration(this.players, camera.target.index);

        for (let i = 0; i < this.players.length; i++) {
            this.players[i].reset({ x: 768 / 2, y: 0 });
        }

        camera.target = this.players[0];
        camera.position = { x: 0, y: camera.targetOffset.y };
        this.highScoreLine.setAttribute("transform", "translate(0," + (+this.highScore - 98) + ")");

        gameStarted = false;
    }

    finishLevel()
    {
        this.currentLevel++;
        document.getElementById("progressStart").innerHTML = (this.currentLevel-1);
        document.getElementById("progressEnd").innerHTML = (this.currentLevel);
        this.levelLimit = -5000 + (this.currentLevel*-1280);
        this.createLevel(Math.ceil((this.levelLimit * -1) / 1280));
        this.restartLevel();
    }

    setLevelLimit(limit)
    {
        return Math.ceil((limit*-1)/1280);
    }

    addPlayer(Position, index, Color)
    {
        var player = new Player(Position, index, Color);
        this.players.push(player);
        document.getElementById("players").appendChild(player.body);
        this.progress.style.backgroundColor = Color;
    }

    update()
    {
        var deadPlayers = 0;
        var topHeight = 0;
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].update();

            if (this.players[i].alive) {
                
                this.players[i].move(this.players[i].brain.think(this.players[i].position,(this.levelParts[this.players[i].getLevelPart()].getClosestSpike(this.players[i].position))));

                //COLLISION
                if (this.levelParts[this.players[i].getLevelPart()].checkCollision(this.players[i].position)) {
                    //CRASH
                    this.players[i].crash(camera.position);
                }

                //TOP POSITION
                if (this.players[i].topPosition <= topHeight) {
                    topHeight = this.players[i].topPosition;
                    camera.target = this.players[i];
                    this.progress.style.backgroundColor = this.players[i].body.getAttribute("fill");
                }

                //LEVEL FINISHED
                if (this.players[i].topPosition < this.levelLimit) {
                    this.players[i].finish(camera.position);
                    setTimeout(() => {
                        this.finishLevel();
                    }, 1000);
                }
                
                this.progress.style.left = (topHeight / this.levelLimit) * 120 + "px";
                this.highScore = Math.floor(Math.min(this.highScore, this.players[i].position.y + this.players[i].halfSize))
            }
            else {
                deadPlayers++;

                if(deadPlayers == this.playerCount)
                {
                    document.getElementById("Black").style.visibility = "visible"
                        setTimeout(() => {
                            this.restartLevel();
                       }, 1000);
                }
            }
        }
        
        //UPDATE CAMERA
        setCamera(camera.target.position)
        
        //UPDATE LEVEL
        for (let i = 0; i < this.levelParts.length; i++) {
            this.levelParts[i].isVisible();
        }
    }
}