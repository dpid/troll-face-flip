function CStore() {
    var _iCredits;
    var _iCurPage;
    var _iHeightToggle;
    var _aBottleButs;
    var _aPointsX;
    var _aContainerPage;
    var _pStartPosCreditsText;
    var _pStartPosSelect;
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    
    var _oButExit;
    var _oAudioToggle;
    var _oArrowRight = null;
    var _oArrowLeft = null;
    var _oTextSelectBottleBack;
    var _oTextSelectBottle;
    var _oTextCreditsBack;
    var _oTextCredits;
    var _oCreditsIcon;
    var _oContainer;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    this._init = function(){
        _iCredits = s_iTotalCredits;
        
        var shape = new createjs.Shape();
        shape.graphics.beginFill("#000000").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        shape.alpha = 0.7;
        
        _iCurPage = 0;
        
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_store'));
	_oContainer.addChild(oBg);
        _oContainer.addChild(shape);
        
        _pStartPosSelect = {x:CANVAS_WIDTH_HALF, y: CANVAS_HEIGHT_HALF - 470};
        
        var iX = _pStartPosSelect.x;
        var iY = _pStartPosSelect.y;
        var iWidth = 450;
        var iHeight = 100;
        
        _oTextSelectBottleBack = new CTLText(s_oStage, 
            iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
            60, "center", SECONDARY_FONT_COLOUR, PRIMARY_FONT, 1,
            2, 2,
            TEXT_STORE,
            true, true, true,
            false );
        _oTextSelectBottleBack.setOutline(5);
        
        _oTextSelectBottle = new CTLText(s_oStage, 
            iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
            60, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
            2, 2,
            TEXT_STORE,
            true, true, true,
            false );

        var oSpriteExit = s_oSpriteLibrary.getSprite('but_exit');
	_iHeightToggle = oSpriteExit.height;
        
        _pStartPosExit = {x: CANVAS_WIDTH - oSpriteExit.width/2 - 20, y: (oSpriteExit.height / 2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSpriteExit,_oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        _pStartPosCreditsText = {x: 50, y: _pStartPosExit.y + 95};
        var oSprite = s_oSpriteLibrary.getSprite('coin');
        _oCreditsIcon = createBitmap(oSprite);
        _oCreditsIcon.regX = oSprite.width * 0.5;
        _oCreditsIcon.regY = oSprite.height * 0.5;
        _oCreditsIcon.x = _pStartPosCreditsText.x ;
        _oCreditsIcon.y = _pStartPosCreditsText.y;
        _oContainer.addChild(_oCreditsIcon);

        
        var iX = _pStartPosCreditsText.x + 140;
        var iY = _pStartPosCreditsText.y + 5;
        var iWidth = 200;
        var iHeight = 70;
        
        _oTextCreditsBack = new CTLText(_oContainer, 
            iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
            60, "left", SECONDARY_FONT_COLOUR, PRIMARY_FONT, 1,
            2, 2,
            String(_iCredits),
            true, true, true,
            false );
        _oTextCreditsBack.setOutline(5);    
        
        _oTextCredits = new CTLText(_oContainer, 
            iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
            60, "left", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
            2, 2,
            String(_iCredits),
            true, true, true,
            false );


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

        this._checkBoundLimits();

        //FIND X COORDINATES FOR LEVEL BUTS
        _aPointsX = new Array();
        var iWidth = CANVAS_WIDTH - (EDGEBOARD_X*2) ;
        var iOffsetX = Math.floor(iWidth/NUM_COLS_PAGE_STORE)/2-30;
        var iXPos = 0;
        for(var i=0;i<NUM_COLS_PAGE_STORE;i++){
            _aPointsX.push(iXPos);
            iXPos += iOffsetX*2;
        }

        _aContainerPage = new Array();
        this._createNewBottlePage(0, BOTTLES_NUMBER);

        if(_aContainerPage.length > 1){
            //MULTIPLE PAGES
            for(var k=1;k<_aContainerPage.length;k++){
                _aContainerPage[k].visible = false;
            }

            _oArrowRight = new CGfxButton(CANVAS_WIDTH_HALF + 450,CANVAS_HEIGHT_HALF, s_oSpriteLibrary.getSprite('arrow_select_level'),s_oStage);
            _oArrowRight.getButtonImage().rotation = 90;
            _oArrowRight.addEventListener(ON_MOUSE_UP, this._onRight, this);
            
            _oArrowLeft = new CGfxButton(CANVAS_WIDTH_HALF - 450, CANVAS_HEIGHT_HALF, s_oSpriteLibrary.getSprite('arrow_select_level'),s_oStage);
            _oArrowLeft.getButtonImage().rotation = -90;
            _oArrowLeft.addEventListener(ON_MOUSE_UP, this._onLeft, this);
        }

        var oFade = new createjs.Shape();
        oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        s_oStage.addChild(oFade);

        createjs.Tween.get(oFade).to({alpha: 0}, 1000).call(function () {
            oFade.visible = false;
        });
    };
    
    this.checkBottlePrice = function(iBottleIndex){
        if (s_iTotalCredits < BOTTLES_PRICES[iBottleIndex]) {
            this.onNotEnoughCredits();
        } else {
            this.onPurchase(iBottleIndex);            
        }        
    };
    
    this.onNotEnoughCredits = function(){
        if (soundPlaying("no_funds") === false) {
            playSound("no_funds", 1, 0);
        }
    };
    
    this.onPurchase = function(iBottleIndex){
        playSound("purchase", 1, 0);
        
        _iCredits -= BOTTLES_PRICES[iBottleIndex];
        _oTextCredits.refreshText(String(_iCredits));
        _oTextCreditsBack.refreshText(String(_iCredits));
        s_iTotalCredits = _iCredits;
        saveItem("flipthebottle_total_credits", s_iTotalCredits);        

        this._onButBottleRelease(iBottleIndex);
    };
    
    this.unload = function(){
        for(var i=0;i<_aBottleButs.length;i++){
            _aBottleButs[i].unload();
        }  
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        
        _oButExit.unload();
        
        if(_oArrowLeft !== null){
            _oArrowLeft.unload();
            _oArrowRight.unload();
        }
        
        s_oStage.removeAllChildren();
        s_oStore = null;
    };
    
    this.refreshButtonPos = function(iNewX, iNewY){
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y + iNewY);
        };
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX,_pStartPosFullscreen.y + iNewY);
        };
        
        _oButExit.setPosition(_pStartPosExit.x - iNewX, _pStartPosExit.y + iNewY);        
        if (_oTextCredits !== undefined) { 
            _oCreditsIcon.x = _pStartPosCreditsText.x - 10 + iNewX;
            _oCreditsIcon.y = _oButExit.getY() - 10;
            
            _oTextCreditsBack.setX(_oCreditsIcon.x + 50);
            _oTextCreditsBack.setY(_oButExit.getY() - 5);
            
            _oTextCredits.setX(_oTextCreditsBack.getX());
            _oTextCredits.setY(_oTextCreditsBack.getY());
        };
    };
    
    this._checkBoundLimits = function(){
        var oSprite = s_oSpriteLibrary.getSprite('but_store');
        var iY = 0;
        
        var iHeightBound = CANVAS_HEIGHT - (EDGEBOARD_Y*2) - (_iHeightToggle * 2);
        var iNumRows = 0;

        while(iY < iHeightBound){
            iY += oSprite.height + 20;
            iNumRows++;
        }
        if (NUM_ROWS_PAGE_STORE > iNumRows){
            NUM_ROWS_PAGE_STORE = iNumRows;
        }

        var iNumCols = 0;
        var iX = 0;
        var iWidthBounds = CANVAS_WIDTH - (EDGEBOARD_X*2);
        var oSprite = s_oSpriteLibrary.getSprite('but_store');

        while(iX < iWidthBounds){
            iX += (oSprite.width/2) + 5;
            iNumCols++;  
        }
        if(NUM_COLS_PAGE_STORE > iNumCols){
            NUM_COLS_PAGE_STORE = iNumCols;
        }
    };
    
    this._createNewBottlePage = function(iStartBottle,iEndBottle){
        var oContainerBottleBut = new createjs.Container();
        _oContainer.addChild(oContainerBottleBut);
        _aContainerPage.push(oContainerBottleBut);
        
        _aBottleButs = new Array();
        var iCont = 0;
        var iY = 0;
        var iNumRow = 1;
        var bNewPage = false;
        var oSprite = s_oSpriteLibrary.getSprite('but_store');
        for(var i=iStartBottle;i<iEndBottle;i++){
            var bActive;
            if (ALL_BOTTLES_UNLOCKED === true) {
                bActive = true;
            } else {
                bActive = s_aBottlesUnlocked[i];
            };
            var oBut = new CStoreBut(_aPointsX[iCont] + oSprite.width/4, iY + oSprite.height/2+30, i, oSprite, bActive,oContainerBottleBut);
            oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onButBottleRelease, this,i);            
            _aBottleButs.push(oBut);
            
            iCont++;
            if(iCont === _aPointsX.length && i<iEndBottle-1){
                iCont = 0;
                iY += oSprite.height + 50;
                iNumRow++;
                if(iNumRow > NUM_ROWS_PAGE_STORE){
                    bNewPage = true;
                    break;
                }
            }
        }
        oContainerBottleBut.x = CANVAS_WIDTH_HALF ;
        oContainerBottleBut.y = CANVAS_HEIGHT_HALF;
        oContainerBottleBut.regX = oContainerBottleBut.getBounds().width/2;
        oContainerBottleBut.regY = oContainerBottleBut.getBounds().height/2;
        if(bNewPage){
            this._createNewBottlePage(i+1,iEndBottle);
        }                
    };
    
    this._onRight = function(){
        _aContainerPage[_iCurPage].visible = false;
        
        _iCurPage++;
        if(_iCurPage >=  _aContainerPage.length){
            _iCurPage = 0;
        }
        
        _aContainerPage[_iCurPage].visible = true;
    };
    
    this._onLeft = function(){
        _aContainerPage[_iCurPage].visible = false;
        
        _iCurPage--;
        if(_iCurPage <  0){
            _iCurPage =_aContainerPage.length-1;
        }
        
        _aContainerPage[_iCurPage].visible = true;
    };
    
    this._onButBottleRelease = function(iBottle){        
        _aBottleButs[iBottle].setActive(0, true);
        
        s_aBottlesUnlocked[iBottle] = true;
        setItemJson("flipthebottle_bottles_unlocked", s_aBottlesUnlocked);
        
        s_iBottleType = iBottle;        
        
        this.unload();
        s_oMain.gotoGame();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
	s_bAudioActive = !s_bAudioActive;
    };
    
    this.setAudio = function(bActive){
        _oAudioToggle.setActive(bActive);
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
	};
    };
    
    this._onExit = function(){
        this.unload();
        s_oMain.gotoMenu();
    };

    s_oStore = this;
    this._init();
}

var s_oStore = null;