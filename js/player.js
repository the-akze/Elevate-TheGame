const WALKING_PLAYER = 0;
const IDLE_PLAYER = 1;
const AIR_PLAYER = 2;
const WATER_PLAYER = 3;
const PUNCH_PLAYER = 4;


class Player extends BaseClass
{
    constructor(x, y, width, height, playerInfo, color, image)
    {
        super(x, y, width, height, color, image);
        this.moveSpeed = playerInfo.moveSpeed;
        this.jumpStrength = playerInfo.jumpStrength;
        this.body.restitution = 0;
        this.body.friction = 0;
        this.body.frictionStatic = 0;
        this.groundSensor = createSprite(x, y + (height/2), width*0.8, height*0.02);
        this.groundSensor.visible = false;
        this.grounded = false;
        this.inWater = false;
        this.targetSwimAngle = 0;

        this.inventory = new Inventory({wood: 0, stone: 0, iron: 0, copper: 0, bronze: 0, diamond: 0, coal: 0, cotton: 0, graphene: 0});

        this.viewInventory = false;

        this.stats = {};
        this.stats.stamina = 50;
        this.stats.health = 80;
        this.stats.air = 100;

        var handSprite = createSprite(x, y, 10, 10);
        handSprite.shapeColor = color;
        this.mining = {
            isMining: false,
            what: null,
            clubAssets: base.assets.tools,
            handSprite: handSprite,
        };
        let miningHitbox = createSprite(x, y, 200, 20);
        miningHitbox.visible = false;
        this.mining.miningHitbox = miningHitbox;

        this.ropeRaycast = createSprite(x, y, 2000, 400);
        this.ropeRaycast.visible = false;

        this.rope = new Rope(this.body, 0.5, 0.01, {x:0, y:0});
        this.rope.disable();

        this.playing = true;

        let w = base.assets.player.walking;
        this.animation = {
            images: {
                idle: base.assets.player.idle,
                walk: base.assets.player.walk,
                walkPattern: [0, 1, 2, 3, 4, 5, 2, 1],
                air: {},
                punch: {}
            },
            direction: 1,
            state: WALKING_PLAYER
        }

        this.animation.images.air.hand = base.assets.player.walk.hand[4];
        for (var i in Inventory.materialLevels())
        {
            this.animation.images.air[Inventory.materialLevels()[i]] = base.assets.player.walk[Inventory.materialLevels()[i]][4];
        }

        this.animation.images.punch.hand = base.assets.player.hit.hand;
        for (var i in Inventory.materialLevels())
        {
            this.animation.images.punch[Inventory.materialLevels()[i]] = base.assets.player.hit[Inventory.materialLevels()[i]];
        }
    }

    updateAnimationState()
    {
        if (this.body.velocity.x !== 0)
        {
            this.animation.direction = Math.sign(this.body.velocity.x)
        }
        if (keyDown("a") || keyDown("d") || keyDown("left") || keyDown("right"))
        {
            this.animation.state = WALKING_PLAYER;
        }
        else
        {
            this.animation.state = IDLE_PLAYER;
        }
        if (!this.grounded)
        {
            this.animation.state = AIR_PLAYER;
        }
        if (this.inWater)
        {
            this.animation.state = WATER_PLAYER;
        }
        if (this.mining.isMining)
        {
            this.animation.state = PUNCH_PLAYER;
            this.animation.direction = Math.sign(this.mining.what.sprite.position.x - this.sprite.position.x)
        }
    }

