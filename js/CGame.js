function CGame(oData) {
    var _bStartGame;
    var _bDisableEvents;
    var _bNewBestScore;
    var _bCheckLaunch;
    var _bLaunched;
    var _bHelpNeeded;
    var _bLaunchReady;
    var _bSwipeTimerStart;
    var _bPressStart;
    var _bPressMove;

    var _iTotalCredits;
    var _iTotalScore;
    var _iScore;
    var _iSwipeTimer;
    
    var _oPressStartPos;
    var _oPressEndPos;
    var _oData;
    var _oBg;
    var _oPhysicWorld;
    var _oPhysicObjectsCreator;    
    var _oGameContainer;
    var _oBgContainer;
    var _oPopupContainer;
    var _oFloor;
    var _oBottle;
    var _oInterface;
    var _oEndPanel;
    var _oHelpPanel;
    var _oHitArea;
    var _oShortLaunchTextBack;
    var _oShortLaunchText;
    var _oNewBestScoreTextBack;
    var _oNewBestScoreText;
    var _oTryAgainText;
    var _oTryAgainTextBack;
    var _oHelpHand;    
    
    // Screen shake variables
    var _shakeIntensity;
    var _shakeDecay;
    var _shakeOffset;
    
    var _oCharacterSelect;
    
    this._init = function () {        
        console.log("Game init started"); // Debug log
        
        // Start with events disabled and game not started
        _bStartGame = false;
        _bLaunchReady = false;
        _bDisableEvents = true;
        
        _oBgContainer = new createjs.Container();
        s_oStage.addChild(_oBgContainer);
        
        var iRandomN = Math.floor(Math.random()*2);
        var oSprite = s_oSpriteLibrary.getSprite('bg_game'+iRandomN);
        _oBg = createBitmap(oSprite);
        _oBgContainer.addChild(_oBg);
        
        _oGameContainer = new createjs.Container();
        s_oStage.addChild(_oGameContainer);        

        // Add direct stage event listeners for debugging
        var oParent = this;
        s_oStage.on("stagemousedown", function(evt) {
            console.log("Stage mouse down", evt.stageX, evt.stageY);
            if (!_bDisableEvents) {
                oParent.onPressed(evt);
            }
        });
        s_oStage.on("stagemousemove", function(evt) {
            console.log("Stage mouse move", evt.stageX, evt.stageY);
            if (!_bDisableEvents && _bPressStart) {
                oParent.onPressMove(evt);
            }
        });
        s_oStage.on("stagemouseup", function(evt) {
            console.log("Stage mouse up", evt.stageX, evt.stageY);
            if (!_bDisableEvents) {
                oParent.onReleased();
            }
        });

        this._resetVariables();
        this._initNewGame();
        
        _oPopupContainer = new createjs.Container();
        _oGameContainer.addChild(_oPopupContainer);
        
        _oInterface = new CInterface(_oPopupContainer);
        _oInterface.initInterfaceTexts();
        this.initNewBestScoreText();
        
        // Initialize screen shake variables with reduced intensity
        this._shakeIntensity = 0;
        this._shakeDecay = 0.9;  // Keep same decay rate
        this._shakeOffset = {x: 0, y: 0};
        
        // Show help panel for first time players, otherwise start game
        if (s_bFirstTimePlaying === true) {
            _oHelpPanel = new CHelpPanel();
        } else {
            this._onExitHelp();
        }
        
        console.log("Game init completed"); // Debug log
    };
    
    this._initHitArea = function(){
        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oHitArea.alpha = 0.01;
        
        var oParent = this;
        _oHitArea.on("mousedown", function(evt){ oParent.onPressed(evt); });
        _oHitArea.on("pressmove", function(evt){ oParent.onPressMove(evt); });
        _oHitArea.on("pressup", function(evt){ oParent.onReleased(); });
        
        _oGameContainer.addChild(_oHitArea);
    };
    
    this._initNewGame = function(){
        s_oPhysicsController = new CPhysicsController();
        _oPhysicObjectsCreator = new CPhysicObjectsCreator(s_oPhysicsController.getWorld());
        _oPhysicWorld = new CPhysicWorld(_oPhysicObjectsCreator, _oGameContainer);
        
        _oFloor = _oPhysicObjectsCreator.addFloor(_oGameContainer);
        _oBottle = _oPhysicObjectsCreator.addBottle(_oGameContainer);
    };

    this._initHelpHand = function(){
        var oSprite = s_oSpriteLibrary.getSprite('help_hand');
        _oHelpHand = createBitmap(oSprite);
        _oHelpHand.regX = oSprite.width * 0.4;
        _oHelpHand.regY = oSprite.height * 0.3;
        _oHelpHand.x = BOTTLE_X_START;
        _oHelpHand.y = BOTTLE_Y_START;
        _oHelpHand.alpha = 0;
        _oGameContainer.addChild(_oHelpHand);
        
        this.startHelpHandMovement();        
    };
        
    this.startHelpHandMovement = function(){
        var oParent = this;
        createjs.Tween.get(_oHelpHand)
            .to({alpha: 1}, 500, createjs.Ease.quadIn)
            .to({scaleX: 0.9, scaleY: 0.9}, 100, createjs.Ease.quadOut)
            .call(function(){                 
                createjs.Tween.get(_oHelpHand)
                    .wait(200)
                    .to({y: BOTTLE_Y_START - 400}, 500, createjs.Ease.cubicOut)
                    .to({scaleX: 1, scaleY: 1}, 100, createjs.Ease.cubicIn)
                    .call(function(){
                        oParent.fadeOutHelpHand();
                    });
            });        
    };
    
    this.fadeOutHelpHand = function(){
        var oParent = this;
        createjs.Tween.get(_oHelpHand)
            .to({alpha: 0}, 500, createjs.Ease.quadIn)
            .call(function(){                 
                _oHelpHand.y = BOTTLE_Y_START;
                oParent.startHelpHandMovement();
            });    
    };

    this.onFirstLaunch = function(){
        _bHelpNeeded = false;
        
        if (_oHelpHand) {
            createjs.Tween.get(_oHelpHand)
                .to({alpha: 0}, 200, createjs.Ease.quadIn)
                .call(function(){                 
                    _oGameContainer.removeChild(_oHelpHand);
                    createjs.Tween.removeTweens(_oHelpHand);
                    _oHelpHand = null;
                });    
        }
    };

    this.getPhysicWorld = function(){
        return _oPhysicWorld;
    };
    
    this._resetVariables = function () {
        _oEndPanel = null;
        _oTryAgainText = null;
        _oTryAgainTextBack = null;
        _oShortLaunchText = null;
        _oShortLaunchTextBack = null;
        
        // Start with game disabled until properly initialized
        _bLaunchReady = false;
        _bCheckLaunch = false;
        _bLaunched = false;
        _bStartGame = false;
        _bDisableEvents = true;
        _bNewBestScore = false;
        _bHelpNeeded = true;
        _bSwipeTimerStart = false;
        _bPressStart = false;
        _bPressMove = false;
        
        _oPressStartPos = {x:0,y:0};
        _oPressEndPos = {x:0,y:0};
        
        _iSwipeTimer = 0;
        _iScore = 0;
        _iTotalScore = s_iTotalScore;
        _iTotalCredits = s_iTotalCredits;
                
        setVolume("soundtrack", 0.5);
    };
    
    this.initNewBestScoreText = function(){
        _oNewBestScoreTextBack = this.showMessage(TEXT_NEWBESTSCORE, SECONDARY_FONT_COLOUR);
        _oNewBestScoreTextBack.outline = 5;

        _oNewBestScoreText = this.showMessage(TEXT_NEWBESTSCORE, PRIMARY_FONT_COLOUR);
        _oNewBestScoreTextBack.y = _oNewBestScoreText.y = CANVAS_HEIGHT_HALF - 200;
        _oNewBestScoreTextBack.visible = _oNewBestScoreText.visible = false;
    };
    
    this.unload = function () {
        _bStartGame = false;        
        _oInterface.unload();
        this.destroyPhysicsEngine();
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();
        s_oGame = null;
    };
    
    this.destroyPhysicsEngine = function () {
        s_oPhysicsController.destroyWorld();

        _oFloor.unload();
        _oFloor = null;
        _oBottle.unload();
        _oBottle = null;
        _oPhysicObjectsCreator = null;
        _oPhysicWorld = null;                
        s_oPhysicsController = null;
    };

    this.onExit = function () {
        setVolume("soundtrack", 1);
        $("#canvas").trigger("end_session");
        $("#canvas").trigger("show_interlevel_ad");
        this.unload();
        s_oMain.gotoMenu();        
    };

    this.restart = function () {
        setVolume("soundtrack", 0.5);
        $("#canvas").trigger("restart_level");
        this.unload();
        s_oMain.gotoGame();
    };

    this._onExitHelp = function () {
        // Enable game interaction only after help panel is closed
        _bStartGame = true;
        _bLaunchReady = true;
        _bDisableEvents = false;
        _oHelpPanel = null;
        
        console.log("Game enabled - ready for interaction");
        
        if (_bHelpNeeded) {
            this._initHelpHand();
        }        
    };
    
    this.updateScore = function () {
        // UPDATE TOTAL SCORE
        _iTotalScore += _iScore;
        s_iTotalScore = _iTotalScore;
        saveItem("flipthebottle_total_score", s_iTotalScore);
        
        this.saveCredits();

        // UPDATE BEST SCORE
        if (_iScore > s_iBestScore) {
            s_iBestScore = _iScore;
            saveItem("flipthebottle_best_score", s_iBestScore);
        }
    };
    
    this.saveCredits = function(){
        // UPDATE CREDITS
        s_iTotalCredits = _iTotalCredits;
        saveItem("flipthebottle_total_credits", s_iTotalCredits);
    };
    
    this.addScore = function () {
        this.initScoreText(LAUNCH_POINTS);
        _iTotalCredits += LAUNCH_CREDITS;
        _iScore += LAUNCH_POINTS;
        _oInterface.refreshScoreText(_iScore);
        this.saveCredits();
        
        // SHOW A "NEW BEST SCORE" TEXT, IF NEEDED
        if (_iScore > s_iBestScore) {
            this.showNewBestScore();
            s_iBestScore = _iScore;
            saveItem("flipthebottle_best_score", s_iBestScore);
            _oInterface.refreshBestScoreText();
            _bNewBestScore = true;
        }
    };

    this.showNewBestScore = function(){
        if (_bNewBestScore === true || s_bFirstTimePlaying === true) {
            return;
        }
        if (soundPlaying("newbestscore") === false) {
            playSound("newbestscore", 1, false);
        }

        var iScaleMax = 1.3;
        _oNewBestScoreText.alpha = _oNewBestScoreTextBack.alpha = 0;
        _oNewBestScoreText.visible = _oNewBestScoreTextBack.visible = true;

        createjs.Tween.get(_oNewBestScoreTextBack)
            .to({alpha: 1}, 500, createjs.Ease.quadIn)
            .call(function () {
                new createjs.Tween.get(_oNewBestScoreTextBack, {loop: true})
                    .to({scaleX: iScaleMax, scaleY: iScaleMax}, TEXT_MESSAGES_SPEED, createjs.Ease.quadOut)
                    .to({scaleX: 1, scaleY: 1}, TEXT_MESSAGES_SPEED, createjs.Ease.quadIn);
                new createjs.Tween.get(_oNewBestScoreTextBack)
                    .wait(2000)
                    .to({alpha: 0}, TEXT_MESSAGES_SPEED, createjs.Ease.quadOut)
                    .call(function(){
                        _oNewBestScoreTextBack.visible = false;
                        createjs.Tween.removeTweens(_oNewBestScoreTextBack);
                    });
            });
        createjs.Tween.get(_oNewBestScoreText)
            .to({alpha: 1}, 500, createjs.Ease.quadIn)
            .call(function () {
                new createjs.Tween.get(_oNewBestScoreText, {loop: true})
                    .to({scaleX: iScaleMax, scaleY: iScaleMax}, TEXT_MESSAGES_SPEED, createjs.Ease.quadOut)
                    .to({scaleX: 1, scaleY: 1}, TEXT_MESSAGES_SPEED, createjs.Ease.quadIn);
                new createjs.Tween.get(_oNewBestScoreText)
                    .wait(2000)
                    .to({alpha: 0}, TEXT_MESSAGES_SPEED, createjs.Ease.quadOut)
                    .call(function(){
                        _oNewBestScoreText.visible = false;
                        createjs.Tween.removeTweens(_oNewBestScoreText);
                    });
            });
    };

    this.initScoreText = function (iValue) {
        var oScoreTextBack = this.showMessage("+" + iValue, SECONDARY_FONT_COLOUR);
        oScoreTextBack.outline = 5;
        var oScoreText = this.showMessage("+" + iValue, PRIMARY_FONT_COLOUR);
        
        createjs.Tween.get(oScoreText)
            .to({y: oScoreText.y - 400, alpha: 0}, TEXT_MESSAGES_SPEED, createjs.Ease.sineOut)
            .call(function() {
                _bLaunchReady = true;
                createjs.Tween.removeTweens(oScoreText);
                _oPopupContainer.removeChild(oScoreText);
            });
        createjs.Tween.get(oScoreTextBack)
            .to({y: oScoreTextBack.y - 400, alpha: 0}, TEXT_MESSAGES_SPEED, createjs.Ease.sineOut)
            .call(function() {
                _bLaunchReady = true;
                createjs.Tween.removeTweens(oScoreTextBack);
                _oPopupContainer.removeChild(oScoreTextBack);
            });
    };
    
    this.isCheckLaunch = function(){
        return _bCheckLaunch;
    };
    
    this.tryAgain = function(){
        this.resetBottle();
        _oBottle.fadeoutAndResetSprite();
        playSound("tryagain", 1, false);
        
        _oTryAgainTextBack = this.showMessage(TEXT_TRY_AGAIN, SECONDARY_FONT_COLOUR);
        _oTryAgainTextBack.outline = 5;
        _oTryAgainText = this.showMessage(TEXT_TRY_AGAIN, PRIMARY_FONT_COLOUR);
        
        createjs.Tween.get(_oTryAgainText)
            .to({y: _oTryAgainText.y - 400, alpha: 0}, TEXT_MESSAGES_SPEED, createjs.Ease.sineOut)
            .call(function() {
                _bLaunchReady = true;
                createjs.Tween.removeTweens(_oTryAgainText);
                _oPopupContainer.removeChild(_oTryAgainText);
                _oTryAgainText = null;
            });        
        createjs.Tween.get(_oTryAgainTextBack)
            .to({y: _oTryAgainTextBack.y - 400, alpha: 0}, TEXT_MESSAGES_SPEED, createjs.Ease.sineOut)
            .call(function() {
                _bLaunchReady = true;
                createjs.Tween.removeTweens(_oTryAgainTextBack);
                _oPopupContainer.removeChild(_oTryAgainTextBack);
                _oTryAgainTextBack = null;
            });
    };
        
    this.atShortLaunch = function(szText){
        playSound("wronglaunch", 1, false);
            
        _bPressStart = false;
        _bPressMove = false;
        _bLaunchReady = true;
        
        if (_oShortLaunchText) {
            return;
        }
        _oShortLaunchTextBack = this.showMessage(szText, SECONDARY_FONT_COLOUR);
        _oShortLaunchTextBack.outline = 5;
        _oShortLaunchText = this.showMessage(szText, PRIMARY_FONT_COLOUR);
        
        createjs.Tween.get(_oShortLaunchTextBack)
            .to({y: _oShortLaunchTextBack.y - 400, alpha: 0}, TEXT_MESSAGES_SPEED, createjs.Ease.sineOut)
            .call(function() {
                createjs.Tween.removeTweens(_oShortLaunchTextBack);
                _oPopupContainer.removeChild(_oShortLaunchTextBack);
                _oShortLaunchTextBack = null;
            });
        createjs.Tween.get(_oShortLaunchText)
            .to({y: _oShortLaunchText.y - 400, alpha: 0}, TEXT_MESSAGES_SPEED, createjs.Ease.sineOut)
            .call(function() {
                createjs.Tween.removeTweens(_oShortLaunchText);
                _oPopupContainer.removeChild(_oShortLaunchText);
                _oShortLaunchText = null;
            });
    };
    
    this.showMessage = function(szText, szColor){
        
        var iX = CANVAS_WIDTH_HALF;
        var iY = CANVAS_HEIGHT_HALF;
        var iWidth = 550;
        var iHeight = 70;
        
        return new CTLText(_oPopupContainer, 
            iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
            60, "center", szColor, PRIMARY_FONT, 1,
            2, 2,
            szText,
            true, true, true,
            false ).getText();    
    };
    
    this.onCorrectLaunch = function(){
        playSound("bonus", 1, false);
        this.addCoin();
        this.addScore();        
        this.resetBottle();        
        _oBottle.resetBottle();

        // Save points to Open Game Protocol
        ogp.savePoints(LAUNCH_POINTS).then(() => {
            console.log('Points saved successfully');
        }).catch(error => {
            console.error('Error saving points:', error);
            ogp.showError({
                title: 'Error',
                message: 'Failed to save points. Please try again.'
            });
        });
    };
    
    this.addCoin = function(){
        var oStartPos = _oBottle.getSpritePosition();
        var oSprite = s_oSpriteLibrary.getSprite('coin');
        var oCoin = createBitmap(oSprite);        
        oCoin.regX = oSprite.width * 0.5;
        oCoin.regY = oSprite.height * 0.5;
        oCoin.x = oStartPos.x;
        oCoin.y = oStartPos.y;
        oCoin.alpha = 0;
        _oGameContainer.addChild(oCoin);
        
        var oIconPos = _oInterface.getCreditsIconPos();
        
        createjs.Tween.get(oCoin)
            .to({alpha: 1}, 200, createjs.Ease.quadIn);    
        createjs.Tween.get(oCoin)
            .to({y: oIconPos.y}, 800, createjs.Ease.quadIn);
        createjs.Tween.get(oCoin)
            .to({x: oIconPos.x}, 1000, createjs.Ease.quintOut)
            .call(function(){
                _oInterface.pulseCreditsIcon();
                _oInterface.refreshCreditsText(_iTotalCredits);
                _oGameContainer.removeChild(oCoin);
                createjs.Tween.removeTweens(oCoin);
            });
    };

    this.gameOver = function () {
        _bStartGame = false;

        this.updateScore();

        if (_oEndPanel === null) {
            $("#canvas").trigger("share_event", s_iTotalScore);
            $("#canvas").trigger("save_score", s_iTotalScore);
            
            // Save final session score to Open Game Protocol
            if (_iScore > 0) {
                ogp.savePoints(_iScore).then(() => {
                    console.log('Final session score saved to OGP:', _iScore);
                }).catch(error => {
                    console.error('Error saving final score to OGP:', error);
                    // Don't show error popup on game over to avoid disrupting the flow
                });
            }
            
            playSound("game_over", 1, false);
            stopSound("soundtrack");
            setTimeout(function() { playSound("soundtrack", 0.5, false); }, 3000);

            _oEndPanel = new CEndPanel(_iScore);
            _bDisableEvents = true;            
        }
    };
        
    this.setStartGame = function (bValue) {
        _bStartGame = bValue;
        _bDisableEvents = bValue;        
    };
    
    this.setLaunchReady = function(bValue) {
        _bLaunchReady = bValue;
    };
    
    this.onPressed = function(evt){
        if (_bDisableEvents || !_bStartGame || !_bLaunchReady || _bPressStart || !_oBottle || !_oBottle.isReady()) {
            console.log("Press conditions not met", {
                _bDisableEvents,
                _bStartGame,
                _bLaunchReady,
                _bPressStart,
                bottleReady: _oBottle ? _oBottle.isReady() : false
            });
            return;
        }
        
        _bPressStart = true;
        _oPressStartPos = {
            x: evt.stageX,
            y: evt.stageY
        };
        _bSwipeTimerStart = true;
    };
    
    this.onPressMove = function(evt){
        if (_bDisableEvents || !_bStartGame || !_bLaunchReady || !_bPressStart) {
            return;
        }
        
        _oPressEndPos = {
            x: evt.stageX,
            y: evt.stageY
        };
    };
    
    this.onReleased = function(){
        if (_bDisableEvents || !_bStartGame || !_bLaunchReady || _bPressMove || !_oBottle || !_oBottle.isReady()) {
            return;
        }
        
        if(_iSwipeTimer > SWIPE_TIMER_MAX) {
            s_oGame.atShortLaunch(TEXT_SLOW_LAUNCH);
            _iSwipeTimer = 0;
            _bSwipeTimerStart = false;            
            return;
        }
        
        _iSwipeTimer = 0;
        _bSwipeTimerStart = false;
        
        if (_oPressStartPos.y < _oPressEndPos.y) {
            s_oGame.atShortLaunch(TEXT_WRONG_LAUNCH);
            return;
        }
        
        _bPressMove = true;
        _bLaunchReady = false;
        s_oGame.checkDistanceForLaunch();
    };
    
    this.checkDistanceForLaunch = function(){
        var iDistance = distanceBetweenTwoPoints(_oPressStartPos.x, _oPressStartPos.y, _oPressEndPos.x, _oPressEndPos.y);        
        // ACCORDING TO THE SWIPE DISTANCE, WE'LL APPLY A VERTICAL IMPULSE TO THE BOTTLE
        if (iDistance > SWIPE_DISTANCE_MINIMUM) {
            if (iDistance <= SWIPE_DISTANCE_LIMIT_MIN){
                iDistance = LAUNCH_DISTANCE_MIN - Math.random()*LAUNCH_WRONG_RANDOMIZER;
            } else if (iDistance > SWIPE_DISTANCE_LIMIT_MIN && iDistance < SWIPE_DISTANCE_LIMIT_MAX){
                iDistance = LAUNCH_DISTANCE_CORRECT + Math.random() * (LAUNCH_CORRECT_MAX_RANDOM-LAUNCH_CORRECT_MIN_RANDOM)+LAUNCH_CORRECT_MIN_RANDOM;
            } else {
                iDistance = LAUNCH_DISTANCE_MAX + Math.random()*LAUNCH_WRONG_RANDOMIZER;
            }
            
            playSound("swish", 1, false);
            _oBottle.addImpulse(iDistance);
        } else {
            this.atShortLaunch(TEXT_SHORT_LAUNCH);
        }
    };
    
    this.startLaunch = function(){
        _bLaunched = true;
        
        if (_bHelpNeeded) {
            this.onFirstLaunch();
        }
    };
    
    this.isLaunched = function(){
        return _bLaunched;
    };
    
    this.isBottleStading = function(){
        // CHECK IF THE BOTTLE HAS DONE AT LEAST ONE LOOP AND FALLEN STANDING
        if (_oBottle.getAngle() < 361 && _oBottle.getAngle() > 359) {
            return true;
        }
        if (_oBottle.getAngle() < 721 && _oBottle.getAngle() > 719) {
            return true;
        }
        
        return false;
    };
    
    this.checkLaunch = function(){
        _bCheckLaunch = true;
        
        // CHECK IF THE BOTTLE HAS FALLEN STANDING OR NOT
        if (this.isBottleStading() === false) {            
            if (_iScore > 0) {      // IF THE PLAYER HAS SCORED AT LEAST ONCE, IT'S GAMEOVER
                this.gameOver();                    
            } else {
                this.tryAgain();    // IF THE PLAYER HAS NOT DONE ANY POINT YET, THERE WILL BE ANOTHER CHANCE                
            }
        } else {
            // Add gold coin confetti effect immediately when bottle lands successfully
            var duration = 2.25 * 1000;
            var animationEnd = Date.now() + duration;
            var defaults = { 
                startVelocity: 30, 
                spread: 360, 
                ticks: 60, 
                zIndex: 9999,
                shapes: ['circle'],
                scalar: 1.5,
                colors: ['#FFD700', '#FFC000', '#FFB000'] // Different shades of gold
            };

            // Center gold burst
            confetti({
                ...defaults,
                particleCount: 50,
                origin: { x: 0.5, y: 0.5 },
                angle: 60,
                spread: 70
            });

            confetti({
                ...defaults,
                particleCount: 50,
                origin: { x: 0.5, y: 0.5 },
                angle: 120,
                spread: 70
            });

            // Additional bursts from sides
            var interval = setInterval(function() {
                var timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                var particleCount = 15;
                
                // Left side burst
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: 0.1, y: 0.5 },
                    angle: 60,
                    spread: 50
                });

                // Right side burst
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: 0.9, y: 0.5 },
                    angle: 120,
                    spread: 50
                });
            }, 250);

            this.onCorrectLaunch();
        }
    };
    
    this.resetBottle = function(){
        _bCheckLaunch = false;
        _bLaunched = false;
        _bPressStart = false;
        _bPressMove = false;        
        _oPressStartPos = {x:0,y:0};
        _oPressEndPos = {x:0,y:0};
    };
    
    this.updatePhysics = function(){
        // KEEP THE SPRITES' POSITION ON THEIR PHYSIC OBJECTS
        _oBottle.update();
        
        s_oPhysicsController.update();
    };    

    this.playCollisionSound = function(){
        // Trigger screen shake on collision with reduced intensity (was 10)
        this.startScreenShake(7.5);  // Reduced by another 25%
        
        switch (s_iBottleType){
            case 1: {   // MILK
                if (soundPlaying("collision_glass") === false) {
                    playSound("collision_glass", 1, false);
                }
                if (soundPlaying("liquid") === false) {
                    playSound("liquid", 1, false);
                }
                break; 
            };
            case 0:     // WATER
            case 3:     // BLUE COKE
            case 4:     // ORANGE JUICE
            case 5:     // RED COKE
            case 6: {   // CHOCOLATE MILK
                if (soundPlaying("collision_plastic") === false) {
                    playSound("collision_plastic", 1, false);
                }
                if (soundPlaying("liquid") === false) {
                    playSound("liquid", 1, false);
                }
                break; 
            };
            case 2:     // BIBERON
            case 7:     // KETCHUP
            case 8:     // MAJONAISE
            case 10: {  // CHOCOLATE BUNNY
                if (soundPlaying("collision_plastic") === false) {
                    playSound("collision_plastic", 1, false);
                }
                break; 
            };
            case 9:      // FIRE ESTINGUISHER
            case 11: {   // LIBERTY STATUE
                if (soundPlaying("collision_metal") === false) {
                    playSound("collision_metal", 1, false);
                }
                break; 
            };
        };
    };

    this.startScreenShake = function(intensity) {
        // Only shake if game is active and not disabled
        if (_bDisableEvents || !_bStartGame) {
            return;
        }
        // Reduce the incoming intensity
        this._shakeIntensity = intensity * 0.375; // Further reduced shake (0.5 * 0.75 = 0.375)
    };
    
    this.updateScreenShake = function() {
        if (this._shakeIntensity > 0.5) {
            this._shakeOffset.x = (Math.random() * 2 - 1) * this._shakeIntensity;
            this._shakeOffset.y = (Math.random() * 2 - 1) * this._shakeIntensity;
            
            // Apply shake to both game and background containers
            _oGameContainer.x = this._shakeOffset.x;
            _oGameContainer.y = this._shakeOffset.y;
            _oBgContainer.x = this._shakeOffset.x;
            _oBgContainer.y = this._shakeOffset.y;
            
            this._shakeIntensity *= this._shakeDecay;
        } else {
            this._shakeIntensity = 0;
            // Reset both containers to original position
            _oGameContainer.x = 0;
            _oGameContainer.y = 0;
            _oBgContainer.x = 0;
            _oBgContainer.y = 0;
        }
    };

    this.update = function () {        
        if (!_bStartGame) {
            return;
        }
        
        // A TIMER TO CHECK IF THE SWIPE IS CORRECT
        if (_bSwipeTimerStart) {
            _iSwipeTimer += s_iTimeElaps;                        
        };
        
        // Update screen shake
        this.updateScreenShake();
        
        for (var i = 0; i < UPDATE_LOOP_VAR; i++) {
            this.updatePhysics();
        };
    };
    
    s_oGame = this;

    _oData = oData;
    
    this._init();
}

var s_oGame = null;