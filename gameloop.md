# Gameloop {#gameloop}

This is it! We've finally reached the point where by the end of the chapter we'll actually have stuff on the screen! Before we get too excited about it lets wind down and ponder a minute about...

## What Is The Essential Part of a Game?

With our newly understood concepts about game loops and gaming in general we'll do an experiment and cut stuff from a game until we're left with the essence of a game.

Games these days have title screens, intro animations, tutorial levels, infinite option screens, leaderboards and many other things that if we cut out we're not left without a game. If you go back in time into the 90s, you could pick a handheld game not unlike Tetris that when powered on would drop you straight into the game. No fancy options, no tutorial levels, no intro stuff, just the actual game.

This game play part is what we're calling the game loop. Its the piece of your game that picks the input from the user, calculates what happens in the game world and displays it to the player. This continuous loop of picking input, simulating the world and displaying it is the heartbeat of a game. It is what makes it alive. We'll focus on this heartbeat and the other features will follow later.

In this chapter we're going to build part of this beating mechanism. We're going to focus on the simulating the world and displaying it and leave player input to its own chapter. At the end of this chapter, our game will be alive and moving.

## Thinking About Our Game Loop

The game loop will be built as its own Game State. In the previous chapter we've built a state to load our assets so that they would be ready to be used by this state that we're going to build now.

Our main objective here is simulating and displaying the world. Lets break down our simulation part and take note on what do we need.

* **Ball moving:** The ball should keep moving.
* **Ball collision with the walls:** If we think the smartphone display has four walls then the ball should collide with them and bounce back so not to leave the screen.
* **Blocks positioning:** Our blocks should be positioned as a grid when the game start.
* **Ball collision with blocks:** The ball should collide with the blocks and once this happens the block should be destroyed.
* **Ball collision with player:** The ball should bounce when it hits the player paddle.

All the stuff about positioning things should happen on the ```create()``` function of the state which is run once when the state is created. All the moving and collision things should happen on the ```update()``` function which is the one that is called repeatedly once a game state is active. 

Create a file called **game.js** inside the **js folder** and lets begin coding. 

### Changing index.html

We need to change our **index.html** file to include **game.js**.

{lang="js", title="index.html: now includes our game state", line-numbers=on}
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
    </head>
    <body>

        <div id="game"></div>

    </body>
</html>
~~~~~

After including that file in the HTML we need to register the state in **init.js** as seen here:

{lang="js", title="init.js: with the new game state", line-numbers=on}
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
    
    // Now start the Preloader state.
    game.state.start('Preloader');

});
~~~~~~~~

## Initializing Our World

