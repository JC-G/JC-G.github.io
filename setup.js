var ACTIVE_SCENE;

function setScene() {
    SCREEN_OBJECTS = {};
    ACTIVE_SCENE = new HelloScene();
    ACTIVE_SCENE.setup();
}