    display()
    {
        if (rocket)
        {
            if (rocket.hasCoal)
            {
                return;
            }
        }
        var currentImg;
        
        var toolLvl = Inventory.materialLevels()[this.inventory.tool];
        if (toolLvl == undefined)
        {
            toolLvl = "hand";
        }

        switch (this.animation.state) {
            case WALKING_PLAYER:
                var index = this.animation.images.walkPattern[Math.round(frameCount / 4) % this.animation.images.walkPattern.length];
                currentImg = this.animation.images.walk[toolLvl][index];
                break;

            case IDLE_PLAYER:
                currentImg = this.animation.images.idle[toolLvl];
                break;

            case AIR_PLAYER:
                currentImg = this.animation.images.air[toolLvl];
                break;
            
            case WATER_PLAYER:
                currentImg = this.animation.images.punch[toolLvl][0];
                break;

            case PUNCH_PLAYER:
                currentImg = this.animation.images.punch[toolLvl][Math.round(frameCount / 4) % (this.animation.images.punch[toolLvl].length)];
                break;

            default:
                break;
        }
        
        this.rope.drawLine([157, 131, 97], 10);

        var angle = this.sprite.rotation;
        push();
        translate(this.body.position.x, this.body.position.y);
        rotate(angle);
        imageMode(CENTER);
        scale(this.animation.direction, 1)
        image(currentImg, 0, 0, this.width, this.height);
        pop();

        this.sprite.x = this.body.position.x;
        this.sprite.y = this.body.position.y;
        this.sprite.rotation = 180*this.body.angle/PI;

    }

    addForce(x, y, isPlayerMovement)
    {
        var magnitude = (base.mathStuff.magnitude(x, y));
        if (isPlayerMovement)
        {
            if (this.stats.stamina < 1)
            {
                x /= 2;
                y /= 2;
            }
            this.stats.stamina -= magnitude/((this.stats.air > 50) ? 10 : 5);
            if (this.stats.stamina < 5)
            {
                this.stats.health -= magnitude/((this.stats.air > 50) ? 16 : 8);
            }
            else if (this.stats.stamina < 30)
            {
                this.stats.health -= magnitude/16;
            }
        }
        var m = (this.width * this.height) / 2800
        Matter.Body.applyForce(this.body, this.body.position, {x: x * m, y: y * m});
    }
    
    //player movement
    move(direction)
    {
        var speed = (this.inWater ? (this.moveSpeed * 2) : (this.moveSpeed));
        //direction must be a direction with magnitude 1 (left or right), or 0, meaning it does not move.
        if ((direction != 1) && (direction != -1) && (direction != 0))
        {
            console.log("Enter 1, -1, or 0 for direction in move(). You entered " + direction + ".");
            return;
        }

        var speedMulti = this.grounded ? 1 : 0.25;

        this.addForce(direction * this.moveSpeed * speedMulti, 0, true);

        //Make sure it only goes up to a specific speed, that too, only if it is on the ground
        if (this.grounded)
        {
            Matter.Body.setVelocity(this.body, {x: base.mathStuff.clamp(this.body.velocity.x, -this.moveSpeed, this.moveSpeed), y: this.body.velocity.y});
        }

        if (direction == 0)
        {
            if (Math.abs(this.body.velocity.x) < this.moveSpeed/10)
            {
                Matter.Body.setVelocity(this.body, {x: 0, y: this.body.velocity.y});
                return;
            }

            //make the speed to back to 0
            this.addForce(this.moveSpeed * (this.body.velocity.x > 0 ? -1 : this.body.velocity.x < 0 ? 1 : 0) * Math.pow(speedMulti, 1.5), 0, false);

            return;
            // Matter.Body.setVelocity(this.body, {x: this.body.velocity.x - direction*this.moveSpeed, y: this.body.velocity.y});
        }
    }

    updateGroundSensor()
    {
        // this.groundSensor.x = this.body.position.x;
        // this.groundSensor.y = this.body.position.y + (this.height/2);

        var offset = base.mathStuff.angleToVector(-this.body.angle);

        this.groundSensor.x = this.body.position.x - offset.x * this.height/2;
        this.groundSensor.y = this.body.position.y - offset.y * this.height/2;


        //.add(createSprite((vertices[0].x + vertices[1].x)/2, (vertices[0].y + vertices[1].y)/2, dist(vertices[0].x, vertices[0].y, vertices[1].x, vertices[1].y), 5));
        this.groundSensor.rotation = (180*this.body.angle/PI);

        this.grounded = this.checkGrounded();
    }

