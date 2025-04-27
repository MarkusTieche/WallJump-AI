class Player{
  
    constructor(Position,Index,Color) 
    {
        this.state = "alive";
        this.states ={"alive":this.updateAlive,"dead":this.updateDead,"noUpdate":this.noUpdate}

        this.gravity = 1.5;
        this.halfSize = 98/2;
        this.body = document.getElementById("Player").cloneNode(true);
        this.body.setAttribute("fill", Color);//RANDOM COLOR1
        this.deadBody =  null;
        this.eyes = this.body.getElementsByTagName('circle');
        this.eyesPosition = {"leftX":Number(this.eyes[0].getAttribute("cx")),"rightX":Number(this.eyes[1].getAttribute("cx"))};
        this.index = Index;
        this.reset(Position);
    }

    reset(Position)
    {
        this.state = "alive";
        this.position = {x:Position.x,y:Position.y-this.halfSize};
        this.rotation = 0;
        this.onWall = 0;
        if(this.deadBody)
        {
            document.getElementById("deadPlayer").removeChild(this.deadBody)
            this.deadBody = null;
        }
        this.velocity = {x:0,y:0};
        this.body.setAttribute("transform","translate("+this.position.x+","+this.position.y+")");
        this.alive = true;
        this.lastRecord = 0;
        this.topPosition = 0;
        this.body.style.opacity = 1;
        this.moveEyes(0);
        this.body.style.visibility = "visible";
    }

    crash(cameraPosition)
    {
        this.moveEyes(0);
        this.state = "dead";
        this.deadBody = document.getElementById("deadPlayer").appendChild(this.body.cloneNode(true));
        this.deadBody.position={x:(this.position.x-cameraPosition.x),y:(this.position.y-cameraPosition.y)};
        this.deadBody.rotation = 0;
        this.deadBody.scale = 1;
        this.deadBody.setAttribute("transform","translate("+this.deadBody.position.x+","+this.deadBody.position.y+")");
        this.velocity.y = Math.min(this.velocity.y,-20)
        this.velocity.x = this.velocity.x/2.5;
        this.body.style.opacity = 0.4;
        this.alive = false;
        this.onWall = 0;
    }

    finish(cameraPosition)
    {
        this.crash(cameraPosition);
        this.body.style.visibility = "hidden";
    }

    getLevelPart()
    {
        return Math.floor(Math.abs((this.position.y)/1280));
    }

    move(DirectionX)
    {
        if(this.onWall)
        {
            this.moveEyes(DirectionX*-1)
            this.velocity.x  = 30*DirectionX;
            this.velocity.y = -20;
            this.rotation = 30 * DirectionX;
        }
    }

    moveEyes(DirectionX)
    {
        this.eyes[0].setAttribute("cx", this.eyesPosition.leftX-10*DirectionX)
        this.eyes[1].setAttribute("cx", this.eyesPosition.rightX-10*DirectionX)
    }

    updateAlive()
    {
        this.velocity.y += this.gravity;

        if(this.position.x <= 768/2-230 || this.position.x >= 768/2+230)
        {
            this.onWall = 1;
            this.velocity.y = -20;
            this.rotation = 0;
        }
        else
        {
            this.onWall = 0;
            if(this.position.y+this.velocity.y >= -this.halfSize)//OnGround
            {
                this.position.y = -this.halfSize;
                this.velocity.y = 0;
                this.onWall = 1;
            }
        }
        
        this.position.x += this.velocity.x*dt;
        this.position.x = Math.min(Math.max(this.position.x, 768/2-230), 768/2+230);
        this.position.y += this.velocity.y*dt;


        this.body.setAttribute("transform", "translate(" + this.position.x + "," + this.position.y + "),rotate(" + this.rotation +")");

        var topPosition = Math.min(this.topPosition,this.position.y+this.halfSize);

        this.lastRecord++;
        if(topPosition < this.topPosition)
        {
            this.lastRecord = 0;
            this.topPosition =topPosition
        }
    }

    updateDead()
    {

        this.velocity.y += this.gravity;
        this.deadBody.rotation +=4*dt;
        this.deadBody.scale =Math.min(this.deadBody.scale+0.015,1.8);
        this.deadBody.position.x += (this.velocity.x*0.98)*dt;
        this.deadBody.position.y += this.velocity.y*dt;

        this.deadBody.setAttribute("transform","translate("+this.deadBody.position.x+","+this.deadBody.position.y+"),rotate("+this.deadBody.rotation+"),scale("+this.deadBody.scale+")");

        if(this.deadBody.position.y>200)//OUT OF SCREEN
        {
            this.state = "noUpdate";
            document.getElementById("deadPlayer").removeChild(this.deadBody)
            this.deadBody = null;
        }
    }

    noUpdate(){}

    update()
    {
        this.states[this.state].call(this)
    }
}