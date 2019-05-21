var snake, foodie, foodiexit, foodiend, food, cursors, perder, ganhar, fundo, buttonBG, buttonText, texto, particle, total=0, music, score=0, scoretext;

// Direction consts
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

//particulas
var sprites = [];

function getscore(){
    score +=200;
}

var Snake = new Phaser.Class({

        initialize:

        function Snake (scene, x, y)
        {
            this.headPosition = new Phaser.Geom.Point(x, y);

            this.body = scene.add.group();

            this.head = this.body.create(x * 16, y * 16, 'body'); //cor
            
            this.head.setOrigin(0);
            
            this.alive = true;

            this.speed = 70;

            this.moveTime = 0;

            this.tail = new Phaser.Geom.Point(x, y);

            this.heading = RIGHT;
            this.direction = RIGHT;
        },

        update: function (time)
        {
            if (time >= this.moveTime)
            {
                return this.move(time);
            }
        },

        faceLeft: function ()
        {
            if (this.direction === UP || this.direction === DOWN)
            {
                this.heading = LEFT;
            }
        },

        faceRight: function ()
        {
            if (this.direction === UP || this.direction === DOWN)
            {
                this.heading = RIGHT;
            }
        },

        faceUp: function ()
        {
            if (this.direction === LEFT || this.direction === RIGHT)
            {
                this.heading = UP;
            }
        },

        faceDown: function ()
        {
            if (this.direction === LEFT || this.direction === RIGHT)
            {
                this.heading = DOWN;
            }
        },

        move: function (time)
        {
            
            switch (this.heading)
            {
                case LEFT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 40);
                    break;

                case RIGHT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 40);
                    break;

                case UP:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 30);
                    break;

                case DOWN:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 30);
                    break;
            }

            this.direction = this.heading;

            //  Update the body segments and place the last coordinate into this.tail
            Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.tail);

            //  Check to see if any of the body pieces have the same x/y as the head
            //  If they do, the head ran into the body

            var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

            if (hitBody)
            {
                console.log('dead');

                this.alive = false;

                return false;
            }
            else
            {
                //  Update the timer ready for the next movement
                this.moveTime = time + this.speed;

                return true;
            }
        },

        grow: function ()
        {
            var newPart = this.body.create(this.tail.x, this.tail.y, 'body');

            newPart.setOrigin(0);
        },

        collideWithFood: function (food)
        {
            if (this.head.x === food.x && this.head.y === food.y)
            {
                getscore();
                this.grow();

                food.eat();

                //  For every 5 items of food eaten we'll increase the snake speed a little
                if (this.speed > 20 && food.total % 5 === 0)
                {
                    this.speed -= 5;
                }

                return true;
            }
            else
            {
                return false;
            }
        },

        collideWithFoodie: function (foodie)
        {
            if (this.head.x === foodie.x && this.head.y === foodie.y)
            {
                this.alive=false;

                return true;
            }
            else
            {
                return false;
            }
        },

        updateGrid: function (grid)
        {
        //Remove all body pieces from valid positions list
        this.body.children.each(function (segment) {

                var bx = segment.x / 16;
                var by = segment.y / 16;

                grid[by][bx] = false;

            });

            return grid;
        }

});

var Foodie = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Foodie (scene, x, y)
        {
            Phaser.GameObjects.Image.call(this, scene)

            this.setTexture('foodie');
            this.setPosition(x * 16, y * 16);
            this.setOrigin(0);

            scene.children.add(this);
        },

        eat: function ()
        {
            this.scene.start('gameover');
        }
});

var Food = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Food (scene, x, y)
        {
            Phaser.GameObjects.Image.call(this, scene)

            this.setTexture('food');
            this.setPosition(x * 16, y * 16);
            this.setOrigin(0);

            scene.children.add(this);
        },

        eat: function ()
        {
            total++;
        }
});