    checkGrounded()
    {
        for (var i in allGrounds)
        {
            if (allGrounds[i].sprite.isTouching(this.groundSensor))
            {
                return true;
            }
        }
        return false;
    }

    checkWater()
    {
        for (var w in allWaterBodies)
        {
            if (allWaterBodies[w].sprite.isTouching(this.sprite))
            {
                return true;
            }
        }
        return false;
    }

    tryToJump(force)
    {
        if (this.grounded)
        {
            var direction = base.mathStuff.angleToVector(this.body.angle);
            this.addForce(direction.x*force, -direction.y*force, true);
        }
    }

    cameraMove(lerpFactor)
    {
        var fastEnough = this.body.speed > 2;
        var tooFast = this.body.speed > 20;
        camera.position = {
            x: lerp(camera.position.x, this.body.position.x, lerpFactor * (tooFast ? 2 : (fastEnough ? 1 : 0.25))),
            y: lerp(camera.position.y, this.body.position.y, lerpFactor * (tooFast ? 2 : (fastEnough ? 1 : 0.25)))
        }
    }
    
    swim(drag)
    {
        Matter.Body.setVelocity(this.body, {x: this.body.velocity.x*drag, y: this.body.velocity.y*drag});
        if (this.body.speed > 2.5)
        {
            this.targetSwimAngle = Math.atan2(this.body.velocity.y, this.body.velocity.x);
        }
        Matter.Body.setAngularVelocity(this.body, ((PI/2 + this.targetSwimAngle - this.body.angle) * 0.1));

        if (keyDown("up") || keyDown("w"))
        {
            this.addForce(0, -2, true);
        }
        else
        {
            // Matter.Body.setAngularVelocity(this.body, -this.body.angle * 0.1);
        }
        if (keyDown("down") || keyDown("s"))
        {
            this.addForce(0, 5, true);
        }
        this.stats.air -= 0.2;
    }

    drawStats()
    {
        var centerPos = {x: this.sprite.x, y: this.sprite.y - (this.height * 1.5)};

        base.renderStuff.progressBar(centerPos.x - 100, centerPos.y - 50, centerPos.x + 100, centerPos.y - 25, [0, 200, 50, 180], [0, 0, 0, 10], this.stats.health/100, "HEALTH", [255, 255, 255], .3, 2);

        if (this.stats.stamina < 90)
        {
            base.renderStuff.progressBar(centerPos.x - 100, centerPos.y - 25, centerPos.x + 100, centerPos.y, [255, 165, 0, 180], [0, 0, 0, 10], this.stats.stamina/100, "STAMINA", [255, 255, 255], .3, 2);
        }
        
        if (this.stats.air < 95)
        {
            base.renderStuff.progressBar(centerPos.x - 100, centerPos.y, centerPos.x + 100, centerPos.y + 25, [50, 180, 255, 180], [0, 0, 0, 10], this.stats.air/100, "OXYGEN", [255, 255, 255], .3, 2);
        }
    }
    
    respawn() // instead of respawning this will make it lose the game
    {
        location = 'end/end.html?lose';
        // this.stats.stamina = 50;
        // this.stats.health = 80;
        // this.stats.air = 100;
        // this.resetPosition();
        // camera.position = {x: this.body.position.x, y: this.body.position.y};
    }

    updateHandPos() // originally the hand, but now just an indicator of where you are pointing to mine
    {
        var mouseXOffset = (mouseX - (windowWidth/2));
        var mouseYOffset = (mouseY - (windowHeight/2));
        
        var handOffset = base.mathStuff.normalize(mouseXOffset, mouseYOffset, 80); // for the mining hitbox
        
        var mineAnimationOffset = Math.sin(frameCount / 2) / 4;
        var animatedOffset = base.mathStuff.normalize(mouseXOffset, mouseYOffset, 100);
        
        fill("blue");
        noStroke();
        rectMode(CENTER);

        this.mining.handSprite.x = animatedOffset.x*0.7 + this.sprite.x;
        this.mining.handSprite.y = animatedOffset.y*0.8 + this.sprite.y;
        
        this.mining.miningHitbox.x = handOffset.x*1.4 + this.sprite.x
        this.mining.miningHitbox.y = handOffset.y*1.6 + this.sprite.y;

        var handAngleDeg = 180*(Math.atan2(handOffset.y, handOffset.x)/PI); 
        this.mining.handSprite.rotation = handAngleDeg;
        this.mining.miningHitbox.rotation = handAngleDeg;

        this.ropeRaycast.x = handOffset.x*7 + this.sprite.x
        this.ropeRaycast.y = handOffset.y*7 + this.sprite.y;
        this.ropeRaycast.rotation = handAngleDeg;
    }

