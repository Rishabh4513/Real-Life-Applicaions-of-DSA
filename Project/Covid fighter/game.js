function preload() {
    //load the images
    enemy_image = new Image;
    enemy_image.src = "./Assets/v2.png";

    player_image = new Image;
    player_image.src = "./Assets/superhero.png";

    gem_image = new Image;
    gem_image.src = "./Assets/gemm.png";
}

function init() {
    //define the objects in the game
    canvas = document.getElementById("mycanvas");
    console.log(canvas);
    W = 700;
    H = 400;

    canvas.width = W;
    canvas.height = H;

    //context to draw objects 

    pen = canvas.getContext('2d');
    console.log(pen);
    game_over = false;
    e1 = {
        x: 150,
        y: 50,
        w: 60,
        h: 60,
        speed: 20,
    };
    e2 = {
        x: 300,
        y: 150,
        w: 60,
        h: 60,
        speed: 30,
    };
    e3 = {
        x: 450,
        y: 20,
        w: 60,
        h: 60,
        speed: 40,
    };

    enemy = [e1, e2, e3];

    player = {
        x: 20,
        y: H / 2,
        w: 60,
        h: 60,
        speed: 20,
        moving: "false",
        health: 100,
    };

    gem = {
        x: W - 100,
        y: H / 2,
        w: 60,
        h: 60,
    };


    //listen to events on canvas

    canvas.addEventListener('mousedown', function() {
        console.log("mouse pressed");
        player.moving = true;
    });

    canvas.addEventListener('mouseup', function() {
        console.log("mouse released");
        player.moving = false;
    });

}

function collision(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.y + rect1.h > rect2.y) {
        return true;
    }
    return false;
}

function draw() {
    pen.clearRect(0, 0, W, H);
    pen.fillStyle = "Red";

    //drwa the player and the gem

    pen.drawImage(player_image, player.x, player.y, player.w, player.h);
    pen.drawImage(gem_image, gem.x, gem.y, gem.w, gem.h);

    for (let i = 0; i < enemy.length; i++) {
        pen.drawImage(enemy_image, enemy[i].x, enemy[i].y, enemy[i].w, enemy[i].h);
    }

    pen.fillStyle = "White";
    pen.fillText("Score: " + player.health, 10, 25);
    pen.font = "20px Verdana";

}

function update() {
    //if the player is moving

    if (player.moving == true) {
        player.x += player.speed;
        player.health += 20;
    }

    for (let i = 0; i < enemy.length; i++) {
        if (collision(player, enemy[i])) {
            player.health -= 50;
            if (player.health < 0) {
                alert("Game Over!");
                game_over = true;
                return;
            }
        }

    }

    //overlap betweeen player and covid
    if (collision(player, gem)) {
        //console.log("You won");
        alert("You won!!!");
        game_over = true;
        return;
    }


    //move the box down
    for (let i = 0; i < enemy.length; i++) {
        enemy[i].y += enemy[i].speed;
        if (enemy[i].y > H - enemy[i].h || enemy[i].y < 0)
            enemy[i].speed *= -1;
    }
}

function gameloop() {
    if (game_over == true) {
        clearInterval(f);
    }
    draw();
    update();
    console.log("In Game loop");
}

preload();
init();
var f = setInterval(gameloop, 100);