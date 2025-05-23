function CFloor(oFloorPhysic, oParentContainer) {
    var _iMultiplier;
    
    var _oFloorPhysic;
    var _oParentContainer;
    
    var _bActive;
    
    this._init = function(){
        _bActive = true;
        _iMultiplier = 1;
        
        var oSprite = s_oSpriteLibrary.getSprite('floor');
        var oFloor = createBitmap(oSprite);
        oFloor.regX = oSprite.width * 0.5;
        oFloor.regY = oSprite.height * 0.5;
        oFloor.x = CANVAS_WIDTH_HALF;
        oFloor.y = FLOOR_Y_START - 15;
        oParentContainer.addChild(oFloor);
    };
    
    this.setActive = function(bValue) {
        _bActive = bValue;
    };    
    
    this.unload = function () {
        _oFloorPhysic.SetActive(false);
    };
    
    this.getBody = function(){
        return _oFloorPhysic;
    };
    
    this.update = function(){

    };
    
    _oParentContainer = oParentContainer;
    _oFloorPhysic = oFloorPhysic;

    this._init();
};