    doMine()
    {
        if (this.stats.stamina < 8)
        {
            return;
        }
        this.mining.isMining = false;
        this.mining.what = null;
        for (var c in allCotton)
        {
            if (allCotton[c].broken)
            {
                delete allCotton[c];
                return;
            }
            if (this.mining.miningHitbox.isTouching(allCotton[c].sprite))
            {
                allCotton[c].hit();
                break;
            }
        }
        for (var m in allMinable)
        {
            if (allMinable[m].broken)
            {
                delete allMinable[m];
                return;
            }
            if (this.mining.miningHitbox.isTouching(allMinable[m].sprite))
            {
                this.mining.isMining = true;
                this.mining.what = allMinable[m];
                if (Inventory.materialStrength()[this.inventory.tool] && Inventory.materialLevels()[this.inventory.tool])
                {
                    allMinable[m].hit(Inventory.materialStrength()[this.inventory.tool], Inventory.materialLevels()[this.inventory.tool]);
                }
                else
                {
                    allMinable[m].hit(1, "hand");
                }
                this.stats.stamina -= 0.6;
                break;
            }
        }
    }

    displayMinableMiningHealth()
    {
        if (!this.mining.what)
        {
            return;
        }
        var minable = this.mining.what;
        push();
        translate(this.mining.miningHitbox.x, this.mining.miningHitbox.y - 200);
        base.renderStuff.progressBar(-this.mining.miningHitbox.width/2, -this.mining.miningHitbox.height/2, this.mining.miningHitbox.width/2, this.mining.miningHitbox.height/2, [122, 71, 0], [0, 0, 0, 10], minable.mining.health/minable.mining.originalHealth);
        pop();
    }

    doRope()
    {
        for (var r in allRopable)
        {
            if (this.ropeRaycast.isTouching(allRopable[r].sprite))
            {
                this.rope.updatePointToSprite(allRopable[r].sprite);
                this.rope.enable(this.body);
                return true;
            }
        }
        return false;
    }

    doSounds()
    {
        if (!buttonStuff.settings.soundEffects)
        {
            return;
        }
        if (this.mining.isMining)
        {
            if (frameCount % 12 == 0)
            {
                if (base.assets.audio.soundEffects[this.mining.what.mining.material + "Hit"])
                {
                    base.assets.audio.soundEffects[this.mining.what.mining.material + "Hit"].play();
                }
            }
        }
    }
    
