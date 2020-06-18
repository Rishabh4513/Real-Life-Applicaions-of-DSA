onload = function () {
    const unit = 16;
    const move_step = unit * 5;
    const fly_step = unit * 8;
    let platforms_array = [];
    let moves = [];
    let pos = 0;
    let firstTime = true;
    let onGround = true;
    const game = new Phaser.Game(320, 240, Phaser.AUTO, 'mynetwork');
    const game_length = 1850;
    const game_height = game.height;
    const ground_height = game_height - 2*unit;
    const result_font = { font:"20px",fill:"#000",align:"center"};
    const refresh = document.getElementById('generate-problem');
    refresh.onclick = function () {
        game.state.start("GameState");
    };
    var temptext = document.getElementById('temptext');
    var solve = document.getElementById('solve');
    const text = 'You\'ll receive a jumps array as input. Each index stores the maximum islands you can jump ahead from current island. ' +
        'You need to find least number of moves needed to reach the last island and return jump to be taken on each island.<br>' +
        'Can you solve it ?<br>';
    const text2 = 'Click on solve to get solution';

    const BootState = {
        init : function () {
            game.stage.backgroundColor = '#5c94fc';
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        },
        create : function () {
            this.state.start("PreloadState");
        }
    };

    const PreloadState = {
        preload : function () {
            game.load.spritesheet('mario', 'assets/player.png', 18, 20);
            game.load.spritesheet('flag', 'assets/flag.png', 33, 168);
            game.load.image('cloud', 'assets/cloud.png');
            game.load.image('sun', 'assets/sun.png');
            game.load.image('tile', 'assets/tile.png');
            game.load.image('wave', 'assets/wave.png');
            game.load.image('sea', 'assets/sea.png');
        },
        create : function () {
            this.state.start("GameState")
        }
    };

    const GameState = {
        init: function() {
            createGame();
        },
        update: function() {
            updateState();
        }
    };

    game.state.add("BootState",BootState);
    game.state.add("PreloadState",PreloadState);
    game.state.add("GameState",GameState);
    game.state.start("BootState");

    function createGame() {
        pos = 0;
        firstTime = true;
        onGround = true;
        platforms_array = [];
        game.world.setBounds(0,0,game_length);
        game.physics.startSystem(Phaser.Physics.ARCADE);

        for(let i=0;i<29;i++){
            platforms_array.push(Math.floor(Math.random()*3)+1);
        }

        clouds = game.add.group();
        let change = 15;
        for (let i = 70; i < game_length; i+= 240) {
            clouds.create(i, change + ground_height - 8*unit, 'cloud');
            change *= -1;
        }

        sun = game.add.sprite(16*unit, ground_height - 13.5*unit, 'sun');
        game.physics.arcade.enable(sun);

        platforms = game.add.group();
        platforms.enableBody = true;
        for (i = 0; i < 30; i++) {
            let pos = i * 60 + 15;
            let platform = platforms.create(pos, ground_height, 'tile');
            platform.body.immovable = true;
            game.add.text(pos + 10, ground_height-40, platforms_array[i], result_font);
            if(i===29){
                platform.scale.setTo(2,1);
            }
        }

        const ground = game.add.tileSprite(0,ground_height+10, game_length, 6, 'wave');
        game.physics.arcade.enable(ground);
        ground.body.immovable = true;
        game.add.tileSprite(0,ground_height+14, game_length, game.height, 'sea');

        flag = game.add.sprite(1780, ground_height-168, 'flag');
        flag.animations.add('celebrate');

        player = game.add.sprite(24, ground_height - 20, 'mario');
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.body.velocity.x = move_step;
        player.body.enable = false;

        temptext.innerHTML = text + platforms_array.toString() + '<br>' + text2;
    }

    function updateState() {
        game.physics.arcade.collide(player, platforms, groundOverlap);
        game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN);

        if (player.body.enable) {
            if (onGround) {
                onGround = false;
                if(pos<moves.length) {
                    const mul = Math.sqrt(moves[pos]);
                    const vely = -fly_step * mul;
                    const velx = move_step * mul;
                    player.body.velocity.y = vely;
                    player.body.velocity.x = velx;
                    player.body.gravity.y = ( 2 * -vely * velx ) / ( 60 * moves[pos] + 1 );
                    pos++;
                } else{
                    if(firstTime){
                        flag.animations.play('celebrate', 5);
                        firstTime = false;
                        sun.body.enable = false;
                        player.body.velocity.x = 0;
                    }
                    player.body.velocity.y = -fly_step;
                    player.body.gravity.y = fly_step*4;
                }
            }

            if(sun.body.enable && player.body.x > 15*unit){
                sun.body.velocity.x = player.body.velocity.x-15;
            } else{
                sun.body.velocity.x = 0;
            }
        }
    }

    function groundOverlap() {
        onGround = true;
    }

    solve.onclick = function () {
        moves = solveProblem(platforms_array);
        temptext.innerText = temptext.innerText + "\n\nSolution\n" + moves;
        player.body.enable = true;
    };
};

function solveProblem(input_arr){
    let res = [];
    for(let i=0;i<30;i++){
        res.push([1000,-1]);
    }
    res[0][0] = 0;
    for(let i=0;i<29;i++){
        const jump = input_arr[i];
        for(let j=1;j<=jump && i+j<30;j++){
            if(res[i+j][0] > res[i][0]+1){
                res[i+j][0] = res[i][0]+1;
                res[i+j][1] = j;
            }
        }
    }

    let ans = [];
    let end = 29;
    while(end>0){
        ans.push(res[end][1]);
        end -= res[end][1];
    }
    return ans.reverse();
}