function repositionFood ()
{
    var testGrid = [];

    for (var y = 0; y < 30; y++)
    {
        testGrid[y] = [];

        for (var x = 0; x < 40; x++)
        {
            testGrid[y][x] = true;
        }
    }

    snake.updateGrid(testGrid);

    //Purge out false positions
    var validLocations = [];

    for (var y = 0; y < 30; y++)
    {
        for (var x = 0; x < 40; x++)
        {
            if (testGrid[y][x] === true)
            {
                //Is this position valid for food? If so, add it here ...
                validLocations.push({ x: x, y: y });
            }
        }
    }

    if (validLocations.length > 0)
    {
        //Use the RNG to pick a random food position
        var pos = Phaser.Math.RND.pick(validLocations);

        //And place it
        food.setPosition(pos.x * 16, pos.y * 16);
    }

    if(y!=19 && x!=17){
        return true;
    }
    else
    {
        return false;
    }
}

var SnakeM = new Phaser.Class({

        initialize:

        function SnakeM (scene, x, y)
        {
            this.headPosition = new Phaser.Geom.Point(x, y);

            this.body = scene.add.group();

            this.head = this.body.create(x * 16, y * 16, 'body'); //cor
            
            this.head.setOrigin(0);

            this.alive = true;

            this.speed = 55;

            this.moveTime = 0;

            this.tail = new Phaser.Geom.Point(x, y);

            this.heading = RIGHT;
            this.direction = RIGHT;
        },

        update: function (time)
        {
            if (time >= this.moveTime)
            {
                return this.move(time);
            }
        },

        faceLeft: function ()
        {
            if (this.direction === UP || this.direction === DOWN)
            {
                this.heading = LEFT;
            }
        },

        faceRight: function ()
        {
            if (this.direction === UP || this.direction === DOWN)
            {
                this.heading = RIGHT;
            }
        },

        faceUp: function ()
        {
            if (this.direction === LEFT || this.direction === RIGHT)
            {
                this.heading = UP;
            }
        },

        faceDown: function ()
        {
            if (this.direction === LEFT || this.direction === RIGHT)
            {
                this.heading = DOWN;
            }
        },

        move: function (time)
        {
            
            switch (this.heading)
            {
                case LEFT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 40);
                    break;

                case RIGHT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 40);
                    break;

                case UP:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 30);
                    break;

                case DOWN:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 30);
                    break;
            }

            this.direction = this.heading;

            //  Update the body segments and place the last coordinate into this.tail
            Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.tail);

            //  Check to see if any of the body pieces have the same x/y as the head
            //  If they do, the head ran into the body

            var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

            if (hitBody)
            {
                console.log('dead');

                this.alive = false;

                return false;
            }
            else
            {
                //  Update the timer ready for the next movement
                this.moveTime = time + this.speed;

                return true;
            }
        },

        grow: function ()
        {
            var newPart = this.body.create(this.tail.x, this.tail.y, 'body');

            newPart.setOrigin(0);
        },

        collideWithFood: function (foodm)
        {
            if (this.head.x === foodm.x && this.head.y === foodm.y)
            {
                getscore();
                this.grow();

                foodm.eat();

                //  For every 5 items of food eaten we'll increase the snake speed a little
                if (this.speed > 20 && foodm.total % 5 === 0)
                {
                    this.speed -= 5;
                }

                return true;
            }
            else
            {
                return false;
            }
        },

        collideWithFoodiexit: function (foodiexit)
        {
            if (this.head.x === foodiexit.x && this.head.y === foodiexit.y)
            {
                this.alive = false;

                return true;
            }
            else
            {
                return false;
            }
        },

        updateGrid: function (grid)
        {
        //Remove all body pieces from valid positions list
        this.body.children.each(function (segment) {

                var bx = segment.x / 16;
                var by = segment.y / 16;

                grid[by][bx] = false;

            });

            return grid;
        }

});

