var GameState = {

  //initiate game settings
  init: function(currentLevel) {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1000

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.game.world.setBounds(0,0,360,1300);

    this.RUNNING_SPEED = 180;
    this.JUMPING_SPEED = 550;
    //this.numLevels = 2;
    this.currentLevel = currentLevel ? currentLevel : 1;
  },
  //executed after everything is loaded
  create: function() {    

    this.ground = this.add.sprite(0, 1250, 'ground');
    this.game.physics.arcade.enable(this.ground);
    this.ground.body.allowGravity = false;
    this.ground.body.immovable = true;

    this.bgm=this.add.audio('bgm');
    this.bgm.play();
    this.bgm.loopFull();
    this.win=this.add.audio('win');
    this.gameover=this.add.audio('gameover');
    this.hit=this.add.audio('hit');
    this.jump=this.add.audio('jump');
    
    
      
    //parse the level file
      if (this.currentLevel ==1){
        this.levelData = JSON.parse(this.game.cache.getText('level'));  
      }
      if (this.currentLevel ==2) {
        this.levelData = JSON.parse(this.game.cache.getText('level2'));
      }

    this.platforms = this.add.group();
    this.platforms.enableBody = true;

    this.levelData.platformData.forEach(function(element){
      this.platforms.create(element.x, element.y, 'platform');
    }, this);

    this.platforms.setAll('body.immovable', true);
    this.platforms.setAll('body.allowGravity', false);

    //create ice
    this.ices = this.add.group();
    this.ices.enableBody = true;

    var ice;
    this.levelData.iceData.forEach(function(element){
      ice = this.ices.create(element.x, element.y, 'ice');
    }, this);

    this.ices.setAll('body.allowGravity', false);
    
    //add goal
    this.goal = this.add.sprite(this.levelData.goal.x, this.levelData.goal.y, 'goal');
    this.game.physics.arcade.enable(this.goal);
    this.goal.body.allowGravity = false;

    //create player
    this.player = this.add.sprite(this.levelData.playerStart.x, this.levelData.playerStart.y, 'player', 3);
    this.player.anchor.setTo(0.5);
    this.player.animations.add('walking', [0, 1, 2, 1], 6, true);
    this.game.physics.arcade.enable(this.player);
    this.player.customParams = {live: 3};
    this.player.body.collideWorldBounds = true;

    this.game.camera.follow(this.player);

    this.liveInfo = this.add.image(300,50,'player',3)
    this.liveInfo.anchor.setTo(0.5);
    this.liveInfo.fixedToCamera = true;
    this.liveLabel = this.game.add.text(this.liveInfo.x + this.liveInfo.width+12, this.liveInfo.y, 'X ' +this.player.customParams.live, {font: '20px Arial', fill:'#000'});
    this.liveLabel.anchor.set(0.5);
    this.liveLabel.fixedToCamera = true;
      
    this.levelLabel = this.game.add.text(this.liveInfo.x + this.liveInfo.width, this.liveInfo.y+40, 'Level: ' +this.currentLevel, {font: '15px Arial', fill:'#000'});
    
    this.levelLabel.anchor.set(0.5);
    this.levelLabel.fixedToCamera = true;
    this.createOnscreenControls();
      
    this.rocks = this.add.group();
    this.rocks.enableBody = true;

    this.createRock();
    this.rockCreator = this.game.time.events.loop(Phaser.Timer.SECOND * this.levelData.rockFrequency, this.createRock, this)
  },
  update: function() {
    this.game.physics.arcade.collide(this.player, this.ground);
    this.game.physics.arcade.collide(this.player, this.platforms);

    this.game.physics.arcade.collide(this.rocks, this.ground);
    this.game.physics.arcade.collide(this.rocks, this.platforms);

    this.game.physics.arcade.overlap(this.player, this.ices, this.killPlayer,null,this);
    this.game.physics.arcade.overlap(this.player, this.rocks, this.killPlayer,null,this);
    this.game.physics.arcade.overlap(this.player, this.goal, this.success,null,this);

    this.player.body.velocity.x = 0;

    if(this.cursors.left.isDown || this.player.customParams.isMovingLeft) {
      this.player.body.velocity.x = -this.RUNNING_SPEED;
      this.player.scale.setTo(-1, 1);
      this.player.play('walking');
    }
    else if(this.cursors.right.isDown || this.player.customParams.isMovingRight) {
      this.player.body.velocity.x = this.RUNNING_SPEED;
      this.player.scale.setTo(1, 1);
      this.player.play('walking');
    }
    else {
      this.player.animations.stop();
      this.player.frame = 3;

    }

    if((this.cursors.up.isDown || this.player.customParams.mustJump) && this.player.body.touching.down) {
      this.player.body.velocity.y = -this.JUMPING_SPEED;
      this.jump.play();
      this.player.customParams.mustJump = false;
    }

    this.rocks.forEach(function(element){
      if(element.x < 10 && element.y > 1200) {
        element.kill();
      }
    }, this);
  },
  createOnscreenControls: function(){
    this.leftArrow = this.add.button(20, 535, 'leftButton');
    this.rightArrow = this.add.button(110, 535, 'rightButton');
    this.actionButton = this.add.button(280, 535, 'jumpButton');

    this.leftArrow.alpha = 0.7;
    this.rightArrow.alpha = 0.7;
    this.actionButton.alpha = 0.7;
      
    this.leftArrow.fixedToCamera = true;
    this.rightArrow.fixedToCamera = true;
    this.actionButton.fixedToCamera = true;

    this.actionButton.events.onInputDown.add(function(){
      this.player.customParams.mustJump = true;
    }, this);

    this.actionButton.events.onInputUp.add(function(){
      this.player.customParams.mustJump = false;
    }, this);

    //left
    this.leftArrow.events.onInputDown.add(function(){
      this.player.customParams.isMovingLeft = true;
    }, this);

    this.leftArrow.events.onInputUp.add(function(){
      this.player.customParams.isMovingLeft = false;
    }, this);

    this.leftArrow.events.onInputOver.add(function(){
      this.player.customParams.isMovingLeft = true;
    }, this);

    this.leftArrow.events.onInputOut.add(function(){
      this.player.customParams.isMovingLeft = false;
    }, this);

    //right
    this.rightArrow.events.onInputDown.add(function(){
      this.player.customParams.isMovingRight = true;
    }, this);

    this.rightArrow.events.onInputUp.add(function(){
      this.player.customParams.isMovingRight = false;
    }, this);

    this.rightArrow.events.onInputOver.add(function(){
      this.player.customParams.isMovingRight = true;
    }, this);

    this.rightArrow.events.onInputOut.add(function(){
      this.player.customParams.isMovingRight = false;
    }, this);
  },
  killPlayer: function(player, ice) {
    if (navigator.vibrate){
        navigator.vibrate(500);
    }
    this.hit.play();
    this.player.animations.stop();
    this.player.x=this.levelData.playerStart.x;
    this.player.y=this.levelData.playerStart.y;
    this.player.customParams.live--;
    
    if (player.customParams.live <= 0){
        this.bgm.stop();
        this.gameover.play();
        game.state.start('HomeState',true,false, 'Game Over!');
    }
    else {
        this.liveLabel.text= 'X '+this.player.customParams.live;
    }
  },
  success: function(player, ice) {
    if(this.currentLevel <2)
    {
        this.currentLevel++;
        this.bgm.stop();
        game.state.start('GameState', true, false, this.currentLevel)
    }
    else{
        this.bgm.stop();
        this.win.play();
        game.state.start('HomeState', true, false, 'YOU WIN!');
      }
  },
  createRock: function() {
    //give the first dead sprite
    var rock = this.rocks.getFirstExists(false);

    if(!rock) {
      rock = this.rocks.create(0, 0, 'rock');
    }

    rock.body.collideWorldBounds = true;
    rock.body.bounce.set(1, 0);

    rock.reset(this.levelData.goal.x, this.levelData.goal.y);
    rock.body.velocity.x = this.levelData.rockSpeed;
  }
  
};