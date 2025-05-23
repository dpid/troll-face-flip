function CInterface(oParentContainer) {
    var _oContainer;
    var _oAudioToggle;
    var _iBottomLinePos;
    
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosFullscreen;
    
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oButExit;   
    var _oBestScoreText;
    var _oBestScoreTextBack;
    var _oScoreText;
    var _oScoreTextBack;
    var _oCreditsIcon;
    var _oCreditsTextBack;
    var _oCreditsText;
    var _oAreYouSurePanel;
    var _oParentContainer;

    this._init = function () {
        _oParentContainer = oParentContainer;
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);
        
        var oSpriteExit = s_oSpriteLibrary.getSprite('but_exit');        
        _pStartPosExit = {x: CANVAS_WIDTH - oSpriteExit.width/2 - 20, y: (oSpriteExit.height / 2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSpriteExit,_oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            
            _pStartPosAudio = {x: _pStartPosExit.x - oSpriteExit.width/2 - oSprite.width/4 - 10, y: _pStartPosExit.y};
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive,_oContainer);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            _pStartPosFullscreen = {x: _pStartPosAudio.x - oSpriteExit.width/2 - oSprite.width/4 - 10,y:(oSprite.height / 2) + 10};
        }else{
            _pStartPosFullscreen = {x: _pStartPosExit.x - oSpriteExit.width - 10, y: _pStartPosExit.y};
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

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,_oContainer);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };
    
    this.getCreditsIconPos = function(){
        var oPos = {x: _oCreditsIcon.x, y: _oCreditsIcon.y};
        return oPos;
    };
    
    this.pulseCreditsIcon = function(){
        var iScaleVar = 1.2;
        createjs.Tween.get(_oCreditsIcon)
            .to({scaleX: iScaleVar, scaleY: iScaleVar}, 300, createjs.Ease.quadOut)
            .to({scaleX: 1, scaleY: 1}, 300, createjs.Ease.quadIn)
            .call(function () {
                createjs.Tween.removeTweens(_oCreditsIcon);
            });
    };
    
    this.initInterfaceTexts = function(){
        var oSprite = s_oSpriteLibrary.getSprite('coin');
        _oCreditsIcon = createBitmap(oSprite);
        _oCreditsIcon.regX = oSprite.width * 0.5;
        _oCreditsIcon.regY = oSprite.height * 0.5;
        _oCreditsIcon.x = 75;
        _oCreditsIcon.y = _oButExit.getY() - 10;
        _oContainer.addChild(_oCreditsIcon);
        
        var iX = _oCreditsIcon.x + 40;
        var iY = _oButExit.getY() - 5;
        var iWidth = 200;
        var iHeight = 70;
        
		_oCreditsTextBack = new CTLText(_oContainer, 
            iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
            36, "left", SECONDARY_FONT_COLOUR, PRIMARY_FONT, 1,
            2, 2,
            String(s_iTotalCredits),
            true, true, true,
            false );
        _oCreditsTextBack.setOutline(5);    
      
        _oCreditsText = new CTLText(_oContainer, 
            iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
            36, "left", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
            2, 2,
            String(s_iTotalCredits),
            true, true, true,
            false );
        
        _iBottomLinePos = CANVAS_HEIGHT - 250;
        
        var iX = 60;
        var iY = _iBottomLinePos;
        var iWidth = 300;
        var iHeight = 70;
        
        _oScoreTextBack = new CTLText(_oContainer, 
            iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
            36, "left", SECONDARY_FONT_COLOUR, PRIMARY_FONT, 1,
            2, 2,
            TEXT_SCORE_GAME + 0,
            true, true, true,
            false );
        _oScoreTextBack.setOutline(5);    
        
        _oScoreText = new CTLText(_oContainer, 
            iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
            36, "left", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
            2, 2,
            TEXT_SCORE_GAME + 0,
            true, true, true,
            false );
        
        var iX = CANVAS_WIDTH - 60;
        var iY = _iBottomLinePos;
        var iWidth = 300;
        var iHeight = 70;
        
        _oBestScoreTextBack = new CTLText(_oContainer, 
            iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
            36, "right", SECONDARY_FONT_COLOUR, PRIMARY_FONT, 1,
            2, 2,
            TEXT_BEST_GAME + s_iBestScore,
            true, true, true,
            false );
        _oBestScoreTextBack.setOutline(5); 
        
        _oBestScoreText = new CTLText(_oContainer, 
            iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
            36, "right", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
            2, 2,
            TEXT_BEST_GAME + s_iBestScore,
            true, true, true,
            false );
        
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };
    
    this.refreshButtonPos = function (iNewX, iNewY) {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y + iNewY);
        };
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX,_pStartPosFullscreen.y + iNewY);
        };
        
        _oButExit.setPosition(_pStartPosExit.x - iNewX, _pStartPosExit.y + iNewY);
        
        // REFRESH BOTTOM TEXTS POSITION
        _iBottomLinePos = CANVAS_HEIGHT - iNewY - 50;
        
        if (_oCreditsText !== undefined) {
            _oCreditsIcon.x = 75 + iNewX;
            _oCreditsIcon.y = _oButExit.getY() - 10;
            
            _oCreditsTextBack.setX(_oCreditsIcon.x + 40);
            _oCreditsTextBack.setY(_oButExit.getY() - 5);
            
            _oCreditsText.setX(_oCreditsTextBack.getX());
            _oCreditsText.setY(_oCreditsTextBack.getY());
        }
        if (_oScoreText !== undefined) {
            _oScoreTextBack.setX(60 + iNewX);
            _oScoreTextBack.setY(_iBottomLinePos);
            
            _oScoreText.setX(_oScoreTextBack.getX());
            _oScoreText.setY(_oScoreTextBack.getY());
        }
        if (_oBestScoreText !== undefined) {
            _oBestScoreTextBack.setX(CANVAS_WIDTH - 60 - iNewX);
            _oBestScoreTextBack.setY(_iBottomLinePos);
            
            _oBestScoreText.setX(_oBestScoreTextBack.getX());
            _oBestScoreText.setY(_oBestScoreTextBack.getY());
        }
    };
    
    this.refreshScoreText = function (iValue) {   
        var szScore = TEXT_SCORE_GAME + iValue;
        _oScoreTextBack.refreshText(szScore);
        _oScoreText.refreshText(szScore);
        _oScoreTextBack.setY(_iBottomLinePos);
        _oScoreText.setY(_oScoreTextBack.getY());
    };
    
    this.refreshCreditsText = function (iValue) {        
        var szCredits = iValue;
        _oCreditsTextBack.refreshText(szCredits);
        _oCreditsText.refreshText(szCredits);
        _oCreditsTextBack.setY(_oButExit.getY() - 5);
        _oCreditsText.setY(_oButExit.getY() - 5);
    };
    
    this.refreshBestScoreText = function () {
        var szBestScore = TEXT_BEST_GAME + s_iBestScore;
        _oBestScoreText.refreshText(szBestScore);
        _oBestScoreTextBack.refreshText(szBestScore);
        
        _oBestScoreTextBack.setY(_iBottomLinePos);
        _oBestScoreText.setY(_oBestScoreTextBack.getY());
    };

    this.unload = function () {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        
        _oButExit.unload();
        s_oInterface = null;
        s_oGame._bDisableEvents = false;
        s_oGame.setStartGame(true);
    };
    
    this._onExit = function () {
        _oAreYouSurePanel = new CAreYouSurePanel(_oContainer);
        s_oGame._bDisableEvents = true;
        s_oGame.setStartGame(false);
    };
    
    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this._onFullscreenRelease = function(){
	if(s_bFullscreen) { 
            _fCancelFullScreen.call(window.document);
	}else{
            _fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };

    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setActive(s_bFullscreen);
	}
    };
    
    s_oInterface = this;

    this._init();

    return this;
}

var s_oInterface = null;