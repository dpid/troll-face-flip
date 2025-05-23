function CPhysicObjectsCreator(oWorld){
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2Body = Box2D.Dynamics.b2Body;
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

    var _oWorld;

    this.init = function(){
        _oWorld = oWorld;
    };
    
    this.addBottle = function(oContainer){
        // CLONE THE COORDINATES TO AVOID MODIFYING THE ORIGINAL ONES (I USE "0" INDEX BECAUSE THERE'S ONLY ONE POLYGON)
        var aClonedCoordinates = [];
        
        var aPlayerCoordinates = BOTTLE_SETTINGS.polygons;
        for (var i = 0; i < aPlayerCoordinates.length; i++ ) {
            for (var j = 0; j < aPlayerCoordinates[i].length; j++) {
                aClonedCoordinates[j] = {x: aPlayerCoordinates[i][j].x, y: aPlayerCoordinates[i][j].y};
            };
        };
        var oPhysicWorld = s_oGame.getPhysicWorld();
        oPhysicWorld.centerToScreen(aClonedCoordinates);
        
        var oPhysic = this.addPolygon(aClonedCoordinates.reverse(),BOTTLE_X_START,BOTTLE_Y_START,0,BOTTLE_DENSITY,BOTTLE_FRICTION,BOTTLE_RESTITUTION,DYNAMIC_BODY);
        var oBottle = new CBottle(oPhysic.GetBody(), oContainer);        
        return oBottle;
    };
    
    this.addFloor = function(oContainer){
        var iWidth = 800;
        var iHeight = 12;
        
        var oPhysic = this.addRectangle(iWidth,iHeight,FLOOR_X_START,FLOOR_Y_START,0,FLOOR_DENSITY,FLOOR_FRICTION,FLOOR_RESTITUTION,STATIC_BODY);
        var oFloor = new CFloor(oPhysic, oContainer);        
        return oFloor;                
    };

    this.addPolygon = function(aPoints,iX,iY,iAngle,density,friction,restitution,iType) {
        var oBodyDef = new b2BodyDef;        
        oBodyDef.type = b2Body.b2_dynamicBody;
        if (iType === STATIC_BODY) {
            oBodyDef.type = b2Body.b2_staticBody;            
        };
        oBodyDef.allowSleep = true;
        oBodyDef.bullet = true;
        
        var oFixDef = new b2FixtureDef;
        oFixDef.density = density;
        oFixDef.friction = friction;
        oFixDef.restitution = restitution;
        oFixDef.shape = new b2PolygonShape;
        oFixDef.userData = {id:"polygon"};
        
        var points = [];
        for (var i = 0; i < aPoints.length; i++) {
            var vec = new b2Vec2();            
            vec.Set(aPoints[i].x/WORLD_SCALE, aPoints[i].y/WORLD_SCALE);
            points.push(vec);
        }
        oFixDef.shape.SetAsArray(points, points.length);
        
        oBodyDef.position.Set(iX/WORLD_SCALE, iY/WORLD_SCALE);
        oBodyDef.angle = iAngle*Math.PI/180;
        
        var oBody = _oWorld.CreateBody(oBodyDef);
        var oCrateFixture = oBody.CreateFixture(oFixDef);
        return oCrateFixture;
    };
    
    this.addRectangle = function(iWidth,iHeight,iX,iY,iAngle,density,friction,restitution,iType) {
        var oBodyDef = new b2BodyDef;
        switch(iType){
            case DYNAMIC_BODY: {
                oBodyDef.type = b2Body.b2_dynamicBody;
                break;
            }
            case STATIC_BODY: {
                oBodyDef.type = b2Body.b2_staticBody;
                break;
            }
            case KINEMATIC_BODY: {
                oBodyDef.type = b2Body.b2_kinematicBody;
                break;
            }
        };

        var oFixDef = new b2FixtureDef;
        oFixDef.density = density;
        oFixDef.friction = friction;
        oFixDef.restitution = restitution;
        oFixDef.shape = new b2PolygonShape;
        oFixDef.shape.SetAsBox(iWidth/WORLD_SCALE, iHeight/WORLD_SCALE);
        oFixDef.userData = {id:"rectangle"};
        
        oBodyDef.position.Set(iX/WORLD_SCALE, iY/WORLD_SCALE);
        oBodyDef.angle = iAngle*Math.PI/180;
        var oBody = _oWorld.CreateBody(oBodyDef);
        oBody.CreateFixture(oFixDef);
        
        return oBody;
    };
            
    this.init();
}
