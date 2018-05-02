//ESLint filters
/*global Phaser PlayState:true*/

function Hero(game, x, y){
	//call Phase.Sprite constructor
	Phaser.Sprite.call(this, game, x, y, "hero");
	this.anchor.set(0.5, 0.5);
	this.game.physics.enable(this);
	this.body.collideWorldBounds = true;
}

//inherit from Phaser.Sprite
//The Function.prototype property represents the Function prototype object.
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.contructor = Hero;

//Adds horizontal movement
Hero.prototype.move = function(direction){
	const SPEED = 200;
	this.body.velocity.x = direction * SPEED;
};

//adds jump capability
Hero.prototype.jump = function () {
	const JUMP_SPEED = 600;
	this.body.velocity.y = -JUMP_SPEED;
};

PlayState = {};

PlayState.init = function () {
	//blur fix for moving sprites
	this.game.renderer.renderSession.roundPixels = true;

	//set key bindings
	this.keys = this.game.input.keyboard.addKeys({
		left: Phaser.KeyCode.LEFT,
		right: Phaser.KeyCode.RIGHT,
		up: Phaser.KeyCode.UP
	});
    
	//bind jump to up button
	this.keys.up.onDown.add(function () {
		this.hero.jump();
	}, this);
};

//load game assets
PlayState.preload = function() {
	this.game.load.json("level:1", "data/level01.json");
	this.game.load.image("background", "images/background.png");
	this.game.load.image("ground", "images/ground.png");
	this.game.load.image("grass:8x1", "images/grass_8x1.png");
	this.game.load.image("grass:6x1", "images/grass_6x1.png");
	this.game.load.image("grass:4x1", "images/grass_4x1.png");
	this.game.load.image("grass:2x1", "images/grass_2x1.png");
	this.game.load.image("grass:1x1", "images/grass_1x1.png");

	this.game.load.image("hero", "images/hero_stopped.png");
};

//create game entities and set up world
PlayState.create = function () {
	this.game.add.image(0,0, "background");
	this._loadLevel(this.game.cache.getJSON("level:1"));
};

PlayState._loadLevel = function (data) {
	//create all the groups/layers that we need
	this.platforms = this.game.add.group();

	//spawns platforms
	data.platforms.forEach(this._spawnPlatform, this);

	//spawn hero and enemies
	this._spawnCharacters({hero: data.hero});

	//enable gravity
	const GRAVITY = 1200;
	this.game.physics.arcade.gravity.y = GRAVITY;
};

PlayState._spawnPlatform = function (platform) {
	let sprite = this.platforms.create(
		platform.x, platform.y, platform.image);
    
	this.game.physics.enable(sprite);
	//this.game.add.sprite(platform.x, platform.y, platform.image);

	//disable gravity on platforms
	sprite.body.allowGravity = false;

	//prevents player sprite from pushing platforms off sreen.
	sprite.body.immovable = true;
};

PlayState._spawnCharacters = function (data) {
	//spawn hero
	this.hero = new Hero(this.game, data.hero.x, data.hero.y);
	this.game.add.existing(this.hero);
};

PlayState.update = function (){
	//function for handling collosion
	this._handleCollisions();
	//function for handling input
	this._handleInput();
};

PlayState._handleCollisions = function() {
	this.game.physics.arcade.collide(this.hero, this.platforms);
};

PlayState._handleInput = function () {
	if (this.keys.left.isDown) {//move hero left
		this.hero.move(-1);
	}
	else if(this.keys.right.isDown) {//move hero right
		this.hero.move(1);
	}
	else { //stop
		this.hero.move(0);
	}
};

//Character movement

//Bind jump to up key press




window.onload = function () {
	let game = new Phaser.Game(960, 600, Phaser.AUTO, "game");
	game.state.add("play", PlayState);
	game.state.start("play");
};