[Phaser Game States](http://docs.phaser.io/Phaser.State.html) as explained in the [initialization chapter](#initialization) have different functions that we can implement to suite our game loop workflow. To initialize the world we'll implement the ```create()``` function that is run once when the state starts. We're not going to implement this initialization as a single continuous block of code because it will be tedious and harder to understand. Instead we're going to build tiny functions that will be called from ```create()```.

{lang="js", title="game.js: is where the fun happens", line-numbers=on}
~~~~~
GameStates.Game = {
    initWorld: function() {
        // Some constants
        this.playerSpeed = 250;
        this.ballSpeed = 220;
        this.blocksPerRow = 5;
        this.blockRows = 3;
        this.playerLives = 13;

        // Add the background
        this.add.sprite(0, 0, 'background');
    },
    
    create: function() {
        this.initWorld();
    }
};
~~~~~

Above we can see an example of how our coding works. We created a function called ```initWorld()``` and then we call it from ```create()```. This ```initWorld()``` is responsible for setting some constants and adding the background image. These constants are used by the functions we'll call on ```update()``` to simulate the world.

From now on, instead of pasting the whole **game.js** file, I am going to place just the new function that you should add and in the end how the 
```create()``` should look.

### Adding the player

Remember that you need to place commas between the methods. Add the method below to the ```GameStates.Game``` object. 

{lang="js", title="game.js: the addPlayer() function", line-numbers=on}
~~~~~
addPlayer: function () {
    // Add the player
    this.player = this.add.sprite(160, 440, 'player');
    this.physics.arcade.enable(this.player);
    this.player.anchor.setTo(0.5, 0);
    this.player.enableBody = true;
    this.player.body.immovable = true;
    this.player.body.collideWorldBounds = true;


    // Add the display of player lives
    this.livesDisplay = this.add.text(10, 8, "Lives: " + this.playerLives, {
        fill: "white",
        fontSize: 12
    });
}
~~~~~

This function is used to add the player sprite to the world. Sprites are the little things that are moving and interacting with the world, all the rest is background and information display. You can learn more about sprites by checking [the Phaser Sprite Class documentation](http://docs.phaser.io/Phaser.Sprite.html).

We're creating a sprite using the image called __player__ that was loaded in our **Preload** game state. This sprite is on a specific position (160x440) and we're storing it in the object property called **player**. If you're not confident about the usage of ```this``` inside an object then check out [the MDN documentation about **this**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this). Basically since the game state is an object and we're storing the player as a property of this object then the player is available to be used in the other functions.

After adding the sprite, we're enabling the physics system to act on the player sprite. When working with mobile devices you don't want to simulate physics on stuff you don't need and waste battery and CPU. Because of this, we need to tell the physics system about all sprites that it should care about.

Phaser comes with three different physics systems ranging from simple arcade like physics to full blown simulations similar to Box2D. Our game doesn't require that amount of simulation and should be just fine with arcade physics. Thats why we're using ```this.physics.arcade``` and not the other systems. You can check more about the arcade physics at [the Phaser Arcade Physics documentation](http://docs.phaser.io/Phaser.Physics.Arcade.html).

The next command change the anchor point of the player sprite. Normally sprite anchor coordinates start from the top left corner and its a lot easier to position stuff if we change the anchor to the middle of the sprite. This way if we want to center a sprite on the screen we can position it directly on the center coordinate instead of picking the center and subtracting it by half of the length of the sprite which would be the steps needed if we could not change the anchor point.

The next three statements are related to the physics system. For things to be able to interact with one another in terms of physics they need to have a body, things with no body (and thus no mass) can't interact. We're also setting the body to immovable because if we didn't then each time the ball hits the paddle the paddle would move down and we don't want that. The last statement is to make sure the paddle doesn't leave the screen.

After that we're setting a text display with the number of lives the player still has. The idea is that once the ball hits the bottom of the screen the player loses a life. Once they are all gone its game over.

### Adding the ball

{lang="js", title="game.js: the addBall() function", line-numbers=on}
~~~~~
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
}

~~~~~

The ball initialization code is very similar to the player code above, the main difference is that the ball is supposed to bounce in all directions. We also give it an initial velocity in both axis so that once the game starts in the ```update()``` function the ball will be moving.

You can see that we're using the constant ```this.ballSpeed``` that was set in ```initWorld()```. By tweaking these constants you can experiment with the game. There are some hardcoded values in here that could all be abstracted to constants. This would make our life much easier. Maybe in the revision or final version of this text I will change this.

### Adding the blocks

{lang="js", title="game.js: the addBlocks() function", line-numbers=on}
~~~~~
addBlocks: function () {
    // Blocks
    this.blocks = this.game.add.group();
    for (var line = 0; line <= this.blockRows; line++) {
        for (var row = 0; row <= this.blocksPerRow; row++) {
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
}
~~~~~

The blocks are a bit different because instead of making each block an independent sprite we're using a group. Groups are useful when you have many of the same entity in a game such as bullets. It will be a lot easier to check collisions with a group because we can do a single check against the group instead of checking each sprite individually.

First we create a new group and store it in a property called blocks. You can learn more about groups at [the Phaser Group documentation](http://docs.phaser.io/Phaser.Group.html). We use a nested loop to build our rows and columns (a.k.a. our grid of blocks). In this loop we calculate the position of the given block and create a temporary sprite to hold it. We then add this sprite to the group after setting the needed physics stuff on it.

### The create() function

After creating the auxiliary functions above, our create function becomes:

{lang="js", title="game.js: the create() function", line-numbers=on}
~~~~~
create: function() {
    this.initWorld();
    this.addPlayer();
    this.addBall();
    this.addBlocks();
}

~~~~~

Easy to follow right? First we initialize the world by setting the constants and adding the background. Then we add the player and the ball and finally the blocks.

With that done, the initialization is ready. If we run our game now we'd see a static screen with everything into the correct place but nothing happening. Our next step is to implement the ```update()``` function to make things move. We're going to do this in the same way we did the ```create()``` function which is by doing little functions and calling them from ```update()```.

## Simulating The World

This is the part where we code the simulation part. In this part we need to take care of moving the ball and colliding with stuff. One thing is that thanks to the physics system we don't need to compute the ball position. In the ```addBall()``` function we add its initial velocity and bounciness so that in each ```update()``` call the physics system will calculate its new position and collision with the world bounds on its own, we don't need to do anything. The ball collisions with the blocks and the player need to be implemented by us though.

### Colliding with blocks

We're going to use two functions to check collisions with blocks. One is the check itself that will be called from ```update()```. The other is a callback that will be called by the physics system if the collision is true. First lets build the check.

{lang="js", title="game.js: the checkHitWithBlocks() function", line-numbers=on}
~~~~~
checkHitWithBlocks: function () {
    this.game.physics.arcade.collide(this.ball, this.blocks, this.ballCollidesWithBlock);
}
~~~~~

Colliding stuff is very easy using the Arcade Physics engine in Phaser. You just call ```this.game.physics.arcade.collide()``` passing the sprite you want to check as the first parameter, the what should the sprite be colliding with which can be a group or a sprite, in this case we're checking against all members of the blocks group and the third parameter is the callback that will be triggered if there is a collision.

{lang="js", title="game.js: the checkHitWithBlocks() function", line-numbers=on}
~~~~~
checkHitWithBlocks: function () {
    this.game.physics.arcade.collide(this.ball, this.blocks, this.ballCollidesWithBlock);
}
~~~~~

Below we implement the callback.

{lang="js", title="game.js: the ballCollidesWithBlock() function", line-numbers=on}
~~~~~
ballCollidesWithBlock: function(sprite, block) {
    console.log("Collided with block!");
    block.kill();
}
~~~~~

The callback receives two parameters which are the sprites that collided. The first one will be our player sprite and the second is the block the player hit. All we do is ```kill()``` the sprite. There are two functions used to remove a sprite from the game, they are ```kill()``` and ```destroy()```, they have different mechanics. The kill one will really destroy and remove the sprite from the game. The destroy one will remove it from the game but keep it in memory to be reused which is useful when you're also using a sprite pool which will allow you to have many sprites being created and destroyed without performance penalty. This is important for shooter games for example. In our case we don't need this stuff.

### Colliding with the player

The collision with the player is a bit different because we don't need a callback since the ball will just bounce away after that collision. There is no consequence from them both colliding.

{lang="js", title="game.js: the ballCollidesWithBlock() function", line-numbers=on}
~~~~~
checkHitWithPlayer: function () {
    this.game.physics.arcade.collide(this.ball, this.player);
}
~~~~~

### Colliding with the ground

Hitting the ground should cause the player to lose a life and the ball to reset to its original position. We're not going to use the Physics system for this because since we set the ```collideWorldBounds = true``` the ball automatically bounces on all four walls. We're going to check if the position of the ball is below the player paddle, if it is then the player loses.

First lets create the ```resetBall()``` routine.

{lang="js", title="game.js: the resetBall() function", line-numbers=on}
~~~~~
resetBall: function() {
    this.ball.reset(160, 240);
    this.ball.body.velocity.x = this.ballSpeed;
    this.ball.body.velocity.y = this.ballSpeed;
}
~~~~~

Now lets implement our player losing check:

{lang="js", title="game.js: the ballCollidesWithBlock() function", line-numbers=on}
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
        // There will be a game over state here soon...
    }

}
~~~~~

So if the ball is below the player paddle which is at 440px then we subtract a life from the player and reset the ball to the original position.

### The update() function

The ```update()``` then becomes very easy to follow. At each loop it checks the necessary collisions and the movement physics are handled by Phaser Arcade library.

{lang="js", title="game.js: the ballCollidesWithBlock() function", line-numbers=on}
~~~~~
update: function() {
    this.checkHitWithBlocks();
    this.checkHitWithPlayer();
    this.ballCollidesWithGround();
}
~~~~~

A> **Notice:** From this chapter onwards I am placing the final code for the given chapter at an appendix at the end of the book. This will make it easier to check for mistakes and have a clear picture of what we've accomplished.
A>
A> The code for this chapter is on [Appendix 5: Gameloop Chapter Code](#appendix-gameloop) and also in its own folder with the code package that is bundled with the book. 

### What about controlling the player?

We're devoting the next chapter to the business of game controls. This was done because this chapter was too long and there is too much to talk about.

## Summary 

If we open our **index.html** on our web browser now we're going to see the game working and the player loosing lives since you can't control it yet. Lets move along to the next chapter to make this game playable!