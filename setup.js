var ACTIVE_SCENE;

var VERSION_NUMBER = 8;

function setScene() {
    SCREEN_OBJECTS = {};
    ACTIVE_SCENE = new HelloScene();
    ACTIVE_SCENE.setup();
}