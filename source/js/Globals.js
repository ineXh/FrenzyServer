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

// Touch
var spritetouched = false;
var spritetouched_cancel_cb = null;
//var spritereleased = true;

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
var rect_texture;
var attack_upgrade_texture;
var defense_upgrade_texture;
var speed_upgrade_texture;

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
var myteam = -1;
var myteamcolor;
var startlocation = -1;
var max_unit_count = 1;
var cow_max_hp = 10;
var hut_max_hp = 25;
// Multiplayer
var gamestartCount = 0;
var gameCount = 0;
var playerid = -1;
var globalchatcolor;
var username = "";
var Client_to_Server_Sync_Period = 200;
var Client_Sync_Tolerance = 0.02;

var sentPeriodicUpdateGameCount = 0;

var Server_Sync_gameCounts = [0];
var Server_Sync_Period_Estimate = 0;


// SinglePlayer
var SinglePlayer_Spawn_Period = 50;
