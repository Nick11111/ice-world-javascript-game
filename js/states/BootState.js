var BootState = {
     init: function() {
    //adapt to screen size, fit all the game
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.game.device.whenReady(function(){
        console.log('are we in cordova?:'+ this.game.device.cordova);
    },this)
  },
    
    preload: function(){
        this.load.image('preloadBar', 'assets/images/bar.png');
        this.load.spritesheet('logo', 'assets/images/player_spritesheet.png', 28, 30, 5, 1, 1);    
    },
    create: function(){
        this.game.stage.backgroundColor ='#fff';
        this.state.start('PreloadState');
    }
};