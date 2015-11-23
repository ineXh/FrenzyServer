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
define('Red', 0xFF9999)
define('Blue', 0x9999FF)
define('Teal', 0x99f9f9)
define('Purple', 0xf999f9)

// Character Types
define('Cow', 0)
define('Hut', 1)
