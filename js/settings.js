var CANVAS_WIDTH = 980;
var CANVAS_HEIGHT = 1400;
var CANVAS_WIDTH_HALF = CANVAS_WIDTH * 0.5;
var CANVAS_HEIGHT_HALF = CANVAS_HEIGHT * 0.5;

var EDGEBOARD_X = 100;
var EDGEBOARD_Y = 100;

var FPS = 30;
var FPS_TIME = 1000 / FPS;
var DISABLE_SOUND_MOBILE = false;

var PRIMARY_FONT = "comfortaa";
var PRIMARY_FONT_COLOUR = "#ffffff";
var SECONDARY_FONT_COLOUR = "#132b41";

var FONT_SIZE_INTERFACE = "36px ";
var FONT_SIZE_MENU_BEST_SCORE = "36px ";
var FONT_SIZE_CREDITS = "36px ";
var FONT_SIZE_HELP = "32px ";
var FONT_SIZE_MSG_BOX = "26px ";
var FONT_SIZE_ARE_YOU_SURE = "36px ";
var FONT_SIZE_TITLES = "60px ";
var FONT_SIZE_STORE_BUTTON = "26px ";
var FONT_SIZE_END_PANEL_TITLE = "40px ";
var FONT_SIZE_END_PANEL_TEXT = "32px ";
var FONT_SIZE_TEXT_MESSAGE = "60px ";

var BOTTLES_NUMBER = 12;
var BOTTLES_PRICES = [0,1,3,5,10,15,20,25,30,50,100,150];
var ALL_BOTTLES_UNLOCKED = false;    // SET TO TRUE TO HAVE ALL THE BOTTLES AVAILABLE
var STARTING_CREDITS;
var LAUNCH_POINTS;
var LAUNCH_CREDITS;
var LAUNCH_DISTANCE_VAR = 10;
var LAUNCH_DISTANCE_MIN = 19;
var LAUNCH_DISTANCE_CORRECT = 22; // 22 IS THE DISTANCE NUMBER THAT WILL MAKE A PERFECT FLIP
var LAUNCH_DISTANCE_MAX = 23;
var SWIPE_DISTANCE_MINIMUM = 100;
var SWIPE_DISTANCE_LIMIT_MIN = 350;
var SWIPE_DISTANCE_LIMIT_MAX = 450;
var LAUNCH_WRONG_RANDOMIZER = 5;
var LAUNCH_CORRECT_MIN_RANDOM = -0.2;
var LAUNCH_CORRECT_MAX_RANDOM = 0.03;
var BOTTLE_ROTATION = 5;
var TEXT_MESSAGES_SPEED = 1500; // IN MS
var SWIPE_TIMER_MAX = 500;      // IN MS

var NUM_ROWS_PAGE_STORE = 5;
var NUM_COLS_PAGE_STORE = 3;

// BOX 2D SETTINGS
var TIMESTEP = 1/60;
var VELOCITY_ITERATIONS = 10;
var POSITION_ITERATIONS = 10;
var UPDATE_LOOP_VAR = 3;
var DEBUG_BOX2D = false;
var DEBUG_BOX2D_ALPHA = 0.5;
var WORLD_SCALE = 100;
var GRAVITY = 9.81;
var FLOOR_DENSITY      = 1;
var FLOOR_FRICTION     = 1;
var FLOOR_RESTITUTION  = 0.1;
var FLOOR_X_START  = CANVAS_WIDTH_HALF;
var FLOOR_Y_START  = CANVAS_HEIGHT - 210;
var BOTTLE_X_START = CANVAS_WIDTH_HALF;
var BOTTLE_Y_START = CANVAS_HEIGHT_HALF + 350;
var BOTTLE_DENSITY      = 1;
var BOTTLE_FRICTION     = 1;
var BOTTLE_RESTITUTION  = 0.1;
        
// BOX 2D BODY SETTINGS
var DYNAMIC_BODY        = 0;
var STATIC_BODY         = 1;
var KINEMATIC_BODY      = 2;
var CONTACT_BEGIN       = 0;
var CONTACT_END         = 1;
var CONTACT_PRESOLVE    = 2;
var CONTACT_POSTSOLVE   = 3;

var ENABLE_FULLSCREEN;
var ENABLE_CHECK_ORIENTATION;

var STATE_LOADING   = 0;
var STATE_MENU      = 1;
var STATE_HELP      = 2;
var STATE_GAME      = 3;
var STATE_STORE     = 4;
var ON_MOUSE_DOWN   = 0;
var ON_MOUSE_UP     = 1;
var ON_MOUSE_OVER   = 2;
var ON_MOUSE_OUT    = 3;

var BOTTLE_SETTINGS = {"polygons":[[{"x":0.43770840764045715,"y":0.7455205321311951},{"x":0.5664584040641785,"y":0.746145486831665},{"x":0.5658334493637085,"y":0.980520486831665},{"x":0.53020840883255,"y":1.0786454677581787},{"x":0.4733334183692932,"y":1.0786454677581787},{"x":0.4370834231376648,"y":0.983645498752594}]],"circles":[],"shapes":[{"type":"POLYGON","vertices":[{"x":0.43770840764045715,"y":0.7455205321311951},{"x":0.5664584040641785,"y":0.746145486831665},{"x":0.5658334493637085,"y":0.980520486831665},{"x":0.53020840883255,"y":1.0786454677581787},{"x":0.4733334183692932,"y":1.0786454677581787},{"x":0.4370834231376648,"y":0.983645498752594}]}]};