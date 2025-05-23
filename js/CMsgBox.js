function CMsgBox(szText,oParentContainer){
    var _oMsg;
    var _oButOk;
    var _oContainer;
    var _oParentContainer;
    var _oFade;

    this._init = function (szText) {
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.5;

        _oFade.on("click", function () {});

        _oContainer.addChild(_oFade);

        var oSpriteBg = s_oSpriteLibrary.getSprite('msg_box_big');
        var oBg = createBitmap(oSpriteBg);

        oBg.x = CANVAS_WIDTH * 0.5;
        oBg.y = CANVAS_HEIGHT * 0.5;
        oBg.regX = oSpriteBg.width * 0.5;
        oBg.regY = oSpriteBg.height * 0.5;
        _oContainer.addChild(oBg);
        
        var iX = CANVAS_WIDTH_HALF;
        var iY = CANVAS_HEIGHT_HALF - 100;
        var iWidth = 520;
        var iHeight = 250;
        
        _oMsg = new CTLText(_oContainer, 
            iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
            50, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1.1,
            2, 2,
            TEXT_ERR_LS,
            true, true, true,
            false );    
            
        _oButOk = new CGfxButton(CANVAS_WIDTH / 2, 820, s_oSpriteLibrary.getSprite('but_yes'), _oContainer);
        _oButOk.addEventListener(ON_MOUSE_UP, this._onButOk, this);
    };

    this._onButOk = function () {
        this.unload();
    };

    this.unload = function () {
        _oButOk.unload();
        _oParentContainer.removeChild(_oContainer);
        _oFade.removeEventListeners();
    };
    
    _oParentContainer = oParentContainer;

    this._init(szText);
}