    //play, what it does each frame supposedly
    play()
    {
        if (!this.playing)
        {
            return;
        }
        
        Matter.Body.setAngle(this.body, this.body.angle % (2*PI));
        this.inWater = this.checkWater();
        if (!this.inWater)
        {
            //don't go beyond a certain angle (prevents turning upside down)
            if (base.mathStuff.clamp(this.body.angle, -PI/6, PI/6) != this.body.angle)
            {
                Matter.Body.setAngle(this.body, base.mathStuff.clamp(this.body.angle, -PI/6, PI/6));
                Matter.Body.setAngularVelocity(this.body, 0);
            }
            //attempt to stay upright (fixes the rotation being weird sometimes)
            if (this.body.speed < 20)
            {
                Matter.Body.setAngularVelocity(this.body, lerp(this.body.angularVelocity, -this.body.angle, (this.grounded ? 0.002 : 0.01) * 1));
            }
            world.gravity.y = 1;
        }
        else
        {
            world.gravity.y = 0.1;
        }

        this.rope.drawLine([157, 131, 97], 10);


        var limit = (this.inWater ? 7 : 50);
        if (this.body.speed > limit)
        {
            Matter.Body.setVelocity(this.body, base.mathStuff.normalize(this.body.velocity.x, this.body.velocity.y, limit));
        }

        this.move((keyDown("right") || keyDown("d")) - (keyDown("left") || keyDown("a")));

        //make ground sensor position at the foot of the player's body
        this.updateGroundSensor();
        
        //jumping
        if (keyDown("up") || keyDown("w"))
        {
            this.tryToJump(this.jumpStrength);
        }

        //swimming
        if (this.inWater)
        {
            this.swim(0.975);
        }
        else
        {
            this.stats.air = lerp(this.stats.air, 100, 0.01);
        }
        
        if (this.stats.air > 10)
        {
            this.stats.stamina = lerp(this.stats.stamina, 100, 0.0075);
        }
        
        for (var stat in this.stats)
        {
            this.stats[stat] = base.mathStuff.clamp(this.stats[stat], 0, 100);
        }
        
        if (this.stats.air < 20)
        {
            this.stats.stamina -= 1;
        }
        
        //respawn if fallen into the void
        if (this.body.position.y > voidY || this.stats.health < 1)
        {
            this.respawn();
        }

        this.updateHandPos();

        if (keyDown("space"))
        {
            this.doMine();
        }
        else
        {
            this.mining.isMining = false;
            this.mining.what = null;
        }
        this.doSounds();

        var onnedRope = false;
        if (keyWentDown("r") || keyWentDown("c"))
        {
            if (this.inventory.hasRope)
            {
                if (this.doRope())
                {
                    onnedRope = true;
                }
            }
            else
            {
                this.inventory.makeRope();
            }
        }
        if ((!keyDown("r")) && (!keyDown("c")) && !onnedRope)
        {
            if (this.inventory.hasRope)
            {
                this.rope.disable();
            }
        }
        
        this.updateAnimationState();

        if (rocket)
        {
            if (keyWentDown('space') && (this.sprite.isTouching(rocket.sprite) || this.mining.miningHitbox.isTouching(rocket.sprite)))
            {
                if (!rocket.hasCoal)
                {
                    if (this.inventory.content.materials.coal)
                    {
                        if (this.inventory.content.materials.coal >= 20)
                        {
                            this.inventory.content.materials.coal = this.inventory.content.materials.coal - 20;
                            rocket.hasCoal = true;
                            this.sprite.visible = false;
                            this.mining.handSprite.visible = false;
                            new GameMessage("Blast off!", [35, 186, 113], [10, 161, 88], 60);
                        }
                        else
                        {
                            new GameMessage("You need 20 coal to power the rocket.", [168, 76, 50], [143, 51, 25], 60);
                        }
                    }
                    else
                    {
                        new GameMessage("You need 20 coal to power the rocket.", [168, 76, 50], [143, 51, 25], 60);
                    }
                }
            }
        }

        //Generate mountain as the player climbs
        if (mountain.done)
        {
            return;
        }
        while (mountain.highestPoint.y + 1500 > player.body.position.y)
        {
            for (var i = 0; i < 16; i++)
            {
                if (Math.abs(mountain.highestPoint.y - -600) < 100)
                {
                    new Ropable(mountain.highestPoint.x + 100, mountain.highestPoint.y - 800);
                    new Ropable(mountain.highestPoint.x - 300, mountain.highestPoint.y - 600);
                    mountain.generateMountain({x: 100, y: 400});
                }
                else if (mountain.highestPoint.y < -1690)
                {
                    grapheneWall = new GrapheneWall(mountain.highestPoint.x + 1000, mountain.highestPoint.y);
                    rocket = new Rocket(mountain.highestPoint.x + 3000, mountain.highestPoint.y);
                    mountain.done = true;
                    break;
                }
                else
                {
                    mountain.generateMountain();
                }
            }
        }
    }
}