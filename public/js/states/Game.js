var Achicken = Achicken || {};
var socket = io.connect(window.location.href);;
socket.on('greet', function(data) {
	console.log(data);
	socket.emit('respond', {message: 'Hello to you too, server'});
});

Achicken.GameState = {

	init: function(currentLevel) {
		//constants
		this.MAX_DISTANCE_SHOOT = 190;
		this.MAX_SPEED_SHOOT = 1100;
		this.SHOOT_FACTOR = 12;
		this.KILL_DIFF = 25;

		//keep track of the current level
		this.currentLevel = currentLevel ? currentLevel : 'level1';
		
		//gravity
		this.game.physics.p2.gravity.y = 1000;
		
		//collision groups - if you want to specify what collides with what
		this.blocksCollisionGroup = this.game.physics.p2.createCollisionGroup();
		this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
	},
	create: function() {
		//sky background
		this.sky = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'sky');
		this.game.world.sendToBack(this.sky);
		
		this.chickenHUD = this.add.group();
		
		//blocks
		this.blocks = this.add.group();
		this.blocks.enableBody = true;
		this.blocks.physicsBodyType = Phaser.Physics.P2JS;
		
		//bodies in p2 -> they get their anchor points set to 0.5
		this.floor = this.add.tileSprite(this.game.world.width/2, this.game.world.height - 24, this.game.world.width, 48, 'floor');
		this.blocks.add(this.floor);
		
		//specify collision for the floor
		this.floor.body.setCollisionGroup(this.blocksCollisionGroup);
		this.floor.body.collides([this.blocksCollisionGroup, this.playerCollisionGroup]);
		this.floor.body.static = true;

		this.player = this.add.sprite(180, 400, 'chicken');
		this.game.physics.p2.enable(this.player);
		this.player.enableBody = true;
		this.player.physicsBodyType = Phaser.Physics.P2JS;
		this.player.body.setCollisionGroup(this.playerCollisionGroup);
		this.player.body.collides([this.blocksCollisionGroup]);
	
		this.cursors = this.game.input.keyboard.createCursorKeys();
	},

	update: function() {
		if (this.cursors.left.isDown) {
			this.player.body.applyForce([10, 0], this.player.x, this.player.y);
		}
		if (this.cursors.right.isDown) {
			this.player.body.applyForce([-10, 0], this.player.x, this.player.y);
		}
		if (this.cursors.up.upDuration()) {
			this.player.body.moveUp(200);
		}
	}
};
