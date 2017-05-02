var PreloadState ={
      //load the game assets before the game starts
  preload: function() {
    this.logo = this.add.sprite (this.game.world.centerX, this.game.world.centerY, 'logo',3);
    this.logo.anchor.setTo(0.5);
    this.preloadBar = this.add.sprite (this.game.world.centerX, this.game.world.centerY + 60, 'preloadBar');
    this.preloadBar.anchor.setTo(0.5);
      
    this.load.setPreloadSprite(this.preloadBar);
    this.load.image('landing','assets/images/landing.jpg');
    this.load.image('ground', 'assets/images/ground.png');    
    this.load.image('platform', 'assets/images/platform.png');    
    this.load.image('goal', 'assets/images/iceman.png');    
    this.load.image('leftButton', 'assets/images/leftButton.png');    
    this.load.image('rightButton', 'assets/images/rightButton.png');  
    this.load.image('jumpButton', 'assets/images/jumpButton.png');    
    this.load.image('rock', 'assets/images/barrel.png');    

    this.load.spritesheet('player', 'assets/images/player_spritesheet.png', 27.5, 38.33, 5, 1, 1);    
    this.load.image('ice', 'assets/images/ice.png');      
  
    this.load.text('level', 'assets/data/level.json');
    this.load.text('level2', 'assets/data/level2.json');
    this.load.audio('bgm','assets/audio/bgm.mp3');
    this.load.audio('win','assets/audio/win_sound.mp3');
    this.load.audio('gameover','assets/audio/game_over.mp3');
    this.load.audio('hit','assets/audio/hit.mp3');
    this.load.audio('jump','assets/audio/jump.mp3');
  },
    
  create: function(){
      this.state.start('HomeState');
  }
};