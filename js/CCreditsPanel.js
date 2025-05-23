function CCreditsPanel(){
    var _oBg;
    var _oButLogo;
    var _oButExit;
    var _oFade;    
    var _oHitArea;    
    var _oCreditsContainer;
    var _oContainer;
    var _oListener;
    
    var _pStartPosExit;
    var _pStartPosYContainer;

    this._init = function(){
        var oSpriteMsgBox = s_oSpriteLibrary.getSprite('msg_box');
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0;
        s_oStage.addChild(_oFade);
        
        _oCreditsContainer = new createjs.Container();
        s_oStage.addChild(_oCreditsContainer);
       
        createjs.Tween.get(_oFade).to({alpha:0.7},500);
        
        _pStartPosYContainer = CANVAS_HEIGHT + oSpriteMsgBox.height/2; 
        
        _oContainer = new createjs.Container();
        _oContainer.y = _pStartPosYContainer; 
        _oCreditsContainer.addChild(_oContainer);
        
        _oBg = createBitmap(oSpriteMsgBox);
        _oBg.regX = oSpriteMsgBox.width/2;
        _oBg.regY = oSpriteMsgBox.height/2;
        _oBg.x = CANVAS_WIDTH_HALF;
        _oBg.y = CANVAS_HEIGHT_HALF;
        _oContainer.addChild(_oBg);
        
        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("#0f0f0f").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oHitArea.alpha = 0.01;
        _oListener = _oHitArea.on("click", this._onLogoButRelease);
        _oContainer.addChild(_oHitArea);
                
        if (!s_bMobile) {
            _oHitArea.cursor = "pointer";
        };
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: 715, y: 572};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, _oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);
        
        var iX = CANVAS_WIDTH_HALF;
        var iY = CANVAS_HEIGHT_HALF - 90;
        var iWidth = 450;
        var iHeight = 100;
        
        new CTLText(_oContainer, 
            iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
            36, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
            2, 2,
            TEXT_CREDITS_DEVELOPED,
            true, true, true,
            false );
        
        oSprite = s_oSpriteLibrary.getSprite('logo_ctl');
        _oButLogo = createBitmap(oSprite);
        _oButLogo.regX = oSprite.width/2;
        _oButLogo.regY = oSprite.height/2;
        _oButLogo.x = CANVAS_WIDTH_HALF;
        _oButLogo.y = CANVAS_HEIGHT_HALF;
        _oContainer.addChild(_oButLogo);
        
        var iX = CANVAS_WIDTH_HALF;
        var iY = CANVAS_HEIGHT_HALF + 90;
        var iWidth = 450;
        var iHeight = 100;
        
        new CTLText(_oContainer, 
            iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
            36, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
            2, 2,
            "www.codethislab.com",
            true, true, true,
            false );
            
	createjs.Tween.get(_oContainer).to({y:0},1000, createjs.Ease.backOut);	
    };
    
    this.unload = function(){
        createjs.Tween.get(_oFade).to({alpha:0},500);
        _oHitArea.off("click", _oListener);   
        createjs.Tween.get(_oCreditsContainer).to({y:_pStartPosYContainer},400, createjs.Ease.backIn).call(function(){
            _oButExit.unload(); 
            _oButExit = null;

            s_oStage.removeChild(_oCreditsContainer);
            s_oMenu.exitFromCredits();
        });    
    };
    
    this._onLogoButRelease = function(){
        window.open("https://www.codethislab.com/","_blank");
    };
    
    this._init();  
};