var Foodiexit = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Foodiexit (scene, x, y)
        {
            Phaser.GameObjects.Image.call(this, scene)

            this.setTexture('foodiexit');
            this.setPosition(x * 16, y * 16);
            this.setOrigin(0);

            scene.children.add(this);
        },

        eat: function ()
        {
            this.scene.start('gameover');
        }
});

var FoodM = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function FoodM (scene, x, y)
        {
            Phaser.GameObjects.Image.call(this, scene)

            this.setTexture('food');
            this.setPosition(x * 16, y * 16);
            this.setOrigin(0);

            scene.children.add(this);
        },

        eat: function ()
        {
            total++;
        }
});

function repositionFoodM ()
{
    var testGrid = [];

    for (var y = 0; y < 30; y++)
    {
        testGrid[y] = [];

        for (var x = 0; x < 40; x++)
        {
            testGrid[y][x] = true;
        }
    }

    snakem.updateGrid(testGrid);

    //Purge out false positions
    var validLocations = [];

    for (var y = 0; y < 30; y++)
    {
        for (var x = 0; x < 40; x++)
        {
            if (testGrid[y][x] === true)
            {
                //Is this position valid for food? If so, add it here ...
                validLocations.push({ x: x, y: y });
            }
        }
    }

    if (validLocations.length > 0)
    {
        //Use the RNG to pick a random food position
        var pos = Phaser.Math.RND.pick(validLocations);

        //And place it
        foodm.setPosition(pos.x * 16, pos.y * 16);
    }

    if(y!=26 && x!=22){
        return true;
    }
    else
    {
        return false;
    }
}

var SnakeF = new Phaser.Class({

        initialize:

        function SnakeF (scene, x, y)
        {
            this.headPosition = new Phaser.Geom.Point(x, y);

            this.body = scene.add.group();

            this.head = this.body.create(x * 16, y * 16, 'body'); //cor
            
            this.head.setOrigin(0);

            this.alive = true;

            this.speed = 45;

            this.moveTime = 0;

            this.tail = new Phaser.Geom.Point(x, y);

            this.heading = RIGHT;
            this.direction = RIGHT;
        },

        update: function (time)
        {
            if (time >= this.moveTime)
            {
                return this.move(time);
            }
        },

        faceLeft: function ()
        {
            if (this.direction === UP || this.direction === DOWN)
            {
                this.heading = LEFT;
            }
        },

        faceRight: function ()
        {
            if (this.direction === UP || this.direction === DOWN)
            {
                this.heading = RIGHT;
            }
        },

        faceUp: function ()
        {
            if (this.direction === LEFT || this.direction === RIGHT)
            {
                this.heading = UP;
            }
        },

        faceDown: function ()
        {
            if (this.direction === LEFT || this.direction === RIGHT)
            {
                this.heading = DOWN;
            }
        },

        move: function (time)
        {
            
            switch (this.heading)
            {
                case LEFT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 40);
                    break;

                case RIGHT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 40);
                    break;

                case UP:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 30);
                    break;

                case DOWN:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 30);
                    break;
            }

            this.direction = this.heading;

            //  Update the body segments and place the last coordinate into this.tail
            Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.tail);

            //  Check to see if any of the body pieces have the same x/y as the head
            //  If they do, the head ran into the body

            var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

            if (hitBody)
            {
                console.log('dead');

                this.alive = false;

                return false;
            }
            else
            {
                //  Update the timer ready for the next movement
                this.moveTime = time + this.speed;

                return true;
            }
        },

        grow: function ()
        {
            var newPart = this.body.create(this.tail.x, this.tail.y, 'body');

            newPart.setOrigin(0);
        },

        collideWithFood: function (foodf)
        {
            if (this.head.x === foodf.x && this.head.y === foodf.y)
            {
                getscore();
                this.grow();

                foodf.eat();

                //  For every 5 items of food eaten we'll increase the snake speed a little
                if (this.speed > 20 && foodf.total % 5 === 0)
                {
                    this.speed -= 5;
                }

                return true;
            }
            else
            {
                return false;
            }
        },

        collideWithFoodiend: function (foodiend)
        {
            if (this.head.x === foodiend.x && this.head.y === foodiend.y)
            {
                this.alive=false;

                return true;
            }
            else
            {
                return false;
            }
        },

        updateGrid: function (grid)
        {
        //Remove all body pieces from valid positions list
        this.body.children.each(function (segment) {

                var bx = segment.x / 16;
                var by = segment.y / 16;

                grid[by][bx] = false;

            });

            return grid;
        }

});

