/**
 * Lagos Subway Surfers - 3D Real Human Engine
 * Rebuilt using Three.js for authentic 3D Subway Surfers perspective & running animations.
 */

// Game Constants & Config
const LANES = [-3.5, 0, 3.5]; // Left, Center, Right x-coordinates
const INITIAL_SPEED = 30;
const MAX_SPEED = 70;
const ACCELERATION = 0.6;

class LagosSubwayGame3D {
    constructor() {
        this.container = document.getElementById('game-container');
        this.scoreVal = document.getElementById('score-val');
        this.coinVal = document.getElementById('coin-val');
        this.finalScore = document.getElementById('final-score');
        this.finalCoins = document.getElementById('final-coins');
        this.highScoreEl = document.getElementById('high-score');

        this.hud = document.getElementById('hud');
        this.menuOverlay = document.getElementById('menu-overlay');
        this.gameoverOverlay = document.getElementById('gameover-overlay');

        this.powerupBar = document.getElementById('powerup-bar');
        this.powerupName = document.getElementById('powerup-name');
        this.powerupProgress = document.getElementById('powerup-progress');
        this.hoverboardBtn = document.getElementById('hoverboard-hud-btn');
        this.hoverboardCountEl = document.getElementById('hoverboard-count');

        // Buttons
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.startGame());
        if (this.hoverboardBtn) {
            this.hoverboardBtn.addEventListener('click', () => this.activateHoverboard());
        }

        // Game State Variables
        this.isPlaying = false;
        this.score = 0;
        this.coins = 0;
        this.highScore = parseInt(localStorage.getItem('lagos_surf_highscore') || '0');
        this.speed = INITIAL_SPEED;

        // Player Physics & State
        this.currentLane = 1; // 0: Left, 1: Center, 2: Right
        this.targetX = LANES[1];
        this.playerY = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.isSliding = false;
        this.slideTimer = 0;

        // Power-ups & Shield
        this.hoverboardsCount = 3;
        this.hasHoverboardActive = false;
        this.hoverboardTimer = 0;
        this.invulnerableTimer = 0;

        this.hasJetpackActive = false;
        this.jetpackTimer = 0;

        // World Objects
        this.obstacles = [];
        this.coinsList = [];
        this.powerupsList = [];
        this.roadTiles = [];

        this.clock = new THREE.Clock();

