# Dressing Our Game Up {#dressingup}

Foxnoid is now a playable game but you can't win it (or lose it). In this chapter we're going to solve that by adding both the game win and game over mechanics.

We're going to use two new game states one for each type of ending. Once each situation happens we're going to switch to that state. Game states are useful for many things but one special use that they excel at is when the nature of what is happening on your game changes. In the game over situation the player was playing the game but lost it and is no longer able to play, this fundamental difference from the previous situation is easily crafted with game state switches.

## Winning and Losing Our Game

Each situation will be a different game state on its own file.

### Game Over Scenario

Game over will happen once the player runs out of lives. His initial lives number is set by the ```initWorld()``` function and updated if needed by the ```ballCollidesWithGround()``` function. What we're going to do there is check if the player has zero lives and switch to a new game state called **GameOver** if needed. Lets alter that function:

{lang="js", title="game.js: the ballCollidesWithBlock() function with Game Over switch", line-numbers=on}
~~~~~
ballCollidesWithGround: function() {
    if (this.ball.y >= 470) {
        this.playerLives -= 1;
        this.resetBall();
    }

    /*
     Update player life display
     */

    this.livesDisplay.setText("Lives: " + this.playerLives);

    if (this.playerLives === 0) {
        this.state.start("GameOver");
    }

}
~~~~~

The important part is ```this.state.start("GameOver")``` which switches to the new state. Our new state will look like this during the game:

![Foxnoid game over screen](images/originals/gameover.png)

We're using the same background as the one in the game with two images for the text parts. We need to add these images to the **Preload** state, so edit the **preload.js** like this:

{lang="js", title="preload.js: the game state to load our assets", line-numbers=on}
~~~~~
GameStates.Preloader = {
    preload: function() {
        this.load.image('background', 'assets/background.jpg');
        this.load.image('player', 'assets/player.png');
        this.load.image('ball', 'assets/ball.png');
        this.load.image('block', 'assets/block.png');
        this.load.image('gameover', 'assets/gameover.png');
        this.load.image('taptoplay', 'assets/taptoplay.png');
    },
    create: function(){
        this.state.start('Game');
    }
};
~~~~~

As you can see we simply added two images to the ```preload()``` function, this way they are available to our new game state once it loads. Talking about game states we need some steps when creating a new one. First thing we need to create a new file. Lets call it **game_over.js** and place it inside the **js folder**.

We need to include it in **index.html** as shown here

{lang="js", title="index.html: now includes our game over state", line-numbers=on}
~~~~~
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Foxnoid Game</title>
        <link rel="stylesheet" href="css/style.css" />
        <script defer src="js/phaser.min.js"></script>
        <script src="js/init.js"></script>
        <script defer src="js/preload.js"></script>
        <script defer src="js/game.js"></script>
        <script defer src="js/game_over.js"></script>
    </head>
    <body>

        <div id="game"></div>

    </body>
</html>
~~~~~

After including that file in the HTML we need to register the state in **init.js** as seen here:

{lang="js", title="init.js: with the new game over state", line-numbers=on}
~~~~~~~~
var GameStates = {}; // <-- Object to hold all our game states.

document.addEventListener("DOMContentLoaded", function()  {

    // Portrait game orientation. 

    var width = 320;
    var height = 480;

    var game = new Phaser.Game(width, height, Phaser.CANVAS, "game");
    
    // Add the Game States the game has.
    game.state.add('Preloader', GameStates.Preloader);
    game.state.add('Game', GameStates.Game);
    game.state.add('GameOver', GameStates.GameOver);
    
    // Now start the Preloader state.
    game.state.start('Preloader');

});
~~~~~~~~

With those steps done we can code **game_over.js**

{lang="js", title="game_over.js: player lost, how sad", line-numbers=on}
~~~~~~~~
GameStates.GameOver = {
    create: function() {

        // Add the background
        this.add.sprite(0, 0, 'background');

        // Add the message
        this.add.sprite(20, 30, 'gameover');

        // Add the tap to play button
        this.add.sprite(20, 300, 'taptoplay');
    },

    update: function() {

        /**
         * We just want to detect a tap. 
         * If there is one, we switch back to the game
         * state and start the game again
         */

        if (this.input.pointer1.isDown) {
            this.state.start('Game');
        }

    }

};
~~~~~~~~


### Game Win Scenario

## Summary