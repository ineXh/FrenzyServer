var width, height, dim, big_dim;
var stage_width, stage_height;
var scope_width, scope_height;
var center;
var renderer;



// Container Frames
// Overall Stage
var stage0;
var stage00;
// In game Stage
var stage;

// Main Menu
var stage_main_menu;
var stage_multiplayer_menu;

// In game Path
var path_container;

var startTime, lastTime;
var time;


// Modules
var stagesetup;
var stagelayout;
var communication;
var game;
var gameobjects;
var characters;
var gameitems;
var particles;
var menu;
var path;

var assetsloaded = false;
// Textures
var arrow_head_texture;
var arrow_line_texture;

var hut_texture;
var cow_texture;
var coin_texture;

var cow_front_frames = [];
var cow_front_attack_frames = [];
var cow_back_frames = [];
var cow_back_attack_frames = [];

var icon_play;
var icon_multiplay;
var icon_music;
var icon_sound;
var icon_heart;
var icon_setting;
var icon_logo;
var icon_menu;
var icon_restart;
var title;
var score_text;


// Game Variables
var gamestate;
var gamemode;
var playerid = -1;
var myteam = -1;
var myteamcolor;
var startlocation = -1;

// Multiplayer
var username = "";