var Foodiend = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Foodiend (scene, x, y)
        {
            Phaser.GameObjects.Image.call(this, scene)

            this.setTexture('foodiend');
            this.setPosition(x * 16, y * 16);
            this.setOrigin(0);

            scene.children.add(this);
        },

        eat: function ()
        {
            this.scene.start('gameover');
        }
});

var FoodF = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function FoodF (scene, x, y)
        {
            Phaser.GameObjects.Image.call(this, scene)

            this.setTexture('food');
            this.setPosition(x * 16, y * 16);
            this.setOrigin(0);

            scene.children.add(this);
        },

        eat: function ()
        {
            total++;
        }
});

function repositionFoodF ()
{
    var testGrid = [];

    for (var y = 0; y < 30; y++)
    {
        testGrid[y] = [];

        for (var x = 0; x < 40; x++)
        {
            testGrid[y][x] = true;
        }
    }

    snakef.updateGrid(testGrid);

    //Purge out false positions
    var validLocations = [];

    for (var y = 0; y < 30; y++)
    {
        for (var x = 0; x < 40; x++)
        {
            if (testGrid[y][x] === true)
            {
                //Is this position valid for food? If so, add it here ...
                validLocations.push({ x: x, y: y });
            }
        }
    }

    if (validLocations.length > 0)
    {
        //Use the RNG to pick a random food position
        var pos = Phaser.Math.RND.pick(validLocations);

        //And place it
        foodf.setPosition(pos.x * 16, pos.y * 16);
    }

    if(y!=20 && x!=26){
        return true;
    }
    else
    {
        return false;
    }
}

//First scene
var Preloader = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Preloader ()
    {
        Phaser.Scene.call(this, { key: 'preloader' });
    },

    preload: function ()
    {
        //butao do play
        this.load.image('buttonBG', 'assets/sprites/button-bg.png');
        this.load.image('buttonText', 'assets/sprites/button-text.png');
        
        //musica
        this.load.audio('theme', [
        'assets/audio/oedipus_wizball_highscore.ogg',
        'assets/audio/oedipus_wizball_highscore.mp3'
        ]);

        //imagens
        this.load.image('food', 'src/games/firstgame/assets/star.png'); //comida da cobra
        this.load.image('foodie', 'https://i.imgur.com/6W409Wp.png'); //comida que mata a cobra
        this.load.image('foodiexit', 'https://i.imgur.com/2VQ7xsN.png'); //comida que mata a cobra
        this.load.image('foodiend', 'https://i.imgur.com/TwxK7t5.png'); //comida que mata a cobra
        this.load.image('body', 'https://i.imgur.com/CPpZXhz.png'); //corpo da snake
        this.load.image('particle1', 'assets/particles/leaf1.png'); //particulas play
        this.load.image('particle2', 'assets/particles/fire1.png'); //particulas over
        this.load.image('particle', 'assets/demoscene/star3.png'); //particulas win
        this.load.image('fundo','https://lh3.googleusercontent.com/--8fMnS0Ny_U/XJO9LvD6lNI/AAAAAAAAATg/sixdsSb-2BAsbyEJpd1lVYrheIPq9ZBJACJoC/w663-h498-n-rw/220170405230815.jpg'); //nivel 1
        this.load.image('fundo1','https://lh3.googleusercontent.com/-OeCjF2aoZ0U/XJQJNbDHEsI/AAAAAAAAAVs/xDp7btbMRx0RUshqQjFfqz9fKnl94v54gCJoC/w663-h498-n-rw/Snake-Pass---Fire-Screenshot-.jpg'); //capa
        this.load.image('perder','https://lh3.googleusercontent.com/-4z_nB5LlGIM/XJO9HBaB-jI/AAAAAAAAAUM/IqN8po0PIMIhlGP3VKdmyKoLVwNYJiY-gCJoC/w663-h498-n-rw/45a26b28-31cf-4abf-a18a-4d330a897ceb_158310c7-e1c3-4f81-a5b0-f299db0a7fa4_HighresScreenshot00009.png'); //over
        this.load.image('ganhar','https://lh3.googleusercontent.com/-narPk2YlOpg/XJqbmp58rvI/AAAAAAAAAbI/PsPIH6PWVlkoAGmkK7gTbcsXL4jr0UPTACJoC/w663-h498-n-rw/snakepasshands_on_1874043b.jpg'); //win
        this.load.image('fundon2', 'https://lh3.googleusercontent.com/-ySaqUHMfmDs/XJo4-6HtqAI/AAAAAAAAAZ4/ZCe3F50r2j4gsswmaLoUxa7n3t3mIUbuQCJoC/w663-h498-n-rw/JBtcGocr.png') //nivel 2
        this.load.image('fundon3', 'https://lh3.googleusercontent.com/-RByXl6LnhNM/XJo4xlBJAWI/AAAAAAAAAXU/_ntAfAHa2C8guV1aI_TrvStx2uOEGChrACJoC/w663-h498-n-rw/SnakePassISsseeYou.jpg') //nivel 3

    },

    create: function ()
    {
        this.scene.start('mainmenu');
    }
});


