function CTextButton(iXPos, iYPos, oSprite, szText, szFont, szColor, iFontSize, oContainer) {
    var _aParams;
    var _aCbCompleted;
    var _aCbOwner;
    var _oButton;
    var _oText;
    var _oContainer;
    
    var _oListenerMouseDown;
    var _oListenerPressUp;
    
    this._init = function (iXPos, iYPos, oSprite, szText, szFont, szColor, iFontSize) {
        _aParams = new Array();
        _aCbCompleted = new Array();
        _aCbOwner = new Array();

        var oButtonBg = createBitmap(oSprite);
        
        _oText = new createjs.Text(szText,  iFontSize + "px " + szFont, szColor);
        _oText.textAlign = "center";
        _oText.textBaseline = "middle";
        var oBounds = _oText.getBounds();
        _oText.x = oSprite.width / 2;
        _oText.y = Math.floor((oSprite.height) / 2);

        _oButton = new createjs.Container();
        _oButton.x = iXPos;
        _oButton.y = iYPos;
        _oButton.regX = oSprite.width / 2;
        _oButton.regY = oSprite.height / 2;
        _oButton.addChild(oButtonBg, _oText);

        _oContainer.addChild(_oButton);

        if (!s_bMobile)
            _oButton.cursor = "pointer";

        this._initListener();
    };

    this.unload = function () {
        _oButton.off("mousedown");
        _oButton.off("pressup");

        _oContainer.removeChild(_oButton);
    };

    this.setVisible = function (bVisible) {
        _oButton.visible = bVisible;
    };

    this._initListener = function () {
        _oListenerMouseDown = _oButton.on("mousedown", this.buttonDown);
        _oListenerPressUp = _oButton.on("pressup", this.buttonRelease);
    };

    this.addEventListener = function (iEvent, cbCompleted, cbOwner) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };

    this.buttonRelease = function () {
        _oButton.scaleX = 1;
        _oButton.scaleY = 1;
        
        playSound("click", 1, false);
        
        if (_aCbCompleted[ON_MOUSE_UP]) {
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP], _aParams[ON_MOUSE_UP]);
        }
    };

    this.buttonDown = function () {
        _oButton.scaleX = 0.9;
        _oButton.scaleY = 0.9;

        if (_aCbCompleted[ON_MOUSE_DOWN]) {
            _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN], _aParams[ON_MOUSE_DOWN]);
        }
    };

    this.addEventListenerWithParams = function (iEvent, cbCompleted, cbOwner, aParams) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams[iEvent] = aParams;
    };

    this.setTextPosition = function (iY) {
        _oText.y = iY;
    };

    this.setPosition = function (iXPos, iYPos) {
        _oButton.x = iXPos;
        _oButton.y = iYPos;
    };

    this.setX = function (iXPos) {
        _oButton.x = iXPos;
    };

    this.setY = function (iYPos) {
        _oButton.y = iYPos;
    };

    this.getButtonImage = function () {
        return _oButton;
    };

    this.getX = function () {
        return _oButton.x;
    };

    this.getY = function () {
        return _oButton.y;
    };

    _oContainer = oContainer;
    
    this._init(iXPos, iYPos, oSprite, szText, szFont, szColor, iFontSize);

    return this;

}
