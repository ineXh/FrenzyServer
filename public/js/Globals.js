var width, height, dim, big_dim;
var stage_width, stage_height;
var scope_width, scope_height;
var center;
var renderer;

// Container Frames
// Overall Stage
var stage0;
// In game Stage
var stage;
// In game Path
var path_container;


var startTime, lastTime;
var time;
var gamestate;

// Modules
var communication;
var gameobjects;
var characters;
var gameitems;
var menu;
var path;

var assetsloaded = false;
// Textures
var arrow_head_texture;
var arrow_line_texture;
var arrow_dot_texture;
var stick_texture;
var cow_texture;