var MainMenu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MainMenu ()
    {
        Phaser.Scene.call(this, { key: 'mainmenu' });
        window.MENU = this;
    },

    create: function ()
    {        
        //add fundo capa
        var fund=this.add.image(330,234,'fundo1');
        
        //butao play
        var bg = this.add.image(0, 0, 'buttonBG');
        var text = this.add.image(0, 0, 'buttonText');

        //texto na capa e suas alterações
        var texto = this.add.text(10,5,'Welcome Snake Game!\n'+'Rules of the game:\n'+'-Use the arrow of left, right, up and down;\n'+'-Eat the star and try take the better score.\n'+'\nGood Game!').setFont('19px Comic Sans MS Black').setFill('#ffffff').setShadow(2, 2, "#000000", 2);
        var texto = this.add.text(470,425,'Andreia Sousa\n'+'Teacher:Krzysztof Rewak\n'+'Visual Programming').setFont('13px Comic Sans MS Black').setFill('#ffffff').setShadow(2, 2, "#000000", 2);
        
        //butão play
        var container = this.add.container(450, 215, [ bg, text ]);
        
        //particulas na capa
        for (var i = 0; i < 20; i++)
        {
            var x = Phaser.Math.Between(-32, 1000);
            var y = Phaser.Math.Between(-32, 1000);
            var image = this.add.image(x, y, 'particle1');
            image.setBlendMode(Phaser.BlendModes.ADD);
            sprites.push({ s: image, r: 1 + Math.random() * 1 });
        }

        //butao do play
        bg.setInteractive();
        bg.once('pointerup', function () {
            this.scene.start('game');
        }, this);
    },

    update: function ()
    {
        for (var i = 0; i < sprites.length; i++)
        {
            var sprite = sprites[i].s;
            sprite.y -= sprites[i].r;
            if (sprite.y < -800)
            {
                sprite.y = 100;
            }
        }
    }   //butao do play
});

