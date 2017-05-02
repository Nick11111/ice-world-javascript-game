var HomeState = {
    init: function(message){
        this.message = message;
    },
    create: function(){
        var background = this.game.add.sprite(0,0,'landing');
        background.inputEnabled = true;
        
        background.events.onInputDown.add(function(){
           this.state.start('GameState'); 
        },this);
        
        var style = { font: '35px Arial', fill: '#000'};
        this.game.add.text(75, 450,'Touch to Start!', style);
        if(this.message){
            this.game.add.text(75, 200, this.message, style);
        }
    }
};