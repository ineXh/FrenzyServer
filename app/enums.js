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

define("NW", 0);
define("NE", 1);
define("SW", 2);
define("SE", 3);

// Client Status
define("Ready", 50);
define("NotReady", 51);

// Color
define('Red', 0xFF0000)
define('Blue', 0x0000FF)
define('Teal', 0x008080)
define('Purple', 0x800080)

// Character Types
define('Cow', 4)
