let config = {
    type: Phaser.AUTO,
    backgroundColor:"#FFFFFF",
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, playGame, EndScene]
};
let game = new Phaser.Game(config);