class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
    }


    preload() {
        this.canvas1 = document.getElementsByTagName("canvas");
        this.canvas1[0].setAttribute("id", "canvasGame");
        this.canvasGame = document.getElementById("canvasGame");

        this.load.image("earth", "./assets/images/earth.png");
        this.load.image("logo", "./assets/images/logo.png");
        this.load.image("bg", "./assets/images/background.png");
        this.load.spritesheet('cat', './assets/images/nyan_cat_sprite.png', { frameWidth: 52.7, frameHeight: 22});
        this.load.audio('bgm','./assets/bgm.mp3');


        this.load.image("about", "./assets/images/button/About_button.png");
        this.load.image("start", "./assets/images/button/Start_button.png");
        this.load.image("tutorial", "./assets/images/button/tutorial_button.png");

    }


    create() {

        this.bgm = this.sound.play('bgm', config);

        initializeEvents(); // Read and initialize events.json
        initializeEndings(); // Read and initialize endings.json

        this.bg = this.add.image(0, 0, "bg").setOrigin(0,0);
        this.logo = this.add.image(this.canvasGame.width / 2, this.canvasGame.height * 0.4, "logo");
        this.logo.displayWidth = this.canvasGame.width * 0.8;
        this.logo.displayHeight = this.logo.displayWidth;

        this.countSpin = 0;
        this.canSpin = true;
        this.logo.setInteractive();
        this.logo.on("pointerdown", this.spinEarth, this);

        let style = { fill: "#FFFFFF", fontSize: "3em", fontFamily: 'Abel'};
        this.start = this.add.image(this.canvasGame.width / 2, this.canvasGame.height * 0.65,
            "start");
        this.start.setInteractive().setOrigin(0.5, 0).setScale(0.25);
        this.start.on("pointerdown", this.firebaseLogin, this);

        this.tutorial = this.add.image(this.canvasGame.width / 2, this.canvasGame.height * 0.72,
            "tutorial");
        this.tutorial.setInteractive().setOrigin(0.5, 0).setScale(0.25);
        this.tutorial.on("pointerdown", function() {
            this.scene.start("PlayTutorial");
        }, this);


        this.about = this.add.image(this.canvasGame.width / 2, this.canvasGame.height * 0.79,
            "about");
        this.about.setInteractive().setOrigin(0.5, 0).setScale(0.25);
        this.about.on("pointerdown", function() {
            this.scene.start("AboutScene");
        }, this);
    }


    firebaseLogin() {
        console.log("called firebaseLogin");
        this.login = function (provider) {
            if (!firebase.auth().currentUser) {
                provider = new firebase.auth.GoogleAuthProvider();
                provider.addScope("https://www.googleapis.com/auth/userinfo.email");
                firebase.auth().signInWithPopup(provider).then(this.start_game.bind(this));
            } else {
                firebase.database().ref("/users/" + firebase.auth().currentUser.uid).once("value").then(this.start_game.bind(this));
            }
        };

        this.start_game = function () {
            this.scene.start("PlayGame");
        };
        this.login();
    }


    firebaseLogout(){
        firebase.auth().signOut();
        console.log("restart scene");
        this.scene.restart();
    }


    spinEarth() {
        if (this.canSpin) {
            this.canSpin = false;
            this.tweens.add({
                targets: [this.logo],
                angle: 360,
                duration: 1000,
                ease: "Cubic.easeOut",
                callbackScope: this,
                onComplete: function() {
                    this.canSpin = true;
                }
            });
        }

        this.countSpin += 1;
        if (this.countSpin == 3) {
            this.nyanCat();
            this.countSpin = 0;
        }
    }


    nyanCat(){
        this.cat = this.physics.add.sprite(-10, Math.random() * this.canvasGame.height, "cat", 0).setScale(3);
        this.cat_2 = this.physics.add.sprite(-50, Math.random() * this.canvasGame.height, "cat", 0).setScale(3);
        this.cat_3 = this.physics.add.sprite(-20, Math.random() * this.canvasGame.height, "cat", 0).setScale(3);

        // animate cat sprite
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 9 }),
            frameRate: 9,
            repeat: -1
        });

        this.cat.setVelocityX(300);
        this.cat.anims.play('right', true);

        this.cat_2.setVelocityX(200);
        this.cat_2.anims.play('right', true);

        this.cat_3.setVelocityX(400);
        this.cat_3.anims.play('right', true);
    }


    update(){
        let style = { fill: "#FFFFFF", fontSize: "3em", fontFamily: 'Abel'};

        // Display log out button if user logged in
        if (firebase.auth().currentUser) {
            this.logout = this.add.text(this.canvasGame.width / 2, this.canvasGame.height / 1.05,
                "Log out", style);
            this.logout.setInteractive().setOrigin(0.5, 0);
            this.logout.on("pointerdown", this.firebaseLogout.bind(this), this);
        }
    }
}
