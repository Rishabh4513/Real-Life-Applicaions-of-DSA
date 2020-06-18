
function init(){
canvas=document.getElementById('mycanvas');
W=canvas.width=1000;
H=canvas.height=1000;
pen=canvas.getContext('2d');
cs=66;
game_over=false;
score=5;

//Create a image object for food
	food_img=new Image();
	food_img.src="Assets/apple.png";

	trophy=new Image();
	trophy.src="Assets/trophy.png";
food =getRandomFood();

snakes={
	init_len:5,
	color:"blue",
	cells:[],
	direction:"right",

	createSnake:function()
	{
		for(var i=this.init_len;i>0;i--)
		{
			this.cells.push({x:i,y:0});
		}
	},
	drawSnake:function()
	{

		for(var i=0;i<this.cells.length;i++)
		{
			pen.fillStyle=this.color;
			pen.fillRect(this.cells[i].x*cs,this.cells[i].y*cs,cs-3,cs-3);
		}
	},

	updateSnake:function()
	{
		//console.log("Updating snake according to the direction");
		//check if the snake has eaten the food, increase the size of the snake
		//and generate the new food object

		var headX=this.cells[0].x;
		var headY=this.cells[0].y;

		if(headX==food.x && headY==food.y)
		{
			console.log("Food eaten");
			food=getRandomFood();
			score++;
		}
		else
		{
			this.cells.pop();
		}

		var nextX,nextY;
		if(this.direction=='right')
		{
			nextX=headX+1;
			nextY=headY;
		}
		else if(this.direction=='left')
		{
			nextX=headX-1;
			nextY=headY;
		}
		else if(this.direction=='down')
		{
			nextX=headX;
			nextY=headY+1;
		}
		else if(this.direction=='up')
		{
			nextX=headX;
			nextY=headY-1;
		}

		this.cells.unshift({x:nextX,y:nextY});

		//Prevent from the boundary
		var last_x=Math.round(W/cs);
		var last_y=Math.round(H/cs);

		if(this.cells[0].y<0 || this.cells[0].x<0 || this.cells[0].x>last_x||this.cells[0].y>last_y)
		{
			game_over=true;
		}
	}

};
snakes.createSnake();
	function keypressed(e)
	{
		//conditional statements
		if(e.key=='ArrowRight')
			snakes.direction="right";
		else if(e.key=='ArrowLeft')
			snakes.direction="left";
		else if(e.key=='ArrowUp')
			snakes.direction='up';
		else if(e.key=='ArrowDown')
			snakes.direction='down';
		console.log(snakes.direction);
	}
	document.addEventListener('keydown',keypressed);
}

function draw()
{
	pen.clearRect(0,0,W,H);
	//erase the old frame
	snakes.drawSnake();

	pen.fillStyle=food.color;
	pen.drawImage(food_img,food.x*cs,food.y*cs,cs,cs);

	pen.drawImage(trophy,35,20,cs,cs);
	pen.fillStyle="blue";
	pen.font="40px Roboto";
	pen.fillText(score,50,55);
}

function update()
{
	//console.log("In update");
	snakes.updateSnake();
}

function getRandomFood()
{
	var foodX=Math.round((Math.random()*(W-cs)/cs));
	var foodY=Math.round((Math.random()*(H-cs)/cs));

	var food =
	{
		x:foodX,
		y:foodY,
		color:"red",
	}
	return food;
}
function game_loop()
{
	if(game_over==true)
	{
		clearInterval(f);
		alert("Game Over");
		return ;
	}
	draw();
	update();
}

init();
var f=setInterval(game_loop,100);
