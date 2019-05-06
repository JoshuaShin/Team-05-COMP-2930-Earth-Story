class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }

    preload() {
        this.load.image("card", "./assets/images/card.png");
        this.load.image("earth", "./assets/images/earth.png");
        this.load.image("timeline", "./assets/images/timeline.png");
        this.load.image("background", "./assets/images/background.png");
        this.load.image("star", "./assets/images/star.png");
        this.load.image("fill", "./assets/images/fill.png");
    }

    create() {
        this.canvas1 = document.getElementsByTagName("canvas");
        this.canvas1[0].setAttribute("id", "canvasGame");
        this.canvasgame = document.getElementById("canvasGame");

        this.fill = this.add.image(100, 300, "fill");
        this.background = this.add.image(0, 0, "background").setOrigin(0,0);
        this.earth = this.add.image(game.config.width / 2 , this.canvasgame.height / 2, "earth");
        this.earth.displayWidth = this.canvasgame.width * 0.8;
        this.earth.displayHeight = this.earth.displayWidth;
        this.card = this.add.image(game.config.width / 2, this.canvasgame.height, "card").setInteractive();
        this.timeline = this.add.image(game.config.width / 2, this.canvasgame.height - 150, "timeline");

        this.star = this.add.image(150, this.canvasgame.height - 160, "star").setScale(.25);
        this.input.on("pointerup", this.endSwipe, this);
    }

    moveStar() {
        if (this.star.x >= this.timeline.width) {
            this.star.x = this.timeline.width;
        } else {
            this.star.x += 50;
        }
    }

    endSwipe(e) {
        let swipeTime = e.upTime - e.downTime;
        let swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
        let swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
        let swipeNormal = new Phaser.Geom.Point(swipe.x / swipeMagnitude, swipe.y / swipeMagnitude);
        
        if(swipeMagnitude > 20 && swipeTime < 1000 && (Math.abs(swipeNormal.y) > 0.8 || Math.abs(swipeNormal.x) > 0.8)) {
            if(swipeNormal.x > 0.8) {
                // right
                $(this.card).animate({x: this.canvasgame.width, speed: "slow"});
                this.moveStar();
            }
            if(swipeNormal.x < -0.8) {
                // left
                $(this.card).animate({x: 0});
                this.moveStar();
            }
            if(swipeNormal.y > 0.8) {
                // down
                $(this.card).animate({y: this.canvasgame.height});
            }
            if(swipeNormal.y < -0.8) {
                // up
                $(this.card).animate({y: this.canvasgame.height / 2});
            }
        }
    }
}