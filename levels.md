# Engaging Players {#levels}

Foxnoid is already a game that you can play and win or lose but we haven't tackled one important aspect of games: **replayability**. Since that word means different thing for different people and it is not in the dictionary, lets define it roughly as **the desire the player has of playing your game again**. 

The important felling here is the desire to play. We're not focusing on the technical features that allow software to be used again and again. In this chapter we're going to talk about what motivates players to keep playing again and again.

## Making The Game A Journey

If you treat your game like a heros journey where the player has a path of progression with increasing difficulty then your game becomes much better. 

Many mobile casual games explore this mechanic using levels that unlock progressively. One level will only become available after you finish the previous one in a satisfactory way. Angry Birds does that and so does a hundred other games.

Platform games also explore this idea where the player has to move from level to level until success is achieved. Super Mario Bros is an example of that. Every time Toad says "The Princess is in another castle" we know we must keep going.

Players keep playing these types of game because they want to finish the journey. They want to win. They want to see the next level. They may justify their action to keep playing in many ways but it usually boils down to "this is an enjoyable journey and I want to see how it ends".

### Replayability

Replayability means different things for different people as I said above. Some popular game development authors don't like the term because it is so vague that it can lead to a lot of confusion. The game development industry is quite young and its jargon is still growing. For example sailing is a pretty old thing and its jargon matured over some centuries. There are lots and lots of ways of expressing concepts regarding sailing. Game development still need some centuries for jargon to evolve and solidify. Still we don't have the patience of old sailors, we game developers are a group of fast people trying to express concepts in this art form while academia and theory are still playing catch up.

Lets talk about two possible aspects of replayability. The first one is the act of returning to the game while the journey is not complete. This is about engaging the player so that they don't forget the game. Our objective is to evoke that felling that will make them think "just one more level and then I will stop". There are many ways to cause this behavior and some of the most common methods should be known by all:

* Top score: Games with leaderboards where the player will keep coming back to make sure they beat their own record or top another players. This has become more competitive with the advent of ubiquitous networking leading to players competing against each other for top scores.
* Multiple levels: The game progress to different levels. To win the game the player needs to complete every level. This appeals to the wanderer inside us all. Players will keep playing because they need to finish the journey.
* Collectibles and Achievements: Some games offer achievements and collectibles inside it. Players will keep playing to catch everything. If the item above appealed to our inner wanderer this one appeals to our inner hoarder. Achievements combined with social networks are a great thing to engage players.
* Story: Some games are story driven and players will keep playing because they want to know what happens. This is usually combined with the levels approach. Adventure games were in my humble opinion the pinnacle of story driven games. Most of today console 3D action games are story driven. Sometimes the story is not good enough or make any sense but still we all hate to unfinished stories so we keep playing.

These aspects are usually combined and its common to see networked scoreboards and achievement lists. When designing your game you need to think about how to engage your players and add value to your title.

Another thing people mean when they talk about replayability is how to make players keep playing your game after the journey ended. Or in plain English, how can we make someone play the game again after they win it. Some games will use the whole collectible approach and go for things such as "you won the game but you haven't collected all sparkling unicorn eggs yet". Other games, specially the casual or arcade genre, will use the top scores as the main reason for people to keep playing. Some games will unlock an "extra hard" difficulty mode after you win so that you can challenge yourself again.

In the end it is important to think about how to engage players before they win your game and also after. 

### Sense of Progression

One important feeling is the sense of progression. If a player stops to think "why am I playing this anyway" while playing your game then there is a chance they won't be playing much longer. The level and story mechanics keep the game fresh and give the player this sense of progression. Its the difference between waving a brush randomly and painting a wall. The act of waving the brush is the same but since in the later you have an objective and can measure your progress makes it much more defined.

### Increasing Difficulty

Along with the level mechanic comes the increasing difficulty. A hero journey is never a stroll in the park. It is more close to climbing a mountain. It starts somewhat easy but it gets more difficult as you are close to the top. The levels will give the player a sense of progress, lets say a road they will travel. Increasing difficulty with the levels will make the road trip more challenging which also means it will be more rewarding as they succeed. The feeling we want to evoke here is first "This game is getting harder" along with "I am getting better at this".