var Game = new Phaser.Class({

Extends: Phaser.Scene,

    initialize:

    function Game ()
    {
        Phaser.Scene.call(this, { key: 'game' });
        window.GAME = this;
    
        this.controls;
    },

    
    create: function ()
    {

    //musica add
    music = this.sound.add('theme');
    music.play();

    //acrescentei
    this.add.image(330,234,'fundo');
    this.add.text(530, 465, 'Andreia Sousa', { font: '12px Magneto', fill: '#ffffff'});
    food = new Food(this, 10, 10); //alterei os valores
    foodie = new Foodie(this, 17, 19); //alterei os valores
    snake = new Snake(this, 1, 1); //alterei os valores

    // Create our keyboard controls
    cursors = this.input.keyboard.createCursorKeys();

    //Score
    scoretext = this.add.text(10, 445, '', { font: '20px Jokerman', fill: '#fff00f' });
    scoretext.setScrollFactor(0);

    },

    update: function (time, delta)
    {

    if (!snake.alive)
    {
        this.scene.start('gameover');
        music.stop();
    }

    if (cursors.left.isDown)
    {
        snake.faceLeft();
    }
    else if (cursors.right.isDown)
    {
        snake.faceRight();
    }
    else if (cursors.up.isDown)
    {
        snake.faceUp();
    }
    else if (cursors.down.isDown)
    {
        snake.faceDown();
    }

    if (snake.update(time))
    {
        //  If the snake updated, we need to check for collision against food
        if (snake.collideWithFood(food))
        {
            repositionFood();
        }
    }

    if (snake.collideWithFoodie(foodie))
    {
        this.scene.start('gameover');
    }

    scoretext.setText('Score: ' + score);

    if(score==2600){
        this.scene.start('game2');
    }

    }
});

var Game2 = new Phaser.Class({

Extends: Phaser.Scene,

    initialize:

    function Game2 ()
    {
        Phaser.Scene.call(this, { key: 'game2' });
        window.GAME = this;
    
        this.controls;
    },

    
    create: function ()
    {

    //musica add
    music = this.sound.add('theme');
    music.play();

    //acrescentei
    this.add.image(330,234,'fundon2');
    this.add.text(530, 465, 'Andreia Sousa', { font: '12px Magneto', fill: '#ffffff'});

    foodm = new FoodM(this, 10, 10); //alterei os valores
    foodiexit = new Foodiexit(this, 22, 26); //alterei os valores
    snakem = new SnakeM(this, 1, 1); //alterei os valores


    // Create our keyboard controls
    cursors = this.input.keyboard.createCursorKeys();

    //Score
    scoretext= this.add.text(10, 445, '', { font: '20px Jokerman', fill: '#fff00f' });

    },

    update: function (time, delta)
    {

    if (!snakem.alive)
    {
        this.scene.start('gameover');
        music.stop();
    }

    if (cursors.left.isDown)
    {
        snakem.faceLeft();
    }
    else if (cursors.right.isDown)
    {
        snakem.faceRight();
    }
    else if (cursors.up.isDown)
    {
        snakem.faceUp();
    }
    else if (cursors.down.isDown)
    {
        snakem.faceDown();
    }

    if (snakem.update(time))
    {
        //  If the snake updated, we need to check for collision against food
        if (snakem.collideWithFood(foodm))
        {
            repositionFoodM();
        }
    }

     if (snakem.collideWithFoodiexit(foodiexit))
    {
        this.scene.start('gameover');
    }

    scoretext.setText('Score: ' + score);
    
    if(score==5800){
        this.scene.start('game3');
    }
}
});

