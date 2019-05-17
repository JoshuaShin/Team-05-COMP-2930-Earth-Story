class PlayTutorial extends Phaser.Scene {
    constructor() {
        super("PlayTutorial");
    }


    preload() {
        this.canvas1 = document.getElementsByTagName("canvas");
        this.canvas1[0].setAttribute("id", "canvasGame");
        this.canvasGame = document.getElementById("canvasGame");

        this.add.image(0, 0, "bg").setOrigin(0);
        let loader = this.add.image(this.canvasGame.width / 2, this.canvasGame.height / 2, "earth");
        loader.displayWidth = this.canvasGame.width * 0.8;
        loader.displayHeight = loader.displayWidth;

        this.loadingText = this.make.text({
            x: this.canvasGame.width / 2,
            y: this.canvasGame.height - 200,
            text: 'Loading...',
            style: {
                fill: '#ffffff',
                fontSize: "3em"
            }
        });
        this.loadingText.setOrigin(0.5);

        this.load.on("progress", function() {
            loader.rotation += 0.01;
        });

        this.load.on("complete", function(value) {
            console.log(value);
            loader.destroy();
        });

        this.load.image("earth_water", "./assets/images/layers/earth_water.png");
        this.load.image("earth_land", "./assets/images/layers/earth_land.png");
        this.load.image("default_mt", "./assets/images/layers/default_mt.png");
        this.load.image("clean_clouds", "./assets/images/layers/clean_clouds.png");

        this.load.image("timeline", "./assets/images/timeline.png");
        this.load.image("card", "./assets/images/card.png");
        this.load.image("star", "./assets/images/star.png");
        this.load.image("eco", "./assets/images/icons/eco.png");
        this.load.image("env", "./assets/images/icons/env.png");
        this.load.image("res", "./assets/images/icons/res.png");
        this.load.image("soc", "./assets/images/icons/soc.png");

        this.load.image("tutorial_text_down", "./assets/images/tutorial/swipe_down.png");
        this.load.image("tutorial_text_up", "./assets/images/tutorial/swipe_up.png");
        this.load.image("tutorial_text_left", "./assets/images/tutorial/swipe_left.png");
        this.load.image("tutorial_text_right", "./assets/images/tutorial/swipe_right.png");
        this.load.image("tutorial_text_click", "./assets/images/tutorial/click_to_flip.png");
        this.load.image("tutorial_text_exit", "./assets/images/tutorial/click_to_exit.png");
        this.load.image("tutorial_shadow", "./assets/images/tutorial/shadow.png");

        this.load.image("tutorial_environment", "./assets/images/tutorial/ENVIRONMENT.png");
        this.load.image("tutorial_society", "./assets/images/tutorial/SOCIETY.png");
        this.load.image("tutorial_economy", "./assets/images/tutorial/ECONOMY.png");
        this.load.image("tutorial_resources", "./assets/images/tutorial/RESOURCES.png");
        this.load.image("tutorial_progress", "./assets/images/tutorial/GAME_PROGRESS.png");
        this.load.image("tutorial_earth_status", "./assets/images/tutorial/EARTH_STATUS.png");
    }


    create() {
        this.loadingText.destroy();

        this.timeline = this.add.image(0, 0, "timeline");
        this.star = this.add.image(-this.timeline.width / 2, 0, "star").setScale(.25);
        this.progressBar = this.add.container(this.canvasGame.width / 2, this.canvasGame.height * 0.9).setSize(this.timeline.width, this.timeline.height);
        this.progressBar.add([this.timeline, this.star]);

        this.setupIcons();
        this.createEarth();

        this.hasSwiped = false;
        this.endGame = false;

        this.backgroundShadow = this.add.image(this.canvasGame.width / 2, this.canvasGame.height / 2, "tutorial_shadow");
        this.backgroundShadow.alpha = 0.4;
        this.backgroundShadow.setScale(10);

        this.createCard("Hello!", "Welcome to the tutorial!");
        this.flipCard();
        this.input.on("pointerup", this.endSwipe, this);

        this.tutorialFlip = true;
        this.tutorialDown = false;
        this.tutorialUp = false;
        this.tutorialRight = false;
        this.tutorialLeft = false;
        this.tutorialEnd = false;
        this.tutorialStatus = false;
        this.tutorialEnvironment= false;
        this.tutorialSociety = false;
        this.tutorialEconomy = false;
        this.tutorialResources = false;
        this.tutorialProgress = false;

        this.tutorial_text = this.add.image(this.canvasGame.width / 2, this.canvasGame.height / 1.2, "tutorial_text_click");
        this.tutorial_text.setScale(2);
    }


    createEarth() {
        this.earth_water = this.add.image(this.canvasGame.width / 2, this.canvasGame.height / 2, "earth_water");
        this.earth_land = this.add.image(this.canvasGame.width / 2, this.canvasGame.height / 2, "earth_land");
        this.default_mt = this.add.image(this.canvasGame.width / 2, this.canvasGame.height / 2, "default_mt");
        this.clean_clouds = this.add.image(this.canvasGame.width / 2, this.canvasGame.height / 2, "clean_clouds");
    }


    createCard(textFront, textBack) {
        this.card = this.add.image(0, 0, "card").setInteractive();
        this.card.setScale(2.75);
        this.card.alpha = 0.7;

        let textStyle = {
            color:'#000000',
            align:"center",
            boundsAlignH: "center",
            fontFamily: 'Abel',
            fontSize: '6em',
            wordWrap: {
                width: this.card.width * 2.25,
                useAdvancedWrap: false }
        };

        this.question = this.add.text(0, 0, textFront, textStyle).setOrigin(0.5);
        this.info = this.add.text(0, 0, textBack, textStyle).setOrigin(0.5);
        this.info.visible = false;
        //container for the card
        this.container = this.add.container(this.canvasGame.width / 2, this.canvasGame.height / 2)
            .setSize(this.canvasGame.width * 0.5, this.canvasGame.width * 0.5)
            .setInteractive();
        this.container.add([this.card, this.question, this.info]);
    }


    moveStar() {
        this.star.x  += this.progressBar.width / 30;
        if (Math.ceil(this.star.x) > this.progressBar.width / 2) {
            this.endGame = true;
        }
    }


    flipCard(){
        this.card.on('pointerup', function(pointer, localX, localY, event){
            if (!this.tutorialFlip) {
                return;
            } else {
                this.tutorialFlip = false;
                this.tutorialDown = true;
                this.tutorial_text.setTexture('tutorial_text_down');
            }

            this.tweens.add({
                targets: this.card,
                scaleY: 2.9,
                scaleX: 0,
                flipX: true,
                yoyo: false,
                duration: 200,
            });

            this.tweens.add({
                targets: [this.question, this.info],
                scaleY: 1.2,
                scaleX: 0,
                flipX: true,
                yoyo: false,
                duration: 200,
            });


            this.time.delayedCall(200, function(card){
                if (this.question.visible){
                    this.info.visible = true;
                    this.question.visible = false;
                } else {
                    this.info.visible = false;
                    this.question.visible = true;
                }
                this.tweens.add({
                    targets: this.card,
                    scaleY: 2.75,
                    scaleX: 2.75,
                    flipX: true,
                    yoyo: false,
                    duration: 200,
                });
                this.tweens.add({
                    targets: [this.question, this.info],
                    scaleY: 1,
                    scaleX: 1,
                    flipX: true,
                    yoyo: false,
                    duration: 200,
                });
            }, this.card, this);
        }, this);
    }


    endSwipe(e) {
        let swipeTime = e.upTime - e.downTime;
        let swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
        let swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
        let swipeNormal = new Phaser.Geom.Point(swipe.x / swipeMagnitude, swipe.y / swipeMagnitude);

        if (this.tutorialStatus) {
            this.env.setDepth(1);
            this.envMask.setDepth(1);
            this.tutorial_text.setTexture('tutorial_environment');
            this.tutorialStatus = false;
            this.tutorialEnvironment = true;
        } else if (this.tutorialEnvironment) {
            this.soc.setDepth(1);
            this.socMask.setDepth(1);
            this.tutorial_text.setTexture('tutorial_society');
            this.tutorialEnvironment = false;
            this.tutorialSociety = true;
        } else if (this.tutorialSociety) {
            this.eco.setDepth(1);
            this.ecoMask.setDepth(1);
            this.tutorial_text.setTexture('tutorial_economy');
            this.tutorialSociety = false;
            this.tutorialEconomy = true;
        } else if (this.tutorialEconomy) {
            this.res.setDepth(1);
            this.resMask.setDepth(1);
            this.tutorial_text.setTexture('tutorial_resources');
            this.tutorialEconomy = false;
            this.tutorialResources = true;
        } else if (this.tutorialResources) {
            this.progressBar.setDepth(1);
            this.tutorial_text.setTexture('tutorial_progress');
            this.tutorial_text.y = this.canvasGame.height / 1.2;
            this.tutorialResources = false;
            this.tutorialProgress = true;
        } else if (this.tutorialProgress) {
            this.tutorial_text.setTexture('tutorial_text_exit');
            this.tutorialProgress = false;
            this.tutorialEnd = true;
        } else if (this.tutorialEnd) {
            this.scene.start("BootScene");
        }

        if (swipeMagnitude > 20 && swipeTime < 1000 && (Math.abs(swipeNormal.y) > 0.8 || Math.abs(swipeNormal.x) > 0.8)) {
            if (swipeNormal.x > 0.8 && this.hasSwiped === false) {
                // right
                if (!this.tutorialRight) {
                    return;
                }  else {
                    this.tutorialRight = false;
                    this.tutorialLeft = true;
                    this.tutorial_text.setTexture('tutorial_text_left');
                }

                this.hasSwiped = true;

                $(this.container).animate({x: this.canvasGame.width + 1500, speed: 500});
                this.time.delayedCall(500, function (container) {
                    if (this.container.x === this.canvasGame.width + 1500){
                        this.container.destroy();
                    }
                }, this.container, this);

                this.time.delayedCall(500, function (swipe) {
                    this.hasSwiped = false;
                    this.swipeX("yes");
                }, this.swipeX, this);
            }
            if (swipeNormal.x < -0.8 && this.hasSwiped === false) {
                // left
                if (!this.tutorialLeft) {
                    return;
                }  else {
                    this.tutorialLeft = false;
                    this.tutorialStatus = true;
                    this.tutorial_text.y = this.canvasGame.height/5.25;
                    this.tutorial_text.setTexture('tutorial_earth_status');
                }

                this.hasSwiped = true;
                $(this.container).animate({x: -1500, speed: 500});
                this.time.delayedCall(500, function (container) {
                    if (this.container.x === -1500){
                        this.container.destroy();
                    }
                }, this.container, this);
                this.time.delayedCall(500, function (swipe) {
                    this.hasSwiped = false;
                    this.swipeX("no");
                }, this.swipeX, this);
            }
            if (swipeNormal.y > 0.8) {
                // down
                if (!this.tutorialDown) {
                    return;
                } else {
                    this.tutorialDown = false;
                    this.tutorialUp = true;
                    this.tutorial_text.setTexture('tutorial_text_up');
                }

                $(this.container).animate({y: this.canvasGame.height * 1.16});
                this.hasSwiped = true;
            }
            if (swipeNormal.y < -0.8) {
                // up
                if (!this.tutorialUp) {
                    return;
                }  else {
                    this.tutorialUp = false;
                    this.tutorialRight = true;
                    this.tutorial_text.setTexture('tutorial_text_right');
                }

                $(this.container).animate({y: this.canvasGame.height / 2});
                this.hasSwiped = false;
            }
        }
    }


    swipeX(direction) {
        this.moveStar();
        this.createCard("Choices we make, shape our world!", "Welcome to the tutorial!");
    }


    setupIcons() {
        // Under icons
        this.env = this.add.image(this.canvasGame.width / 2 - 330, 150, 'env').setScale(0.4);
        this.soc = this.add.image(this.canvasGame.width / 2 - 110, 150, 'soc').setScale(0.4);
        this.eco = this.add.image(this.canvasGame.width / 2 + 110, 150, 'eco').setScale(0.4);
        this.res = this.add.image(this.canvasGame.width / 2 + 330, 150, 'res').setScale(0.4);

        // Over icons
        this.envMask = this.add.image(this.canvasGame.width / 2 - 330, 150, 'env').setScale(0.4);
        this.envMask.tint = 0x808080;
        this.socMask = this.add.image(this.canvasGame.width / 2 - 110, 150, 'soc').setScale(0.4);
        this.socMask.tint = 0x808080;
        this.ecoMask = this.add.image(this.canvasGame.width / 2 + 110, 150, 'eco').setScale(0.4);
        this.ecoMask.tint = 0x808080;
        this.resMask = this.add.image(this.canvasGame.width / 2 + 330, 150, 'res').setScale(0.4);
        this.resMask.tint = 0x808080;

        this.updateIcons();
    }


    updateIcons() {
        this.cropIcon(this.envMask, 50);
        this.cropIcon(this.socMask, 50);
        this.cropIcon(this.ecoMask, 50);
        this.cropIcon(this.resMask, 50);
    }


    cropIcon(icon, percent) {
        icon.setCrop(0, icon.height - icon.height * (percent / 100), 1000, 1000);
    }
}