If you fail to engage a player like this they tend to get bored and move on. The hardest game I know is [Dwarf Fortress](http://www.bay12games.com/dwarves/) which is a game where you basically simulate a fantasy dwarf colony. The game motto is **loosing is fun**. It has a steep learning curve and you will sure lose it a lot but once you start succeeding a little before failing miserably you start to get hooked.

I am not advocating to go full masochist on your player. All I am saying is that don't make it too easy. Make it more like a trail and less like shopping mall. 

## Creating New Levels For Our Game

Creating networked stuff such as scoreboard and achievements is beyond the scope of this book. Foxnoid doesn't really need a story since it is just a good traditional arcade game. To engage players we're going to implement some levels. To keep things short we're going to implement just a few levels. Feel free to add more on your own.

### Defining a Level Format

Our game has three rows of five blocks each. The easiest way to describe a level is by using an array with 15 elements that can be 0 for empty space or 1 for block. Each level will be an array and the collection of all levels will also be an array.

Create a file called **levels.js** inside the **js folder**

{lang="js", title="levels.js: three different levels for our game", line-numbers=on}
~~~~~
var levels = [
    [
        1,1,1,1,1,
        1,0,0,0,1,
        1,1,1,1,1
    ],

    [
        1,0,1,0,1,
        1,0,1,0,1,
        1,0,1,0,1
    ],

    [
        1,1,1,1,1,
        1,1,1,1,1,
        1,1,1,1,1
    ]
];
~~~~~

Now lets include this file in our HTML.

{lang="html", title="index.html: now includes our game win state", line-numbers=on}
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
        <script defer src="js/game_win.js"></script>
        <script defer src="js/levels.js"></script>
    </head>
    <body>

        <div id="game"></div>

    </body>
</html>
~~~~~

A> Warning: Yep, you spotted a global called levels on the source code above right? This is not really good practice. The best way would be for the preloader to load that from a JSON and store it in the ```GameStates``` variable. In a future revision of this book I might just do that. Foxnoid is a simple game and I am trying to keep the source code easy to follow so that we can go from zero to a complete game. As I said in the introduction, this is an early release and revisions will be done in time. If you think that global offends your tastes let me know.

### Displaying The Level

To make use of the levels we'll need to alter our **game.js** file. First thing lets change ```initWorld()``` to add a constant for starting level.

{lang="js", title="game.js: adding level stuff", line-numbers=on}
~~~~~
initWorld: function() {
    // Some constants
    this.playerSpeed = 250;
    this.ballSpeed = 220;
    this.blocksPerRow = 5;
    this.blockRows = 4;
    this.playerLives = 13;
    this.currentLevel = 0;

    // Add the background
    this.add.sprite(0, 0, 'background');

    // Add keyboard input.
    // This call creates and returns an object containing 4 hotkeys for Up, Down, Left and Right.
    this.cursors = this.input.keyboard.createCursorKeys();
}
~~~~~

So the game will start from the zeroth (a.k.a. first) element of the levels array. Next we need to be able to display the level marked by ```this.currentLevel```. To do that we'll change ```addBlocks()```.

{lang="js", title="game.js: new addBlocks() will display the current level", line-numbers=on}
~~~~~
addBlocks: function () {
    var level = levels[this.currentLevel];
    var blockNum = 0;

    // do not create the blocks group
    // if it is already present.
    if (!this.blocks) {
        this.blocks = this.game.add.group();
    }

    for (var line = 0; line <= this.blockRows - 1; line++) {
        for (var row = 0; row <= this.blocksPerRow - 1; row++) {
            var posY = (line * 30) + 40;
            var posX = (row * 50) + 40;

            if (level[blockNum] === 1) {
                var temp = this.add.sprite(posX, posY, 'block');
                this.physics.arcade.enable(temp);
                temp.enableBody = true;
                temp.body.immovable = true;

                this.blocks.add(temp);
            }

            blockNum += 1;
        }
    }
}
~~~~~

If we play our game now we'll see that it correctly displays the first level.

### Level Progression

To change the way the game works and add the level progression mechanic we just need to change the calculation of the game win scenario. If there are no blocks left but the player current level is not the last level then draw the new level and keep going. To do this we're going to change the ```checkGameWin()``` function.

{lang="js", title="game.js: new addBlocks() will display the current level", line-numbers=on}
~~~~~
checkGameWin: function () {
    if (this.blocks.countLiving() === 0) {
        if (this.currentLevel === levels.length - 1) {
            this.state.start("GameWin");
        } else {
            this.currentLevel++;
            this.addBlocks();
            this.resetBall();
        }
    }
}
~~~~~

We check to see if all blocks have been removed. If there are no more blocks we check if the players current level is the last one. If it is then the game has been won, if it isn't then we advance to the next level, draw it and reset the ball to the original position.

Go ahead and try to win it!

## Summary

Congratulations!!! You've went from zero to a complete game with a game over and a game win scenario and multiple levels! Be proud of yourself, people seldom complete their game development projects. There are more unfinished games on lost HDs than sand in a beach or something similar.

On the next chapter we're going to publish it to the Firefox Marketplace! Lets move ahead and share our game with the world!
