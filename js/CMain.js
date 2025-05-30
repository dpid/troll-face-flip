// Initialize Open Game Protocol SDK
const ogp = new OpenGameSDK({
    ui: {
        gameIcon: 'sprites/200x200.png' // Using the game's icon
    }
    // Set useCustomAuth: true if you want to use your own authentication system
    // useCustomAuth: false  // Default is false, which uses built-in Privy auth
});

// Initialize SDK when document is ready
$(document).ready(function() {
    // Set up OGP event listeners
    ogp.on('OnReady', () => {
        console.log('OGP SDK is ready');
    });

    ogp.on('LoginSuccess', () => {
        console.log('User logged in successfully to OGP');
    });

    ogp.on('LoginError', (error) => {
        console.error('OGP login error:', error);
    });

    ogp.on('PointsSaved', (data) => {
        console.log('Points saved successfully:', data);
    });

    ogp.on('PointsError', (error) => {
        console.error('Error saving points:', error);
    });

    // initialize the SDK
    ogp.init({ gameId: 'troll-flip2' }).then(() => {
        console.log('Open Game Protocol SDK initialized');
    }).catch(error => {
        console.error('Failed to initialize OGP SDK:', error);
    });

    ogp.gameReadyToPlay();
});

function CMain(oData) {
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    var _oPreloader;
    var _oHelp;
    var _oMenu;
    var _oGame;
    var _oStore;
    
    this.initContainer = function () {
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
        
        // Enable touch events
        createjs.Touch.enable(s_oStage);
        
        // Basic stage setup
        s_oStage.enableMouseOver(0);
        s_oStage.mouseMoveOutside = true;
        
        // Determine if mobile
        s_bMobile = isMobile();
        
        // Handle mobile-specific setup
        if(s_bMobile) {
            // Prevent scrolling
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            
            // Add touch event handlers
            window.addEventListener('touchmove', function(e) {
                if(e.target === s_oCanvas) {
                    e.preventDefault();
                }
            }, { passive: false });
            
            window.addEventListener('touchstart', function(e) {
                if(e.target === s_oCanvas) {
                    e.preventDefault();
                }
            }, { passive: false });
            
            window.addEventListener('touchend', function(e) {
                if(e.target === s_oCanvas) {
                    e.preventDefault();
                }
            }, { passive: false });
        } else {
            // Desktop-specific setup
            $('body').on('contextmenu', '#canvas', function (e) {
                return false;
            });
        }
        
        // Set up ticker
        s_iPrevTime = new Date().getTime();
        createjs.Ticker.framerate = FPS;
        createjs.Ticker.addEventListener("tick", this._update);

        if (navigator.userAgent.match(/Windows Phone/i)) {
            DISABLE_SOUND_MOBILE = true;
        }

        s_oSpriteLibrary = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();

    };

    this.preloaderReady = function () {
        this._loadImages();
        
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            this._initSounds();
        }

        _bUpdate = true;
    };

    this.soundLoaded = function () {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        _oPreloader.refreshLoader(iPerc);

        if (_iCurResource === RESOURCE_TO_LOAD) {
            //s_oMain._onRemovePreloader();
        }
    };

    this._initSounds = function () {
        Howler.mute(!s_bAudioActive);
        
        s_aSoundsInfo = new Array();
        s_aSoundsInfo.push({path: './sounds/',filename:'soundtrack',loop:true,volume:1, ingamename: 'soundtrack'});
        s_aSoundsInfo.push({path: './sounds/',filename:'click',loop:false,volume:1, ingamename: 'click'});
        s_aSoundsInfo.push({path: './sounds/',filename:'collision_glass',loop:false,volume:1, ingamename: 'collision_glass'});
        s_aSoundsInfo.push({path: './sounds/',filename:'collision_metal',loop:false,volume:1, ingamename: 'collision_metal'});
        s_aSoundsInfo.push({path: './sounds/',filename:'collision_plastic',loop:false,volume:1, ingamename: 'collision_plastic'});
        s_aSoundsInfo.push({path: './sounds/',filename:'liquid',loop:false,volume:1, ingamename: 'liquid'});
        s_aSoundsInfo.push({path: './sounds/',filename:'bonus',loop:false,volume:1, ingamename: 'bonus'});
        s_aSoundsInfo.push({path: './sounds/',filename:'wronglaunch',loop:false,volume:1, ingamename: 'wronglaunch'});
        s_aSoundsInfo.push({path: './sounds/',filename:'tryagain',loop:false,volume:1, ingamename: 'tryagain'});
        s_aSoundsInfo.push({path: './sounds/',filename:'swish',loop:false,volume:1, ingamename: 'swish'});
        s_aSoundsInfo.push({path: './sounds/',filename:'no_funds',loop:false,volume:1, ingamename: 'no_funds'});
        s_aSoundsInfo.push({path: './sounds/',filename:'purchase',loop:false,volume:1, ingamename: 'purchase'});
        s_aSoundsInfo.push({path: './sounds/',filename:'game_over',loop:false,volume:1, ingamename: 'game_over'});
        s_aSoundsInfo.push({path: './sounds/',filename:'newbestscore',loop:false,volume:1, ingamename: 'newbestscore'});        
        
        RESOURCE_TO_LOAD += s_aSoundsInfo.length;

        s_aSounds = new Array();
        for(var i=0; i<s_aSoundsInfo.length; i++){
            this.tryToLoadSound(s_aSoundsInfo[i], false);
        }
    };
    
    this.tryToLoadSound = function(oSoundInfo, bDelay){
       setTimeout(function(){        
            s_aSounds[oSoundInfo.ingamename] = new Howl({ 
                                                            src: [oSoundInfo.path+oSoundInfo.filename+'.mp3'],
                                                            autoplay: false,
                                                            preload: true,
                                                            loop: oSoundInfo.loop, 
                                                            volume: oSoundInfo.volume,
                                                            onload: s_oMain.soundLoaded,
                                                            onloaderror: function(szId,szMsg){
                                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                    if ( s_aSounds[s_aSoundsInfo[i].ingamename]._sounds.length>0 && szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                        s_oMain.tryToLoadSound(s_aSoundsInfo[i], true);
                                                                                        break;
                                                                                    }else{
                                                                                        document.querySelector("#block_game").style.display = "none";
                                                                                    }
                                                                                }
                                                                        },
                                                            onplayerror: function(szId) {
                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                          s_aSounds[s_aSoundsInfo[i].ingamename].once('unlock', function() {
                                                                                            s_aSounds[s_aSoundsInfo[i].ingamename].play();
                                                                                            if(s_aSoundsInfo[i].ingamename === "soundtrack" && s_oGame !== null){
                                                                                                setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME);
                                                                                            }
                                                                                          });
                                                                                         break;
                                                                                     }
                                                                                 }
                                                                       
                                                            } 
                                                        });

            
        }, (bDelay ? 200 : 0) );
    };

    this._loadImages = function () {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);

        for (var i = 0; i < BOTTLES_NUMBER; i++) {
            s_oSpriteLibrary.addSprite("bottle"+i,"./sprites/bottle"+i+".png");
        };
        
        s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_play", "./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("but_restart", "./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("but_home", "./sprites/but_home.png");
        s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("msg_box_big", "./sprites/msg_box_big.png");
        s_oSpriteLibrary.addSprite("logo_ctl", "./sprites/logo_ctl.png");
        s_oSpriteLibrary.addSprite("but_fullscreen", "./sprites/but_fullscreen.png");        
        s_oSpriteLibrary.addSprite("bg", "./sprites/bg.jpg");
        s_oSpriteLibrary.addSprite("floor", "./sprites/floor.png");
        s_oSpriteLibrary.addSprite("coin", "./sprites/coin.png");
        s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_game0", "./sprites/bg_game0.jpg");
        s_oSpriteLibrary.addSprite("bg_game1", "./sprites/bg_game1.jpg");
        s_oSpriteLibrary.addSprite("bg_store", "./sprites/bg_store.jpg");
        s_oSpriteLibrary.addSprite("but_no", "./sprites/but_no.png");
        s_oSpriteLibrary.addSprite("but_yes", "./sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("but_store", "./sprites/but_store.png");
        s_oSpriteLibrary.addSprite("logo_menu","./sprites/logo_menu.png");        
        s_oSpriteLibrary.addSprite("help_hand","./sprites/help_hand.png");
                
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };

    this._onImagesLoaded = function () {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        _oPreloader.refreshLoader(iPerc);
        
        if (_iCurResource === RESOURCE_TO_LOAD) {
            //this._onRemovePreloader();
        }
    };

    this._onAllImagesLoaded = function () {
        
    };

    this.onAllPreloaderImagesLoaded = function () {
        this._loadImages();
    };
    
    this._onRemovePreloader = function(){
        try{
            saveItem("ls_available","ok");
        }catch(evt){
            // localStorage not defined
            s_bStorageAvailable = false;
        }

        _oPreloader.unload();

        if (!isIOS()) {
            if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
                s_oSoundTrack = playSound("soundtrack", 1, true);
            }
        }

        this.gotoMenu();
    };
    
    this.gotoMenu = function () {
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };
    
    this.gotoGame = function () {
        $("#canvas").trigger("start_session");
        _oGame = new CGame(_oData);
        _iState = STATE_GAME;
    };
    
    this.gotoStore = function(){
        _oStore = new CStore();
        _iState = STATE_STORE;
    };

    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
    
    this.stopUpdate = function () {
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display", "block");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            Howler.mute(true);
        }        
    };

    this.startUpdate = function () {
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display", "none");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            if(s_bAudioActive){
                Howler.mute(false);
            }
        }      
    };

    this._update = function (event) {
        if (_bUpdate === false) {
            return;
        }
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;

        if (s_iCntTime >= 1000) {
            s_iCurFps = s_iCntFps;
            s_iCntTime -= 1000;
            s_iCntFps = 0;
        }

        if (_iState === STATE_MENU) {
            _oMenu.update();
        }

        if (_iState === STATE_GAME) {
            _oGame.update();
        }

        s_oStage.update(event);
    };

    s_oMain = this;

    _oData = oData;
    STARTING_CREDITS = oData.starting_credits;
    LAUNCH_POINTS = oData.launch_points;
    LAUNCH_CREDITS = oData.launch_credits;
    ENABLE_FULLSCREEN = oData.fullscreen;
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;    
    s_bAudioActive = oData.audio_enable_on_startup;
    this.initContainer();
}

var s_bMobile;
var s_bAudioActive = true;
var s_bFullscreen = false;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundTrack = null;
var s_oCanvas;
var s_iTotalScore = 0;
var s_iBestScore = 0;
var s_aSounds;
var s_aSoundsInfo;
var s_oPhysicsController;

var s_bStorageAvailable = true;
var s_bFirstTimePlaying;
var s_aBottlesUnlocked = [];
var s_iBottleType = 0;
var s_iTotalCredits = 0;