function CBottle(oBottlePhysic, oParentContainer) {
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    
    var _oBottleSprite;
    var _oBottlePhysic;
    var _oParentContainer;

    var _bReady;
    var _bLaunched;
    var _bActive;
    var _bRotation;
    
    this._init = function(){
        _bLaunched = false;
        this.resetVariables();
        
        var oSprite = s_oSpriteLibrary.getSprite('bottle'+s_iBottleType);
        _oBottleSprite = createBitmap(oSprite);
        _oBottleSprite.regX = oSprite.width * 0.5;
        _oBottleSprite.regY = oSprite.height * 0.5;
        _oBottleSprite.x = BOTTLE_X_START;
        _oBottleSprite.y = BOTTLE_Y_START;
        
        // Make bottle interactive
        _oBottleSprite.cursor = "pointer";
        
        var oParent = this;
        if(s_bMobile){
            _oBottleSprite.on("touchstart", function(evt){ 
                if(!_bReady) return;
                evt.preventDefault();
                s_oGame.onPressed(evt);
            });
            _oBottleSprite.on("touchmove", function(evt){
                if(!_bReady) return;
                evt.preventDefault(); 
                s_oGame.onPressMove(evt);
            });
            _oBottleSprite.on("touchend", function(evt){
                if(!_bReady) return;
                evt.preventDefault();
                s_oGame.onReleased();
            });
        } else {
            _oBottleSprite.on("mousedown", function(evt){ 
                if(!_bReady) return;
                evt.preventDefault();
                s_oGame.onPressed(evt);
            });
            _oBottleSprite.on("pressmove", function(evt){
                if(!_bReady) return;
                evt.preventDefault();
                s_oGame.onPressMove(evt);
            });
            _oBottleSprite.on("pressup", function(evt){
                if(!_bReady) return;
                evt.preventDefault();
                s_oGame.onReleased();
            });
        }
        
        oParentContainer.addChild(_oBottleSprite);
    };
    
    this.resetVariables = function(){
        _bActive = true;
        _bRotation = false;
        _bReady = true;        
    };
    
    this.isReady = function(){
        return _bReady;
    };
    
    this.addImpulse = function(iDistance) {
        if (_bLaunched) {
            return;
        }
        _bReady = false;
        _bLaunched = true;
        var vImpulse = new b2Vec2(0, iDistance*LAUNCH_DISTANCE_VAR);
        _oBottlePhysic.ApplyImpulse(vImpulse, _oBottlePhysic.GetWorldCenter(), true);                
        _bRotation = true;
        s_oGame.startLaunch();
    };
        
    this.getAngle = function(){
        var iAngle = _oBottlePhysic.GetAngle()/Math.PI*180.0;
        return iAngle;
    };
    
    this.unload = function () {
        _oBottlePhysic.SetActive(false);
        createjs.Tween.removeTweens(_oBottleSprite); 
        _oParentContainer.removeChild(_oBottleSprite); 
    };
    
    this.getSpritePosition = function(){
        var oPos = {x: _oBottleSprite.x, y: _oBottleSprite.y};
        return oPos;
    };
    
    this.fadeoutAndResetSprite = function(){
        var oParent = this;
        createjs.Tween.get(_oBottleSprite)
            .to({alpha: 0}, 500, createjs.Ease.cubicOut)
            .call(function(){ oParent.resetPosition(); });
    };
    
    this.fadeinSprite = function(){
        var oParent = this;
        createjs.Tween.get(_oBottleSprite)
            .to({alpha: 1}, 500, createjs.Ease.cubicOut)
            .call(function(){ 
                oParent.resetBottle(); 
            });
    };
    
    this.resetBottle = function(){
        _oBottlePhysic.SetActive(true);
        _oBottlePhysic.SetAwake(true);                
        _bActive = true;
        _bRotation = false;
        _bReady = true;
        
        // CHECK IF A RESET POSITION IS NEEDED
        if (WORLD_SCALE * _oBottlePhysic.GetPosition().x > CANVAS_WIDTH-100 ||
            WORLD_SCALE * _oBottlePhysic.GetPosition().x < 100) {
            s_oPhysicsController.setBodyPosition(_oBottlePhysic,BOTTLE_X_START,BOTTLE_Y_START);
        }
        
        _oBottlePhysic.SetAngle(0);
        createjs.Tween.removeTweens(_oBottleSprite);
    };
    
    this._moveSpritePosOnPhysicPos = function(){
        _oBottleSprite.x = WORLD_SCALE * _oBottlePhysic.GetPosition().x;
        _oBottleSprite.y = WORLD_SCALE * _oBottlePhysic.GetPosition().y;
        _oBottleSprite.rotation = this.getAngle();
    };
    
    this.stopBottle = function(){
        var vImpulse = new b2Vec2(0,0);
        _oBottlePhysic.ApplyImpulse(vImpulse, _oBottlePhysic.GetWorldCenter(), true);                
    };
    
    this.resetPosition = function(){
        // RESET BOTTLE POSITION
        s_oPhysicsController.setBodyPosition(_oBottlePhysic,BOTTLE_X_START,BOTTLE_Y_START);
        _oBottlePhysic.SetAngle(0);
        
        this.fadeinSprite();
    };
    
    this.update = function(){
        this._moveSpritePosOnPhysicPos();
        
        // CHECK IF THE BOTTLE LANDS STRAIGHT
        if (_bRotation && _oBottlePhysic.IsAwake()) {
            if (_oBottlePhysic.GetAngularVelocity() < BOTTLE_ROTATION) {
                _oBottlePhysic.ApplyTorque(BOTTLE_ROTATION);
            };
        };
        
        if (_bLaunched && !s_oGame.isCheckLaunch() && !_oBottlePhysic.IsAwake()) {
            _bLaunched = false;
            s_oGame.checkLaunch();
            _bRotation = false;
            this.stopBottle();
        }
    };
    
    _oParentContainer = oParentContainer;
    _oBottlePhysic = oBottlePhysic;

    this._init();
};