function CStoreBut(iXPos, iYPos, iBottleIndex,oSprite,bActive,oParentContainer) {
    var _bActive;
    var _aCbCompleted;
    var _aCbOwner;
    var _aButton = new Array();
    var _aParams = [];
    
    var _oBottleSprite;
    var _oButton;
    var _oContainer;
    var _oParentContainer;
    
    var _mousedown;
    var _pressup;

    this._init = function (iXPos, iYPos, iBottleIndex, oSprite, bActive) {        
        _aCbCompleted = new Array();
        _aCbOwner = new Array();
        
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);
        
        var oData = {
            images: [oSprite],
            // width, height & registration point of each sprite
            frames: {width: oSprite.width / 2, height: oSprite.height, regX: (oSprite.width / 2) / 2, regY: oSprite.height / 2},
            animations: {state_true: [0], state_false: [1]}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);

        _bActive = bActive;
        _oButton = createSprite(oSpriteSheet, "state_" + _bActive, (oSprite.width / 2) / 2, oSprite.height / 2, oSprite.width / 2, oSprite.height);
        _oButton.mouseEnabled = bActive;
        _oButton.x = iXPos;
        _oButton.y = iYPos;
        _oButton.stop();		
        _oContainer.addChild(_oButton);
        _aButton.push(_oButton);        
        
        var oSpriteImg = s_oSpriteLibrary.getSprite('bottle'+iBottleIndex);
        _oBottleSprite = createBitmap(oSpriteImg);
        _oBottleSprite.regX = oSpriteImg.width * 0.5;
        _oBottleSprite.regY = oSpriteImg.height * 0.5;
        _oBottleSprite.scaleX = _oBottleSprite.scaleY = 0.5;
        _oBottleSprite.x = _oButton.x;
        _oBottleSprite.y = _oButton.y - 8;
        _oContainer.addChild(_oBottleSprite);

        if (!s_bMobile && _bActive){
            _oContainer.cursor = "pointer";
        }

        var szText;
        if (!_bActive) {
            var oSpriteImg = s_oSpriteLibrary.getSprite('coin');
            var oCoin = createBitmap(oSpriteImg);
            oCoin.regX = oSpriteImg.width * 0.5;
            oCoin.regY = oSpriteImg.height * 0.5;
            oCoin.scaleX = oCoin.scaleY = 0.7;
            oCoin.x = _oButton.x - 25;
            oCoin.y = _oButton.y + 95;
            _oContainer.addChild(oCoin);
            
            var oTextBack = new createjs.Text(BOTTLES_PRICES[iBottleIndex], FONT_SIZE_STORE_BUTTON + PRIMARY_FONT, SECONDARY_FONT_COLOUR);
            oTextBack.textAlign = "center";
            oTextBack.x = _oButton.x + 20;
            oTextBack.y = _oButton.y + 80;
            oTextBack.outline = 5;
            _oContainer.addChild(oTextBack);
            
            var oText = new createjs.Text(BOTTLES_PRICES[iBottleIndex], FONT_SIZE_STORE_BUTTON + PRIMARY_FONT, PRIMARY_FONT_COLOUR);
            oText.textAlign = "center";
            oText.x = _oButton.x + 20;
            oText.y = _oButton.y + 80;
            _oContainer.addChild(oText);
        } else {
            
        };
        
        this._initListener();
    };

    this.unload = function () {
        _oContainer.off("mousedown", _mousedown);
        _oContainer.off("pressup", _pressup);
        _oContainer.removeChild(_oButton);
    };

    this._initListener = function () {
        _mousedown = _oContainer.on("mousedown", this.buttonDown);
        _pressup = _oContainer.on("pressup", this.buttonRelease);
    };

    this.viewBut = function (oButton) {
        _oContainer.addChild(oButton);
    };

    this.addEventListener = function (iEvent, cbCompleted, cbOwner) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };

    this.addEventListenerWithParams = function (iEvent, cbCompleted, cbOwner, aParams) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams = aParams;
    };

    this.ifClickable = function () {
        if (_oContainer.mouseEnabled === true) {
            return 1;
        }
        return 0;
    };

    this.setActive = function (iLevel, bActive) {
        _bActive = bActive;
        _aButton[iLevel].gotoAndStop("state_" + _bActive);
        _aButton[iLevel].mouseEnabled = true;
    };

    this.buttonRelease = function () {
        if(!_bActive){
            s_oStore.checkBottlePrice(iBottleIndex);
            return;
        } else {
            playSound("click", 1, 0);

            if (_aCbCompleted[ON_MOUSE_UP]) {
                _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP], _aParams);
            }
        };
    };

    this.buttonDown = function () {
        if (_bActive) {
            _oButton.scaleX = _oButton.scaleY = 0.9;
            _oBottleSprite.scaleX = _oBottleSprite.scaleY = 0.4;
        }
        if (_aCbCompleted[ON_MOUSE_DOWN]) {
            _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN], _aParams);                                
        }
    };
    
    this.setPosition = function (iXPos, iYPos) {
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
    };

    this.setVisible = function (bVisible) {
        _oContainer.visible = bVisible;
    };
    
    _oParentContainer = oParentContainer;
    this._init(iXPos, iYPos, iBottleIndex,oSprite, bActive,oParentContainer);
}