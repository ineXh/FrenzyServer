var walldamp = -1;
var damping = 1;
var spring = 0.01;
var GrassBGColor = RGBColor(168, 220, 163);
var GrassColor 	 = RGBColor(40, 140, 40);
var GrassColor2 = 0x699e5f;
var LightCyan = 0xe0ffff;
var LightBlue = 0x9aaee6;
var LightOrange = 0xffac4c;
var LightYellow = 0xfffb45;
var Red = 0xff9999;
var Blue = 0x9999ff;
var Green = 0x99ff99;
var Teal = 0x99f9f9;
var Purple = 0xf999f9;

var TitleYellow = 0xffd422;
var SkyColor = RGBColor(51, 153, 255);
var OrangeColor = 0xFFA500;
var PI = Math.PI;

function GameState() {}
GameState.Loading		= 1;
GameState.MainMenu		= 5;
GameState.MainMenu2StageSelect		= 6;
GameState.StageSelect		= 7;
GameState.MultiPlayerMenu	= 8;
GameState.GetReady		= 10;
GameState.StartGame		= 11;
GameState.InPlay		= 12;
GameState.GameOver		= 100;

function GameMode(){}
GameMode.SinglePlayer = 0;
GameMode.MultiPlayer = 1;

function GameItemType() {}
GameItemType.Fence = 0;
GameItemType.Hut = 1;

function StartLocation(){}
StartLocation.NW = 0;
StartLocation.NE = 1;
StartLocation.SW = 2;
StartLocation.SE = 3;

function AnimationType(){}
AnimationType.Walk_Front = 0;
AnimationType.Attack_Front = 1;

AnimationType.Walk_Back = 5;
AnimationType.Attack_Back = 6;

function MovementSetType(){}
MovementSetType.Charge = 0;
MovementSetType.Stand = 1;
MovementSetType.Block = 2;
MovementSetType.Jump = 3;
MovementSetType.Hop = 4;
MovementSetType.JumpForward = 5;

MovementSetType.Punch = 7;
MovementSetType.LongPunch = 8;
MovementSetType.Sword = 9;
MovementSetType.Shuriken = 10;

MovementSetType.Kick = 11;

MovementSetType.Slash = 12;


MovementSetType.Get_Hit_Back = 20;



function MovementType() {}
MovementType.Charge = 0;
MovementType.Charge_LArm = 1;
MovementType.Charge_RArm = 2;
MovementType.Charge_LLeg = 3;
MovementType.Charge_RLeg = 4;
MovementType.Dash 		 = 5;	// ground dash only
MovementType.Dash_to_original = 11;
MovementType.Jump = 20;
MovementType.Stand = 21;
MovementType.Stand_Body = 22;


MovementType.Punch	= 32;
MovementType.PunchPull = 33;
MovementType.Walk1	= 34;
MovementType.Walk2 = 35;
MovementType.Idle = 40;
MovementType.Idle_Move = 41;

MovementType.Throw_item_LArm = 61;
MovementType.Throw_item_RArm = 62;

MovementType.Hit_Back = 80;

function Status(){};
Status.Idle = 0;
Status.Hit_Back = 1;
Status.Defense = 2;
Status.Attack = 3;
Status.Dodge = 4;


function Direction(){}
Direction.Left = -1;
Direction.Right = 1;



function ArmType(){}
ArmType.Head = 0;
ArmType.LArm = 1;
ArmType.RArm = 2;
ArmType.LLeg = 3;
ArmType.RLeg = 4;

function SpriteType(){}
SpriteType.Body = 0;
SpriteType.Head = 1;
SpriteType.LArm = 2;
SpriteType.RArm = 3;
SpriteType.LLeg = 4;
SpriteType.RLeg = 5;
SpriteType.Cloth = 6;

function CharacterType() {}
CharacterType.Cow       = 0;
CharacterType.Hut       = 1;

CharacterType.Alien		= 11;
CharacterType.Piranha	= 12;
CharacterType.Duck		= 13;
CharacterType.Cat		= 15;
CharacterType.Knight	= 16;
CharacterType.Mole		= 17;
CharacterType.Stick		= 18;
CharacterType.Mask	= 19;
CharacterType.Demon	= 20;

function ParticleType() {}

ParticleType.FLAME      = 0;
ParticleType.BACK       = 1;
ParticleType.TEXT		= 2;
ParticleType.CHARGEFLAME 	= 3;
ParticleType.ICON 		= 4;

function BallType(){}
BallType.Draw			= 0;
BallType.NotDraw		= 1;

function ItemType(){}
ItemType.Shuriken		= 0;
ItemType.Sword			= 1;

function SurfaceType(){}
SurfaceType.Sline = 0;

function SurfaceInteractType(){}
SurfaceInteractType.Bound = 0;
SurfaceInteractType.Bounce = 1;

function TileType(){}
TileType.NotSurface = 0;
TileType.Surface = 1;
TileType.LeftDownSlant = 2;
TileType.RightDownSlant = 3;


function DrawType(){}
DrawType.None = 0;
DrawType.Graphics = 1;
DrawType.Sprite = 2;

