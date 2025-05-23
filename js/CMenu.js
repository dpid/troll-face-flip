function CMenu() {
    var _oMenuContainer;
    var _oGameLogo;
    var _oButPlay;
    var _oFade;
    var _oAudioToggle;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _oBestScoreText;
    var _oBestScoreTextBack;
    
    this._init = function () {
        //localStorage.clear();            // TO DELETE EVERYTHING SAVED IN LOCALSTORAGE
        
        _oMenuContainer = new createjs.Container();
        s_oStage.addChild(_oMenuContainer);
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        _oMenuContainer.addChild(oBg);
        
        s_bFirstTimePlaying = true;
        
        var oGameLogo = s_oSpriteLibrary.getSprite('logo_menu');
        _oGameLogo = createBitmap(oGameLogo);
        _oGameLogo.regX = oGameLogo.width/2;
        _oGameLogo.regY = oGameLogo.height/2;
        _oGameLogo.x = CANVAS_WIDTH / 2;
        _oGameLogo.y = -150;
        createjs.Tween.get(_oGameLogo, {loop: false}).to({y: CANVAS_HEIGHT_HALF - 180}, 1000, createjs.Ease.cubicOut);
        _oMenuContainer.addChild(_oGameLogo);
        
        var iX = CANVAS_WIDTH_HALF;
        var iY = CANVAS_HEIGHT_HALF + 180;
        var iWidth = 450;
        var iHeight = 100;
        
        _oBestScoreTextBack = new CTLText(_oMenuContainer, 
            iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
            36, "center", SECONDARY_FONT_COLOUR, PRIMARY_FONT, 1,
            2, 2,
            TEXT_BEST_SCORE + 0,
            true, true, true,
            false );
        _oBestScoreTextBack.setOutline(5);
        _oBestScoreTextBack.setVisible(false);

        _oBestScoreText = new CTLText(_oMenuContainer, 
            iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
            36, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
            2, 2,
            TEXT_BEST_SCORE + 0,
            true, true, true,
            false );
   
        _oBestScoreText.setVisible(false);

        var oSpritePlay = s_oSpriteLibrary.getSprite('but_play');
        _oButPlay = new CGfxButton(CANVAS_WIDTH_HALF, CANVAS_HEIGHT + 200, oSpritePlay, _oMenuContainer);
        createjs.Tween.get(_oButPlay.getSprite(), {loop: false}).to({y: CANVAS_HEIGHT_HALF + 350}, 1000, createjs.Ease.cubicOut);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - oSprite.width/4 -20, y: (oSprite.height / 2) + 10};
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive,_oMenuContainer);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x:_pStartPosCredits.x + oSprite.width/2 + 10,y:_pStartPosCredits.y};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,_oMenuContainer);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oMenuContainer.addChild(_oFade);

        createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function () {
            _oMenuContainer.removeChild(_oFade);
        });
        
        if(!s_bStorageAvailable){
            new CMsgBox(TEXT_ERR_LS,_oMenuContainer);
        }else{
            var iTotalScore = getItem("flipthebottle_total_score");
            if (iTotalScore !== null && iTotalScore !== undefined) {
                s_iTotalScore = Number(iTotalScore);
            } else {
                s_iTotalScore = 0;
            };
            
            s_iBestScore = 0;
            _oBestScoreTextBack.setVisible(false);
            _oBestScoreText.setVisible(false); 
            var iBestScore = getItem("flipthebottle_best_score");
            if (iBestScore !== null && iBestScore !== undefined) {
                s_iBestScore = Number(iBestScore);
                _oBestScoreTextBack.setVisible(true);
                _oBestScoreText.setVisible(true); 
            };
            _oBestScoreTextBack.refreshText(TEXT_BEST_SCORE + s_iBestScore);
            _oBestScoreText.refreshText(TEXT_BEST_SCORE + s_iBestScore);
            
            s_iTotalCredits = STARTING_CREDITS;
            var iTotalCredits = getItem("flipthebottle_total_credits");
            if (iTotalCredits !== null & iTotalCredits !== undefined){
                s_iTotalCredits = Number(iTotalCredits);
            }
            
            var aBottlesUnlocked = getItemJson("flipthebottle_bottles_unlocked");
            if (aBottlesUnlocked !== null){
                s_aBottlesUnlocked = aBottlesUnlocked;
            } else {
                for (var i = 0; i < BOTTLES_NUMBER; i++) {
                    s_aBottlesUnlocked.push(false);
                }
                s_aBottlesUnlocked[0] = true;
            };
        }
        
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this.unload = function () {
        _oButPlay.unload();
        _oButPlay = null;
        
        _oMenuContainer.removeAllChildren();

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        s_oMenu = null;
    };

    this.refreshButtonPos = function (iNewX, iNewY) {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y + iNewY);
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX,_pStartPosFullscreen.y + iNewY);
        }
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setActive(s_bFullscreen);
	}
    };
    
    this.exitFromCredits = function(){
        _oCreditsPanel = null;
    };

    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onCredits = function(){
        _oCreditsPanel = new CCreditsPanel();
    };

    this._onButPlayRelease = function () {
        this.unload();
        s_oMain.gotoStore();
    };
    
    this._onFullscreenRelease = function(){
	if(s_bFullscreen) { 
            _fCancelFullScreen.call(window.document);
	}else{
            _fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
    
    this.update = function () {
        
    };
    
    s_oMenu = this;

    this._init();
}

var s_oMenu = null;