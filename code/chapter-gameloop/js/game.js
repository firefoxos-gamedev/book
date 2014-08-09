/**
 * This is the Game game state. 
 * Its our game loop responsible for the game itself.
 *
 * In the create() function we setup the display.
 * In the update() function we do the gameloop.
 *
 * To learn more about states refer to:
 * Refer to: http://docs.phaser.io/Phaser.State.html
 */

GameStates.Game = {
    resetBall: function() {
        this.ball.reset(160, 240);
        this.ball.body.velocity.x = this.ballSpeed;
        this.ball.body.velocity.y = this.ballSpeed;
    },

    initWorld: function() {
        // Some constants
        this.playerSpeed = 250;
        this.ballSpeed = 220;
        this.blocksPerRow = 5;
        this.blockRows = 4;
        this.playerLives = 13;

        // Add the background
        this.add.sprite(0, 0, 'background');
    },


    addPlayer: function () {
        // Add the player
        this.player = this.add.sprite(160, 440, 'player');
        this.physics.arcade.enable(this.player);
        this.player.anchor.setTo(0.5, 0);
        this.player.enableBody = true;
        this.player.body.immovable = true;
        this.player.body.collideWorldBounds = true;


        // Add the display of player lives
        this.livesDisplay = this.add.text(10, 8, "Lives: " + 
            this.playerLives, {
                fill: "white",
                fontSize: 12
            });
    },

    addBall: function () {
        // Add ball
        this.ball = this.add.sprite(160, 240, 'ball');
        this.physics.arcade.enable(this.ball);
        this.ball.anchor.setTo(0.5, null);
        this.ball.enableBody = true;
        this.ball.body.bounce.setTo(1, 1);
        this.ball.body.velocity.x = this.ballSpeed;
        this.ball.body.velocity.y = this.ballSpeed;
        this.ball.body.collideWorldBounds = true;
    },

    addBlocks: function () {
        // Blocks
        this.blocks = this.game.add.group();
        for (var line = 0; line <= this.blockRows - 1; line++) {
            for (var row = 0; row <= this.blocksPerRow - 1; row++) {
                var posY = (line * 30) + 40;
                var posX = (row * 50) + 40;
                console.log("Adding block at: " + posX + "," + posY)
                var temp = this.add.sprite(posX, posY, 'block');
                this.physics.arcade.enable(temp);
                temp.enableBody = true;
                temp.body.immovable = true;

                this.blocks.add(temp);
            }
        }
    },

    create: function() {
        this.initWorld();
        this.addPlayer();
        this.addBall();
        this.addBlocks();
    },

    checkHitWithBlocks: function () {
        this.game.physics.arcade.collide(this.ball, this.blocks, this.ballCollidesWithBlock);
    },

    checkHitWithPlayer: function () {
        this.game.physics.arcade.collide(this.ball, this.player);
    },

    update: function() {
        this.checkHitWithBlocks();
        this.checkHitWithPlayer();
        this.ballCollidesWithGround();
    },

    ballCollidesWithBlock: function(sprite, block) {
        console.log("Collided with block!");
        block.kill();
    },

    ballCollidesWithGround: function() {
        if (this.ball.y >= 470) {
            this.playerLives -= 1;
            this.resetBall();
        }

        /*
         Update lives display
         */

        this.livesDisplay.setText("Lives: " + this.playerLives);

        if (this.playerLives === 0) {
            // Soon there will be a game over state switch here
        }

    }

};