var Game3 = new Phaser.Class({

Extends: Phaser.Scene,

    initialize:

    function Game2 ()
    {
        Phaser.Scene.call(this, { key: 'game3' });
        window.GAME = this;
    
        this.controls;
    },

    
    create: function ()
    {

    //musica add
    music = this.sound.add('theme');
    music.play();

    //acrescentei
    this.add.image(330,234,'fundon3');
    this.add.text(530, 465, 'Andreia Sousa', { font: '12px Magneto', fill: '#ffffff'});

    foodf = new FoodF(this, 10, 10); //alterei os valores
    foodiend = new Foodiend(this, 26, 20); //alterei os valores
    snakef = new SnakeF(this, 1, 1); //alterei os valores


    // Create our keyboard controls
    cursors = this.input.keyboard.createCursorKeys();

    //Score
    scoretext= this.add.text(10, 445, '', { font: '20px Jokerman', fill: '#fff00f' });

    },

    update: function (time, delta)
    {

    if (!snakef.alive)
    {
        this.scene.start('gameover');
        music.stop();
    }

    if (cursors.left.isDown)
    {
        snakef.faceLeft();
    }
    else if (cursors.right.isDown)
    {
        snakef.faceRight();
    }
    else if (cursors.up.isDown)
    {
        snakef.faceUp();
    }
    else if (cursors.down.isDown)
    {
        snakef.faceDown();
    }

    if (snakef.update(time))
    {
        //  If the snake updated, we need to check for collision against food
        if (snakef.collideWithFood(foodf))
        {
            repositionFoodF();
        }
    }
    
     if (snakef.collideWithFoodiend(foodiend))
    {
        this.scene.start('gameover');
    }

    scoretext.setText('Score: ' + score);
    
    if(score==10000){
        this.scene.start('gamewin');
    }
}
});

var GameWin = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameWin ()
    {
        Phaser.Scene.call(this, { key: 'gamewin' });
        window.OVER = this;
    },

    create: function ()
    {
        //add3 
        this.add.image(330,234,'ganhar');
        this.add.text(380, 420, 'Click to Start!', { font: '35px Kristen ITC', fill: '#ffffff'});
        var texto = this.add.text(10,20,'GaMe WiN').setFont('145px Chiller').setFill('#ffffff').setShadow(9, 12, "#ff0000", 7);

        //particulas na capa
        for (var i = 0; i < 200; i++)
        {
            var x = Phaser.Math.Between(-64, 640);
            var y = Phaser.Math.Between(-64, 480);
            var image = this.add.image(x, y, 'particle');
            image.setBlendMode(Phaser.BlendModes.ADD);
            sprites.push({ s: image, r: 2 + Math.random() * 6 });
        }

        this.input.once('pointerup', function (event) {

            this.scene.start('preloader');

        }, this);
    },

    update: function(){

        for (var i = 0; i < sprites.length; i++)
        {
            var sprite = sprites[i].s;
            sprite.y -= sprites[i].r;
            if (sprite.y < -880)
            {
                sprite.y = 200;
            }
        }

    }

});

var GameOver = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameOver ()
    {
        Phaser.Scene.call(this, { key: 'gameover' });
        window.OVER = this;
    },

    create: function ()
    {
        //add3 
        this.add.image(330,234,'perder');
        this.add.text(48, 440, 'Click to Restart!', { font: '27px Kristen ITC', fill: '#000000'});
        var texto = this.add.text(50,70,'GaMe OvEr').setFont('50px Goudy Stout').setFill('#000000').setShadow(9, 12, "#ff0000", 7);

        //particulas na capa
        for (var i = 7; i < 40; i++)
        {
            var x = Phaser.Math.Between(-70, 800);
            var y = Phaser.Math.Between(-70, 600);
            var image = this.add.image(x, y, 'particle2');
            image.setBlendMode(Phaser.BlendModes.ADD);
            sprites.push({ s: image, r: 2 + Math.random() * 6 });
        }

        this.input.once('pointerup', function (event) {

            this.scene.start('preloader');

        }, this);
    },

    update: function(){
        score=0;
        for (var i = 7; i < sprites.length; i++)
        {
            var sprite = sprites[i].s;
            sprite.y -= sprites[i].r;
            if (sprite.y < -880)
            {
                sprite.y = 220;
            }
        }

    }

});

var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    parent: 'phaser-example',
    scene: [Preloader, MainMenu, Game, Game2, Game3, GameWin, GameOver],
    audio: {
        disableWebAudio: true
    }
};

var game = new Phaser.Game(config);