function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}
// Enums
define("socket", 0);

define("team0", 0);
define("team1", 1);
define("team2", 2);
define("team3", 3);

// Client Status
define("Ready", 50);
define("NotReady", 51);