        this.initThreeJS();
        this.initEvents();
        this.animate();
    }

    initThreeJS() {
        // 1. Scene setup with dramatic Sunset Dusk sky
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x3B233D); // Sunset purple dusk
        this.scene.fog = new THREE.FogExp2(0x3B233D, 0.008);

        // 2. Camera setup (Behind-the-back 3D Subway Surfers perspective)
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            350
        );
        this.camera.position.set(0, 4.0, 8.5);
        this.camera.lookAt(0, 1.8, -12);

        // 3. Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // 4. Lighting setup (Golden hour sunset lights)
        const ambientLight = new THREE.AmbientLight(0xFFD1A9, 0.85);
        this.scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xFF7E47, 1.5); // Warm sunset sun
        sunLight.position.set(40, 35, -50);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 10;
        sunLight.shadow.camera.far = 200;
        sunLight.shadow.camera.left = -30;
        sunLight.shadow.camera.right = 30;
        sunLight.shadow.camera.top = 30;
        sunLight.shadow.camera.bottom = -30;
        this.scene.add(sunLight);

        const skyLight = new THREE.DirectionalLight(0x4A6FA5, 0.6);
        skyLight.position.set(-30, 20, 50);
        this.scene.add(skyLight);

        // 5. Build 3D Human Runner, Chasing Police Officer & Railway Track
        this.createHumanRunner();
        this.createPoliceOfficer();
        this.initRailwayTiles();
    }

    // -------------------------------------------------------------
    // REALISTIC 3D HUMAN RUNNER (BLUE HOODIE, BACKPACK, CARGO PANTS)
    // -------------------------------------------------------------
    createHumanRunner() {
        this.playerGroup = new THREE.Group();

        const skinMat = new THREE.MeshStandardMaterial({ color: 0x8D5B4C, roughness: 0.6 });
        const hoodieBlueMat = new THREE.MeshStandardMaterial({ color: 0x2A5298, roughness: 0.5 }); // Blue Hoodie
        const shirtGreyMat = new THREE.MeshStandardMaterial({ color: 0x7F8C8D, roughness: 0.7 });  // Grey T-shirt
        const backpackMat = new THREE.MeshStandardMaterial({ color: 0x3D4A3E, roughness: 0.8 });  // Olive Backpack
        const cargoPantsMat = new THREE.MeshStandardMaterial({ color: 0x2C3E50, roughness: 0.7 }); // Dark Cargo Pants
        const shoeMat = new THREE.MeshStandardMaterial({ color: 0xBDC3C7, roughness: 0.4 });       // High-top Sneakers
        const whiteMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });

        // Torso (Blue Zip-Up Hoodie)
        const torsoGeo = new THREE.BoxGeometry(0.76, 1.05, 0.45);
        this.torso = new THREE.Mesh(torsoGeo, hoodieBlueMat);
        this.torso.position.y = 1.25;
        this.torso.castShadow = true;
        this.playerGroup.add(this.torso);

        // Grey T-shirt peeking out front
        const innerShirt = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 0.1), shirtGreyMat);
        innerShirt.position.set(0, 1.2, 0.22);
        this.playerGroup.add(innerShirt);

        // Hood pulled down around neck
        const hoodGeo = new THREE.TorusGeometry(0.3, 0.1, 8, 16);
        const hood = new THREE.Mesh(hoodGeo, hoodieBlueMat);
        hood.rotation.x = Math.PI / 2;
        hood.position.set(0, 1.75, -0.15);
        this.playerGroup.add(hood);

        // OLIVE GREEN BACKPACK
        const packGeo = new THREE.BoxGeometry(0.65, 0.85, 0.35);
        const pack = new THREE.Mesh(packGeo, backpackMat);
        pack.position.set(0, 1.3, -0.32);
        pack.castShadow = true;
        this.playerGroup.add(pack);

        const pocketGeo = new THREE.BoxGeometry(0.45, 0.35, 0.15);
        const pocket = new THREE.Mesh(pocketGeo, backpackMat);
        pocket.position.set(0, 1.1, -0.52);
        this.playerGroup.add(pocket);

        // Head (Buzz-cut dark hair)
        const headGeo = new THREE.SphereGeometry(0.32, 16, 16);
        this.head = new THREE.Mesh(headGeo, skinMat);
        this.head.position.y = 2.0;
        this.head.castShadow = true;
        this.playerGroup.add(this.head);

        const hairGeo = new THREE.SphereGeometry(0.33, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const hairMat = new THREE.MeshStandardMaterial({ color: 0x1A1A1A, roughness: 0.9 });
        const hair = new THREE.Mesh(hairGeo, hairMat);
        hair.position.y = 2.02;
        this.playerGroup.add(hair);

        // ARMS (Blue Hoodie Sleeves + Skin Hands)
        const armGeo = new THREE.BoxGeometry(0.24, 0.72, 0.24);

        // Left Arm Group (pivots at shoulder y=1.5)
        this.leftArmGroup = new THREE.Group();
        const leftArmMesh = new THREE.Mesh(armGeo, hoodieBlueMat);
        leftArmMesh.position.y = -0.36;
        leftArmMesh.castShadow = true;
        this.leftArmGroup.add(leftArmMesh);
        this.leftArmGroup.position.set(-0.52, 1.5, 0);
        this.playerGroup.add(this.leftArmGroup);

        // Right Arm Group (pivots at shoulder y=1.5)
        this.rightArmGroup = new THREE.Group();
        const rightArmMesh = new THREE.Mesh(armGeo, hoodieBlueMat);
        rightArmMesh.position.y = -0.36;
        rightArmMesh.castShadow = true;
        this.rightArmGroup.add(rightArmMesh);
        this.rightArmGroup.position.set(0.52, 1.5, 0);
        this.playerGroup.add(this.rightArmGroup);

        // LEGS (Dark Cargo Pants & Sneakers)
        const legGeo = new THREE.BoxGeometry(0.29, 0.85, 0.29);
        const shoeGeo = new THREE.BoxGeometry(0.32, 0.22, 0.5);

        // Left Leg Group (pivots at hip y=0.85)
        this.leftLegGroup = new THREE.Group();
        const leftLeg = new THREE.Mesh(legGeo, cargoPantsMat);
        leftLeg.position.y = -0.4;
        leftLeg.castShadow = true;
        this.leftLegGroup.add(leftLeg);

        const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
        leftShoe.position.set(0, -0.85, 0.08);
        leftShoe.castShadow = true;
        this.leftLegGroup.add(leftShoe);

        const leftSole = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.06, 0.52), whiteMat);
        leftSole.position.set(0, -0.95, 0.08);
        this.leftLegGroup.add(leftSole);

        this.leftLegGroup.position.set(-0.24, 0.85, 0);
        this.playerGroup.add(this.leftLegGroup);

        // Right Leg Group (pivots at hip y=0.85)
        this.rightLegGroup = new THREE.Group();
        const rightLeg = new THREE.Mesh(legGeo, cargoPantsMat);
        rightLeg.position.y = -0.4;
        rightLeg.castShadow = true;
        this.rightLegGroup.add(rightLeg);

        const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
        rightShoe.position.set(0, -0.85, 0.08);
        rightShoe.castShadow = true;
        this.rightLegGroup.add(rightShoe);

        const rightSole = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.06, 0.52), whiteMat);
        rightSole.position.set(0, -0.95, 0.08);
        this.rightLegGroup.add(rightSole);

        this.rightLegGroup.position.set(0.24, 0.85, 0);
        this.playerGroup.add(this.rightLegGroup);

        // 3D Powerup attachments
        this.createHoverboardMesh();
        this.createJetpackMesh();

        this.playerGroup.position.set(LANES[1], 0, 0);
        this.scene.add(this.playerGroup);
    }

    createHoverboardMesh() {
        this.hoverboardMesh = new THREE.Group();

        const boardGeo = new THREE.BoxGeometry(1.2, 0.12, 2.4);
        const boardMat = new THREE.MeshStandardMaterial({ color: 0x00FF88, roughness: 0.2, metalness: 0.8 });
        const board = new THREE.Mesh(boardGeo, boardMat);
        this.hoverboardMesh.add(board);

        const stripeMat = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.14, 0.4), stripeMat);
        this.hoverboardMesh.add(stripe);

        this.hoverboardMesh.position.set(0, 0.08, 0);
        this.hoverboardMesh.visible = false;
        this.playerGroup.add(this.hoverboardMesh);
    }

    createJetpackMesh() {
        this.jetpackMesh = new THREE.Group();

        const tankGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.9, 16);
        const metallicMat = new THREE.MeshStandardMaterial({ color: 0x2A5298, metalness: 0.8 });

        const leftTank = new THREE.Mesh(tankGeo, metallicMat);
        leftTank.position.set(-0.25, 0, 0);
        this.jetpackMesh.add(leftTank);

        const rightTank = new THREE.Mesh(tankGeo, metallicMat);
        rightTank.position.set(0.25, 0, 0);
        this.jetpackMesh.add(rightTank);

        this.jetpackMesh.position.set(0, 1.35, -0.45);
        this.jetpackMesh.visible = false;
        this.playerGroup.add(this.jetpackMesh);
    }

    // -------------------------------------------------------------
    // REALISTIC 3D CHASING POLICE OFFICER (NAVY UNIFORM & BADGE)
    // -------------------------------------------------------------
    createPoliceOfficer() {
        this.officerGroup = new THREE.Group();

        const navyMat = new THREE.MeshStandardMaterial({ color: 0x1B2A47, roughness: 0.5 }); // Navy Police Uniform
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xD4A373, roughness: 0.6 });
        const badgeGoldMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.9 }); // Gold Badge
        const beltMat = new THREE.MeshStandardMaterial({ color: 0x111111 });

        // Torso
        const torsoGeo = new THREE.BoxGeometry(0.85, 1.15, 0.5);
        const torso = new THREE.Mesh(torsoGeo, navyMat);
        torso.position.y = 1.25;
        torso.castShadow = true;
        this.officerGroup.add(torso);

        // Gold Police Badge on Left Chest
        const badgeGeo = new THREE.BoxGeometry(0.18, 0.22, 0.08);
        const badge = new THREE.Mesh(badgeGeo, badgeGoldMat);
        badge.position.set(-0.25, 1.45, 0.26);
        this.officerGroup.add(badge);

        // Duty Belt & Holster
        const belt = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.18, 0.53), beltMat);
        belt.position.set(0, 0.72, 0);
        this.officerGroup.add(belt);

        const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.25, 0.2), beltMat);
        pouch.position.set(0.44, 0.7, 0);
        this.officerGroup.add(pouch);

        // Head & Visor Cap
        const headGeo = new THREE.SphereGeometry(0.35, 16, 16);
        const head = new THREE.Mesh(headGeo, skinMat);
        head.position.y = 2.05;
        head.castShadow = true;
        this.officerGroup.add(head);

        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.12, 16), navyMat);
        cap.position.set(0, 2.3, 0);
        this.officerGroup.add(cap);

        const visor = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.22), beltMat);
        visor.position.set(0, 2.26, 0.22);
        this.officerGroup.add(visor);

        // Arms (Pivoting at shoulders)
        const armGeo = new THREE.BoxGeometry(0.24, 0.72, 0.24);

        this.officerLeftArmGroup = new THREE.Group();
        const oLeftArm = new THREE.Mesh(armGeo, navyMat);
        oLeftArm.position.y = -0.36;
        this.officerLeftArmGroup.add(oLeftArm);
        this.officerLeftArmGroup.position.set(-0.55, 1.5, 0);
        this.officerGroup.add(this.officerLeftArmGroup);

        this.officerRightArmGroup = new THREE.Group();
        const oRightArm = new THREE.Mesh(armGeo, navyMat);
        oRightArm.position.y = -0.36;
        this.officerRightArmGroup.add(oRightArm);
        this.officerRightArmGroup.position.set(0.55, 1.5, 0);
        this.officerGroup.add(this.officerRightArmGroup);

        // Legs (Pivoting at hips)
        const legGeo = new THREE.BoxGeometry(0.3, 0.85, 0.3);

        this.officerLeftLegGroup = new THREE.Group();
        const oLeftLeg = new THREE.Mesh(legGeo, navyMat);
        oLeftLeg.position.y = -0.42;
        this.officerLeftLegGroup.add(oLeftLeg);
        this.officerLeftLegGroup.position.set(-0.25, 0.85, 0);
        this.officerGroup.add(this.officerLeftLegGroup);

        this.officerRightLegGroup = new THREE.Group();
        const oRightLeg = new THREE.Mesh(legGeo, navyMat);
        oRightLeg.position.y = -0.42;
        this.officerRightLegGroup.add(oRightLeg);
        this.officerRightLegGroup.position.set(0.25, 0.85, 0);
        this.officerGroup.add(this.officerRightLegGroup);

        this.officerGroup.position.set(LANES[1], 0, 3.2); // Chasing right behind player
        this.scene.add(this.officerGroup);
    }

    // -------------------------------------------------------------
    // RAILWAY TRACKS, METAL GRATE PLATFORM, TRAINS & GANTRIES
    // -------------------------------------------------------------
    initRailwayTiles() {
        const TILE_LENGTH = 60;
        for (let i = 0; i < 5; i++) {
            this.createRailwayTile(-i * TILE_LENGTH);
        }
    }

    createRailwayTile(zPos) {
        const tileGroup = new THREE.Group();

        // 1. Central Metal Grate Platform
        const platformGeo = new THREE.BoxGeometry(11.5, 0.3, 60);
        const platformMat = new THREE.MeshStandardMaterial({ color: 0x333A42, roughness: 0.6, metalness: 0.5 });
        const platform = new THREE.Mesh(platformGeo, platformMat);
        platform.position.set(0, -0.15, -30);
        platform.receiveShadow = true;
        tileGroup.add(platform);

        // 2. Yellow & Black Diagonal Hazard Warning Stripes along Edges
        const stripeGeo = new THREE.BoxGeometry(0.5, 0.32, 60);
        const yellowMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.4 });
        
        const leftStripe = new THREE.Mesh(stripeGeo, yellowMat);
        leftStripe.position.set(-5.8, -0.14, -30);
        tileGroup.add(leftStripe);

        const rightStripe = new THREE.Mesh(stripeGeo, yellowMat);
        rightStripe.position.set(5.8, -0.14, -30);
        tileGroup.add(rightStripe);

        // 3. Steel Rails along 3 Lanes
        const railGeo = new THREE.BoxGeometry(0.12, 0.2, 60);
        const steelMat = new THREE.MeshStandardMaterial({ color: 0x95A5A6, metalness: 0.9, roughness: 0.2 });

        LANES.forEach(x => {
            const leftRail = new THREE.Mesh(railGeo, steelMat);
            leftRail.position.set(x - 0.7, 0.05, -30);
            tileGroup.add(leftRail);

            const rightRail = new THREE.Mesh(railGeo, steelMat);
            rightRail.position.set(x + 0.7, 0.05, -30);
            tileGroup.add(rightRail);
        });

        // ---------------------------------------------------------
        // GREEN & MAROON/RED TRAIN CARS ON SIDES
        // ---------------------------------------------------------
        this.addTrainCar(tileGroup, -10.5, -15, 0x1E4620); // Green Train Left
        this.addTrainCar(tileGroup, 10.5, -25, 0x7B241C);  // Maroon/Red Train Right
        this.addTrainCar(tileGroup, -10.5, -45, 0x7B241C); // Maroon/Red Train Left
        this.addTrainCar(tileGroup, 10.5, -55, 0x1E4620);  // Green Train Right

        // Overhead Gantries
        this.addOverheadGantry(tileGroup, -30);

        tileGroup.position.z = zPos;
        this.scene.add(tileGroup);
        this.roadTiles.push(tileGroup);
    }

    addTrainCar(parentGroup, x, z, colorHex) {
        const trainGroup = new THREE.Group();

        const bodyGeo = new THREE.BoxGeometry(4.2, 4.0, 18);
        const trainMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.6, metalness: 0.4 });
        const body = new THREE.Mesh(bodyGeo, trainMat);
        body.position.y = 2.0;
        body.castShadow = true;
        trainGroup.add(body);

        const winGeo = new THREE.BoxGeometry(4.25, 1.1, 2.2);
        const winMat = new THREE.MeshStandardMaterial({ color: 0x152238, roughness: 0.1 });
        
        for (let w = -6; w <= 6; w += 4) {
            const win = new THREE.Mesh(winGeo, winMat);
            win.position.set(0, 2.6, w);
            trainGroup.add(win);
        }

        const roof = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.4, 18.2), new THREE.MeshStandardMaterial({ color: 0x2C3E50 }));
        roof.position.y = 4.15;
        trainGroup.add(roof);

        trainGroup.position.set(x, 0, z);
        parentGroup.add(trainGroup);
    }

    addOverheadGantry(parentGroup, z) {
        const gantry = new THREE.Group();
        const steelMat = new THREE.MeshStandardMaterial({ color: 0x4A5568, metalness: 0.8 });

        const leftPole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 9), steelMat);
        leftPole.position.set(-6.5, 4.5, 0);
        gantry.add(leftPole);

        const rightPole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 9), steelMat);
        rightPole.position.set(6.5, 4.5, 0);
        gantry.add(rightPole);

        const beam = new THREE.Mesh(new THREE.BoxGeometry(13.4, 0.4, 0.4), steelMat);
        beam.position.set(0, 8.8, 0);
        gantry.add(beam);

        const redLampMat = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
        const lamp1 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), redLampMat);
        lamp1.position.set(-3.5, 8.2, 0);
        gantry.add(lamp1);

        const lamp2 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), redLampMat);
        lamp2.position.set(3.5, 8.2, 0);
        gantry.add(lamp2);

        gantry.position.set(0, 0, z);
        parentGroup.add(gantry);
    }

    // -------------------------------------------------------------
    // OBSTACLE GENERATOR (WOODEN CARGO CRATES & DANFO BUSES)
    // -------------------------------------------------------------
    spawnObstaclePattern(zDistance) {
        const laneIndex = Math.floor(Math.random() * 3);
        const xPos = LANES[laneIndex];
        const randType = Math.random();

        if (randType < 0.45) {
            // STACKED WOODEN CARGO CRATES
            this.createStackedWoodenCrates(xPos, zDistance);
        } else if (randType < 0.80) {
            // DANFO BUS
            this.createDanfoBus(xPos, zDistance);
        } else {
            // BARRICADE
            this.createBarricade(xPos, zDistance);
        }

        // Spawn Jetpack / Hoverboard Power-ups
        if (Math.random() < 0.3) {
            const powerupLane = LANES[(laneIndex + 1) % 3];
            if (Math.random() < 0.5) {
                this.spawnJetpackCollectible(powerupLane, zDistance - 5);
            } else {
                this.spawnHoverboardCollectible(powerupLane, zDistance - 5);
            }
        }

        // Spawn Coins on available lanes
        for (let i = 0; i < 3; i++) {
            if (i !== laneIndex && Math.random() > 0.35) {
                this.spawnCoinTrail(LANES[i], zDistance - 10);
            }
        }
    }

    createStackedWoodenCrates(x, z) {
        const crateGroup = new THREE.Group();
        const woodMat = new THREE.MeshStandardMaterial({ color: 0x8B5A2B, roughness: 0.8 });
        const borderMat = new THREE.MeshStandardMaterial({ color: 0x5C3A21 });

        const baseCrate = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 2.2), woodMat);
        baseCrate.position.y = 0.7;
        baseCrate.castShadow = true;
        crateGroup.add(baseCrate);

        const brace = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.15, 2.25), borderMat);
        brace.position.y = 0.7;
        crateGroup.add(brace);

        crateGroup.position.set(x, 0, z);
        crateGroup.userData = { type: 'crate', width: 2.2, height: 1.5, depth: 2.2 };
        this.scene.add(crateGroup);
        this.obstacles.push(crateGroup);
    }

    createDanfoBus(x, z) {
        const busGroup = new THREE.Group();
        const bodyGeo = new THREE.BoxGeometry(2.6, 2.6, 5.5);
        const danfoYellowMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.4 });
        const body = new THREE.Mesh(bodyGeo, danfoYellowMat);
        body.position.y = 1.6;
        body.castShadow = true;
        busGroup.add(body);

        const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.65, 0.35, 5.55), new THREE.MeshStandardMaterial({ color: 0x1A1A1A }));
        stripe.position.y = 1.5;
        busGroup.add(stripe);

        busGroup.position.set(x, 0, z);
        busGroup.userData = { type: 'danfo', width: 2.6, height: 2.8, depth: 5.5 };
        this.scene.add(busGroup);
        this.obstacles.push(busGroup);
    }

    createBarricade(x, z) {
        const barGroup = new THREE.Group();
        const board = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.1, 0.4), new THREE.MeshStandardMaterial({ color: 0xFF3B30 }));
        board.position.y = 0.8;
        board.castShadow = true;
        barGroup.add(board);

        barGroup.position.set(x, 0, z);
        barGroup.userData = { type: 'barricade', width: 2.8, height: 1.2, depth: 0.5 };
        this.scene.add(barGroup);
        this.obstacles.push(barGroup);
    }

    spawnJetpackCollectible(x, z) {
        const jpGroup = new THREE.Group();
        const jp = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.8, 16), new THREE.MeshStandardMaterial({ color: 0x2A5298 }));
        jp.position.y = 1.2;
        jpGroup.add(jp);

        jpGroup.position.set(x, 0, z);
        jpGroup.userData = { type: 'jetpack' };
        this.scene.add(jpGroup);
        this.powerupsList.push(jpGroup);
    }

    spawnHoverboardCollectible(x, z) {
        const hbGroup = new THREE.Group();
        const hb = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.1, 1.8), new THREE.MeshStandardMaterial({ color: 0x00FF88 }));
        hb.position.y = 1.2;
        hbGroup.add(hb);

        hbGroup.position.set(x, 0, z);
        hbGroup.userData = { type: 'hoverboard_item' };
        this.scene.add(hbGroup);
        this.powerupsList.push(hbGroup);
    }

    spawnCoinTrail(x, startZ, count = 4, yPos = 1.2) {
        const coinGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16);
        const coinMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.8, roughness: 0.2 });

        for (let k = 0; k < count; k++) {
            const coin = new THREE.Mesh(coinGeo, coinMat);
            coin.rotation.x = Math.PI / 2;
            coin.position.set(x, yPos, startZ - (k * 3));
            this.scene.add(coin);
            this.coinsList.push(coin);
        }
    }

    // -------------------------------------------------------------
    // INPUT HANDLING & POWERUPS
    // -------------------------------------------------------------
    initEvents() {
        window.addEventListener('resize', () => this.onWindowResize());

        window.addEventListener('keydown', (e) => {
            if (!this.isPlaying) return;

            switch (e.key.toLowerCase()) {
                case 'a':
                case 'arrowleft':
                    if (this.currentLane > 0) this.currentLane--;
                    break;
                case 'd':
                case 'arrowright':
                    if (this.currentLane < 2) this.currentLane++;
                    break;
                case 'w':
                case 'arrowup':
                case ' ':
                    this.jump();
                    break;
                case 's':
                case 'arrowdown':
                    this.slide();
                    break;
                case 'e':
                case 'shift':
                    this.activateHoverboard();
                    break;
            }
            this.targetX = LANES[this.currentLane];
        });

        let touchStartX = 0, touchStartY = 0;
        window.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        window.addEventListener('touchend', (e) => {
            if (!this.isPlaying) return;
            const diffX = e.changedTouches[0].clientX - touchStartX;
            const diffY = e.changedTouches[0].clientY - touchStartY;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX < -30 && this.currentLane > 0) this.currentLane--;
                if (diffX > 30 && this.currentLane < 2) this.currentLane++;
                this.targetX = LANES[this.currentLane];
            } else {
                if (diffY < -30) this.jump();
                if (diffY > 30) this.slide();
            }
        });
    }

    jump() {
        if (!this.isJumping && !this.hasJetpackActive) {
            this.isJumping = true;
            this.velocityY = 16;
        }
    }

    slide() {
        if (!this.isSliding && !this.hasJetpackActive) {
            this.isSliding = true;
            this.slideTimer = 0.6;
            this.playerGroup.scale.set(1, 0.5, 1);
            if (this.isJumping) this.velocityY = -20;
        }
    }

    activateHoverboard() {
        if (!this.isPlaying || this.hasHoverboardActive || this.hoverboardsCount <= 0) return;

        this.hasHoverboardActive = true;
        this.hoverboardsCount--;
        if (this.hoverboardCountEl) this.hoverboardCountEl.textContent = `x${this.hoverboardsCount}`;
        this.hoverboardTimer = 15;
        this.hoverboardMesh.visible = true;

        this.showPowerupBar('DANFO HOVERBOARD SHIELD 🛹', 15);
    }

    triggerJetpack() {
        this.hasJetpackActive = true;
        this.jetpackTimer = 8;
        this.jetpackMesh.visible = true;

        for (let z = -20; z > -180; z -= 30) {
            this.spawnCoinTrail(LANES[Math.floor(Math.random() * 3)], z, 5, 12.2);
        }

        this.showPowerupBar('NAIJA JETPACK SKY FLYER 🚀', 8);
    }

    showPowerupBar(name, duration) {
        if (this.powerupName && this.powerupBar) {
            this.powerupName.textContent = name;
            this.powerupBar.classList.remove('hidden');
            this.powerupProgress.style.width = '100%';
        }
    }

    // -------------------------------------------------------------
    // GAME LOOP & ANIMATION RENDERER
    // -------------------------------------------------------------
    startGame() {
        this.isPlaying = true;
        this.score = 0;
        this.coins = 0;
        this.speed = INITIAL_SPEED;
        this.currentLane = 1;
        this.targetX = LANES[1];
        this.playerY = 0;

        this.hoverboardsCount = 3;
        this.hasHoverboardActive = false;
        this.hasJetpackActive = false;
        this.hoverboardMesh.visible = false;
        this.jetpackMesh.visible = false;
        if (this.hoverboardCountEl) this.hoverboardCountEl.textContent = `x3`;
        if (this.powerupBar) this.powerupBar.classList.add('hidden');

        this.playerGroup.position.set(LANES[1], 0, 0);

        this.obstacles.forEach(o => this.scene.remove(o));
        this.coinsList.forEach(c => this.scene.remove(c));
        this.powerupsList.forEach(p => this.scene.remove(p));
        this.obstacles = [];
        this.coinsList = [];
        this.powerupsList = [];

        this.menuOverlay.classList.add('hidden');
        this.gameoverOverlay.classList.add('hidden');
        this.hud.classList.remove('hidden');

        for (let z = -40; z > -250; z -= 35) {
            this.spawnObstaclePattern(z);
        }
    }

    gameOver() {
        this.isPlaying = false;
        if (this.score > this.highScore) {
            this.highScore = Math.floor(this.score);
            localStorage.setItem('lagos_surf_highscore', this.highScore);
        }

        this.finalScore.textContent = `${Math.floor(this.score)} m`;
        this.finalCoins.textContent = `🇳🇬 ${this.coins}`;
        this.highScoreEl.textContent = `${this.highScore} m`;

        this.hud.classList.add('hidden');
        this.gameoverOverlay.classList.remove('hidden');
    }

    update(delta) {
        if (!this.isPlaying) return;

        // 1. Score & Speed
        this.speed = Math.min(MAX_SPEED, this.speed + ACCELERATION * delta);
        this.score += this.speed * delta;
        this.scoreVal.textContent = String(Math.floor(this.score)).padStart(6, '0');

        // 2. Player Movement Lerp
        this.playerGroup.position.x += (this.targetX - this.playerGroup.position.x) * 15 * delta;

        // 3. Physics (Jetpack / Jump)
        if (this.hasJetpackActive) {
            this.jetpackTimer -= delta;
            this.playerY += (12 - this.playerY) * 6 * delta;
            this.playerGroup.position.y = this.playerY;

            this.updatePowerupBar(this.jetpackTimer, 8);

            if (this.jetpackTimer <= 0) {
                this.hasJetpackActive = false;
                this.jetpackMesh.visible = false;
                this.powerupBar.classList.add('hidden');
            }
        } else if (this.isJumping) {
            this.playerY += this.velocityY * delta;
            this.velocityY -= 42 * delta;

            if (this.playerY <= 0) {
                this.playerY = 0;
                this.isJumping = false;
                this.velocityY = 0;
            }
            this.playerGroup.position.y = this.playerY;
        } else {
            if (this.playerY > 0) {
                this.playerY += (0 - this.playerY) * 10 * delta;
                if (this.playerY < 0.05) this.playerY = 0;
                this.playerGroup.position.y = this.playerY;
            }
        }

        // 4. Hoverboard & Invulnerability Timers
        if (this.hasHoverboardActive) {
            this.hoverboardTimer -= delta;
            this.updatePowerupBar(this.hoverboardTimer, 15);

            if (this.hoverboardTimer <= 0) {
                this.hasHoverboardActive = false;
                this.hoverboardMesh.visible = false;
                this.powerupBar.classList.add('hidden');
            }
        }

        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer -= delta;
        }

        if (this.isSliding) {
            this.slideTimer -= delta;
            if (this.slideTimer <= 0) {
                this.isSliding = false;
                this.playerGroup.scale.set(1, 1, 1);
            }
        }

        // 5. CONTINUOUS DYNAMIC RUNNING ANIMATIONS (ARM & LEG STRIDES)
        const runTime = this.clock.getElapsedTime() * 18;
        if (!this.isJumping && !this.hasJetpackActive) {
            // Legs Striding
            this.leftLegGroup.rotation.x = Math.sin(runTime) * 0.85;
            this.rightLegGroup.rotation.x = -Math.sin(runTime) * 0.85;

            // Arms Swinging in opposition
            this.leftArmGroup.rotation.x = -Math.sin(runTime) * 0.7;
            this.rightArmGroup.rotation.x = Math.sin(runTime) * 0.7;

            // Body running bounce
            this.torso.position.y = 1.25 + Math.abs(Math.sin(runTime * 2)) * 0.08;
            this.head.position.y = 2.0 + Math.abs(Math.sin(runTime * 2)) * 0.08;
        }

        // Police Officer Sprinting Pursuit
        this.officerGroup.position.x += (this.playerGroup.position.x - this.officerGroup.position.x) * 10 * delta;
        this.officerLeftLegGroup.rotation.x = Math.sin(runTime + 0.5) * 0.9;
        this.officerRightLegGroup.rotation.x = -Math.sin(runTime + 0.5) * 0.9;
        this.officerLeftArmGroup.rotation.x = -Math.sin(runTime + 0.5) * 0.8;
        this.officerRightArmGroup.rotation.x = Math.sin(runTime + 0.5) * 0.8;

        // 6. Move Railway Track Tiles
        this.roadTiles.forEach(tile => {
            tile.position.z += this.speed * delta;
            if (tile.position.z > 60) tile.position.z -= 300;
        });

        // 7. Check Obstacles & Collisions
        const moveDist = this.speed * delta;
        let furthestZ = 0;

        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.position.z += moveDist;
            if (obs.position.z < furthestZ) furthestZ = obs.position.z;

            const data = obs.userData;
            const pX = this.playerGroup.position.x;
            const pY = this.playerGroup.position.y;
            const pZ = this.playerGroup.position.z;

            if (
                Math.abs(pX - obs.position.x) < (data.width / 2 + 0.35) &&
                Math.abs(pZ - obs.position.z) < (data.depth / 2 + 0.35)
            ) {
                if (pY < data.height && this.invulnerableTimer <= 0) {
                    if (this.hasHoverboardActive) {
                        this.hasHoverboardActive = false;
                        this.hoverboardMesh.visible = false;
                        this.invulnerableTimer = 1.5;
                        this.powerupBar.classList.add('hidden');
                        this.scene.remove(obs);
                        this.obstacles.splice(i, 1);
                        continue;
                    } else {
                        this.gameOver();
                        return;
                    }
                }
            }

            if (obs.position.z > 15) {
                this.scene.remove(obs);
                this.obstacles.splice(i, 1);
            }
        }

        if (this.obstacles.length < 7) {
            this.spawnObstaclePattern(furthestZ - 40);
        }

        // 8. Collect Power-ups & Coins
        for (let p = this.powerupsList.length - 1; p >= 0; p--) {
            const item = this.powerupsList[p];
            item.position.z += moveDist;
            item.rotation.y += 3 * delta;

            if (this.playerGroup.position.distanceTo(item.position) < 1.6) {
                if (item.userData.type === 'jetpack') {
                    this.triggerJetpack();
                } else if (item.userData.type === 'hoverboard_item') {
                    this.hoverboardsCount++;
                    if (this.hoverboardCountEl) this.hoverboardCountEl.textContent = `x${this.hoverboardsCount}`;
                }
                this.scene.remove(item);
                this.powerupsList.splice(p, 1);
                continue;
            }

            if (item.position.z > 15) {
                this.scene.remove(item);
                this.powerupsList.splice(p, 1);
            }
        }

        for (let j = this.coinsList.length - 1; j >= 0; j--) {
            const coin = this.coinsList[j];
            coin.position.z += moveDist;
            coin.rotation.z += 4 * delta;

            if (this.playerGroup.position.distanceTo(coin.position) < 1.5) {
                this.coins += 1;
                this.coinVal.textContent = this.coins;
                this.scene.remove(coin);
                this.coinsList.splice(j, 1);
                continue;
            }

            if (coin.position.z > 15) {
                this.scene.remove(coin);
                this.coinsList.splice(j, 1);
            }
        }
    }

    updatePowerupBar(current, total) {
        if (this.powerupProgress) {
            const pct = Math.max(0, (current / total) * 100);
            this.powerupProgress.style.width = `${pct}%`;
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const delta = Math.min(this.clock.getDelta(), 0.1);
        this.update(delta);
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Start 3D Game Engine when DOM content is loaded
window.addEventListener('DOMContentLoaded', () => {
    window.lagosGame = new LagosSubwayGame3D();
});
