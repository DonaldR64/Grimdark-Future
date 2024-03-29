const GDF = (()=> {
    const version = '2024.2.16';
    const rules = '3.2.0';
    if (!state.GDF) {state.GDF = {}};
    const pageInfo = {name: "",page: "",gridType: "",scale: 0,width: 0,height: 0};
    const rowLabels = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","AA","BB","CC","DD","EE","FF","GG","HH","II","JJ","KK","LL","MM","NN","OO","PP","QQ","RR","SS","TT","UU","VV","WW","XX","YY","ZZ","AAA","BBB","CCC","DDD","EEE","FFF","GGG","HHH","III","JJJ","KKK","LLL","MMM","NNN","OOO","PPP","QQQ","RRR","SSS","TTT","UUU","VVV","WWW","XXX","YYY","ZZZ"];

    let TerrainArray = {};
    let WearyEnd = false;
    let EbbFaction = []; //used in Ebb and Flow

    let ModelArray = {}; //Individual Models, Tanks etc
    let UnitArray = {}; //Units of Models
    let currentUnitID = ""; //used in melee to track the unit that has Charge order;
    let currentActivation = ""; //used to track current activation eg. a charge - for morale and other purposes
    let nameArray = {};
    let SpellStored = {};
    let ucInfo = {};

    let hexMap = {}; 
    let EDGE;
    let xSpacing = 75.1985619844599;
    let ySpacing = 66.9658278242677;

    const DIRECTIONS = ["Northeast","East","Southeast","Southwest","West","Northwest"];

    const colours = {
        red: "#ff0000",
        blue: "#00ffff",
        yellow: "#ffff00",
        green: "#00ff00",
        purple: "#800080",
        black: "#000000",
    }

    const TurnMarkers = ["","https://s3.amazonaws.com/files.d20.io/images/361055772/zDURNn_0bbTWmOVrwJc6YQ/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055766/UZPeb6ZiiUImrZoAS58gvQ/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055764/yXwGQcriDAP8FpzxvjqzTg/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055768/7GFjIsnNuIBLrW_p65bjNQ/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055770/2WlTnUslDk0hpwr8zpZIOg/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055771/P9DmGozXmdPuv4SWq6uDvw/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055765/V5oPsriRTHJQ7w3hHRBA3A/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055767/EOXU3ujXJz-NleWX33rcgA/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055769/925-C7XAEcQCOUVN1m1uvQ/thumb.png?1695998303"];



    const sm = {
        moved: "status_Advantage-or-Up::2006462", //if unit moved
        focus: "status_Bullseye::2006535", //if has focus fire 
        fatigue: "status_sleepy",
        takeaim: "status_Target::2006531", //if has take aim
        fired: "status_Shell::5553215",
        bonusmorale: "status_green", //when has eg company standard or spell adding 1 to morale,
        minusmorale: "status_purple",
        takecover: "status_white-tower", 
        tempstealth: "status_Stealth-or-Hidden-Transparent::2006530",
        speed3: "status_Fast-or-Haste::2006485",
        speed2: "status_rolling-bomb",
        slow2: "status_brown",
        slow4: "status_Slow::2006498",
        meleeap: "status_strong",
        meleeap2: "status_fist",
        defense2: "status_death-zone",
        minusdefense: "status_pummeled",
        bonusdef: "status_Shield::2006495",
        bonusatt: "status_half-haze",
        bonusatt2: "status_tread",
        minustohit: "status_half-heart",
        flying: "status_fluffy-wing",
        regeneration: "status_chained-heart",
        onetime: "status_brown",
        bonusCaster: "status_screaming",
        poison: "status_skull",
        rangedap: "status_half-haze",
        bonusrange: "status_archery-target",
        spotting: "status_red",
        limited: "status_oneshot::5503748",
    };

    let outputCard = {title: "",subtitle: "",faction: "",body: [],buttons: [],};

    const Factions = {
        "Ultramarines": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/353049529/KtPvktw8dgMFRyHJIW-i6w/thumb.png?1690989195",
            "dice": "Ultramarines",
            "backgroundColour": "#0437F2",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#FFD700",
            "borderStyle": "5px ridge",  
        },
        "Orks": {
            "image": "",
            "dice": "Orks",
            "backgroundColour": "#3a8000",
            "titlefont": "Goblin One",
            "fontColour": "#000000",
            "borderColour": "#3a8000",
            "borderStyle": "5px ridge",  
        },
        "Deathguard": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/353239057/GIITPAhD-JdRRD2D6BREWw/thumb.png?1691112406",
            "dice": "Deathguard",
            "backgroundColour": "#B3CF99",
            "titlefont": "Anton",
            "fontColour": "#000000",
            "borderColour": "#000000",
            "borderStyle": "5px ridge",
        },
        "Blood Angels": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/354261572/BMAsmC28Ap91qYIfra71yw/thumb.png?1691796541",
            "dice": "BloodAngels",
            "backgroundColour": "#be0b07",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#000000",
            "borderStyle": "5px ridge",
        },
        "Tau": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/354348305/k_izI31oM8lRsHHma1xfag/thumb.png?1691855991",
            "dice": "Tau",
            "backgroundColour": "#ffffff",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#be0b07",
            "borderStyle": "5px groove",
        },
        "Imperial Guard": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/354557308/CrRWn51EJHMtijUM1wqB-g/thumb.webp?1691958030",
            "dice": "IG",
            "backgroundColour": "#000000",
            "titlefont": "Arial",
            "fontColour": "#ffffff",
            "borderColour": "#000000",
            "borderStyle": "5px groove",
        },
        "Space Wolves": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/360961940/GOg8nIXa8AfvA3v69KT-Vw/thumb.png?1695929748",
            "dice": "SpaceWolves",
            "backgroundColour": "#dae6ef",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#000000",
            "borderStyle": "5px groove",
        },
        "Tyranids": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/362007142/CjTYql17F5VDkqGlW_yorg/thumb.png?1696555948",
            "dice": "Tyranids",
            "backgroundColour": "#800080",
            "titlefont": "Goblin One",
            "fontColour": "#f9b822",
            "borderColour": "#f9b822",
            "borderStyle": "5px ridge",
        },
        "Ratlings": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/370033286/f7j3naWZOV20oCTltjIOcA/thumb.png?1701549101",
            "dice": "Ratlings",
            "backgroundColour": "#F4D14A",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#000000",
            "borderStyle": "5px groove",
        },
        "Necron": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/372012061/m5nGfasz3BR0CLJ9ZhfAVQ/thumb.png?1702861536",
            "dice": "Necron",
            "backgroundColour": "#828b8e",
            "titlefont": "Rye",
            "fontColour": "#39FF14",
            "borderColour": "#39FF14",
            "borderStyle": "5px solid",
        },
        "Harlequin": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/375565026/7KwGdOduTiN7y6UlUJhAkQ/thumb.png?1705284834",
            "dice": "Harlequin",
            "backgroundColour": "#fa78d5",
            "titlefont": "Arial",
            "fontColour": "#0505ff",
            "borderColour": "#0505ff",
            "borderStyle": "5px inset",
        },
        "Skitarii": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/376117525/oUCncQsuGex7cTGWCBawlg/thumb.png?1705622184",
            "dice": "Skitarii",
            "backgroundColour": "#9A1115",
            "titlefont": "Rye",
            "fontColour": "#FFFFFF",
            "borderColour": "#9A1115",
            "borderStyle": "5px dashed",
        },
        "Drukhari": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/377279496/8B8Gere84r2qqbS5JVuGmQ/thumb.png?1706281396",
            "dice": "Drukhari",
            "backgroundColour": "#000000",
            "titlefont": "Shadows Into Light",
            "fontColour": "#FFFFFF",
            "borderColour": "#871f78",
            "borderStyle": "3px outset",
        },
        "Adeptus Sororitas": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/378405665/zZCv4Z4TRaEkLeveAhLAiQ/thumb.png?1706900477",
            "dice": "Sororitas",
            "backgroundColour": "#0072bb",
            "titlefont": "Arial",
            "fontColour": "#FFFFFF",
            "borderColour": "#be0b07",
            "borderStyle": "3px groove",
        },
        "Inquisition": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/274145152/UOAkvHfOH4nQa3ZuF2953Q/thumb.png?1646521832",
            "dice": "Inquisition",
            "backgroundColour": "#000000",
            "titlefont": "Arial",
            "fontColour": "#FF0000",
            "borderColour": "#000000",
            "borderStyle": "3px solid",
        },
        "Kroot": {
            "image": "",
            "dice": "Kroot",
            "backgroundColour": "#554840",
            "titlefont": "Arial",
            "fontColour": "#C4A484",
            "borderColour": "#41533B",
            "borderStyle": "3px groove",
        },
        "Slaanesh": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/384972410/s5lV2Qa0IyWrSASrNtHJRw/thumb.png?1710704726",
            "dice": "Slaanesh",
            "backgroundColour": "#FFC0CB",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#05D5FA",
            "borderStyle": "3px groove",
        },
        "Dark Angels": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/385857621/bc1rJaCKBR4cvxgNjrMHNg/thumb.png?1711251000",
            "dice": "Dark Angels",
            "backgroundColour": "#24572B",
            "titlefont": "Arial",
            "fontColour": "#FFFFFF",
            "borderColour": "#000000",
            "borderStyle": "3px groove",
        },
        "Neutral": {
            "image": "",
            "dice": "Neutral",
            "backgroundColour": "#FFFFFF",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#00FF00",
            "borderStyle": "5px ridge",
        },

    };

    const SpellList = {
        "Imperial Guard": {
            "Flame Breath": {
                cost: 1,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 12,
                effect: "Damage",
                damage: {hits: 2,ap: 2,special: "Spell"},
                marker: "",
                sound: "Inferno",
                text: "A gout of Flame spews forth",
                fx: "System-breath-fire",
            },
            "Foresight": {
                cost: 1,
                targetInfo: "Friendly",
                targetNumber: 1,
                range: 6,
                effect: "Effect",
                damage: "",
                text: " gets +1 to Hit the next time it shoots",
                marker: sm.takeaim,
                sound: "Teleport",
                fx: "",
            },
            "Expel": {
                cost: 2,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 9,
                effect: "Damage",
                damage: {hits: 1,ap: 4,special: "Deadly(3),Spell"},
                marker: "",
                text: "A beam of psychic energy lances out",
                sound: "Beam",
                fx: "System-beam-frost",
            },
            "Protective Dome": {
                cost: 2,
                targetInfo: "Friendly",
                targetNumber: 2,
                range: 12,
                effect: "Effect",
                damage: "",
                text: " gets Stealth the next time it is shot at",
                marker: sm.tempstealth,
                sound: "Angels",
                fx: "",
            },
            "Psychic Speed": {
                cost: 3,
                targetInfo: "Friendly",
                targetNumber: 2,
                range: 12,
                effect: "Effect",
                damage: "",
                text: ' gets +3" to their base movement their next move',
                marker: sm.speed3,
                sound: "Teleport",
                fx: "",
            },
            "Tempest": {
                cost: 3,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 18,
                effect: "Damage",
                damage: {hits: 1,ap: 0,special: "Blast(9),Spell"},
                marker: "",
                text: "A swirling Vortex of Psychic Power hits the target",
                sound: "Explosion",
                fx: "System-Blast-nova-frost",
            },
        },
        "Deathguard": {
            "Blessed Virus": {
                cost: 1,
                targetInfo: "Friendly",
                targetNumber: 1,
                range: 12,
                effect: "Effect",
                damage: "",
                text: " gets Stealth the next time it is shot at",
                marker: sm.tempstealth,
                sound: "Angels",
                fx: "",
            },
            "Muscular Atrophy": {
                cost: 1,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 18,
                effect: "Damage",
                damage: {hits: 1,ap: 0,special: "Blast(3),Spell"},
                marker: "",
                text: " takes damage as their muscles atrophy",
                sound: "DCannon",
                fx: "System-Blast-nova-slime",
            },
            "Plague Curse": {
                cost: 2,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 9,
                effect: "Damage",
                damage: {hits: 1,ap: 4,special: "Deadly(3),Spell"},
                marker: "",
                text: " are cursed by Nurgle",
                sound: "for-the-dark-gods",
                fx: "System-Blast-nova-slime",
            },
            "Putrefaction": {
                cost: 2,
                targetInfo: "Friendly",
                targetNumber: 2,
                range: 12,
                effect: "Effect",
                damage: "",
                marker: sm.meleeap,
                text: " get +1AP the next time they fight in Melee",
                sound: "for-the-dark-gods",
                fx: "",
            },
            "Pestilence": {
                cost: 3,
                targetInfo: "Enemy",
                targetNumber: 2,
                range: 12,
                effect: "Effect",
                damage: "",
                marker: sm.tempslow,
                text: ' are slowed by -4"/-8" the next time they move',
                sound: "Napalm",
                fx: "",
            },
            "Rot Wave": {
                cost: 3,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 12,
                effect: "Damage",
                damage: {hits: 6,ap: 2,special: "Spell"},
                marker: "",
                sound: "Explosion",
                text: ' are hit with a wave of Rot and Slime',
                fx: "System-Blast-nova-slime",
            },
        }, 
        "Blood Angels" : {
            "Fear": {
                cost: 1,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 12,
                effect: "Effect",
                damage: "",
                marker: sm.slow2,
                sound: "for-the-glory-of-the-imperium",
                text: ' gets -2" to their base movement their next move',
                fx: "",
            },
            "Lance": {
                cost: 1,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 12,
                effect: "Damage",
                damage: {hits: 1,ap: 4,special: "Spell"},
                marker: "",
                sound: "Las",
                text: "A beam of psychic energy lances out",
                fx: "BlueLine",
            },
            "Quickness": {
                cost: 2,
                targetInfo: "Friendly",
                targetNumber: 2,
                range: 12,
                effect: "Effect",
                damage: "",
                marker: sm.meleeap2,
                sound: "for-the-glory-of-the-imperium",
                text: ' get +2AP next time they charge',
                fx: "",
            },
            "Blood Curse": {
                cost: 2,
                targetInfo: "Enemy",
                targetNumber: 2,
                range: 9,
                effect: "Damage",
                damage: {hits: 4,ap: 0,special: "Spell"},
                marker: "",
                sound: "Inferno",
                text: ' curses the Unit',
                fx: "Melta",
            },
            "Break Shields": {
                cost: 3,
                targetInfo: "Enemy",
                targetNumber: 2,
                range: 6,
                effect: "Effect",
                damage: "",
                marker: sm.defense2,
                sound: "for-the-glory-of-the-imperium",
                text: ' gets -2 to defense rolls next time they take hits',
                fx: "",
            },
            "Rage Burst": {
                cost: 3,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 12,
                effect: "Damage",
                damage: {hits: 6,ap: 2,special: "Spell"},
                marker: "",
                sound: "Inferno",
                text: ' curses the Unit',
                fx: "Melta",
            },
        },
        "Space Wolves" : {
            "Fury": {
                cost: 1,
                targetInfo: "Friendly",
                targetNumber: 1,
                range: 12,
                effect: "Effect",
                damage: "",
                marker: sm.bonusatt,
                sound: "for-the-glory-of-the-imperium",
                text: ' gets +1 attack the next time it charges',
                fx: "",
            },
            "Hurricane": {
                cost: 1,
                targetInfo: "Enemy",
                targetNumber: 2,
                range: 9,
                effect: "Damage",
                damage: {hits: 2,ap: 0,special: "Spell"},
                marker: "",
                sound: "Explosion",
                text: " is hit by a whirling vortex of air",
                fx: "System-Blast-explode-frost",
            },
            "Storm": {
                cost: 2,
                targetInfo: "Enemy",
                targetNumber: 2,
                range: 12,
                effect: "Effect",
                damage: "",
                marker: sm.minustohit,
                sound: "for-the-glory-of-the-imperium",
                text: ' get -1 to hit the next time they shoot',
                fx: "",
            },
            "Thunder": {
                cost: 2,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 12,
                effect: "Damage",
                damage: {hits: 4,ap: 2,special: "Spell"},
                marker: "",
                sound: "Inferno",
                text: ' is hit by Thunderous energy',
                fx: "System-Blast-explosion-frost",
            },
            "Lightning": {
                cost: 3,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 12,
                effect: "Damage",
                damage: {hits: 3,ap: 4,special: "Spell"},
                marker: "",
                sound: "for-the-glory-of-the-imperium",
                text: ' takes lightning bolts',
                fx: "",
            },
            "Wrath": {
                cost: 3,
                targetInfo: "Enemy",
                targetNumber: 2,
                range: 6,
                effect: "Effect",
                damage: "",
                marker: "sm.slow4",
                sound: "for-the-glory-of-the-imperium",
                text: ' curses the Unit with slowness',
                fx: "",
            },
        },
        "Tyranids" : {
            "Terror": {
                cost: 1,
                targetInfo: "Enemy",
                targetNumber: 2,
                range: 12,
                effect: "Effect",
                damage: "",
                marker: sm.minusmorale,
                sound: "",
                text: ' gets -1 on its next Morale check',
                fx: "",
            },
            "Psychic Blast": {
                cost: 1,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 9,
                effect: "Damage",
                damage: {hits: 1,ap: 2,special: "Deadly,Spell"},
                marker: "",
                sound: "",
                text: ' takes a Psychic Blast',
                fx: "",
            },
            "Animate Flora": {
                cost: 1,
                targetInfo: "Friendly",
                targetNumber: 2,
                range: 12,
                effect: "Effect",
                damage: "",
                marker: sm.flying,
                sound: "",
                text: ' grow temporary wings, can fly the next time they activate',
                fx: "",
            },
            "Shriek": {
                cost: 2,
                targetInfo: "Enemy",
                targetNumber: 2,
                range: 12,
                effect: "Damage",
                damage: {hits: 2,ap: 1,special: "Spell"},
                marker: "",
                sound: "",
                text: ' take a Psychic Shriek',
                fx: "",
            },
            "Infuse Life": {
                cost: 3,
                targetInfo: "Friendly",
                targetNumber: 2,
                range: 18,
                effect: "Effect",
                damage: "",
                marker: sm.regeneration,
                sound: "",
                text: ' is Infused with the Power of the Hive',
                fx: "",
            },
            "Overwhelm": {
                cost: 3,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 12,
                effect: "Damage",
                damage: {hits: 3,ap: 4,special: "Sniper,Spell"},
                marker: "",
                sound: "",
                text: ' is overwhelmed by Psychic Power',
                fx: "",
            },
        },
        "Necron": {
            "Star Bots": {
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 12,
                effect: "Effect",
                damage: "",
                text: "The Target get -1 to Hit the next time they Attack",
                marker: sm.minustohit,
                sound: "Teleport",
                fx: "",
            },
            "Meteor Bots": {
                cost: 1,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 12,
                effect: "Damage",
                damage: {hits: 2,ap: 2,special: "Spell"},
                text: "The Target is hit by Nanobots, streaking like meteors",
                marker: "",
                sound: "Plasma",
                fx: "",
            },
            "Assault Bots": {
                cost: 2,
                targetInfo: "Friendly",
                targetNumber: 2,
                range: 12,
                effect: "Effect",
                damage: "",
                text: 'The Target Units get +2" to their base movement their next move',
                marker: sm.speed2,
                sound: "Teleport",
                fx: "",
            },
            "Thunderbolt Bots": {
                cost: 2,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 12,
                effect: "Damage",
                damage: {hits: 2,ap: 4,special: "Sniper,Spell"},
                text: "Nanobots, streaking like thunderbolts, pick out the target",
                marker: "",
                sound: "Plasma",
                fx: "",
            },
            "Arrow Bots": {
                cost: 3,
                targetInfo: "Enemy",
                targetNumber: 2,
                range: 18,
                effect: "Effect",
                damage: "",
                text: "The Targets get -1 to Hit the next time they Shoot",
                marker: sm.minustohit,
                sound: "Teleport",
                fx: "",
            },
            "Fire Bots": {
                cost: 3,
                targetInfo: "Enemy",
                targetNumber: 2,
                range: 9,
                effect: "Damage",
                damage: {hits: 6,ap: 0,special: "Spell"},
                marker: "",
                text: "The Units are hit by explosive nano-bots",
                sound: "Explosion",
                fx: "",
            },
        },
        "Ratlings": {
            "Cracks": {
                cost: 1,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 12,
                effect: "Damage",
                damage: {hits: 2,ap: 2,special: "Spell"},
                marker: "",
                sound: "Inferno",
                text: " - Cracks open up beneath the Unit, causing damage",
                fx: "",
            },
            "Filth": {
                cost: 1,
                targetInfo: "Friendly",
                targetNumber: 2,
                range: 18,
                effect: "Effect",
                damage: "",
                text: " get Poison the next time they fight in Melee",
                marker: sm.poison,
                sound: "Teleport",
                fx: "",
            },
            "Lightning": {
                cost: 2,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 9,
                effect: "Damage",
                damage: {hits: 1,ap: 4,special: "Deadly(3),Spell"},
                marker: "",
                text: " is hit by a Bolt of Lightning",
                sound: "Beam",
                fx: "System-beam-frost",
            },
            "Sickness": {
                cost: 2,
                targetInfo: "Enemy",
                targetNumber: 2,
                range: 12,
                effect: "Effect",
                damage: "",
                text: " get -1 to Hit the next time they Shoot",
                marker: sm.minustohit,
                sound: "Teleport",
                fx: "",
            },
            "Frenzy": {
                cost: 3,
                targetInfo: "Friendly",
                targetNumber: 2,
                range: 12,
                effect: "Effect",
                damage: "",
                text: ' gets +3" to their base movement their next move',
                marker: sm.speed3,
                sound: "Teleport",
                fx: "",
            },
            "Pestilence": {
                cost: 3,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 18,
                effect: "Damage",
                damage: {hits: 1,ap: 0,special: "Blast(9),Spell"},
                marker: "",
                text: " is hit with a horrible Plague",
                sound: "Explosion",
                fx: "System-Blast-nova-slime",
            },
        },
        "Harlequin": {
            "Psychic Fog": {
                cost: 1,
                targetInfo: "Enemy",
                targetNumber: 2,
                range: 12,
                effect: "Effect",
                damage: "",
                marker: sm.minusmorale,
                sound: "",
                text: 'The Targets get -1 on their next Morale check',
                fx: "",
            },
            "Discord": {
                cost: 1,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 12,
                effect: "Damage",
                damage: {hits: 1,ap: 2,special: "Spell"},
                marker: "",
                sound: "",
                text: 'Target takes a Psychic Blast',
                fx: "",
            },
            "Shadow Dance": {
                cost: 2,
                targetInfo: "Friendly",
                targetNumber: 2,
                range: 12,
                effect: "Effect",
                damage: "",
                marker: sm.bonusdef,
                sound: "",
                text: 'Targets gets +1 Defense the next time time they take hits',
                fx: "",
            },
            "Sorrow": {
                cost: 2,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 12,
                effect: "Damage",
                damage: {hits: 2,ap: 4,special: "Sniper,Spell"},
                text: "The Target is overwhelmed with Sorrow",
                marker: "",
                sound: "Plasma",
                fx: "",
            },
            "Veil of Madness": {
                cost: 3,
                targetInfo: "Enemy",
                targetNumber: 2,
                range: 6,
                effect: "Effect",
                damage: "",
                marker: sm.tempslow,
                text: 'The Targets are slowed by -4" the next time they move',
                sound: "Napalm",
                fx: "",
            },
            "Light Shards": {
                cost: 3,
                targetInfo: "Enemy",
                targetNumber: 2,
                range: 9,
                effect: "Damage",
                damage: {hits: 6,ap: 0,special: "Spell"},
                marker: "",
                text: "The Units are hit shard of Psychic Light",
                sound: "Multilaser",
                fx: "",
            },
        },
        "Skitarii": {
            "Critical Aim": {
                cost: 1,
                targetInfo: "Friendly",
                targetNumber: 1,
                range: 6,
                effect: "Effect",
                damage: "",
                marker: sm.rangedap,
                sound: "",
                text: 'Target gets AP(+1) the next time time they shoot',
                fx: "",
            },
            "Solar Beam": {
                cost: 1,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 12,
                effect: "Damage",
                damage: {hits: 1,ap: 4,special: "Spell,Sniper"},
                marker: "",
                sound: "Laser",
                text: 'A Beam of Pure Light streams out',
                fx: "",
            },
            "Shrapnel": {
                cost: 2,
                targetInfo: "Enemy",
                targetNumber: 2,
                range: 9,
                effect: "Damage",
                damage: {hits: 4,ap: 0,special: "Spell"},
                marker: "",
                text: "The Units are hit by shrapnel",
                sound: "Explosion",
                fx: "",
            },
            "Steel Body": {
                cost: 2,
                targetInfo: "Friendly",
                targetNumber: 2,
                range: 12,
                effect: "Effect",
                damage: "",
                marker: sm.bonusdef,
                sound: "",
                text: 'Targets gets +1 Defense the next time time they take hits',
                fx: "",
            },
            "Corroded Metal": {
                cost: 3,
                targetInfo: "Enemy",
                targetNumber: 2,
                range: 12,
                effect: "Effect",
                damage: "",
                text: " get -1 to Hit the next time they Shoot",
                marker: sm.minustohit,
                sound: "",
                fx: "",
            },
            "Machine Terror": {
                cost: 3,
                targetInfo: "Enemy",
                targetNumber: 2,
                range: 9,
                effect: "Damage",
                damage: {hits: 6,ap: 0,special: "Spell"},
                marker: "",
                text: "",
                sound: "Shriek",
                fx: "",
            }
        },
        "Inquisition": {
            "Foresight": {
                cost: 1,
                targetInfo: "Friendly",
                targetNumber: 1,
                range: 6,
                effect: "Effect",
                damage: "",
                text: " gets +1 to Hit the next time it shoots",
                marker: sm.takeaim,
                sound: "Teleport",
                fx: "",
            },
            "Flame Breath": {
                cost: 1,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 12,
                effect: "Damage",
                damage: {hits: 2,ap: 2,special: "Spell"},
                marker: "",
                sound: "Inferno",
                text: 'A gout of Flame washes out',
                fx: "System-breath-fire",
            },
            "Protective Dome": {
                cost: 2,
                targetInfo: "Friendly",
                targetNumber: 2,
                range: 12,
                effect: "Effect",
                damage: "",
                text: " gets Stealth the next time it is shot at",
                marker: sm.tempstealth,
                sound: "Angels",
                fx: "",
            },
            "Expel": {
                cost: 2,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 9,
                effect: "Damage",
                damage: {hits: 1,ap: 4,special: "Spell,Deadly(3)"},
                marker: "",
                sound: "Blaster",
                text: 'A wave of Psychic Energy hits the Unit',
                fx: "",
            },
            "Psychic Speed": {
                cost: 3,
                targetInfo: "Friendly",
                targetNumber: 2,
                range: 12,
                effect: "Effect",
                damage: "",
                text: ' gets +3" to their base movement their next move',
                marker: sm.speed3,
                sound: "Teleport",
                fx: "",
            },
            "Tempest": {
                cost: 3,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 18,
                effect: "Damage",
                damage: {hits: 1,ap: 0,special: "Blast(9),Spell"},
                marker: "",
                text: "The Target is hit by a swirling Tempest of Psychic Force",
                sound: "Explosion",
                fx: "System-Blast-explode-magic",
            },

        },
        "Adeptus Sororitas": {
            "Holy Tears": {
                cost: 1,
                targetInfo: "Friendly",
                targetNumber: 2,
                range: 18,
                effect: "Effect",
                damage: "",
                text: "Target Units get Poison next time they fight in Melee",
                marker: sm.poison,
                sound: "",
                fx: "",
            },
            "Eternal Flame": {
                cost: 1,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 12,
                effect: "Damage",
                damage: {hits: 3,ap: 0,special: "Spell"},
                marker: "",
                sound: "Inferno",
                text: 'A gout of Flame washes out',
                fx: "System-breath-fire",
            },
            "Heretics": {
                cost: 2,
                targetInfo: "Enemy",
                targetNumber: 2,
                range: 18,
                effect: "Effect",
                damage: "",
                text: "Targets get -1 to Defense Rolls the next time they take hits",
                marker: sm.minusdefense,
                sound: "Angels",
                fx: "",
            },
            "Admonition": {
                cost: 2,
                targetInfo: "Enemy",
                targetNumber: 2,
                range: 12,
                effect: "Damage",
                damage: {hits: 2,ap: 4,special: "Spell"},
                marker: "",
                sound: "Blaster",
                text: 'The enemy is admonished',
                fx: "",
            },
            "Litanies": {
                cost: 3,
                targetInfo: "Friendly",
                targetNumber: 2,
                range: 12,
                effect: "Effect",
                damage: "",
                text: ' gets +12" to their range the next time they shoot',
                marker: sm.bonusrange,
                sound: "Teleport",
                fx: "",
            },
            "Righteous Wrath": {
                cost: 3,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 9,
                effect: "Damage",
                damage: {hits: 6,ap: 0,special: "Spell"},
                marker: "",
                text: "The Target is hit by the Righteous Wrath of the Sisters",
                sound: "Angels",
                fx: "System-Blast-explode-magic",
            },

        },
        "Kroot": {
            "Lean and Mean": {
                cost: 1,
                targetInfo: "Friendly",
                targetNumber: 2,
                range: 12,
                effect: "Effect",
                damage: "",
                text: 'Target Units get +2"/+4" Movement their next move',
                marker: sm.speed2,
                sound: "",
                fx: "",
            },
            "Feral Strike": {
                cost: 1,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 12,
                effect: "Damage",
                damage: {hits: 2,ap: 2,special: "Spell"},
                marker: "",
                sound: "Axe",
                text: '',
                fx: "",
            },
            "Psy-Canines": {
                cost: 2,
                targetInfo: "Friendly",
                targetNumber: 2,
                range: 12,
                effect: "Effect",
                damage: "",
                text: "Targets get AP +1 next time they fight in melee",
                marker: sm.meleeap,
                sound: "",
                fx: "",
            },
            "Quill Blast": {
                cost: 2,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 12,
                effect: "Damage",
                damage: {hits: 6,ap: 0,special: "Spell"},
                marker: "",
                sound: "Spliter",
                text: 'Psychic Quills strike the unit',
                fx: "",
            },
            "Shaper": {
                cost: 3,
                targetInfo: "Friendly",
                targetNumber: 2,
                range: 18,
                effect: "Effect",
                damage: "",
                text: 'Target Units get Regeneration next time they take wounds',
                marker: sm.regeneration,
                sound: "Teleport",
                fx: "",
            },
            "Power Maw": {
                cost: 3,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 9,
                effect: "Damage",
                damage: {hits: 1,ap: 2,special: "Spell,Deadly(6)"},
                marker: "",
                text: "",
                sound: "",
                fx: "",
            },

        },
        "Slaanesh": {
            "Seizure": {
                cost: 1,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 9,
                effect: "Damage",
                damage: {hits: 1,ap: 2,special: "Spell,Deadly(3)"},
                marker: "",
                sound: "",
                text: 'The Unit has a Seizure',
                fx: "",
            },
            "Acquiescence": {
                cost: 1,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 18,
                effect: "Effect",
                damage: "",
                text: " get -1 to Hit the next time they Shoot",
                marker: sm.minustohit,
                sound: "",
                fx: "",
            },
            "Pleasure": {
                cost: 2,
                targetInfo: "Friendly",
                targetNumber: 2,
                range: 12,
                effect: "Effect",
                damage: "",
                marker: sm.bonusdef,
                sound: "",
                text: 'Targets gets +1 Defense the next time time they take hits',
                fx: "",
            },
            "Pain": {
                cost: 2,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 12,
                effect: "Damage",
                damage: {hits: 2,ap: 4,special: "Spell"},
                marker: "",
                sound: "",
                text: 'The enemy feels Pain!!!',
                fx: "",
            },
            "Ecstasy": {
                cost: 3,
                targetInfo: "Friendly",
                targetNumber: 2,
                range: 18,
                effect: "Effect",
                damage: "",
                text: 'Target Units get +2 to hit next time they attack in melee',
                marker: sm.bonusatt2,
                sound: "Teleport",
                fx: "",
            },
            "Overload": {
                cost: 3,
                targetInfo: "Enemy",
                targetNumber: 1,
                range: 18,
                effect: "Damage",
                damage: {hits: 1,ap: 0,special: "Spell,Blast(9)"},
                marker: "",
                text: "",
                sound: "Explosion",
                fx: "",
            },

        },




    }
    




    let specialInfo = {
        "Accelerator Drone": 'This model and its unit get +6” range when firing their weapons.',
        "Advanced Tactics": 'Once per activation, before attacking, pick one other friendly unit within 12” of this model, which may move by up to 6".',
        "Aircraft": 'Must be deployed before all other units. This model ignores all units and terrain when moving/stopping, cannot seize objectives, and cannot be moved in contact with. When activated, must always move straight by 30”-36” without turning. If it moves off-table, it ends its activation, and must be deployed on any table edge at the beginning of the next round. Units targeting this model get -12” range and -1 to hit rolls.',
        "Ambush": 'This model may be kept in reserve instead of deploying. At the start of any round after the first, you may place the model anywhere, over 9” away from enemy units. If both players have Ambush, roll-off to see who goes first, and alternate deploying units. Units that deploy like this on the last round cannot seize or contest objective markers.',
        "Apex Killers": "This model and its Unit get AP +1 in melee",
        "Bad Shot": 'This model shoots at Quality 5+',
        "Battle Drills": 'This model and its unit get Furious. If they already had Furious, they get extra hits on rolls of 5-6 instead.',
        "Banner of Lust": 'This model and its unit get Strider, +1 to Morale',
        "Beacon": 'Friendly units using Ambush may ignore distance restrictions from enemies if they are deployed within 6” of this model.',
        "Blast(X)": 'Each attack ignores cover and multiplies hits by X, but cannot deal more hits than models in the target unit.',
        "Blind Faith": 'This model and its unit get Stealth',
        "Blessing of Plague": 'This model and its unit get Regeneration',
        "Blessing of Lust": 'This model and its unit move +1” on Advance, and +2” on Rush/Charge.',
        "Bomb": 'Flying over the enemy, can use this weapon even if Charging or Rushing, hits on a 6+, ignores cover',
        "Bounding": 'When activated, may be placed within d3+1"',
        "Canticles": 'This model and its unit get AP(+1) when shooting',
        "Canticle Megaphone": 'This model and its unit get +1 to morale test rolls',
        "Carnivore": "Gets +1 to hit in Melee",
        "Caster(X)": 'Gets X spell tokens at the beginning of each round, but cannot hold more than 6 tokens at once. At any point before attacking, spend as many tokens as the spells value to try casting one or more different spells. Roll one die, on 4+ resolve the effect on a target in line of sight. This model and other casters within 18” in line of sight may spend any number of tokens at the same time to give the caster +1/-1 to the roll.',
        "Celestial Infantry": 'This model gets +1 to hit rolls in melee and shooting.',
        "Chosen Veteran": 'This model gets +1 to hit rolls in melee and shooting.',
        "Counter": 'Strikes first with this weapon when charged, and the charging unit gets -1 total Impact attacks (per model with this rule).',
        "Counter-Attack": 'Strikes first when charged.',
        "Daemon": 'This model may be deployed as if it had the Ambush or the Scout rule (pick one).',
        "Dark Assault": 'This unit counts as having Ambush and may deploy on ANY round',
        "Dark Strike": 'Model and Unit get AP(+1) in melee',
        "Dark Tactics": 'Once per activation, before attacking, pick one other friendly unit within 12” of this model, which may move by up to 6".',
        "Deadly(X)": 'Assign each wound to one model, and multiply it by X. Hits from Deadly must be resolved first, and these wounds do not carry over to other models if the target is killed.',
        "Defense +X": 'Will provide +X to Defense',
        "Devout": 'When shooting at enemies within 12", hits from unmodified rolls of 6 are multiplied by 2 (only the original hit counts as a 6).',
        "Dodge": 'Enemies have -1 to hit in Melee',
        "Double Time": 'Once per activation, before attacking, pick one other friendly unit within 12”, which may move by up to 6".',
        "Elemental Power": 'Once per activation, before attacking, pick one other friendly unit within 12” of this model, which may move by up to 6".',
        "Entrenched": 'Enemies get -2 to hit when shooting at this model from over 9" away, as long as it has not moved since the beginning of its last activation.',
        "Explode(X)": 'If this model is ever 1" away from an enemy unit, it is immediately killed, and the enemy takes X*2 hits. This model automatically passes all morale tests.',
        "Extra Shooty": 'This model and its unit get Shooty. If they already had Shooty, they get extra hits on unmodified rolls of 5-6 instead',
        "Fast": 'Moves +2” when using Advance, and +4” when using Rush/Charge.',
        "Fear (X)": 'Counts as having dealt +X wounds when checking who won melee.',
        "Fearless": 'When failing a morale test, roll one die. On a 4+ its passed instead.',
        "Field Radio": "If this unit has a hero with the Double Time, Focus Fire or Take Aim rule, then it may use it on units that have a Field Radio up to 24” away.",
        "Flux": 'Unmodified rolls of 6 are multiplied by 2 (only the original hit counts as a 6)',
        "Flying": 'May go over obstacles and ignores terrain effects when moving.',
        "Frenzy": 'When charging, the model has AP(+1) and hits from unmodified rolls of 6 are multiplied by 2 (only the original hit counts as a 6)',
        "Furious": 'When charging, hits from unmodified rolls of 6 are multiplied by 2 (only the original hit counts as a 6).',
        "Gloom-Protocol": 'When this model and its unit take a wound, roll one die, and on a 6+ it is ignored. If the wound was from a spell, then it is ignored on a 4+ instead.',
        "Good Shot": 'This model shoots at Quality 4+.',
        "Graceful Brutality": 'This model and its Unit may move up to 3" after shooting',
        "Grim": 'Whenever this unit fails a morale test, it takes one wound, and the morale test counts as passed instead.',
        "Heavy Armour": '+1 added to Defense',
        "Hidden Route": 'This model and its Unit get Ambush',
        "Highly Devout": 'When shooting at enemies within 12", hits from unmodified rolls of 5-6 are multiplied by 2 (only the original hit counts as a 6)',
        "Hold the Line": 'Whenever this models unit fails a morale test, it takes one wound, and the morale test counts as passed instead.',
        "Holy Chalice": 'The hero and its unit get +1 to hit in melee and the Regeneration rule.',
        "Immobile": 'May only use Hold actions.',
        "Impact(X)": 'Gets X attacks that hit on 2+ when charging.',
        "Impact +X": 'adds that many Impact Hits',
        "Indirect": 'May target enemies that are not in line of sight, and ignores cover from sight obstructions, but gets -1 to hit rolls when shooting after moving.',
        "Inhibitor Drone": 'Enemies get -6" to their charge when trying to charge this model and its unit.',
        "Lance": 'Gets AP(+2) when charging.',
        "Lead from Behind": 'Whenever this models unit fails a morale test, it takes one wound, and the morale test counts as passed instead.',
        "Limited": 'May only be used once',
        "Lock-On": 'Ignores cover and all negative modifiers to hit rolls and range.',
        'Mad Doctor': 'This model and its unit get the Regeneration rule.',
        'Magic Absorption': 'When taking a wound, roll one die, and on a 6+ it is ignored. If the wound was from a spell, then it is ignored on a 2+ instead.',
        "Martial Prowess": 'Unit gets +1 to hit when in cover/terrain',
        "Master of Machine Lore": 'Gets X spell tokens at the beginning of each round, but cannot hold more than 6 tokens at once. At any point before attacking, spend as many tokens as the spells value to try casting one or more different spells. Roll one die, on 4+ resolve the effect on a target in line of sight. This model and other casters within 18” in line of sight may spend any number of tokens at the same time to give the caster +1/-1 to the roll.',
        "Medical Training": 'This model and its unit get the Regeneration rule.',
        "Musician": 'This model and its unit move +1” on Advance, and +2” on Rush/Charge.',
        "Mutations": 'When in melee, roll one die and apply one bonus to models with this rule: * 1-3: Attacks get Rending * 4-6: Attacks get AP(+1)',
        "No Retreat": 'Whenever this models unit fails a morale test, it takes one wound, and the morale test counts as passed instead.',
        "Overload": 'For each unmodified roll of 6 to hit when attacking, this model may roll +2 attacks with that weapon. This rule does not apply to newly generated attacks.',
        "Pain Fueled": 'This model and its unit get Regeneration',
        "Pain Immunity": 'This model and its Unit get +1 to Regeneration Rolls',
        "Pheromones": 'Once per activation, before attacking, pick one other friendly unit within 12”, which may move by up to 6".',
        "Phosphor": 'This Weapon ignores cover',
        "Piper's Calling": 'This model and its unit get Furious. If they already had Furious, they get extra hits on rolls of 5-6 instead.',
        "Poison": 'Enemy units taking wounds from weapons with this special rule cannot regenerate them, and must re-roll unmodified Defense rolls of 6 when blocking hits.',
        "Precision Shots": 'This model and its unit get AP(+1) when shooting.',
        "Protected": 'Attacks targeting units where all models have this rule count as having AP(-1), to a min. of AP(0).',
        "Prowl": 'Enemies over 12" get -2 to hit while Unit is in Terrain or Cover',
        "Psalms": 'This model and its Unit move +2" on Advance and +4" on Rush/Charge',
        "Psy-Barrier": 'When taking a wound, roll one die, and on a 6+ it is ignored. If the wound was from a spell, then it is ignored on a 4+ instead.',
        "Putrid": 'When taking a wound, roll one die. On a 6+ it is ignored',
        "Raiment of the Laughing God": 'When taking a wound, roll one die, and on a 6+ it is ignored. If the wound was from a spell, then it is ignored on a 4+ instead.',
        "Regeneration": 'When taking a wound, roll one die. On a 5+ it is ignored.',
        "Regen-Protocol": 'This model and its Unit get +1 to Regeneration Rolls',
        "Release Swarm": "Once per game, when this model is activated, you may place a new unit of 3 Scarab Swarms fully within 6” of it.",
        "Relentless": 'When using Hold actions and shooting, hits from unmodified rolls of 6 are multiplied by 2 (only the original hit counts as a 6).',
        "Reliable": 'Attacks at Quality 2+.',
        "Rending": 'Enemy units taking wounds from weapons with this special rule cannot regenerate them, and whenever you roll an unmodified to hit result of 6, that hit counts as having AP(4).',
        "Rending in Melee": 'This model gets Rending in melee.',
        "Repair": 'Once per activation, if within 2” of a unit with Tough, roll one die. On a 2+ you may repair D3 wounds from the target.',
        "Resistance": 'When taking a wound, roll one die, and on a 6+ it is ignored. If the wound was from a spell, then it is ignored on a 4+ instead.',
        "Robot": 'Whenever this unit takes a morale test, it is passed automatically. Then, roll as many dice as remaining models/tough in the unit, and for each result of 1-3 the unit takes one wound, which can not be regenerated.',
        "Ring the Bell": 'The hero and its unit move +2” on Advance, and +4” on Rush/Charge actions.',
        "Sacred Banner": 'The Unit gains Fearless',
        "Safety in Numbers": 'Once per activation, pick 2 friendly units within 12”, which get +1 to their next morale test roll.',
        "Scout": 'This model may be deployed after all other units, and may then move by up to 12”, ignoring terrain. If both players have Scout, roll-off to see who goes first, and alternate deploying units.',
        "Scurry Away": 'Once per activation, before attacking, pick one other friendly unit within 12” of this model, which may move by up to 6".',
        "Shadow-Protocol": 'This model and its Unit get Ambush',
        "Shield Drone": 'This model and its unit count as having the Stealth special rule.',
        "Shield Wall": 'This model gets +1 to defense rolls against non-spell attacks.',
        "Shooty": 'When shooting, hits from unmodified rolls of 6 are multiplied by 2 (only the original hit counts as a 6).',
        "Slayer": 'This model gets AP(+2) in melee against units where most models have Tough(3) or higher',
        "Slow": 'Moves -2” when using Advance, and -4” when using Rush/Charge.',
        "Sniper": 'Shoots at Quality 2+, and may pick one model in a unit as its target, which is resolved as if its a unit of 1.',
        "Spell Warden": 'Once per activation, pick one friendly Caster within 6”, which gets +1 to its next spell casting roll.',
        "Speed Boost": 'This model gets +2" to Advance, +4" to Charge/Rush',
        "Spiritual Guidance": 'This model and its unit get AP(+1) when shooting',
        "Spores": 'For each missed attack you may place a new unit of 3 Spore Mines or 1 Massive Spore Mine 12” away from the target, but the position is decided by your opponent. Note that this new unit can’t be activated on the round in which it is placed.',
        "Spotting Laser": 'Once per activation, before attacking, this model may pick one enemy unit within 30” in line of sight and roll one die, on a 4+ place a marker on it. Friendly units may remove markers from their target to get +X to hit rolls when shooting, where X is the number of removed markers.',
        "Stealth": 'Enemies get -1 to hit rolls when shooting at units where all models have this rule from over 9" away.',
        "Stealth Drones (X)": 'Enemy units over 9” away get -1 to hit rolls when shooting per drone.',
        "Strider": 'May ignore the effects of difficult terrain when moving.',
        'Take Aim': 'Once per activation, before attacking, pick one friendly unit within 12” of this model, which gets +1 to hit next time it shoots.',
        'Takedown': "Once per game, when this model attacks in melee, you may pick one model in the unit as its target, and make 1 attack at Quality 2+ with AP(1) and Deadly(3), which is resolved as if it's a unit of 1.",
        'Tall(X)': 'Model is Tall enough to see over some terrain. X is height of model',
        "Transport(X)": 'May transport up to X models or Heroes with up to Tough(6), and non-Heroes with up to Tough(3) which occupy 3 spaces each. Units may deploy inside or embark by moving into contact, and may use any action to disembark, but may only move up to 6”. If a unit is inside a transport when it is destroyed, then it takes a dangerous terrain test, is immediately Shaken, and surviving models must be placed within 6” of the transport before it is removed.',
        "Trueborn": '+1 to hit in melee and shooting',
        "Tunneller": 'Counts as Ambush, but may deploy up to 1" away from Enemy Teams',
        "Undead": 'Whenever this unit takes a morale test, it is passed automatically. Then, roll as many dice as remaining models/tough in the unit, and for each result of 1-3 the unit takes one wound, which can not be regenerated.',
        "Very Fast": 'This model moves +4” when using Advance and +8” when using Rush/Charge.',
        "Veteran Infantry": 'This model gets +1 to hit rolls in melee and shooting.',
        "Veteran Walker": 'This model gets +1 to hit rolls in melee and shooting.',
        "Volley Fire": 'The hero and its unit count as having the Relentless special rule: When using Hold actions, for each unmodified result of 6 to hit, this model deals 1 extra hit.',
        "War Chant": 'This model and its unit get Furious. If they already had Furious, they get extra hits on rolls of 5-6 instead.',
        "War Cry": 'This model and its Unit get +2" to Advance, +4" to Charge/Rush',
        "War Hymns": 'This model and its unit get AP(+1) in melee.',
        "Warning Cry": 'Enemy Units cannot be set up within 12" of this Unit while using Ambush',
        "Witch Hunter": 'When taking a wound, roll one die, and on a 6+ it is ignored. If the wound was from a spell, then it is ignored on a 2+ instead.',
    }


    const TerrainInfo = {
        "#000000": {name: "Hill 1", height: 1,los: "Open",cover: false,move: "Normal"},
        "#434343": {name: "Hill 2", height: 2,los: "Open",cover: false,move: "Normal"},  
        "#666666": {name: "Hill 3",height:3,los: "Open",cover: false,move: "Normal"},
        "#c0c0c0": {name: "Hill 4",height:4,los: "Open",cover: false,move: "Normal"},
        "#d9d9d9": {name: "Hill 5",height:5,los: "Open",cover: false,move: "Normal"},
    
        "#ffffff": {name: "Spire", height: 2,los: "Blocked",cover: false,move: "Impassable"}, 
        "#00ffff": {name: "Stream", height: 0,los: "Partial",cover: false,move: "Difficult"}, 
        "#00ff00": {name: "Woods",height: 2,los: "Partial",cover: true,move: "Difficult"},
        "#b6d7a8": {name: "Scrub",height: 0,los: "Open",cover: true,move: "Normal"},
        "#9900ff": {name: "Ditch Hill",height: -1,los: "Open",cover: false,move: "Normal"},
        "#fce5cd": {name: "Craters",height: 0,los: "Open",cover: true,move: "Difficult"},
        "#0000ff": {name: "Swamp", height: 0,los: "Open",cover: true,move: "Difficult"}, 
        "#6aa84f": {name: "Jungle", height: 2,los: "Partial",cover: true,move: "Difficult"}, 
        "#0000ff": {name: "Lake", height: 0,los: "Open",cover: true,move: "Difficult"}, 

        "#ffff00": {name: "Rubble", height: 0,los: "Open",cover: true,move: "Difficult"}, 

    };


    const MapTokenInfo = {
        "Woods": {name: "Woods",height: 2,los: "Partial",cover: true,move: "Difficult"},
        "Hedge": {name: "Hedge",height: 0,los: "Open",cover: true,move: "Normal"},
        "Crops": {name: "Crops",height: 0,los: "Open",cover: true,move: "Normal"},
        "Ruins": {name: "Ruins",height: 1,los: "Partial",cover: true,move: "Dangerous if Rush/Charge"},
        "Imperial Building A": {name: "Building",height: 1,los: "Blocked",cover: true,move: "Difficult"},
        "Imperial Building B": {name: "Building",height: 2,los: "Blocked",cover: true,move: "Difficult"},
        "Imperial Building C": {name: "Building",height: 3,los: "Blocked",cover: true,move: "Difficult"},
        "Wood Building A": {name: "Building",height: 1,los: "Blocked",cover: true,move: "Difficult"},
        "Minefield": {name: "Minefield",height: 0,los: "Open",cover: false,move: "Dangerous"},
        "Razorwire": {name: "Razorwire",height: 0,los: "Open",cover: false,move: "Dangerous for Infantry"},
        "Drums": {name: "Storage Drums",height: .5,los: "Partial",cover: true,move:"Normal"},
        "Pipe": {name: "Pipe",height: .5,los: "Partial",cover: true,move:"Difficult"},
        "Crater": {name: "Crater",height: 0,los: "Open",cover: true,move:"Difficult"},



    }


    const simpleObj = (o) => {
        let p = JSON.parse(JSON.stringify(o));
        return p;
    };

    const getCleanImgSrc = (imgsrc) => {
        let parts = imgsrc.match(/(.*\/images\/.*)(thumb|med|original|max)([^?]*)(\?[^?]+)?$/);
        if(parts) {
            return parts[1]+'thumb'+parts[3]+(parts[4]?parts[4]:`?${Math.round(Math.random()*9999999)}`);
        }
        return;
    };

    const tokenImage = (img) => {
        //modifies imgsrc to fit api's requirement for token
        img = getCleanImgSrc(img);
        img = img.replace("%3A", ":");
        img = img.replace("%3F", "?");
        img = img.replace("med", "thumb");
        return img;
    };

    const stringGen = () => {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 6; i++) {
            text += possible.charAt(Math.floor(randomInteger(possible.length)));
        }
        return text;
    };

    const findCommonElements = (arr1,arr2) => {
        //iterates through array 1 and sees if array 2 has any of its elements
        //returns true if the arrays share an element
        return arr1.some(item => arr2.includes(item));
    };

    const DeepCopy = (variable) => {
        variable = JSON.parse(JSON.stringify(variable))
        return variable;
    };

    const PlaySound = (name) => {
        let sound = findObjs({type: "jukeboxtrack", title: name})[0];
        if (sound) {
            sound.set({playing: true,softstop:false});
        }
    };

    const FX = (fxname,model1,model2) => {
        //model2 is target, model1 is shooter
        //if its an area effect, model1 isnt used
        if (fxname.includes("System")) {
            //system fx
            fxname = fxname.replace("System-","");
            if (fxname.includes("Blast")) {
                fxname = fxname.replace("Blast-","");
                spawnFx(model2.location.x,model2.location.y, fxname);
            } else {
                spawnFxBetweenPoints(model1.location, model2.location, fxname);
            }
        } else {
            let fxType =  findObjs({type: "custfx", name: fxname})[0];
            if (fxType) {
                spawnFxBetweenPoints(model1.location, model2.location, fxType.id);
            }
        }
    }

    const EldarFactions = ["Harlequin","Dark Eldar"];
    const EldarNames = ["Asurmen","Asuryani","Baharroth","Eldanesh","Fuegan","Idranel","Irillyth","Yriel","Mehlendri","Lathriel","Karandras"];
    const SpaceMarineFactions = ["Blood Angels","Ultramarines","Space Wolves","Dark Angels"];
    const SpaceMarineNames = ["Felix","Valerius","Valentine","Lucius","Cassius","Magnus","Claudius","Adrian","August","Gaius","Agrippa","Marcellus","Silas","Atticus","Jude","Sebastian","Miles","Magnus","Aurelius","Leo"];
    const FactionNames = {
        Deathguard: ["Blight","Pustus","Bilegore","Cachexis","Clotticus","Colathrax","Corpulux","Poxmaw","Dragan","Festardius","Fethius","Fugaris","Gangrous","Rotheart","Glauw","Leprus","Kholerus","Malarrus","Necrosius","Phage"],
        "Imperial Guard": ["Anders","Bale","Bask","Black","Creed","Dekkler","Gruber","Hekler","Janssen","Karsk","Kell","Lenck","Lynch","Mira","Niels","Odon","Ovik","Pask","Quill","Rogg","Ryse","Stahl","Stein","Sturm","Trane","Volkok","Wulfe"],    
        Orks: ["Gorbad","Snagrod","Grog Ironteef","Blaktoof","Vorsk","Grimskull","Grax","Mork","Gork"],
        Ratlings: ["Bak Bak","Doomclaw","Twitchtail","Fang","Gnawdwell","Gutgnaw","Kreesqueek","Poxtik","Queek Headtaker","Sharptail","Skabritt","Sneek","Vermintail"],
        Necron: ["Aetekh","Ahmose","Amenhotep","Khafre","Menes","Sneferu","Darius","Khufu"],
        Skitarii: ["Zeta","Theta","Iota","Xi","Omicron","Rho","Tau","Phi","Psi","Omega","Alpha","Beta","Gamma"],
        Drukhari: ["K'shaic","Kronos","Kaspian","Korolus","Kamir","Kassius","Kraillach","Krael","Kalas","Kane"],
        Inquisition: ["Angmar","Belial","Castinus","Dante","Draco","Enoch","Erasmus","Gideon","Heldane","Ishmael","Kane","Magnus","Orpheus"],
        "Adeptus Sororitas": ["Aspira","Celestine","Decima","Dominica","Evangeline","Genevieve","Grace","Hope","Katherine","Sabine"],
        Tau: ["Shi'ur","Por'o","Kai","Vor","Shi","Ru","Ni","Chi-Ha","Tor-lak"],
        Kroot: ["Anghkor", "Arakah", "Gakhan", "Gorok", "Jiynko", "Khibala", "Orek", "Grekh", "Kro", "Prok", "Trosk"],
        Slaanesh: ["Azalea","Mistress","Eliaxus","Jago","Luxuria","Clementine"],


    }

    const Naming = (name,rank,faction) => {
        name = name.replace(faction + " ","");
        name = name.replace("Primaris ","");
        if (name.includes("w/")) {
            name = name.split("w/")[0];
        } else if (name.includes("//")) {
            name = name.split("//")[0];
        }
        name = name.trim();
        if (rank > 3 && faction !== "Tyranids") {
            if (SpaceMarineFactions.includes(faction)) {
                name += " " + SpaceMarineNames[randomInteger(SpaceMarineNames.length - 1)];
            } else if (EldarFactions.includes(faction)) {
                name  += " " + EldarNames[randomInteger(EldarNames.length - 1)];
            } else {
                name += " " + FactionNames[faction][randomInteger(FactionNames[faction].length - 1)];
            }
        } else {
            if (nameArray[name]) {
                nameArray[name]++;
            } else {
                nameArray[name] = 1;
            }
            name += " " + nameArray[name];
        }

        return name;
    }

    //Retrieve Values from Character Sheet Attributes
    const Attribute = (character,attributename) => {
        //Retrieve Values from Character Sheet Attributes
        let attributeobj = findObjs({type:'attribute',characterid: character.id, name: attributename})[0]
        let attributevalue = "";
        if (attributeobj) {
            attributevalue = attributeobj.get('current');
        }
        return attributevalue;
    };

    const AttributeArray = (characterID) => {
        let aa = {}
        let attributes = findObjs({_type:'attribute',_characterid: characterID});
        for (let j=0;j<attributes.length;j++) {
            let name = attributes[j].get("name")
            let current = attributes[j].get("current")   
            if (!current || current === "") {current = " "} 
            aa[name] = current;

        }
        return aa;
    };

    const AttributeSet = (characterID,attributename,newvalue,max) => {
        if (!max) {max = false};
        let attributeobj = findObjs({type:'attribute',characterid: characterID, name: attributename})[0]
        if (attributeobj) {
            if (max === true) {
                attributeobj.set("max",newvalue)
            } else {
                attributeobj.set("current",newvalue)
            }
        } else {
            if (max === true) {
                createObj("attribute", {
                    name: attributename,
                    current: newvalue,
                    max: newvalue,
                    characterid: characterID,
                });            
            } else {
                createObj("attribute", {
                    name: attributename,
                    current: newvalue,
                    characterid: characterID,
                });            
            }
        }
    };

    const DeleteAttribute = (characterID,attributeName) => {
        let attributeObj = findObjs({type:'attribute',characterid: characterID, name: attributeName})[0]
        if (attributeObj) {
            attributeObj.remove();
        }
    }




    const ButtonInfo = (phrase,action) => {
        let info = {
            phrase: phrase,
            action: action,
        }
        outputCard.buttons.push(info);
    };

    const SetupCard = (title,subtitle,faction) => {
        outputCard.title = title;
        outputCard.subtitle = subtitle;
        outputCard.faction = faction;
        outputCard.body = [];
        outputCard.buttons = [];
        outputCard.inline = [];
    };

    const DisplayDice = (roll,faction,size) => {
        roll = roll.toString();
        if (!Factions[faction] || !faction) {
            faction = "Neutral";
        }
        let tablename = Factions[faction].dice;
        let table = findObjs({type:'rollabletable', name: tablename})[0];
        let obj = findObjs({type:'tableitem', _rollabletableid: table.id, name: roll })[0];        
        let avatar = obj.get('avatar');
        let out = "<img width = "+ size + " height = " + size + " src=" + avatar + "></img>";
        return out;
    };


    const HexInfo = {
        size: {
            x: 75.1985619844599/Math.sqrt(3),
            y: 66.9658278242677 * 2/3,
        },
        pixelStart: {
            x: 37.5992809922301,
            y: 43.8658278242683,
        },
        //xSpacing: 75.1985619844599,
        halfX: 75.1985619844599/2,
        //ySpacing: 66.9658278242677,
        width: 75.1985619844599,
        height: 89.2877704323569,
        directions: {},
    };

    const M = {
            f0: Math.sqrt(3),
            f1: Math.sqrt(3)/2,
            f2: 0,
            f3: 3/2,
            b0: Math.sqrt(3)/3,
            b1: -1/3,
            b2: 0,
            b3: 2/3,
    };

    class Point {
        constructor(x,y) {
            this.x = x;
            this.y = y;
        }
    };

    class Hex {
        constructor(q,r,s) {
            this.q = q;
            this.r =r;
            this.s = s;
        }

        add(b) {
            return new Hex(this.q + b.q, this.r + b.r, this.s + b.s);
        }
        subtract(b) {
            return new Hex(this.q - b.q, this.r - b.r, this.s - b.s);
        }
        static direction(direction) {
            return HexInfo.directions[direction];
        }
        neighbour(direction) {
            //returns a hex (with q,r,s) for neighbour, specify direction eg. hex.neighbour("NE")
            return this.add(HexInfo.directions[direction]);
        }
        neighbours() {
            //all 6 neighbours
            let results = [];
            for (let i=0;i<DIRECTIONS.length;i++) {
                results.push(this.neighbour(DIRECTIONS[i]));
            }
            return results;
        }



        len() {
            return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2;
        }
        distance(b) {
            return this.subtract(b).len();
        }
        round() {
            var qi = Math.round(this.q);
            var ri = Math.round(this.r);
            var si = Math.round(this.s);
            var q_diff = Math.abs(qi - this.q);
            var r_diff = Math.abs(ri - this.r);
            var s_diff = Math.abs(si - this.s);
            if (q_diff > r_diff && q_diff > s_diff) {
                qi = -ri - si;
            }
            else if (r_diff > s_diff) {
                ri = -qi - si;
            }
            else {
                si = -qi - ri;
            }
            return new Hex(qi, ri, si);
        }
        lerp(b, t) {
            return new Hex(this.q * (1.0 - t) + b.q * t, this.r * (1.0 - t) + b.r * t, this.s * (1.0 - t) + b.s * t);
        }
        linedraw(b) {
            //returns array of hexes between this hex and hex 'b'
            var N = this.distance(b);
            var a_nudge = new Hex(this.q + 1e-06, this.r + 1e-06, this.s - 2e-06);
            var b_nudge = new Hex(b.q + 1e-06, b.r + 1e-06, b.s - 2e-06);
            var results = [];
            var step = 1.0 / Math.max(N, 1);
            for (var i = 0; i < N; i++) {
                results.push(a_nudge.lerp(b_nudge, step * i).round());
            }
            return results;
        }
        label() {
            //translate hex qrs to Roll20 map label
            let doubled = DoubledCoord.fromCube(this);
            let label = rowLabels[doubled.row] + (doubled.col + 1).toString();
            return label;
        }

        radius(rad) {
            //returns array of hexes in radius rad
            //Not only is x + y + z = 0, but the absolute values of x, y and z are equal to twice the radius of the ring
            let results = [];
            let h;
            for (let i = 0;i <= rad; i++) {
                for (let j=-i;j<=i;j++) {
                    for (let k=-i;k<=i;k++) {
                        for (let l=-i;l<=i;l++) {
                            if((Math.abs(j) + Math.abs(k) + Math.abs(l) === i*2) && (j + k + l === 0)) {
                                h = new Hex(j,k,l);
                                results.push(this.add(h));
                            }
                        }
                    }
                }
            }
            return results;
        }
        angle(b) {
            //angle between 2 hexes
            let origin = hexToPoint(this);
            let destination = hexToPoint(b);

            let x = Math.round(origin.x - destination.x);
            let y = Math.round(origin.y - destination.y);
            let phi = Math.atan2(y,x);
            phi = phi * (180/Math.PI);
            phi = Math.round(phi);
            phi -= 90;
            phi = Angle(phi);
            return phi;
        }        
    };

    class DoubledCoord {
        constructor(col, row) {
            this.col = col;
            this.row = row;
        }
        static fromCube(h) {
            var col = 2 * h.q + h.r;
            var row = h.r;
            return new DoubledCoord(col, row);//note will need to use rowLabels for the row, and add one to column to translate from 0
        }
        toCube() {
            var q = (this.col - this.row) / 2; //as r = row
            var r = this.row;
            var s = -q - r;
            return new Hex(q, r, s);
        }
    };

    class Model {
        constructor(tokenID,unitID,player,existing){
            if (!existing) {existing = false};
            let token = findObjs({_type:"graphic", id: tokenID})[0];
            let char = getObj("character", token.get("represents")); 
            let attributeArray = AttributeArray(char.id);
            let faction = attributeArray.faction;
            let type = attributeArray.type;
            let location = new Point(token.get("left"),token.get("top"));
            let hex = pointToHex(location);
            let hexLabel = hex.label();

            let size = "Standard";
            let radius = 1;
            let vertices = TokenVertices(token);

            let defense = parseInt(attributeArray.defense);

            if (token.get("width") > 100 || token.get("height") > 100) {
                size = "Large";
                let w = token.get("width")/2;
                let h = token.get("height")/2;
                radius = Math.ceil(Math.sqrt(w*w + h*h)/70);
            }

            //weapons
            let weaponArray = [];
            let wnames = [];
            let infoArray = [];
            let counterFlag = false;
            let sniperFlag = false;

            for (let i=1;i<11;i++) {
                let wname = attributeArray["weapon"+i+"name"];
                let wequipped = attributeArray["weapon"+i+"equipped"];
                if (wequipped !== "Equipped") {continue};
                if (!wname || wname === "" || wname === undefined || wname === " ") {continue};
                let wtype = attributeArray["weapon" + i + "type"];
                let wrange = parseInt(attributeArray["weapon"+i+"range"]);
                if (isNaN(wrange) || wtype === "CCW") {
                    wrange = 2;
                }
                let wattack = parseInt(attributeArray["weapon"+i+"attack"]);
                let wap = parseInt(attributeArray["weapon"+i+"ap"]);
                if (!wap || isNaN(wap) || wap === " ") {
                    wap = 0;
                    AttributeSet(char.id,"weapon"+i+"ap",0);
                }
                let wspecial = attributeArray["weapon"+i+"special"];
                if (!wspecial || wspecial === "") {
                    wspecial = " ";
                }
                if (wspecial !== " ") {
                    //puts info on weapon specials on sheet
                    let ws = wspecial.split(",");
                    for (let s=0;s<ws.length;s++) {
                        let wss = ws[s].trim();
                        infoArray.push(wss);
                    }
                }
                if (wspecial.includes("Counter")) {
                    counterFlag = true;
                }
                if (wspecial.includes("Sniper")) {
                    sniperFlag = true;
                }
                let wsound = attributeArray["weapon"+i+"sound"];
                let wfx = attributeArray["weapon"+i+"fx"];
                let weapon = {
                    name: wname,
                    type: wtype,
                    range: wrange,
                    attack: wattack,
                    ap: wap,
                    special: wspecial,
                    sound: wsound,
                    fx: wfx,
                }
                weaponArray.push(weapon);
                wnames.push(wname);
            }
            wnames = wnames.toString();

            //update sheet with info
            let specials = attributeArray.special;
            if (!specials || specials === "") {
                specials = " ";
            }
            specials = specials.split(";");
            for (let i=0;i<specials.length;i++) {
                let special = specials[i].trim();
                let attName = "special" + i;
                AttributeSet(char.id,attName,special);
                infoArray.push(special);
            }
            
            let upgrades = [];
            for (let i=1;i<11;i++) {
                let equipped = attributeArray["up"+i+"equipped"];
                let upgrade = attributeArray["up"+i+"name"];
                if (equipped === "Equipped") {
                    upgrades.push(upgrade);                    
                };
            }
     
            for (let i=0;i<upgrades.length;i++) {
                let upgrade = upgrades[i];
                if (upgrade.includes("(")) {
                    upgrade = upgrade.match(/\((.*?)\)/g).map(b=>b.replace(/\(|(.*?)\)/g,"$1"));
                }
                upgrade = upgrade.toString();
                upgrade = upgrade.split(",");
                for (let j=0;j<upgrade.length;j++) {
                    let up = upgrade[j].trim();
                    infoArray.push(up);
                    if (up === "Defense +1") {
                        defense += 1;
                    }

                }
            }

            infoArray = [...new Set(infoArray)];

            infoArray.sort(function (a,b) {
                let a1 = a.charAt(0).toLowerCase();
                let b1 = b.charAt(0).toLowerCase();
                if (a1<b1) {return -1};
                if (a1>b1) {return 1};
                return 0;
            });
   
            for (let i=0;i<10;i++) {
                let specName = infoArray[i];
                if (!specName || specName === "") {continue}
                if (specName.includes("(")) {
                    let index = specName.indexOf("(");
                    specName = specName.substring(0,index);
                    specName += "(X)";
                }
                if (specName.includes("+")) {
                    let index = specName.indexOf("+");
                    specName = specName.substring(0,index);
                    specName += "+X";
                }
                let specInfo = specialInfo[specName];
                if (specName) {
                    specName += ": ";
                }
                if (!specInfo && specName) {
                    specInfo = "Not in Database Yet";
                }
                let atName = "spec" + (i+1) + "Name";
                let atText = "spec" + (i+1) + "Text";

                if (!specName) {
                    DeleteAttribute(char.id,atName);
                } else {
                    AttributeSet(char.id,atName,specName);
                    AttributeSet(char.id,atText,specInfo);
                }
            }

            let special = infoArray.toString();
            if (!special || special === "" || special === " ") {
                special = " ";
            }
            if (sniperFlag === true) {
                special += ",Sniper";
            }

            if (special.includes("Impact(")) {
                let index = special.indexOf("Impact(") + 7;
                let att = parseInt(special.charAt(index));
                if (special.includes("Impact +")) {
                    index = special.indexOf("Impact +") + 8;
                    att += parseInt(special.charAt(index));
                }
                weaponArray.unshift({
                    name: "Impact",
                    type: "CCW",
                    range: 3,
                    attack: att,
                    ap: 0,
                    special: " ",
                    sound: "Staff", //add crunchy sound here
                    fx: "",
                })
                wnames = "Impact," + wnames;


            }

            let rank = parseInt(attributeArray.rank);
            let name;
            if (existing === false) {
                name = Naming(char.get("name"),rank,faction);
            } else {
                name = token.get("name");
            }
            upgrades = upgrades.toString() || " ";

            this.name = name;
            this.type = type;
            this.id = tokenID;
            this.unitID = unitID;
            this.player = player;
            this.faction = faction;
            this.location = location;
            this.hex = hex;
            this.hexLabel = hexLabel;
            this.startHex = hex;
            this.special = special;
            this.upgrades = upgrades;
            this.quality = parseInt(attributeArray.quality);
            this.defense = parseInt(attributeArray.defense);
            this.toughness = parseInt(attributeArray.toughness);
            this.token = token;
            this.weaponArray = weaponArray;
            this.weapons = wnames;
            this.counter = counterFlag;
            this.fired = [];
            this.spellsCast = [];
            this.wnames = wnames;
            this.size = size;
            this.radius = radius;
            this.vertices = vertices;
            this.targetID = "";//temp, used in LOS 
            this.rank = rank;
            this.largeHexList = []; //hexes that have parts of larger token, mainly for LOS 
            ModelArray[tokenID] = this;
            hexMap[hexLabel].tokenIDs.push(token.id);
            if (this.size === "Large") {
                LargeTokens(this); 
            }
            this.opponent = "";
            this.specialsUsed = [];


        }

        kill() {
            let index = hexMap[this.hexLabel].tokenIDs.indexOf(this.id);
            if (index > -1) {
                hexMap[this.hexLabel].tokenIDs.splice(index,1);
            }
            if (this.size === "Large") {
                ClearLarge(this); 
            }            
            let unit = UnitArray[this.unitID];
            unit.remove(this);
            if (this.token) {
                this.token.set({
                    status_dead: true,
                    layer: "map",
                })
                toFront(this.token);
            }
            delete ModelArray[this.id];
        }
    }

    class Unit {
        constructor(player,faction,unitID,unitName) {
            if (!unitID) {
                unitID = stringGen();
            }
            this.id = unitID;
            this.name                    = unitName;
            this.modelIDs = [];
            this.player = player;
            this.faction = faction;
            this.activated = false;
            this.order = "";
            this.deployed = false; //true if deployed from ambush this turn
            this.targetIDs = []; //temp, used to track targets in firing as max of 2
            this.hitArray = []; //used to track hits
            state.GDF.modelCounts[this.id] = 0
            UnitArray[unitID] = this;
        }

        add(model) {
            if (this.modelIDs.includes(model.id) === false) {
                if (model.token.get("aura1_color") === colours.green || model.type === "Hero") {
                    this.modelIDs.unshift(model.id);
                } else {
                    this.modelIDs.push(model.id);
                    this.modelIDs.sort((a,b) => {
                        return parseInt(ModelArray[b].rank) - parseInt(ModelArray[a].rank);
                    })
                }
            }
            state.GDF.modelCounts[this.id]++;
        }

        remove(model) {
            let index = this.modelIDs.indexOf(model.id);
            if (index > -1) {
                this.modelIDs.splice(index,1);
                if (index === 0 && this.modelIDs.length > 0) {
                    let ac = model.token.get("aura1_color");
                    let stm = model.token.get("statusmarkers");
                    ModelArray[this.modelIDs[0]].token.set({
                        aura1_color: ac,
                        statusmarkers: stm,
                    })
                }
            }
            if (this.modelIDs.length === 0) {
                //Unit Destroyed
                delete UnitArray[this.id];
            }
        }

        halfStrength() {
            let result = false;
            if (((this.modelIDs.length <= Math.floor(state.GDF.modelCounts[this.id] / 2)) || (state.GDF.modelCounts[this.id] === 1 && parseInt(ModelArray[this.modelIDs[0]].token.get("bar1_value")) <= Math.floor(parseInt(ModelArray[this.modelIDs[0]].token.get("bar1_max")))/2))) {
                result = true;
            }
            return result;
        }

        routs() {
            this.modelIDs.forEach((id) => {
                let model = ModelArray[id];
                model.token.set({
                    status_dead: true,
                    layer: "map",
                });
                toFront(model.token)
                delete ModelArray[this.id];
            });
            delete UnitArray[this];
        }

        shaken() {
            let leader = ModelArray[this.modelIDs[0]];
            leader.token.set("aura1_color",colours.red);
            _.each(this.modelIDs,id => {
                let model = ModelArray[id];
                if (model) {
                    model.token.set("tint_color",colours.red);
                }
            })
        }

        shakenCheck() {
            let leader = ModelArray[this.modelIDs[0]];
            if (!leader) {return false};
            if (leader.token.get("tint_color") ===colours.red) {
                return true;
            } else {
                return false;
            }
        }

        rally() {
            _.each(this.modelIDs,id => {
                let model = ModelArray[id];
                if (model) {
                    model.token.set("tint_color","transparent");
                }
            })
        }
    }

    const UnitMarkers = ["Plus-1d4::2006401","Minus-1d4::2006429","Plus-1d6::2006402","Minus-1d6::2006434","Plus-1d20::2006409","Minus-1d20::2006449","Hot-or-On-Fire-2::2006479","Animal-Form::2006480","Red-Cloak::2006523","A::6001458","B::6001459","C::6001460","D::6001461","E::6001462","F::6001463","G::6001464","H::6001465","I::6001466","J::6001467","L::6001468","M::6001469","O::6001471","P::6001472","Q::6001473","R::6001474","S::6001475"];

    const ModelDistance = (model1,model2) => {
        let hexes1 = [model1.hex];
        let hexes2 = [model2.hex];
        if (model1.size === "Large") {
            hexes1 = hexes1.concat(model1.largeHexList);
        }
        if (model2.size === "Large") {
            hexes2 = hexes2.concat(model2.largeHexList);
        }
        let closestDist = Infinity;
        let closestHex1 = model1.hex;
        let closestHex2 = model2.hex;

        for (let i=0;i<hexes1.length;i++) {
            let hex1 = hexes1[i];
            for (let j=0;j<hexes2.length;j++) {
                let hex2 = hexes2[j];
                let dist = hex1.distance(hex2);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestHex1 = hex1;
                    closestHex2 = hex2;
                }
            }
        }
        closestDist -= 1; //as its distance between bases
        let info = {
            distance: closestDist,
            hex1: closestHex1,
            hex2: closestHex2,
        }
        return info;
    }

    const pointToHex = (point) => {
        let x = (point.x - HexInfo.pixelStart.x)/HexInfo.size.x;
        let y = (point.y - HexInfo.pixelStart.y)/HexInfo.size.y;
        let q = M.b0 * x + M.b1 * y;
        let r = M.b2 * x + M.b3 * y;
        let s = -q-r;
        let hex = new Hex(q,r,s);
        hex = hex.round();
        return hex;
    }

    const hexToPoint = (hex) => {
        let q = hex.q;
        let r = hex.r;
        let x = (M.f0 * q + M.f1 * r) * HexInfo.size.x;
        x += HexInfo.pixelStart.x;
        let y = (M.f2 * r + M.f3 * r) * HexInfo.size.y;
        y += HexInfo.pixelStart.y;
        let point = new Point(x,y);
        return point;
    }


    const getAbsoluteControlPt = (controlArray, centre, w, h, rot, scaleX, scaleY) => {
        let len = controlArray.length;
        let point = new Point(controlArray[len-2], controlArray[len-1]);
        //translate relative x,y to actual x,y 
        point.x = scaleX*point.x + centre.x - (scaleX * w/2);
        point.y = scaleY*point.y + centre.y - (scaleY * h/2);
        point = RotatePoint(centre.x, centre.y, rot, point);
        return point;
    }

    const XHEX = (pts) => {
        //makes a small group of points for checking around centre
        let points = pts;
        points.push(new Point(pts[0].x - 20,pts[0].y - 20));
        points.push(new Point(pts[0].x + 20,pts[0].y - 20));
        points.push(new Point(pts[0].x + 20,pts[0].y + 20));
        points.push(new Point(pts[0].x - 20,pts[0].y + 20));
        return points;
    }

    const Angle = (theta) => {
        while (theta < 0) {
            theta += 360;
        }
        while (theta > 360) {
            theta -= 360;
        }
        return theta
    }   

    const RotatePoint = (cX,cY,angle, p) => {
        //cx, cy = coordinates of the centre of rotation
        //angle = clockwise rotation angle
        //p = point object
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        // translate point back to origin:
        p.x -= cX;
        p.y -= cY;
        // rotate point
        let newX = p.x * c - p.y * s;
        let newY = p.x * s + p.y * c;
        // translate point back:
        p.x = Math.round(newX + cX);
        p.y = Math.round(newY + cY);
        return p;
    }

    const pointInPolygon = (point,polygon) => {
        //evaluate if point is in the polygon
        px = point.x
        py = point.y
        collision = false
        vertices = polygon.vertices
        len = vertices.length - 1
        for (let c=0;c<len;c++) {
            vc = vertices[c];
            vn = vertices[c+1]
            if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) && (px < (vn.x-vc.x)*(py-vc.y)/(vn.y-vc.y)+vc.x)) {
                collision = !collision
            }
        }
        return collision
    }

    const ClearLarge = (model) => {
        //clear Old hexes, if any
        for (let h=0;h<model.largeHexList.length;h++) {
            let chlabel = model.largeHexList[h].label();
            let index = hexMap[chlabel].tokenIDs.indexOf(model.id);
            if (index > -1) {
                hexMap[chlabel].tokenIDs.splice(index,1);
            }                    
        }        
        model.largeHexList = [];
    }


    const LargeTokens = (model) => {
        ClearLarge(model);
        //adds tokenID to hexMap for LOS purposes
        let radiusHexes = model.hex.radius(model.radius);
        for (let i=0;i<radiusHexes.length;i++) {
            let radiusHex = radiusHexes[i];
            let radiusHexLabel = radiusHex.label();
            if (radiusHexLabel === model.hexLabel) {continue};
            if (!hexMap[radiusHexLabel]) {continue};
            let c = hexMap[radiusHexLabel].centre;
            let check = false;
            let num = 0;
            let pts = [];
            pts.push(c);
            pts = XHEX(pts);
            for (let i=0;i<5;i++) {
                check = pointInPolygon(pts[i],model);
                if (check === true) {num ++};
            }
            if (num > 2) {
                if (hexMap[radiusHexLabel].tokenIDs.includes(model.id) === false) {
                    hexMap[radiusHexLabel].tokenIDs.push(model.id);
                }
                model.largeHexList.push(radiusHex);
            }
        }
    }


    const TokenVertices = (tok) => {
      //Create corners with final being the first
      let corners = []
      let tokX = tok.get("left")
      let tokY = tok.get("top")
      let w = tok.get("width")
      let h = tok.get("height")
      let rot = tok.get("rotation") * (Math.PI/180)
      //define the four corners of the target token as new points
      //also rotate those corners around the target tok centre
      corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX-w/2, tokY-h/2 )))     //Upper left
      corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX+w/2, tokY-h/2 )))     //Upper right
      corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX+w/2, tokY+h/2 )))     //Lower right
      corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX-w/2, tokY+h/2 )))     //Lower left
      corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX-w/2, tokY-h/2 )))     //Upper left
      return corners
    }


    const PrintCard = (id) => {
        let output = "";
        if (id) {
            let playerObj = findObjs({type: 'player',id: id})[0];
            let who = playerObj.get("displayname");
            output += `/w "${who}"`;
        } else {
            output += "/desc ";
        }

        if (!outputCard.faction || !Factions[outputCard.faction]) {
            outputCard.faction = "Neutral";
        }

        //start of card
        output += `<div style="display: table; border: ` + Factions[outputCard.faction].borderStyle + " " + Factions[outputCard.faction].borderColour + `; `;
        output += `background-color: #EEEEEE; width: 100%; text-align: centre; `;
        output += `border-radius: 1px; border-collapse: separate; box-shadow: 5px 3px 3px 0px #aaa;;`;
        output += `"><div style="display: table-header-group; `;
        output += `background-color: ` + Factions[outputCard.faction].backgroundColour + `; `;
        output += `background-image: url(` + Factions[outputCard.faction].image + `), url(` + Factions[outputCard.faction].image + `); `;
        output += `background-position: left,right; background-repeat: no-repeat, no-repeat; background-size: contain, contain; align: centre,centre; `;
        output += `border-bottom: 2px solid #444444; "><div style="display: table-row;"><div style="display: table-cell; padding: 2px 2px; text-align: centre;"><span style="`;
        output += `font-family: ` + Factions[outputCard.faction].titlefont + `; `;
        output += `font-style: normal; `;

        let titlefontsize = "1.4em";
        if (outputCard.title.length > 12) {
            titlefontsize = "1em";
        }

        output += `font-size: ` + titlefontsize + `; `;
        output += `line-height: 1.2em; font-weight: strong; `;
        output += `color: ` + Factions[outputCard.faction].fontColour + `; `;
        output += `text-shadow: none; `;
        output += `">`+ outputCard.title + `</span><br /><span style="`;
        output += `font-family: Arial; font-variant: normal; font-size: 13px; font-style: normal; font-weight: bold; `;
        output += `color: ` +  Factions[outputCard.faction].fontColour + `; `;
        output += `">` + outputCard.subtitle + `</span></div></div></div>`;

        //body of card
        output += `<div style="display: table-row-group; ">`;

        let inline = 0;

        for (let i=0;i<outputCard.body.length;i++) {
            let out = "";
            let line = outputCard.body[i];
            if (!line || line === "") {continue};
            if (line.includes("[INLINE")) {
                let end = line.indexOf("]");
                let substring = line.substring(0,end+1);
                let num = substring.replace(/[^\d]/g,"");
                if (!num) {num = 1};
                line = line.replace(substring,"");
                out += `<div style="display: table-row; background: #FFFFFF;; `;
                out += `"><div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                out += `"><span style="line-height: normal; color: #000000; `;
                out += `"> <div style='text-align: centre; display:block;'>`;
                out += line + " ";

                for (let q=0;q<num;q++) {
                    let info = outputCard.inline[inline];
                    out += `<a style ="background-color: ` + Factions[outputCard.faction].backgroundColour + `; padding: 5px;`
                    out += `color: ` + Factions[outputCard.faction].fontColour + `; text-align: centre; vertical-align: middle; border-radius: 5px;`;
                    out += `border-color: ` + Factions[outputCard.faction].borderColour + `; font-family: Tahoma; font-size: x-small; `;
                    out += `"href = "` + info.action + `">` + info.phrase + `</a>`;
                    inline++;                    
                }
                out += `</div></span></div></div>`;
            } else {
                line = line.replace(/\[hr(.*?)\]/gi, '<hr style="width:95%; align:centre; margin:0px 0px 5px 5px; border-top:2px solid $1;">');
                line = line.replace(/\[\#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})\](.*?)\[\/[\#]\]/g, "<span style='color: #$1;'>$2</span>"); // [#xxx] or [#xxxx]...[/#] for color codes. xxx is a 3-digit hex code
                line = line.replace(/\[[Uu]\](.*?)\[\/[Uu]\]/g, "<u>$1</u>"); // [U]...[/u] for underline
                line = line.replace(/\[[Bb]\](.*?)\[\/[Bb]\]/g, "<b>$1</b>"); // [B]...[/B] for bolding
                line = line.replace(/\[[Ii]\](.*?)\[\/[Ii]\]/g, "<i>$1</i>"); // [I]...[/I] for italics
                let lineBack = (i % 2 === 0) ? "#D3D3D3" : "#EEEEEE";
                out += `<div style="display: table-row; background: ` + lineBack + `;; `;
                out += `"><div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                out += `"><span style="line-height: normal; color: #000000; `;
                out += `"> <div style='text-align: centre; display:block;'>`;
                out += line + `</div></span></div></div>`;                
            }
            output += out;
        }

        //buttons
        if (outputCard.buttons.length > 0) {
            for (let i=0;i<outputCard.buttons.length;i++) {
                let out = "";
                let info = outputCard.buttons[i];
                out += `<div style="display: table-row; background: #FFFFFF;; `;
                out += `"><div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                out += `"><span style="line-height: normal; color: #000000; `;
                out += `"> <div style='text-align: centre; display:block;'>`;
                out += `<a style ="background-color: ` + Factions[outputCard.faction].backgroundColour + `; padding: 5px;`
                out += `color: ` + Factions[outputCard.faction].fontColour + `; text-align: centre; vertical-align: middle; border-radius: 5px;`;
                out += `border-color: ` + Factions[outputCard.faction].borderColour + `; font-family: Tahoma; font-size: x-small; `;
                out += `"href = "` + info.action + `">` + info.phrase + `</a></div></span></div></div>`;
                output += out;
            }
        }

        output += `</div></div><br />`;
        sendChat("",output);
        outputCard = {title: "",subtitle: "",faction: "",body: [],buttons: [],};
    }


    const LoadPage = () => {
        //build Page Info and flesh out Hex Info
        pageInfo.page = getObj('page', Campaign().get("playerpageid"));
        pageInfo.name = pageInfo.page.get("name");
        pageInfo.scale = pageInfo.page.get("snapping_increment");
        pageInfo.width = pageInfo.page.get("width") * 70;
        pageInfo.height = pageInfo.page.get("height") * 70;

        HexInfo.directions = {
            "Northeast": new Hex(1, -1, 0),
            "East": new Hex(1, 0, -1),
            "Southeast": new Hex(0, 1, -1),
            "Southwest": new Hex(-1, 1, 0),
            "West": new Hex(-1, 0, 1),
            "Northwest": new Hex(0, -1, 1),
        }

        let edges = findObjs({_pageid: Campaign().get("playerpageid"),_type: "path",layer: "map",stroke: "#d5a6bd",});
        let c = pageInfo.width/2;
        let edgeArray = [];
        for (let i=0;i<edges.length;i++) {
            edgeArray.push(edges[i].get("left"));
        }
        if (edgeArray.length === 0) {
            sendChat("","Add Edge(s) to map and reload API");
            return;
        } else if (edgeArray.length === 1) {
            EDGE = edgeArray[0];
        } else if (edgeArray.length > 1) {
            sendChat("","Error with > 1 edges, Fix and Reload API");
            return
        }
    }
/*
    const Linear = (polygon) => {
        //adds linear obstacles, eg Ridgelines
        let vertices = polygon.vertices;
        for (let i=0;i<(vertices.length - 1);i++) {
            let hexes = [];
            let pt1 = vertices[i];
            let pt2 = vertices[i+1];
            let hex1 = pointToHex(pt1);
            let hex2 = pointToHex(pt2);
            hexes = hex1.linedraw(hex2);
            for (let j=0;j<hexes.length;j++) {
                let hex = hexes[j];
                let hexLabel = hex.label();
                if (!hexMap[hexLabel]) {continue};
                if (hexMap[hexLabel].terrain.includes(polygon.name) === false) {
                    hexMap[hexLabel].terrain.push(polygon.name);
                    hexMap[hexLabel].terrainIDs.push(polygon.id);
                    if (polygon.blocksLOS === true) {
                        hexMap[hexLabel].losBlocked = true;
                    }
                    hexMap[hexLabel].height = Math.max(hexMap[hexLabel].height,polygon.height);
                    hexMap[hexLabel].cover = Math.min(hexMap[hexLabel].cover,polygon.cover);
                }
            }
        }
    }
*/
    const BuildMap = () => {
        let startTime = Date.now();
        hexMap = {};
        //builds a hex map, assumes Hex(V) page setting
        let halfToggleX = HexInfo.halfX;
        let rowLabelNum = 0;
        let columnLabel = 1;
        //let xSpacing = 75.1985619844599;
        //let ySpacing = 66.9658278242677;
        let startX = 37.5992809922301;
        let startY = 43.8658278242683;

        for (let j = startY; j <= pageInfo.height;j+=ySpacing){
            let rowLabel = rowLabels[rowLabelNum];
            for (let i = startX;i<= pageInfo.width;i+=xSpacing) {
                let point = new Point(i,j);     
                let label = (rowLabel + columnLabel).toString(); //id of hex
                let hexInfo = {
                    id: label,
                    centre: point,
                    terrain: [],
                    tokenIDs: [],
                    elevation: 0, //modeld on hills
                    height: 0, //height of top of terrain over elevation
                    toplevel: 0,
                    terrainIDs: [], //used to see if tokens in same building or such
                    los: "Open",
                    cover: false,
                    move: "Normal",
                };
                hexMap[label] = hexInfo;
                columnLabel += 2;
            }
            startX += halfToggleX;
            halfToggleX = -halfToggleX;
            rowLabelNum += 1;
            columnLabel = (columnLabel % 2 === 0) ? 1:2; //swaps odd and even
        }

        BuildTerrainArray();

        let keys = Object.keys(hexMap);
        const burndown = () => {
            let key = keys.shift();
            let movementClasses = {
                "Dangerous": 5,
                "Dangerous for Infantry": 4,
                "Dangerous if Rush/Charge": 3,
                "Difficult": 2,
                "Normal": 1,
            }
            if (key){
                let c = hexMap[key].centre;
                if (c.x >= EDGE) {
                    //Offboard
                    hexMap[key].terrain = ["Offboard"];
                } else {
                    let elevation = hexMap[key].elevation;
                    let height = hexMap[key].height;
                    let los = hexMap[key].los;
                    let cover = hexMap[key].cover;
                    let toplevel = hexMap[key].toplevel;
                    let taKeys = Object.keys(TerrainArray);
                    let move = hexMap[key].move;
                    for (let t=0;t<taKeys.length;t++) {
                        let polygon = TerrainArray[taKeys[t]];
                        if (hexMap[key].terrain.includes(polygon.name)) {continue};
                        let check = false;
                        let pts = [];
                        pts.push(c);
                        pts = XHEX(pts);
                        let num = 0;
                        for (let i=0;i<5;i++) {
                            check = pointInPolygon(pts[i],polygon);
                            if (check === true) {num ++};
                        }
                        if (num > 2) {
                            hexMap[key].terrain.push(polygon.name);
                            hexMap[key].terrainIDs.push(polygon.id);
                            if (polygon.los === "Blocked") {
                                los = "Blocked";
                            } else if (los !== "Blocked" && polygon.los === "Partial") {
                                los = "Partial";
                            }
                            if (polygon.cover === true) {
                                cover = true;
                            }
                            if (movementClasses[polygon.move] > movementClasses[move]) {
                                move = polygon.move;
                            }

                            if (polygon.name.includes("Hill")) {
                                if (polygon.height < 0) {
                                    elevation = polygon.height;
                                } else {
                                    elevation = Math.max(elevation,polygon.height);
                                }
                            } else {
                                height = Math.max(height,polygon.height);
                                if (polygon.name.includes("Building")) {
                                    toplevel = polygon.height - 1;
                                }
                            };
                        };
                    };
                    if (hexMap[key].terrain.length === 0) {
                        hexMap[key].terrain.push("Open Ground");
                    }
                    hexMap[key].elevation = elevation;
                    hexMap[key].height = height;
                    hexMap[key].cover = cover;
                    hexMap[key].los = los;
                    hexMap[key].toplevel = toplevel;
                    hexMap[key].move = move;
                }
                setTimeout(burndown,0);
            }
        }
        burndown();

        let elapsed = Date.now()-startTime;
        log("Hex Map Built in " + elapsed/1000 + " seconds");
        let l = Object.keys(TerrainArray).length;
        log(l + " Terrain Elements");
        //add tokens to hex map, rebuild Team/Unit Arrays
        TA();
    }

    const TA = () => {
        //add tokens on map into various arrays
        ModelArray = {};
        UnitArray = {};
        //create an array of all tokens
        let start = Date.now();
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "objects",
        });

        let c = tokens.length;
        let s = (1===c?'':'s');     
        tokens.forEach((token) => {
            let character = getObj("character", token.get("represents"));           
            if (character === null || character === undefined) {return};
            let faction = Attribute(character,"faction");
            let unitInfo = decodeURIComponent(token.get("gmnotes")).toString();
            if (!unitInfo) {return};
            unitInfo = unitInfo.split(";");
            let player = unitInfo[0];
            let unitName = unitInfo[1];
            let unitID = unitInfo[2];
            let unit = UnitArray[unitID];
            if (!unit) {
                unit = new Unit(player,faction,unitID,unitName);
                let markers = token.get("statusmarkers");
                let unitMarker = UnitMarkers.filter(value => markers.includes(value));
                unit.symbol = unitMarker;
            }
            let model = new Model(token.id,unitID,player,true);
            unit.add(model);
        });


        let elapsed = Date.now()-start;
        log(`${c} token${s} checked in ${elapsed/1000} seconds - ` + Object.keys(ModelArray).length + " placed in Model Array");
    }


    const BuildTerrainArray = () => {
        TerrainArray = {};
        //first look for graphic lines outlining hills etc
        let paths = findObjs({_pageid: Campaign().get("playerpageid"),_type: "path",layer: "map"});
        paths.forEach((pathObj) => {
            let vertices = [];
            toFront(pathObj);
            let colour = pathObj.get("stroke").toLowerCase();
            let t = TerrainInfo[colour];
            if (!t) {return};    
            let path = JSON.parse(pathObj.get("path"));
            let centre = new Point(pathObj.get("left"), pathObj.get("top"));
            let w = pathObj.get("width");
            let h = pathObj.get("height");
            let rot = pathObj.get("rotation");
            let scaleX = pathObj.get("scaleX");
            let scaleY = pathObj.get("scaleY");

            //covert path vertices from relative coords to actual map coords
            path.forEach((vert) => {
                let tempPt = getAbsoluteControlPt(vert, centre, w, h, rot, scaleX, scaleY);
                if (isNaN(tempPt.x) || isNaN(tempPt.y)) {return}
                vertices.push(tempPt);            
            });
            let id = stringGen();
            if (TerrainArray[id]) {
                id += stringGen();
            }
            let info = {
                name: t.name,
                id: id,
                vertices: vertices,
                centre: centre,
                height: t.height,
                cover: t.cover,
                los: t.los,
                move: t.move,
            };
            TerrainArray[id] = info;
        });
        //add tokens on map eg woods, crops
        let mta = findObjs({_pageid: Campaign().get("playerpageid"),_type: "graphic",_subtype: "token",layer: "map",});
        mta.forEach((token) => {
            let truncName = token.get("name").replace(/[0-9]/g, '');
            truncName = truncName.trim();
            let t = MapTokenInfo[truncName];
            if (!t) {return};
            let vertices = TokenVertices(token);
            let centre = new Point(token.get('left'),token.get('top'));
            let id = stringGen();
            if (TerrainArray[id]) {
                id += stringGen();
            }
            let info = {
                name: t.name,
                id: id,
                vertices: vertices,
                centre: centre,
                height: t.height,
                cover: t.cover,
                los: t.los,
                move: t.move,
            };
            TerrainArray[id] = info;
        });
    };

    const modelHeight = (model) => {
        let hex = hexMap[model.hexLabel];
        let height = parseInt(hex.elevation);
        if (hex.terrain.includes("Building")) {
            height += parseInt(hex.toplevel);
        }
        if (model.type === "Aircraft") {
            height = 20;
        }
        return height;
    }

    const LOS = (id1,id2,special) => {
        if (!special) {special = " "};
        let model1 = ModelArray[id1];
        let unit1 = UnitArray[model1.unitID];
        let model2 = ModelArray[id2];
        let cover = false;
        let losCover = false;

        if (!model1 || !model2) {
            let info = (!model1) ? "Model 1":"Model2";
            sendChat("",info + " is not in Model Array");
            let result = {
                los: false,
                cover: false,
                losCover: false,
                distance: -1,
                phi: 0,
            }
            return result
        }

        let md = ModelDistance(model1,model2);

        let distanceT1T2 = md.distance;
        
        if (model2.type === "Aircraft") {
            distanceT1T2 += 12;
            let result = {
                los: true,
                cover: false,
                losCover: false,
                distance: distanceT1T2,
                phi: 0,
            }
            return result;
        }
        let los = true;

        let model1Hex = hexMap[model1.hexLabel];
        let model2Hex = hexMap[model2.hexLabel];
        cover = model2Hex.cover;

        let model1Height = modelHeight(model1);
        let model2Height = modelHeight(model2);
        if (model1.special.includes("Tall")) {
            let index = model1.special.indexOf("Tall");
            let X = parseInt(model1.special.charAt(index + 5));
            model1Height += X;
        }
        if (model2.special.includes("Tall")) {
            let index = model2.special.indexOf("Tall");
            let X = parseInt(model2.special.charAt(index + 5));
            model2Height += X;
        }
//log("Team1 H: " + model1Height)
//log("Team2 H: " + model2Height)
        let modelLevel = Math.min(model1Height,model2Height);
        model1Height -= modelLevel;
        model2Height -= modelLevel;

        let interHexes = md.hex1.linedraw(md.hex2); 
        //interHexes will be hexes between shooter and target, not including their hexes or closest hexes for large tokens

        let theta = model1.hex.angle(model2.hex);
        let phi = Angle(theta - model1.token.get('rotation')); //angle from shooter to target taking into account shooters direction
//log("Model: " + modelLevel)
        let sameTerrain = findCommonElements(model1Hex.terrainIDs,model2Hex.terrainIDs);
        let lastElevation = model1Height;

        if (sameTerrain === true && (model1Hex.los === "Partial" || model1Hex.los === "Blocked")) {
//log("In Same Terrain but Distance > 4")
            if (distanceT1T2 > 3) {
                let result = {
                    los: false,
                    cover: false,
                    losCover: false,
                    distance: -1,
                    phi: 0,
                }
                return result;
            }
        }


        let openFlag = (model1Hex.los === "Open") ? true:false;
        let partialHexes = 0;
        let partialFlag = false;
        if (model1Hex.los === "Partial") {
            partialFlag = true;
            partialHexes++;
        }
//log("Initial Open Flag: " + openFlag);
//log("Initial Partial Flag: " + partialFlag);
        for (let i=1;i<interHexes.length;i++) {
            //0 is tokens own hex
            let qrs = interHexes[i];
            let interHex = hexMap[qrs.label()];
            if (interHex.tokenIDs.length > 0) {
                let ids = interHex.tokenIDs;
                for (let j=0;j<ids.length;j++) {
                    let id = ids[j];
                    if (unit1.modelIDs.includes(id) === false) {
                        if (id === id2 || id === id1) {continue};
                        if (model1.type === "Vehicle" && ModelArray[id].type !== "Vehicle" && i < (distanceT1T2 - i)) {
                            continue;
                        }
//log("Blocked by another model")
                        let result = {
                            los: false,
                            cover: false,
                            losCover: false,
                            distance: -1,
                            phi: 0,
                        }
                        return result;
                    }
                }
            }

            if (interHex.cover === true) {
                losCover = true;
            };
//log(i + ": " + qrs.label());
//log(interHex.terrain);
//log("Cover: " + interHex.cover);
//log("Blocks LOS? " + interHex.los)
            let interHexElevation = parseInt(interHex.elevation) - modelLevel
            let interHexHeight = parseInt(interHex.height);
            let B; //max height of intervening hex terrain to be seen over
            if (model1Height > model2Height) {
                B = (distanceT1T2 - i) * model1Height / distanceT1T2;
            } else if (model1Height <= model2Height) {
                B = i * model2Height / distanceT1T2;
            }
//log("InterHex Height: " + interHexHeight);
//log("InterHex Elevation: " + interHexElevation);
//log("Last Elevation: " + lastElevation);
//log("B: " + B)
            if (interHexElevation < lastElevation && lastElevation > model1Height && lastElevation > model2Height) {
//log("Intervening Higher Terrain");
                los = false;
                break;
            }            
            lastElevation = interHexElevation;

            if (interHexHeight + interHexElevation >= B) {
                if (interHex.los === "Blocked" && i>1 && i<(interHexes.length - 1)) {
//log("Intervening LOS Blocking Terrain");
                    los = false;
                    break;
                } else if (interHex.los === "Partial") {
                    partialHexes++;
                    partialFlag = true;
//log("Partial Hexes: " + partialHexes)
                    if (partialHexes > 3) {
//log("Too Deep into Partial ")
                        los = false;
                        break;
                    }
                } else if (interHex.los === "Open") {
                    if (openFlag === false) {
                        openFlag = true;
                        partialHexes = 0;
                        partialFlag = false;
                    } else if (openFlag === true) {
                        if (partialFlag === true) {
//log("Other side of Partial LOS Blocking Terrain")
                            los = false;
                            break;
                        }
                    }
                } 
            } else {
//log("Terrain less than B")
                //treated as open as looking into empty space above terrain
                if (openFlag === false) {
                    openFlag = true;
                    partialHexes = 0;
                    partialFlag = false;
                } else if (openFlag === true) {
                    if (partialFlag === true) {
//log("Other side of Partial LOS Blocking Terrain")
                        los = false;
                        break;
                    }
                }
            }
//log("Open Flag: " + openFlag)
//log("Partial Flag: " + partialFlag)
//log("Cover at Hex: " + cover)
        }
        if (model2Height < lastElevation && lastElevation > model1Height && lastElevation > model2Height) {
//log("Intervening Higher Terrain")
            los = false;
        }   

        if (model2Hex.los === "Partial" && partialHexes > 3) {
//log("Too Deep into Partial ")
            los = false;
        }
        if (model2Hex.los === "Open" && partialFlag === true) {
//log("Other side of Partial LOS Blocking Terrain")
            los = false;
        }
    
        let result = {
            los: los,
            cover: cover,
            losCover: losCover,
            distance: distanceT1T2,
            angle: phi,
        }
        return result;
    }




    const RollD6 = (msg) => {
        let Tag = msg.content.split(";");
        PlaySound("Dice");
        let roll = randomInteger(6);
        if (Tag.length === 1) {
            let playerID = msg.playerid;
            let faction = "Neutral";
            if (!state.GDF.players[playerID] || state.GDF.players[playerID] === undefined) {
                if (msg.selected) {
                    let id = msg.selected[0]._id;
                    if (id) {
                        let tok = findObjs({_type:"graphic", id: id})[0];
                        let char = getObj("character", tok.get("represents")); 
                        faction = Attribute(char,"faction");
                        state.GDF.players[playerID] = faction;
                    }
                } else {
                    sendChat("","Click on one of your tokens then select Roll again");
                    return;
                }
            } else {
                faction = state.GDF.players[playerID];
            }
            let res = "/direct " + DisplayDice(roll,faction,40);
            sendChat("player|" + playerID,res);
        } else {
            let type = Tag[1];
            //type being used for times where fed back by another function
            if (type === "Morale") {
                let tokenID = Tag[2];
                let model = ModelArray[tokenID];

                let unit = UnitArray[model.unitID];
                let leaderID = unit.modelIDs[0];
                let leader = ModelArray[leaderID];
                let needed = parseInt(leader.quality);
                if (leader.token.get(sm.bonusmorale) === true) {
                    //Unit has +1 to morale from something, ability or spell
                    needed--;
                    leader.token.set(sm.bonusmorale,false);
                }
                if (leader.token.get(sm.minusmorale) === true) {
                    needed++;
                    leader.token.set(sm.minusmorale,false);
                }
                if (leader.special.includes("Canticle Megaphone")) {
                    needed--;
                }
                let banner = false;
                _.each(unit.modelIDs,id => {
                    let model = ModelArray[id];
                    if (model.special.includes("Banner of Lust")) {
                        banner = true;
                    }
                });
                if (banner === true) {
                    needed--;
                }

                let neededText = "Needing: "  + needed + "+";
                if (leader.token.get("aura1_color") === colours.red) {
                    //shaken, auto fail test
                    needed = 7;
                    neededText = "Auto Fail";
                }

                let moraleRoll = randomInteger(6);
                let fearlessRoll = 0;


                //auto but roll for each model
                let autoMorales = ["Undead","Robot"];
                let auto = "None";
                for (let i=0;i<autoMorales.length;i++) {
                    if (leader.special.includes(autoMorales[i])) {
                        auto = autoMorales[i];
                        break;
                    }
                }
                if (auto !== "None") {
                    SetupCard(unit.name,auto,unit.faction);
                    outputCard.body.push("Automatically Passed");
                    let rolls = [];
                    let wounds = 0;
                    for (let i=0;i<unit.modelIDs.length;i++) {
                        let um = ModelArray[unit.modelIDs[i]];
                        let t = parseInt(um.token.get("bar1_value"));
                        for (let j=0;j<t;j++) {
                            let roll = randomInteger(6);
                            rolls.push(roll);
                            if (roll <= 3) {wounds++};
                        }
                    }
                    rolls.sort();
                    rolls.reverse();
                    let line = '[🎲](#" class="showtip" title="' + rolls + ' vs 4+ )';
                    if (wounds > 0) {
                        line += " " + wounds + " Wounds Taken";
                    } else {
                        line += " No Wounds Taken";
                    }
                    outputCard.body.push(line);

                    let killed = [];
                    let index = unit.modelIDs.length - 1;
                    let total = index+1
                    while (wounds > 0 && index > -1) {
                        let um = ModelArray[unit.modelIDs[index]];
                        let hp = parseInt(um.token.get("bar1_value"));
                        wounds -= hp;
                        if (wounds < 0) {
                            hp = Math.abs(wounds);
                            um.token.set("bar1_value",hp);
                        } else {
                            killed.push(um);
                            index--;
                        }
                    }
                    killed.forEach((model) => {
                        model.kill();
                    })
                    if (killed.length === total) {
                        outputCard.body.push("Entire Unit Destroyed!");

                    }
                } else {
                    SetupCard(unit.name,neededText,unit.faction);
                    outputCard.body.push("Morale Roll: " + DisplayDice(moraleRoll,unit.faction,24));
                    let fearlessFlag = false;
                    if (leader.special.includes("Fearless")) {fearlessFlag = true};
                    _.each(unit.modelIDs,id => {
                        let model = ModelArray[id];
                        if (model.special.includes("Sacred Banner")) {
                            fearlessFlag = true;
                        }
                    });

                    if (fearlessFlag === true && moraleRoll < needed) {
                        fearlessRoll = randomInteger(6);   
                        if (leader.name.includes("Captain") && fearlessRoll < 4) {
                            fearlessRoll = randomInteger(3) + 3;
                        }
                        outputCard.body.push("Fearless Roll: " + DisplayDice(fearlessRoll,unit.faction,24));
                    }
    
                    if (moraleRoll >= needed || fearlessRoll >= 4 || leader.special.includes("Explode")) {
                        outputCard.body.push("Success!");
                    } else {
                        let heroMorale = ["Hold the Line","Lead from Behind"];
                        let flag = false;
                        let reason;
                        for (let i=0;i<heroMorale.length;i++) {
                            if (leader.special.includes(heroMorale[i])) {
                                flag = true;
                                reason = heroMorale[i];
                                break;
                            }
                        }
                        let gruntMorale = ["No Retreat","Grim"];
                        gmLoop1:
                        for (let i=0;i<gruntMorale.length;i++) {
                            for (let j=0;j<unit.modelIDs.length;j++) {
                                if (ModelArray[unit.modelIDs[j]].special.includes(gruntMorale[j])) {
                                    flag = true;
                                    reason = gruntMorale[j];
                                    break gmLoop1;
                                }
                            }
                        }
                        if (flag === true) {
                            let index = unit.modelIDs.length - 1;
                            let um = ModelArray[unit.modelIDs[index]];
                            let w = parseInt(um.token.get("bar1_value")) - 1;
                            let noun = " killed by ";
                            if (w === 0) {
                                um.kill();
                            } else {
                                noun = " wounded by ";
                                um.token.set("bar1_value",w);
                            }
                            outputCard.body.push(um.name + noun + leader.name + " due to " + reason);
                            outputCard.body.push("Morale Test Passed");
                        } else if (flag === false) {
                            if (currentActivation === "Charge" && unit.halfStrength() === true) {
                                outputCard.body.push("Failure! Unit Routs!");
                                unit.routs();
                            } else {
                                outputCard.body.push("Failure! Unit is Shaken");
                                unit.shaken();
                            }
                        }
                    }

                }

                PrintCard();






            }
            if (type === "Dangerous") {
                let tokenID = Tag[2];
                let model = ModelArray[tokenID];
                let unit = UnitArray[model.unitID];
                let rolls = [];
                let fails = 0;
                let wounds = parseInt(model.token.get("bar1_value"));
                for (let i=0;i<model.toughness;i++) {
                    let roll = randomInteger(6);
                    rolls.push(roll);
                    if (roll === 1) {fails += 1};
                }
                rolls.sort();
                rolls.reverse();
                let line = '[🎲](#" class="showtip" title="' + rolls + ')';

                SetupCard(model.name,"Dangerous Terrain",model.nation);
                wounds = Math.max(wounds - fails,0);
                model.token.set("bar1_value",wounds);
                if (fails === 0) {
                    line += " " + model.name + " passes";
                    if (rolls.length > 1) {
                        line += " all " + rolls.length + " tests";
                    }
                } else {
                    if (wounds === 0) {
                        line += " [#ff0000]" + model.name + ' fails and is destroyed[/#]';
                        model.kill();
                    } else {
                        let s = (wounds === 1) ? "":"s";
                        line += " [#ff0000]" + model.name + ' takes ' + fails + ' wound' + s + ' but survives[/#]';
                    }
                }
                outputCard.body.push(line);
                PrintCard();
            }




        }
    }

    const ClearState = () => {
        //clear arrays
        ModelArray = {};
        UnitArray = {};
        nameArray = {};
        //clear token info
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "objects",
        })
        tokens.forEach((token) => {
            if (token.get("name").includes("Objective") === true) {return};

            token.set({
                name: "",
                tint_color: "transparent",
                aura1_color: "transparent",
                aura1_radius: 0,
                showplayers_bar1: true,
                showname: true,
                showplayers_aura1: true,
                bar1_value: 0,
                bar1_max: "",
                gmnotes: "",
                statusmarkers: "",
                tooltip: "",
            });                
        });
    
        RemoveDead("All");
        RemoveDepLines();

        state.GDF = {
            factions: [[],[]],
            players: {},
            playerInfo: [[],[]],
            markers: [[],[]],
            turn: 0,
            lineArray: [],
            modelCounts: {},
            objectives: [],
            deployLines: [],
            options: [false,false,false,false],
            mission: '1',
            lastPlayer: -1,
            turnMarkerID: "",
        }
        for (let i=0;i<UnitMarkers.length;i++) {
            state.GDF.markers[0].push(i);
            state.GDF.markers[1].push(i);
        }
        sendChat("","Cleared State/Arrays");
    }

    const RemoveDepLines = () => {
        for (let i=0;i<state.GDF.deployLines.length;i++) {
            let id = state.GDF.deployLines[i];
            let path = findObjs({_type: "path", id: id})[0];
            if (path) {
                path.remove();
            }
        }
    }

    const UnitCreation = (msg) => {
        let Tag = msg.content.split(";");
        let tokenIDs = [];
        for (let i=0;i<msg.selected.length;i++) {
            tokenIDs.push(msg.selected[i]._id);
        }
        if (tokenIDs.length === 0) {return};
        let refToken = findObjs({_type:"graphic", id: tokenIDs[0]})[0];
        let refChar = getObj("character", refToken.get("represents")); 
        let faction = Attribute(refChar,"faction");
        ucInfo = {
            unitName: Tag[1],
            tokenIDs: tokenIDs,
            faction: faction,
            player: -1,
        }
        if (!state.GDF.factions[0] || state.GDF.factions[0].length === 0) {
            state.GDF.factions[0].push(faction);
            ucInfo.player = 0;
        } else if (state.GDF.factions[0].includes(faction)) {
            ucInfo.player = 0;
        } else if (!state.GDF.factions[1] || state.GDF.factions[1].length === 0) {
            state.GDF.factions[1].push(faction);
            ucInfo.player = 1;
        } else if (state.GDF.factions[1].includes(faction)) {
            ucInfo.player = 1;
        } else {
            //check whom allied with as both 0 and 1 have at least 1 faction
            SetupCard("Allies","","Neutral");
            ButtonInfo("Allied with " + state.GDF.factions[0][0],"!UnitCreation2;0;"+faction);
            ButtonInfo("Allied with " + state.GDF.factions[1][0],"!UnitCreation2;1;"+faction);
            PrintCard();
            return;
        }
        UnitCreation3();
    }

    const UnitCreation2 = (msg) => {
        let Tag = msg.content.split(";");
        let player = parseInt(Tag[1]);
        state.GDF.factions[player].push(Tag[2]);
        ucInfo.player = player;
        UnitCreation3();
    }

    const UnitCreation3 = () => {
        let player = ucInfo.player;
        let faction = ucInfo.faction;
        let unitName = ucInfo.unitName;
        let tokenIDs = ucInfo.tokenIDs;

        let unitID = stringGen();
        let unit = new Unit(player,faction,unitID,unitName);
        let markerNumber = state.GDF.markers[player].length;
        if (!markerNumber || markerNumber === 0) {
            markerNumber = 1;   
        } else {
            markerNumber = randomInteger(markerNumber);
            state.GDF.markers[player].splice(markerNumber-1,1);
        }
        unit.symbol = UnitMarkers[markerNumber-1];
        let unitInfo = player + ";" + unitName + ";" + unitID; 
        for (let i=0;i<tokenIDs.length;i++) {
            let tokenID = tokenIDs[i];
            let model = new Model(tokenID,unitID,player);
            unit.add(model);
            model.token.set({
                name: model.name,
                tint_color: "transparent",
                showplayers_bar1: true,
                showname: true,
                bar1_value: model.toughness,
                gmnotes: unitInfo,
            })
            if (model.toughness > 1) {
                model.token.set("bar1_max",model.toughness);
            }
            if (model.special.includes("Caster")) {
                let index = model.special.indexOf("Caster");
                let X = parseInt(model.special.charAt(index+7));
                model.token.set({
                    bar2_value: X,
                    bar2_max: 6,
                    showplayers_bar2: true,
                });
            }

            model.token.set("statusmarkers","");
            model.token.set("status_"+unit.symbol,true);
            if (tokenIDs.length > 1) {
                model.token.set({
                    show_tooltip: true,
                    tooltip: model.wnames,
                });
            }
        }
        ModelArray[unit.modelIDs[0]].token.set({
            aura1_color: colours.green,
            aura1_radius: 0.2,
        })
        sendChat("",unitName + " Created");
    }

    const TokenInfo = (msg) => {
        if (!msg.selected) {
            sendChat("","No Token Selected");
            return;
        };
        let id = msg.selected[0]._id;
        let model = ModelArray[id];
        if (!model) {
            sendChat("","Not in Model Array Yet");
            return;
        };
        let faction = model.faction;
        if (!faction) {faction = "Neutral"};
        SetupCard(model.name,"Hex: " + model.hexLabel,faction);
        let h = hexMap[model.hexLabel];
        let terrain = h.terrain;
        terrain = terrain.toString();
        let elevation = modelHeight(model);
        let cover = h.cover;
        let unit = UnitArray[model.unitID];

        outputCard.body.push("Terrain: " + terrain);
        if (cover === true) {
            outputCard.body.push("In Cover");
        } else {
            outputCard.body.push("Not in Cover");
        } 
        outputCard.body.push("Elevation: " + elevation);
        outputCard.body.push("[hr]");
        outputCard.body.push("Unit: " + unit.name);
        for (let i=0;i<unit.modelIDs.length;i++) {
            let m = ModelArray[unit.modelIDs[i]];
            outputCard.body.push(m.name);
        }
        PrintCard();
    }

    const DrawLine = (id1,id2,w,layer) => {
        let ColourCodes = ["#00ff00","#ffff00","#ff0000","#00ffff","#000000"];
        let colour = ColourCodes[w];


        let x1 = hexMap[ModelArray[id1].hexLabel].centre.x + w*15;
        let x2 = hexMap[ModelArray[id2].hexLabel].centre.x + w*15;
        let y1 = hexMap[ModelArray[id1].hexLabel].centre.y + w*15;
        let y2 = hexMap[ModelArray[id2].hexLabel].centre.y + w*15;

        let width = (x1 - x2);
        let height = (y1 - y2);
        let left = width/2;
        let top = height/2;

        let path = [["M",x1,y1],["L",x2,y2]];
        path = path.toString();

        let newLine = createObj("path", {   
            _pageid: Campaign().get("playerpageid"),
            _path: path,
            layer: layer,
            fill: colour,
            stroke: colour,
            stroke_width: 5,
            left: left,
            top: top,
            width: width,
            height: height,
        });

        let id = newLine.id;
        return id;
    }

    const DeploymentLines = (x1,x2,y1,y2) => {
        let width = (x1 - x2);
        let height = (y1 - y2);
        let left = width/2;
        let top = height/2;

        let path = [["M",x1,y1],["L",x2,y2]];
        path = path.toString();

        let newLine = createObj("path", {   
            _pageid: Campaign().get("playerpageid"),
            _path: path,
            layer: "map",
            fill: "#FF0000",
            stroke: "#FF0000",
            stroke_width: 5,
            left: left,
            top: top,
            width: width,
            height: height,
        });
        toFront(newLine);
        let id = newLine.id;
        return id;
    }


    const RemoveLines = () => {
        let lineIDArray = state.GDF.lineArray;
        if (!lineIDArray) {
            state.GDF.lineArray = [];
            return;
        }
        for (let i=0;i<lineIDArray.length;i++) {
            let id = lineIDArray[i];
            let path = findObjs({_type: "path", id: id})[0];
            if (path) {
                path.remove();
            }
        }
        state.GDF.lineArray = [];  
    }

    const Attack = (msg) => {
        RemoveLines();
        //currentUnitID will be the ID of unit that charged 
        let Tag = msg.content.split(";");
        let attackerID = Tag[1];
        let defenderID = Tag[2];
        let attackType = Tag[3]; //Ranged or Melee
        let weaponType = Tag[4]; //eg. CCW, Rifle etc
        let attacker = ModelArray[attackerID];
        let defender = ModelArray[defenderID];
        let attackingUnit = UnitArray[attacker.unitID];
        let attackLeader = ModelArray[attackingUnit.modelIDs[0]];
        let defendingUnit = UnitArray[defender.unitID];
        let defendLeader = ModelArray[defendingUnit.modelIDs[0]];
        defendingUnit.hitArray = [];
        let validAttackerIDs = [];
        let sniperTargetID; //if attacker(s) is/are sniper then this will be filled with defenderID

        SetupCard(attackingUnit.name,attackType,attacker.faction);
        let errorMsg = "";
        if (attacker.faction === defender.faction) {
            errorMsg = "Friendly Fire!";
        }
      
        if (weaponType === "Bomb") {
            if (attackingUnit.order === "Charge") {
                attackType === "Melee"
            } else {
                attackType === "Ranged"
            }
        }

        let validRangedOrders = ["Advance","Hold","Overwatch"];
        if (weaponType === "Bomb") {
            if (attackingUnit.order === "Charge") {
                attackType === "Melee";
                validRangedOrders.push("Charge");
            } else {
                attackType === "Ranged";
                validRangedOrders.push("Rush");
            }
        }

        if (currentUnitID === attackingUnit.id && attackingUnit.order !== "Charge" && attackType === "Melee") {
            errorMsg = "Need to be given a Charge Order";
        }

        if (validRangedOrders.includes(attackingUnit.order) === false && attackType === "Ranged") {              
            errorMsg = "Can only fire if given Advance, Hold or Overwatch Orders";
        }
        /*
        if (attackingUnit.targetIDs.length > 1 && attackingUnit.targetIDs.includes(defendingUnit.id) === false && attackType === "Ranged") {
            errorMsg = "Max. of 2 Target Units in 1 Round";
        }
        */

        let distFlag = false;
        let numberCover = 0;
        let numberCoverTested = 0;
        let numberLOSCover = 0;
        let fired = 0;
        let counterCounter = 0;

        let furiousAB = false;
        let furiousAbilities = ["Battle Drills","War Chant","Piper's Calling"];

        let accelerator = false;
        _.each(attackingUnit.modelIDs,id => {
            let model = ModelArray[id];
            if (model.special.includes("Accelerator Drone")) {
                accelerator = true;
            }
        })




        loop1:
        for (let i=0;i<attackingUnit.modelIDs.length;i++) {
            let am = ModelArray[attackingUnit.modelIDs[i]];
            if (!am) {continue};
            if (attackType === "Ranged" && am.token.get(sm.fired) === true) {
                if (am.fired.includes(weaponType)) {
                    fired++;
                    continue;
                }
            }

            if (currentUnitID === attackingUnit.id && attackingUnit.order === "Charge") {
                for (let i = 0;i<furiousAbilities.length;i++) {
                    let ab = furiousAbilities[i];
                    if (am.special.includes(ab)) {
                        furiousAB = true;
                    } 
                }
            }

            let range = 0;
            let indirect = false;
            for (let w=0;w<am.weaponArray.length;w++) {
                let weapon = am.weaponArray[w];
                if (weapon.type === weaponType) {
                    if (weapon.special.includes("Indirect")) {
                        indirect = true;
                    }
                    range = weapon.range;
                    if (attackLeader.token.get(sm.bonusrange) === true) {
                        range += 12;
                    }
                    if (accelerator === true) {
                        range += 6;
                    }
                    if (weapon.special.includes("Limited") && am.token.get(sm.limited) === true) {
                        fired++;
                        continue loop1;
                    }
                }
            }
            
            if (range === 0) {continue}; //no weapons of that type

            let minDistance = Infinity;

            for (let j=0;j<defendingUnit.modelIDs.length;j++) {
                let dm = ModelArray[defendingUnit.modelIDs[j]];
                if (!dm) {continue};
                if (dm.counter === true && attackType === "Melee") {
                    counterCounter++;
                }
                if (dm.token.get(sm.fatigue) === false && dm.counter === true && attackType === "Melee" && currentUnitID === attackingUnit.id) {
                    errorMsg = "Defender's have weapons with Counter and may strike first";
                    break loop1;
                }
                if (dm.token.get(sm.fatigue) === false && dm.special.includes("Counter-Attack") && attackType === "Melee" && currentUnitID === attackingUnit.id) {
                    errorMsg = "Defender's strike first due to Counter-Attack Ability";
                    break loop1;
                }
                let losResult = LOS(am.id,dm.id);
                if (losResult.distance < 1) {distFlag = true}; //B2B contact
                if (losResult.los === false && indirect === false) {continue};
                if (losResult.distance > range) {continue};
                if (losResult.distance < minDistance) {
                    minDistance = losResult.distance;
                    am.opponent = dm.id;
                }
                if (validAttackerIDs.includes(am.id) === false) {
                    validAttackerIDs.push(am.id);
                }
                numberCoverTested++;

                if (losResult.cover === true) {numberCover++};
                if (losResult.losCover === true) {numberLOSCover++};
            }            
            am.minDistance = minDistance;
        }

        if (distFlag === false && errorMsg === "" && attackType === "Melee") {
            errorMsg = "One Model needs to be in Base to Base Contact";
        }

        let coverPercent = (numberCover/numberCoverTested) * 100;
        let losCoverPercent = (numberLOSCover/numberCoverTested) * 100;
        
        let cover = false; //targets are IN the cover, ignored by Blast and Lockon
        let losCover = false; //targets are behind cover, ignored by Indirect
        if (coverPercent > 50) {
            cover = true;
        }
        if (losCoverPercent > 50) {
            losCover = true;
        }

        if (validAttackerIDs.length === 0 && errorMsg === "") {
            if (fired === attackingUnit.modelIDs.length && attackType === "Ranged") {
                errorMsg = "Attackers have all fired";
            } else if (fired > 0 && attackType === "Ranged") {
                errorMsg = "Remaining Attackers lack Range or LOS";
            } else {
                errorMsg = "Attackers lack Range or LOS"
            }
        }

        if (errorMsg !== "") {
            outputCard.body.push(errorMsg);
            PrintCard();
            return;
        }
        //Distance < 9 check
        let close = false;
        let close12 = false;
        let slayerTargets = 0;


        for (let i=0;i<defendingUnit.modelIDs.length;i++) {
            let m1 = ModelArray[defendingUnit.modelIDs[i]];
            if (parseInt(m1.token.get("bar1_max")) > 2) {slayerTargets++};
            for (let j=0;j<attackingUnit.modelIDs.length;j++) {
                let m2 =  ModelArray[attackingUnit.modelIDs[j]];
                let losR = LOS(m2.id,m1.id);
                if (losR.los === false) {continue};
                let dist = losR.distance;
                if (dist <= 9) { //v3.2
                    close = true;
                    break;
                }
                if (dist <= 12 ) {
                    close12 = true;
                }
            }
        }

        let prowl = (attackType === "Ranged" && close12 === false && defendLeader.special.includes("Prowl") && (cover === true || losCover === true)) ? true:false;
        let martialProwess = (attackLeader.special.includes("Martial Prowess") && (cover === true || losCover === true)) ? true:false;

        let slayerFlag = Math.round((slayerTargets/defendingUnit.modelIDs.length)) >= .5 ? true:false;
        //check for Stealth 
        let stealth = false;
        let stealthDrone = 0;
        if (attackType === "Ranged" && close === false) {
            stealth = true;
            let shieldDrone = false;
            for (let i=0;i<defendingUnit.modelIDs.length;i++) {
                let m1 = ModelArray[defendingUnit.modelIDs[i]];
///log(m1.special)
                if (m1.special.includes("Stealth Drone")) {
                    let splitSpecial = m1.special.split(",");
                    let drones = 0;
                    for (let sd=0;sd<splitSpecial.length;sd++) {
                        let substring = splitSpecial[sd];
                        if (substring.includes("Stealth Drone")) {
                            drones = parseInt(substring.replace(/[^\d]/g,""));
                        }
                    }
//log(drones)
                    stealthDrone += drones;
//log(stealthDrone)
                }
                if (m1.special.includes("Shield Drone")) {
                    shieldDrone = true;
                }
                if (m1.special.includes("Stealth") === false) {
                    stealth = false;
                    break;
                }
            }
            if (defendLeader.special.includes("Blind Faith")) {
                stealth = true;
            }
            if (shieldDrone === true) {
                stealth = true;
            }

        }
//log(stealth)
        //for each attacker in range, run through its weapons, roll to hit etc and save hits in defender unit.hitArray
        let unitHits = 0;
        let unitMisses = 0;
        let sporesFlag = false;

        outputCard.body.push("[U][B]Hits[/b][/u]");
        for (let i=0;i<validAttackerIDs.length;i++) {
            let attacker = ModelArray[validAttackerIDs[i]];
        
            let weaponArray = attacker.weaponArray;
            let baseToHit = attacker.quality;
            let baseToHitTips = "<br>Base: " + baseToHit + "+";

            let bonusToHit = 0;
            let minusToHit = 0;
            let minusTips = "";
            let bonusTips = "";

            let fatigue = false;
            if ((attacker.token.get(sm.fatigue) === true || attackingUnit.shakenCheck() === true) && attackType === "Melee") {
                fatigue = true;
            }

            if (attacker.special.includes("Good Shot") && attackType === "Ranged") {
                baseToHit = 4;
                baseToHitTips = "<br>Base: Good Shot 4+";
            }
            if (attacker.special.includes("Bad Shot") && attackType === "Ranged") {
                baseToHit = 5;
                baseToHitTips = "<br>Base: Bad Shot 5+";
            }
            if (attacker.special.includes("Sniper") && attackType === "Ranged") {
                sniperTargetID = defenderID;
                baseToHit = 2;
                baseToHitTips = "<br>Base: Sniper 2+";
            }
            if (defender.type === "Aircraft") {
                minusToHit += 1;
                minusTips += "<br>Aircraft -1";
            }
            if (defender.special.includes("Dodge") && attackType === "Melee") {
                minusToHit += 1;
                minusTips += "<br>Dodge -1";
            }

            if (stealth === true) {
                minusToHit += 1;
                minusTips += "<br>Stealth -1";
            }
            if (stealthDrone > 0) {
                minusToHit += stealthDrone;
                minusTips += "<br>Stealth Drones -" + stealthDrone;
            }
            if (prowl === true) {
                minusToHit += 2;
                minusTips += "<br>Prowl -2";
            }

            if (defendLeader.token.get(sm.spotting)) {
                let sl = parseInt(defendLeader.token.get(sm.spotting));
                bonusToHit += sl;
                bonusTips += "<br>Spotting Lasers: +" + sl;
            }

            if (attackingUnit.order === "Hold" && close === true && attackType === "Ranged") {
                bonusTips += "<br>Hold/Close Range +1";
                bonusToHit += 1;
            }

            if (attackLeader.token.get(sm.minustohit) === true) {
                minusToHit += 1;
                minusTips += "<br>Spell Effect -1";
            }

            if (attacker.special.includes("Carnivore") && attackType === "Melee") {
                bonusToHit += 1;
                bonusTips += "<br>Carnivore +1";
            }


            if (attackingUnit.order === "Overwatch" && attackType === "Ranged") {
                minusToHit += 1;
                minusTips += "<br>Overwatch -1";
            }

            //attacker specials in format [name,attackType,bonus]
            let veteran = ["Veteran","Trueborn","Celestial Infantry"];
            _.each(veteran,vetType => {
                if (attacker.special.includes(vetType)) {
                    bonusTips += "<br>" + vetType + "+1";
                    bonusToHit += 1;
                }
            });

            if (martialProwess === true) {
                bonusTips += "<br>Martial Prowess +1";
                bonusToHit += 1;
            }

            let furious6 = false;
            let furious5 = false;

            if (currentUnitID === attackingUnit.id && attackingUnit.order === "Charge") {
                if (attacker.special.includes("Furious") || attacker.special.includes("Frenzy")) {
                    furious6 = true;
                }
                if (furiousAB === true && furious6 === true) {
                    furious5 = true;
                } else if (furiousAB === true && furious6 === false) {
                    furious6 = true;
                }
            }


            //Leader specials   



            //defender specials
            if (defendLeader.special.includes("Entrenched" && close === false) && defendingUnit.order === "Hold") {
                minusToHit += 2;
                minusTips += "<br>Dug In -2"; 
            }

            if (defendingUnit.order === "Take Cover") {
                minusToHit += 1;
                minusTips += "<br>Take Cover -1";
            }

            //attacker conditions on leaders token in format [condition,attacktype,name,bonus or minus], to be removed
            let ac = [["takeaim","Ranged","+1 to Hit",1]];
            for (let a=0;a<ac.length;a++) {
                if (attackLeader.token.get(sm[ac[a][0]]) === true && attackType === ac[a][1]) {
                    mark = " -";
                    if (ac[a][3] > 0) {
                        mark = " +"
                        bonusToHit += ac[a][3];
                        bonusTips += "<br>" + ac[a][2] + mark + ac[a][3];
                    } else {
                        minusToHit += ac[a][3];
                        minusTips += "<br>" + ac[a][2] + mark + ac[a][3];
                    }  
                }
            }
    
            for (let w=0;w<weaponArray.length;w++) {
                let weapon = DeepCopy(weaponArray[w]);
                let range = weapon.range;
                let weaponToHit = baseToHit;
                let weaponTips = "";
                let weaponMinusToHit = 0;
                let weaponBonusToHit = 0;

                if (weapon.special.includes("Spores")) {sporesFlag = true};
                let rollTips = ""; //used for weapon specials
                let addon = "";
                if (weapon.type !== weaponType) {continue};
                if (attackLeader.token.get(sm.bonusrange) === true) {
                    range += 12;
                }
                if (accelerator === true) {
                    range += 6;
                }
                if (attacker.minDistance > range) {continue};
                if (weapon.name === "Impact" && currentUnitID !== attackingUnit.id) {
                    continue;
                }
                if (weapon.name === "Impact" && counterCounter > 0) {
                    counterCounter--;
                    continue;
                }

                //closest enemy model is farther than this weapons distance
                
                if (attacker.special.includes("Mutations") && attackType === "Melee") {
                    let roll = randomInteger(6);
                    if (roll < 4) {
                        addon  += "Rending ";
                        weapon.special += ",Rending";
                        rollTips += "<br>Mutation - Rending";
                    } else {
                        addon += "Sharp ";
                        weapon.ap += 1
                        rollTips += "<br>Mutation - AP +1";
                    }
                }
                if (attackType === "Melee") {
                    if (attackingUnit.order === "Charge") {
                        if (attackLeader.token.get(sm.meleeap2) === true) {
                            weapon.ap += 2;
                        }
                        if (attackLeader.token.get(sm.bonusatt) === true) {
                            weapon.attack += 1;
                        }
                        if (attacker.special.includes("Frenzy")) {
                            weapon.ap += 1;
                        }
                    }
                    if (attackLeader.token.get(sm.poison) === true) {
                        weapon.special += ",Poison";
                    }
                    if (attackLeader.token.get(sm.meleeap) === true || attackLeader.special.includes("Dark Strike") || attackLeader.special.includes("War Hymns")) {
                        weapon.ap += 1;
                    }
                    if (attackLeader.special.includes("Apex Killers")) {
                        weapon.ap += 1;
                    }
                    if (attacker.special.includes("Slayer") && slayerFlag === true) {
                        weapon.ap += 2;
                    }
                    if (attackLeader.token.get(sm.bonusatt2) === true) {
                        weaponBonusToHit += 2;
                    }
                }


    
                //weapon modifiers
                if (weapon.special.includes("Reliable")) {
                    weaponToHit = 2; //drop needed to 2, without affecting it for other weapons
                    weaponTips += "<br>Reliable - Base changed to 2+";
                }
                if (weapon.special.includes("Indirect")) {
                    losCover = false;
                    if (attackingUnit.order === "Advance") {
                        weaponMinusToHit += 1;
                        weaponTips += "<br>Indirect/Moved -1";
                    }
                }

                if (attackLeader.special.includes("Precision") || attackLeader.special.includes("Canticles") || attackLeader.special.includes("Spiritual Guidance")) {
                    weapon.ap += 1;
                }
                if (attackLeader.token.get(sm.rangedap) === true) {
                    weapon.ap += 1;
                }
                if (weapon.special.includes("Phosphor")) {
                    cover = false;
                    losCover = false;
                }

                if (weapon.special.includes("Bomb)") || weapon.type === "Bomb") {
                    weaponToHit = 6;
                    weaponTips += "<br>Bomb - Base changed to 6+";
                    cover = false;
                    losCover = false;
                }
                
                //Lock On should be last as negates all negative modifiers
                if (weapon.special.includes("Lock-On")) {
                    cover = false;
                    losCover = false;
                    minusToHit = 0; 
                    weaponTips = "<br>Lock-On";
                }

                if (weapon.name === "Impact") {
                    weaponToHit = 2;
                    weaponMinusToHit = -minusToHit; 
                    weaponBonusToHit = -bonusToHit;
                    weaponTips = "<br>Impact - Base changed to 2+";
                } 

                let toHit = weaponToHit - bonusToHit + minusToHit - weaponBonusToHit + weaponMinusToHit;
                let toHitTips = baseToHitTips + bonusTips + minusTips + weaponTips;

                if (weapon.name === "Impact") {
                    toHit = 2;
                    toHitTips = "<br>Impact - 2+";
                } 

                toHit = Math.max(2,Math.min(toHit,6));

                if (fatigue === true) {
                    toHit = 6;
                    toHitTips = "<br>Fatigue: unmodified 6"
                }

                let hits = [];
                let rolls = [];

                let a = 0;
                let weaponAttacks = weapon.attack;
                let overload = 0;
                let overloadTip = 0;
                do {
                    PlaySound(weapon.sound);
                    let roll = randomInteger(6);
                    rolls.push(roll);
                    overload = Math.max(overload - 1,0); //used to avoid overloads on overload extra hits
                    if (roll === 1) {
                        unitMisses++;
                        continue;
                    } else if (roll === 6) {
                        hits.push(roll);
                        //weapons/abilities that do something on a 6
                        if (furious6 === true) {
                            hits.push(7);
                            rollTips += "<br>Extra Hit from Furious";
                        }
                        if (attackType === "Ranged" && (attacker.special.includes("Shooty") || attackLeader.special.includes("Extra Shooty"))) {
                            hits.push(7);
                            rollTips += "<br>Extra Hit from Shooty";
                        } 
                        if (attacker.special.includes("Flux")) {
                            hits.push(7);
                            rollTips += "<br>Extra Hit from Flux";
                        } 
                        if (attacker.special.includes("Devout") && attacker.minDistance <= 12) {
                            hits.push(7);
                            rollTips += "<br>Extra Hit from Devout";
                        } 
                        if (attacker.special.includes("Taser")) {
                            hits.push(7);
                            rollTips += "<br>Extra Hit from Taser";
                        }
                        if (attackType === "Ranged" && attackingUnit.order === "Hold" && ( attacker.special.includes("Relentless") ||  ModelArray[attackingUnit.modelIDs[0]].special.includes("Volley Fire"))) {
                            hits.push(7);
                            if (rollTips.includes("Relentless") === false) {
                                rollTips += "<br>Relentless";
                            }
                        }
                        if (attacker.special.includes("Overload") && overload < 1) {
                            overloadTip += 2;
                            weaponAttacks += 2;
                            overload += 2;
                        }

                    } else if (roll !== 1 && roll !== 6 && roll >= toHit) {
                        if (furious5 === true && roll === 5) {
                            hits.push(7);
                            rollTips += "<br>Extra Hit from Furious";
                        }
                        if (attacker.special.includes("Highly Devout") && attacker.minDistance <= 12) {
                            hits.push(7);
                            rollTips += "<br>Extra Hit from Highly Devout";
                        }                         
                        if (attackType === "Ranged" && attacker.special.includes("Shooty") && attackLeader.special.includes("Extra Shooty")) {
                            hits.push(7);
                            rollTips += "<br>Extra Hit from Shooty + Extra Shooty";
                        } 
                        hits.push(roll);
                    } else {
                        unitMisses++
                    }

                    //Blast Weapons
                    if (weapon.special.includes("Blast") && roll >= toHit) {
                        cover = false;
                        losCover = false;
                        let index = weapon.special.indexOf("Blast");
                        let X = parseInt(weapon.special.charAt(index + 6));
                        extraHits = Math.min(X,defendingUnit.modelIDs.length) - 1;
                        //each blast hit gets X hits, capped by unit model #s - extra hits 
                        rollTips += "<br>Blast: " + extraHits + " extra hits";
                        for (let i=0;i<extraHits;i++) {
                            hits.push(7);
                        }
                    }
                    a++;
                } while (a < weaponAttacks);
    
                if (overloadTip > 0) {
                    rollTips += "<br>" + overloadTip + " Extra Attacks from Overload";
                }

                rolls.sort();
                rolls.reverse();
                hits.sort();
                hits.reverse();

                if (rollTips !== "") {
                    rollTips = "<br>----------------------" + rollTips;
                }

                let bit = " gets [#ff0000]" + hits.length  + " Hits[/#]";
                if (hits.length === 1) {bit = " gets [#ff0000]1 Hit[/#]"}''
                if (hits.length === 0) {bit = " misses"};
    
                let line = '[🎲](#" class="showtip" title="' + rolls + " vs. " + toHit + "+" + toHitTips + rollTips + ')' + " " + attacker.name + bit + " with " + addon + weapon.name;
    
                outputCard.body.push(line);

                let hitCover = false;
                if (cover === true || losCover === true) {
                    hitCover = true;
                }

                let hitInfo = {
                    hits: hits,
                    weapon: weapon,
                    cover: hitCover,
                }
                unitHits += hits.length;
                if (hits.length > 0) {
                    if (weapon.special.includes("Deadly")) {
                        //deadly hits have to be resolved first
                        defendingUnit.hitArray.unshift(hitInfo);
                    } else {
                        defendingUnit.hitArray.push(hitInfo);
                    }
                }

                if (weapon.fx) {
                    let opp = ModelArray[attacker.opponent]
                    FX(weapon.fx,attacker,opp);
                }

            }
        }

        //rotate models that attacked, place fire or fatigue
     
        defendLeader.token.get(sm.spotting,false);

        for (let i=0;i<validAttackerIDs.length;i++) {
            let am = ModelArray[validAttackerIDs[i]];
            let dm = ModelArray[am.opponent];
            let theta = am.hex.angle(dm.hex);
            if (am.type !== "Aircraft") {
                am.token.set("rotation",theta);
            };
            if (attackType === "Ranged") {
                am.token.set(sm.fired,true);
                am.fired.push(weaponType);
            } else {
                am.token.set(sm.fatigue,true);
            }
        }
        
        if (attackingUnit.order === "Overwatch") {
            attackingUnit.order = "Fired";
            attackLeader.token.set("aura1_color",colours.black);
        }

        attackingUnit.targetIDs.push(defendingUnit.id);
        if (unitHits === 0) {
            outputCard.body.push("No Hits Scored");
            totalWounds = 0;
        } else {
            let s = (unitHits === 1) ? "":"s";
            outputCard.body.push(unitHits + " Hit" + s + " Total")
            outputCard.body.push("[hr]");
            totalWounds = Saves(attackType,defendingUnit.id,sniperTargetID);

        }
        if (unitMisses > 0 && sporesFlag === true) {
            outputCard.body.push("[hr]");
            let bit = "1 new unit";
            if (unitMisses > 1) {bit = unitMisses + " new units"};
            outputCard.body.push("Place " + bit + " of 3 Spore Mines or 1 Massive Spore Mine 12” away from the target, but the position is decided by your opponent. Note that any new unit can’t be activated on the round in which they are placed.");
        }

        //Morale
        if (!defendingUnit || defendingUnit.modelIDs.length === 0) {
            outputCard.body.push("[#ff0000]Entire Unit Destroyed![/#]");
            if (defendingUnit.modelIDs.length === 0) {
                defendingUnit.remove(defender);
            }    
            if (attackType === "Melee") {
                outputCard.body.push(attackingUnit.name + ' wins the Melee, and may Consolidate 3"');
            }
        } else {
            if (attackType === "Ranged") {
                if (defendingUnit.halfStrength() === true && defendingUnit.shakenCheck() === false && totalWounds > 0) {
                    outputCard.body.push("[hr]");
                    outputCard.body.push(defendingUnit.name + " must take a Morale Check");
                    ButtonInfo("Morale Check","!Roll;Morale;" + defendingUnit.modelIDs[0]);
                }
            } else if (attackType === "Melee") {
                let noun = (totalWounds === 1) ? " Wound":" Wounds";
                let fear = 0;
                if (attackLeader.special.includes("Fear")) {
                    let substrings = attackLeader.special.split(",");
                    let substring;
                    _.each(substrings,string => {
                        if (string.includes("Fear")) {
                            substring = string;
                        }
                    })
                    fear = substring.replace(/\D/g,'');
                    fear = parseInt(fear);
                }
                let line = "[hr]When deciding the winner of the Melee this unit caused [#ff0000]" + totalWounds + noun;
                if (fear > 0) {
                    let twf = parseInt(totalWounds) + fear;
                    line += " Plus " + fear + " from Fear for a Total of " + twf;
                }
                line += "[/#]";
                outputCard.body.push(line);
            }
        }
        PrintCard();
    }

    const Saves = (attackType,unitID,sniperTargetID) => {
        let unit = UnitArray[unitID];
        let hitArray = unit.hitArray;

        let modelIDs = unit.modelIDs;
        let leader = ModelArray[unit.modelIDs[0]];

        let number = unit.modelIDs.length - 1;

        let medic = false;
        let regenProtocol = false;
        let regenAbilities = false;

        for (let w=0;w<unit.modelIDs.length;w++) {
            let model2 = ModelArray[modelIDs[w]];
            if (model2.special.includes("Medical Training") || model2.special.includes("Mad Doctor")) {
                medic = true;
            }
            if (model2.special.includes("Blessing of Plague") || model2.special.includes("Pain Fueled")) {
                regenAbilities = true;
            }
            if (model2.special.includes("Regen-Protocol")) {
                regenProtocol = true;
            }

        }
        let totalWounds = 0;
        let killed = [];
        outputCard.body.push("[U][B]Saves[/b][/u]");
        let hitNum = 1;
        for (let a=0;a<hitArray.length;a++) {
            let weapon = hitArray[a].weapon;
            let cover = hitArray[a].cover;
            for (let b=0;b<hitArray[a].hits.length;b++) {
                let hitRoll = hitArray[a].hits[b];
                let out = " Hit #" + hitNum + ": ";
                hitNum++;
                if (number > -1) {
                    let currentModel = ModelArray[modelIDs[number]];
                    if (sniperTargetID) {
                        currentModel = ModelArray[sniperTargetID];
                    }

                    out += currentModel.name + ": "
                    let save = currentModel.defense;
                    let saveTips = "<br>Defense: " + save;

                    let hp = parseInt(currentModel.token.get("bar1_value"));
                    if (isNaN(hp)) {hp = 1};

                    if (cover === true && attackType !== "Melee") {
                        save -= 1;
                        saveTips += "<br>Cover +1";
                    }
                    if (leader.token.get(sm.bonusdef) === true) {
                        save -= 1;
                        saveTips += "<br>Spell +1";
                    }

                    if (leader.token.get(sm.defense2) === true) {
                        save += 2;
                        saveTips += "<br>Spell: -2 to Defense";
                    }
                    if (leader.token.get(sm.minusdefense) === true) {
                        save += 1;
                        saveTips += "<br>Spell: -1 to Defense";
                    }

                    let addon = "";
                    if (hitRoll === 6 && weapon.special.includes("Rending")) {
                        ap = 4;
                        saveTips += "<br>Rending AP: 4";
                        addon += "Rending ";
                    } else {
                        ap = weapon.ap;
                        saveTips += "<br>AP: " + ap;
                    }
                    if (currentModel.special.includes("Shield Wall") && attackType !== "Spell") {
                        save -= 1;
                        saveTips += "<br>Shield Wall +1";
                    }

                    if (attackType === "Melee" && currentUnitID !== unitID && weapon.special.includes("Lance")) {
                        ap += 2;
                        saveTips += "<br>+2 for Lance/Charging";
                    }

                    if (attackType === "Ranged" && leader.token.get(sm.focus) === true) {
                        ap += 1;
                        saveTips += "<br>+1 for Focus Fire";
                    }
                    //have this after other AP 
                    if (currentModel.special.includes("Protected") && ap > 0) {
                        ap--;
                        saveTips += "<br>Protected AP -1";
                    }
                    save += ap;

                    let saveRoll = randomInteger(6);
                    let saveRollTip = saveRoll.toString();
                    if (saveRoll < save && currentModel.faction === "Ultramarines") {
                        saveRoll = randomInteger(6);
                    }

                    if (saveRoll === 6 && weapon.special.includes("Poison")) {
                        saveRoll = randomInteger(6);
                        saveRollTip = saveRoll + " Poison Reroll";
                        saveTips += "<br>Poison";
                        addon += "Poisoned "
                    }

                    save = Math.min(6,Math.max(2,save));

                    if (saveRoll >= save || saveRoll === 6) {
                        out += " saves vs. " + addon + weapon.name;
                    } else {
                        let wounds = 1;
                        if (weapon.special.includes("Radiation") && saveRoll === 1) {
                            wounds = 2;
                        }
                        if (weapon.special.includes("Deadly")) {
                            let index = weapon.special.indexOf("Deadly");
                            let X = parseInt(weapon.special.charAt(index+7));
                            wounds = X;
                        } 

log("Line 3782 Wounds: " + wounds)

                        let noun = "Wounds";
                        if (wounds === 1) {noun = "Wound"};

                        //Ignore mechanics - Individual then Leader/Unit
                        let ignore = 0;
                        let ignorePossible = false;
                        let ignoreAbility;
                        let ignoreAbilities = ["Psy-Barrier","Resistance","Raiment of the Laughing God","Putrid","Witch Hunter","Magic Absorption"];
                        let spellIgnore = ["Psy-Barrier","Resistance","Raiment of the Laughing God","Witch Hunter","Magic Absorption"];
                        for (let g=0;g<ignoreAbilities.length;g++) {
                            if (currentModel.special.includes(ignoreAbilities[g])) {
                                ignorePossible = true;
                                ignoreAbility = ignoreAbilities[g];
                                break;
                            }
                        }
                        for (let w=0;w<unit.modelIDs.length;w++) {
                            let model2 = ModelArray[modelIDs[w]];
                            if (model2.special.includes("Gloom-Protocol")) {
                                ignorePossible = true;
                                ignoreAbility = "Gloom-Protocol";
                                break;
                            }
                        }
                        if (ignorePossible === true) {
        log("In Ignore")
        log("Wounds: " + wounds)
                            for (let w=0;w<wounds;w++) {
                                let ignoreRoll = randomInteger(6);
                                let iTarget = 6;
                                //if spell is 4
                                if (weapon.special.includes("Spell") && spellIgnore.includes(ignoreAbility)) {
                                    iTarget = 4;
                                }
                                if (weapon.special.includes("Spell") && (ignoreAbility === "Witch Hunter" || ignoreAbility === "Magic Absorption")) {
                                    iTarget = 2;
                                }
                                saveTips += "<br>" + ignoreAbility + ": " + ignoreRoll + " vs. " + iTarget + "+";
                                if (ignoreRoll >= iTarget) {
                                    ignore++;
                                }
                            }
                        }


                        let interimWounds = wounds - ignore;
                        //Regen/Medic mechanics
                        let regen = 0;
                        let regNoun = "[#009d00]regenerates[/#] ";
                        if (medic === true) {
                            regNoun = "is [#009d00]healed[/#] for "
                        }
                        if (currentModel.upgrades.includes("Force Field")) {
                            regNoun = "[#009d00]the Force Field absorbs[/#] ";
                        }
                        if (currentModel.faction === "Necron") {
                            regNoun = "[#009d00]Living Metal repairs[/#] ";
                        }

                        if ((medic === true || regenAbilities === true || currentModel.special.includes("Regeneration") || leader.token.get(sm.regeneration) === true) && (weapon.special.includes("Rending") === false && weapon.special.includes("Poison") === false)) {
                            for (let w=0;w<interimWounds;w++) {
                                let regenRoll  = randomInteger(6);
                                let regenTarget = 5;
                                if (regenProtocol === true) {regenTarget = 4};
                                if (ModelArray[modelIDs[0]].special.includes("Holy Chalice")) {
                                    regenTarget -= 1;
                                }
                                if (leader.special.includes("Pain Immunity")) {
                                    regenTarget -= 1;
                                }
                                if (leader.token.get(sm.regeneration) === true && currentModel.special.includes("Regeneration")) {
                                    regenTarget -= 1;
                                }
                                saveTips += "<br>Regen: " + regenRoll + " vs. " + regenTarget + "+";
                                if (regenRoll >= regenTarget) {
                                    if (regenRoll === regenTarget && leader.special.includes("Pain Immunity")) {
                                        regNoun = "[#009d00]ignores[/#] "
                                    }
                                    regen++;
                                }
                            }
                        }
                      
                        hp -= wounds;
                        hp += regen + ignore;
                        let regenText = regen + " wound";
                        let ignoreText = ignore + " wound";
                        if (regen > 1) {regenText += "s"};
                        if (ignore > 1) {ignoreText += "s"};
                        if( regen === wounds && wounds > 1) {
                            regenText = "all wounds";
                        } else if (regen === wounds && wounds === 1) {
                            regenText = "the wound"
                        }
                        if (ignore === wounds && wounds > 1) {
                            ignoreText = "all wounds";
                        } else if (ignore === wounds && wounds === 1) {
                            ignoreText = "the wound";
                        }

                        let endWounds = (wounds - regen - ignore);
                        totalWounds += endWounds;
                        currentModel.token.set("bar1_value",hp);

                        if (hp <= 0) {
                            //dead, next model 
                            number--;
                            killed.push(currentModel);
                            out += "[#ff0000]killed by " + addon + weapon.name + "[/#]";
                            if (sniperTargetID) {
                                number = -1;
                            }
                        } else if (hp > 0) {
                            let out2 = "";
                            if (endWounds > 0) {
                                out += "[#ff0000]";
                                out2 = "[/#]"
                            }
                            out += "takes " + wounds + " " + noun + " from " + addon + weapon.name + out2;
                            if (regen > 0) {
                                out += ", but " + regNoun + regenText; 
                            }
                            if (ignore > 0) {
                                out += ", but [#009d00]ignores[/#] " + ignoreText + " via " + ignoreAbility; 
                            }
                        }
                    }

                    let line = '[🎲](#" class="showtip" title="' + saveRollTip + " vs. " + save + "+" + saveTips +  ')' + out;
                    outputCard.body.push(line);
                } 
            }
        }

        killed.forEach((model) => {
            model.kill();
        });

        unit.hitArray = [];
        
        return totalWounds;
    }





    const AddAbility = (abilityName,action,charID) => {
        createObj("ability", {
            name: abilityName,
            characterid: charID,
            action: action,
            istokenaction: true,
        })
    }    

    const AddAbilities = (msg) => {
        if (!msg) {return}
        let id = msg.selected[0]._id;
        if (!id) {return};
        let token = findObjs({_type:"graphic", id: id})[0];
        let char = getObj("character", token.get("represents"));
        if (!char) {return};
        let model = ModelArray[id];
        if (!model) {return};

        let abilityName,action;
        let abilArray = findObjs({_type: "ability", _characterid: char.id});
        //clear old abilities
        for(let a=0;a<abilArray.length;a++) {
            abilArray[a].remove();
        } 

        abilityName = "Activate";
        if (model.type === "Infantry" || model.type === "Hero") {
            action = "!Activate;@{selected|token_id};?{Order|Hold|Advance|Rush|Charge|Overwatch|Take Cover}";
        } else if (model.type === "Vehicle" || model.type === "Monster") {
            action = "!Activate;@{selected|token_id};?{Order|Hold|Advance|Rush|Charge|Overwatch}";
        } else if (model.type === "Aircraft") {
            action = "!Activate;@{selected|token_id};Advance";
        }
        if (model.special.includes("Immobile")) {
            action = "!Activate;@{selected|token_id};?{Order|Hold|Overwatch}";
        }
        AddAbility(abilityName,action,char.id);

        abilityName = "Info";
        action = "!TokenInfo";
        AddAbility(abilityName,action,char.id);

        abilityName = "LOS";
        action = "!CheckLOS;@{selected|token_id};@{target|token_id}";
        AddAbility(abilityName,action,char.id);

        let types = {
            "Rifle": [],
            "Pistol": [],
            "Heavy": [],
            "Heavy2": [],
            "Mod": [],
            "CCW": [],
            "Sniper": [],
            "Bomb": [],
        }
  
        for (let i=0;i<model.weaponArray.length;i++) {
            let weapon = model.weaponArray[i];
            let name = weapon.name;
            if (weapon.type === " " || weapon.name === " ") {continue}
            if (weapon.special.includes("Limited")) {
                name += " (Limited)";
            }
            types[weapon.type].push(name); 
        }
        
        let keys = Object.keys(types);
        let weaponNum = 1;
        for (let i=0;i<keys.length;i++) {
            let names = types[keys[i]];
            let typ = "Ranged;";
            if (keys[i] === "CCW") {typ = "Melee;"};
            if (names.length === 0) {continue};
            names = names.toString();
            if (names.charAt(0) === ",") {names = names.replace(",","")};
            names = names.replaceAll(",","+");
            abilityName = weaponNum + ": " + names;
            weaponNum += 1;
            action = "!Attack;@{selected|token_id};@{target|token_id};" + typ + keys[i];
            AddAbility(abilityName,action,char.id);
        }

        let macros = [["Advanced Tactics",1],["Repair",1],["Double Time",1],["Company Standard",2],["Focus Fire",1],["Take Aim",1],["Dark Tactics",1],["Pheromones",1],["Explode",1],["Takedown",1],["Spell Warden",1],["Breath Attack",1],["Scurry Away",1],["Safety in Numbers",2],["Spotting Laser",1]];
log(model.special)
        for (let i=0;i<macros.length;i++) {
            let macroName = macros[i][0]
            if (model.special.includes(macroName)) {
                action = "!Specials;" + macroName + ";@{selected|token_id}";
                for (let j=0;j<macros[i][1];j++) {
                    action += ";@{target|Target " + (j+1) + "|token_id}";
                }
                AddAbility(macroName,action,char.id);
            }
        }
        if (model.special.includes("Caster")) {
            let spells = SpellList[model.faction];
            let spellNames = Object.keys(spells);
            for (let i=0;i<spellNames.length;i++) {
                let spellName = spellNames[i];
                let spell = spells[spellName];
                let targetName = spell.targetInfo;
                let action = "!Cast;@{selected|token_id};"  + spellName;
                for (let j=0;j<spell.targetNumber;j++) {
                    action += ";@{target|" + targetName + " Target " + (j+1) + "|token_id}";
                }
                AddAbility("Spell: " + spellName,action,char.id);
            } 
        }
    }

    const Cast = (msg) => {
        SpellStored = {};
        RemoveLines();

        let Tag = msg.content.split(";");
        let casterID = Tag[1];
        let spellName = Tag[2];
        let targetIDs = Tag.slice(3); //remaining info
        targetIDs = [...new Set(targetIDs)]; //eliminate duplicates
    
        let caster = ModelArray[casterID];
        if (!caster) {
            sendChat("","Error");
            return;
        }
        let spell = SpellList[caster.faction][spellName]
        let casterPoints = parseInt(caster.token.get("bar2_value"));
        let errorMsg = "";
        let playerID,opponentFaction,oppID;
        let playerKeys = Object.keys(state.GDF.players);
        for (let i=0;i<playerKeys.length;i++) {
            let faction = state.GDF.players[playerKeys[i]];
            if (faction === caster.faction) {
                playerID = playerKeys[i];
            } else {
                opponentFaction = faction;
                oppID = playerKeys[i];
            }
        }
        if (!playerID) {
            errorMsg = "No Player Identified";
        }
        let player = caster.player;
        let opponent = (player === 0) ? 1:0;
    
        SetupCard("Cast Spell","",caster.faction);

        if (casterPoints < spell.cost) {
            errorMsg = "Not enough Points to cast";
        }
        if (caster.spellsCast.includes(spellName)) {
            errorMsg = "Can only cast a spell once per round";
        }
        if (caster.unitID !== currentUnitID) {
            errorMsg = "Activate Caster's Unit First";
        }

        for (let i=0;i<targetIDs.length;i++) {
            let id2 = targetIDs[i];
            let losResult = LOS(casterID,id2);
            if (losResult.los === false) {
                errorMsg = "Target is not in LOS";
            }
            if (losResult.distance > spell.range) {
                errorMsg = "Target is out of Range";
            }
        }
    
        if (errorMsg !== "") {
            outputCard.body.push(errorMsg);
            PrintCard();
            return;
        }
    
        let enemyPointsMax = 0;
        let extraPointsMax = 0;
        let friendlyCasters = [];
        let enemyCasters = [];
    
        let keys = Object.keys(ModelArray);
        for (let i=0;i<keys.length;i++) {
            let model = ModelArray[keys[i]];
            if (model.special.includes("Caster") === false) {continue};
            let pts = parseInt(model.token.get("bar2_value"));
            if (pts === 0) {continue};
            let losResult = LOS(casterID,model.id);
            if (losResult.los === false) {continue};
            if (losResult.distance > 18) {continue};
            info = {id: model.id, range: losResult.distance};
            if (model.faction === caster.faction) {
                if (model.id === casterID) {
                    extraPointsMax += pts - spell.cost;
                } else {
                    extraPointsMax += pts;
                }
                friendlyCasters.push(info);
            } else {
                enemyPointsMax += pts;
                enemyCasters.push(info);
            }
        }
    
        if (friendlyCasters.length > 0) {
            friendlyCasters.sort((a,b) => {
                return a.range - b.range;
            })
        }
        if (enemyCasters.length > 0) {
            enemyCasters.sort((a,b) => {
                return a.range - b.range;
            })
        }
    
        SpellStored = {
            casterID: casterID,
            player: player,
            spellName: spellName,
            targetIDs: targetIDs,
            extraAlliedPts: 0,
            opposingPts: 0,
            friendlyCasters: friendlyCasters,
            enemyCasters: enemyCasters,
            extraPointsMax: extraPointsMax,
            enemyPointsMax: enemyPointsMax,
        }
    
    log(SpellStored)
        if (extraPointsMax === 0 && enemyPointsMax === 0) {
            //proceed right to casting spell, using SpellStored
            Cast3();
        } else if (extraPointsMax === 0 && enemyPointsMax > 0) {
            //send other player q re points
            SetupCard("Oppose Casting","",opponentFaction);
            ButtonInfo("Points","!Cast2;" + opponent + ";?{Extra Points [max "+ enemyPointsMax + "]|0};Done");
            PrintCard();
        } else if (extraPointsMax > 0 && enemyPointsMax === 0) {
            SetupCard("Enhance Casting","",caster.faction);
            ButtonInfo("Extra Points","!Cast2;" + player + ";?{Extra Points [max "+ extraPointsMax+"]|0};Done");
            PrintCard();
        } else if (extraPointsMax > 0 && enemyPointsMax > 0) {
            SetupCard("Enhance Casting","",caster.faction);
            ButtonInfo("Extra Points","!Cast2;" + player + ";?{Extra Points [max "+ extraPointsMax+"]|0};Not Done");
            PrintCard();
        }
    }
    
    const Cast2 = (msg) => {
        //extra points 'spent' by caster
        let Tag = msg.content.split(";");
log(Tag)
        let player = parseInt(Tag[1]);
        let opponent = (player === 0) ? 1:0;
        let pts = parseInt(Tag[2]);
        let flag = Tag[3];
        if (player === parseInt(SpellStored.player)) {
            log("Add")
            pts = Math.min(pts,SpellStored.extraPointsMax);
            SpellStored.extraAlliedPts = pts;
        } else {
            log("Subtract")
            pts = Math.min(pts,SpellStored.enemyPointsMax)
            SpellStored.opposingPts = pts;
        }
log("Interim Spell Stored")
log(SpellStored)
        if (flag === "Done") {
            Cast3();
        } else if (flag === "Not Done") {
            SetupCard("Oppose Casting","",state.GDF.factions[opponent][0]);
            ButtonInfo("Points","!Cast2;" + opponent + ";?{Extra Points [max "+ SpellStored.enemyPointsMax + "]|0};Done");
            PrintCard();
        } 
    }
    
    
    const Cast3 = () => {
log("Spell Stored")
log(SpellStored)
        let caster = ModelArray[SpellStored.casterID];
        let spellName = SpellStored.spellName;
        let spell = SpellList[caster.faction][spellName];
        //take off points off friendlyCasters and enemyCasters based on proximity and points spent
        let mp = parseInt(caster.token.get("bar2_value"));

log("Starting MP: " + mp)
        mp -= parseInt(spell.cost);
log("New MP: " + mp)
        caster.token.set("bar2_value",mp);
        RemoveMagicPoints(SpellStored.friendlyCasters,SpellStored.extraAlliedPts);
        RemoveMagicPoints(SpellStored.enemyCasters,SpellStored.opposingPts);
        SetupCard(spellName,"",caster.faction);
        let target = 4;
        target -= SpellStored.extraAlliedPts;
        target += SpellStored.opposingPts;
        target = Math.max(2,Math.min(6,target));
        let targetTip = "Base: 4+"
        if (SpellStored.extraAlliedPts > 0) {
            targetTip += "<br>Adding " + SpellStored.extraAlliedPts + " pts";
        }
        if (SpellStored.opposingPts > 0) {
            targetTip += "<br>Subtracting " + SpellStored.opposingPts + " pts"
        }
        if (caster.token.get(sm.bonusCaster) !== false) {
            let bc = parseInt(caster.token.get(sm.bonusCaster));
            target -= bc;
            caster.token.set(sm.bonusCaster,false);
            targetTip += "<br>Bonus from Abilities +" + bc;
        }



        let roll = randomInteger(6);
        let successResult = " Success: ";


        targetTip = '[🎲](#" class="showtip" title="' + targetTip + ')';
        if (roll < target || roll === 1) {successResult = " Fail: "};
        outputCard.body.push(targetTip + successResult + DisplayDice(roll,caster.faction,24) + " vs. " + target + "+");

        caster.spellsCast.push(spellName);

        if (roll === 1 || roll < target) {
            outputCard.body.push("Spell Fails to be Cast");
        } else {
            if (spell.effect === "Damage") {
                SpellDamage();
            } else if (spell.effect === "Effect") {
                SpellEffect();
            }
        }

        PrintCard();
    }
    
  

    const SpellEffect = () => {
        let caster = ModelArray[SpellStored.casterID];
        let spellName = SpellStored.spellName;
        let spell = SpellList[caster.faction][spellName];
        let targetIDs = SpellStored.targetIDs;
        for (let i=0;i<targetIDs.length;i++) {
            let targetID = targetIDs[i];
            let targetModel = ModelArray[targetID];
            if (spell.fx) {
                FX(spell.fx,caster,targetModel);
            }
            if (spell.sound) {
                PlaySound(spell.sound);
            }
            let targetUnit = UnitArray[targetModel.unitID];
            if (spell.text !== "") {
                outputCard.body.push(targetUnit.name + spell.text);
            }
            let unitLeader = ModelArray[targetUnit.modelIDs[0]];
            if (spell.marker !== "") {
                unitLeader.token.set(spell.marker,true);
            }
        }
    }




    const SpellDamage = () => {
        let caster = ModelArray[SpellStored.casterID];
        let spellName = SpellStored.spellName;
        let spell = SpellList[caster.faction][spellName];
        let targetIDs = SpellStored.targetIDs;
log(spell)
        let weapon = {
            name: spellName,
            ap: spell.damage.ap,
            special: spell.damage.special,
        }

        let sniperTargetID;
        if (weapon.special.includes("Sniper")) {
            sniperTargetID = targetIDs[0];
        }


        outputCard.body.push(spell.text);
        outputCard.body.push("[hr]");

        for (let i=0;i<targetIDs.length;i++) {
            let targetID = targetIDs[i];
            let targetModel = ModelArray[targetID];

            if (spell.fx) {
                FX(spell.fx,caster,targetModel);
            }
            
            if (spell.sound) {
                PlaySound(spell.sound);
            }

            let targetUnit = UnitArray[targetModel.unitID];
            outputCard.body.push(targetUnit.name);
            let hits = [];
            for (let h=0;h<spell.damage.hits;h++) {
                hits.push(7);
            }
            //cover check
            let numberCoverTested = 0;
            let numberLOSCover = 0;
            let numberCover = 0;
            for (let j=0;j<targetUnit.modelIDs.length;j++) {
                let tID = targetUnit.modelIDs[j];
                let losResult = LOS(caster.id,tID);
                if (losResult.los === false) {continue};
                numberCoverTested++;
                if (losResult.cover === true) {numberCover++};
                if (losResult.losCover === true) {numberLOSCover++};
            }
            let coverPercent = (numberCover/numberCoverTested) * 100;
            let losCoverPercent = (numberLOSCover/numberCoverTested) * 100;
            
            let cover = false; //targets are IN the cover, ignored by Blast and Lockon
            let losCover = false; //targets are behind cover, ignored by Indirect
            if (coverPercent >= 50) {
                cover = true;
            }
            if (losCoverPercent >= 50) {
                losCover = true;
            }
      
            //Blast Spells
            let blastTip = "";
            if (weapon.special.includes("Blast")) {
                cover = false;
                losCover = false;
                let index = weapon.special.indexOf("Blast");
                let X = parseInt(weapon.special.charAt(index + 6));
                extraHits = Math.min(X,targetUnit.modelIDs.length) - 1;
                blastTip = " [Blast added " + extraHits + "]";
                //each blast hit gets X hits, capped by unit model #s - extra hits 
                for (let i=0;i<extraHits;i++) {
                    hits.push(7);
                }
            }
    
            let hitCover = false;
            if (cover === true || losCover === true) {
                hitCover = true;
            }
    
            let hitInfo = {
                hits: hits,
                weapon: weapon,
                cover: hitCover,
            }
            targetUnit.hitArray.push(hitInfo);

            let s = (hits.length === 1) ? " hit":" hits";
    
            outputCard.body.push("The spell causes " + hits.length + s + blastTip);
            let totalWounds = Saves("Ranged",targetUnit.id,sniperTargetID);
    
            if (targetUnit.halfStrength() === true && targetUnit.shakenCheck() === false && totalWounds > 0) {
                outputCard.body.push("[hr]");
                outputCard.body.push(targetUnit.name + " must take a Morale Check");
                ButtonInfo("Morale Check","!Roll;Morale;" + targetUnit.modelIDs[0]);
            }
        }
    
    
    }




    const RemoveMagicPoints = (casters,points) => {
        let currentIndex = 0;
log("In Remove MP")
log("Points: " + points)
        for (let i=0;i<points;i++) {
            let caster = ModelArray[casters[currentIndex].id];
            if (!caster) {
                log("No Caster");
                continue;
            }
log(caster.name)
            let mp = parseInt(caster.token.get("bar2_value"));
log("MP: " + mp)
            if (mp > 0) {
                mp--;
                caster.token.set("bar2_value",mp);
            } else {
                currentIndex++
            }
        }
    }

    const ActivateUnit = (msg) => {
        let Tag = msg.content.split(";")
        let id = Tag[1];
        let order = Tag[2];
        let model = ModelArray[id];
        if (!model) {return};
        let unit = UnitArray[model.unitID];
        let unitLeader = ModelArray[unit.modelIDs[0]];

        RemoveDead();
        RemoveLines();

        SetupCard("Activate " + unit.name,"",unitLeader.faction);

        if (unit.activated === true) {
            outputCard.body.push("Unit has already been activated");
            PrintCard();
            return;
        }

        if (state.GDF.options[2] === "Ebb" && EbbFaction !== unit.faction) {
            outputCard.body.push("Not this Factions Turn");
            PrintCard();
            return;
        }

        //clear last activated unit of markers
        let prevUnit = UnitArray[currentUnitID];
        if (prevUnit) {
            ClearMarkers(prevUnit,"Prev");
        }
        ClearMarkers(unit,"Own");
        state.GDF.lastPlayer = unitLeader.player;
        currentUnitID = unit.id

        let specialOut = "";

        if (state.GDF.options[2] === "Weary") {
            let keys = Object.keys(UnitArray);
            let numbers = [0,0];
            let activated = [0,0];
            let currentPl = unit.player;
            let otherPl = (unitplayer === 1) ? 2:1;
            for (let i=0;i<keys.length;i++) {
                let uni = UnitArray[keys[i]];
                numbers[uni.player]++; 
                if (uni.activated === true) {
                    activated[player]++;
                }
            }
            if (activated[currentPl] >= Math.round(numbers[currentPl]/2)) {
                let endT = false;
                if (WearyEnd === true && activated[otherPl] >= Math.round(numbers[otherPl]/2)) {
                    endT = true;
                } else if (WearyEnd === false) {
                    let twoD6 = randomInteger(6) + randomInteger(6);
                    if (twoD6 === 2 || twoD6 === 12) {
                        WearyEnd === true;
                        if (activated[otherPl] >= Math.round(numbers[otherPl]/2)) {
                            endT = true;
                        } else {
                            let rem = Math.round(numbers[otherPl]/2) - activated[otherPl];
                            outputCard.body.push("This Unit fails to Activate");
                            let a = state.GDF.factions[currentPl].toString();
                            a = a.replace(","," + ");
                            let b = state.GDF.factions[otherPl][0].toString();
                            b = b.replace(","," + ");

                            outputCard.body.push(a + ": turn is over");
                            outputCard.body.push(b +": " + rem + " activations left");
                        }
                    }
                }
                if (endT === true) {
                    outputCard.body.push("Turn Ends");
                    for (let i=0;i<keys.length;i++) {
                        let um = ModelArray[UnitArray[keys[i]].modelIDs[0]];
                        if (um.token.get("aura1_color") === colours.green) {
                            um.token.set("aura1_color",colours.black)
                            UnitArray[keys[i]].order = "Hold";
                        }                        
                    }
                    PrintCard();
                    return;
                }
            }
        }

        if (unit.shakenCheck() === true) {
            if (unitLeader.type === "Vehicle" || unitLeader.type === "Monster") {
                order = "Hold";
            } else {
                order = "Take Cover";
            }
        } 

        unit.order = order;
        outputCard.subtitle = order;
        unit.activated = true;
        unitLeader.token.set("aura1_color",colours.black);
        let move = 6;
        if (unitLeader.special.includes("Fast") || unitLeader.special.includes("Ring the Bell") || unitLeader.special.includes("Psalms")) {
            move += 2;
        }
        if (unitLeader.special.includes("Very Fast")) {
            move += 2; //will have 2 from fast already
        }
        if (unitLeader.special.includes("Slow")) {
            move -= 2;
        }
        if (unitLeader.special.includes("Speed Boost") || unitLeader.special.includes("War Cry")) {
            move += 2;
        }
        if (unitLeader.special.includes("Blessing of Lust")) {
            move += 1;
        }
        let music = false;
        _.each(unit.modelIDs,id => {
            let model = ModelArray[id];
            if (model.special.includes("Musician")) {
                music = true;
            }
        })
        if (music === true) {
            move += 1;
        }



        if (unitLeader.token.get(sm.speed2) === true) {
            move += 2;
        }

        if (unitLeader.token.get(sm.speed3) === true) {
            move += 3;
        }
        if (unitLeader.token.get(sm.slow4) === true) {
            move -= 4;
        }
        if (unitLeader.token.get(sm.slow2) === true) {
            move -= 2;
        }

        if (unitLeader.type === "Aircraft") {
            move = '30-36"';
        }

        //check if in difficult or dangerous
        let difficult = false;
        let dangerous = [];
        let unitStrider = true;
        let anyStrider = false;
        let flying = false;
        if (unitLeader.token.get(sm.flying) === true) {
            flying = true;
        }

        if (flying === false) {
            for (let i=0;i<unit.modelIDs.length;i++) {
                let um = ModelArray[unit.modelIDs[i]];
                if (um.special.includes("Flying")) {
                    flying = true;
                    unitStrider = false;
                    continue;
                };
                if (um.special.includes("Strider")) {
                    anyStrider = true;
                } else {
                    unitStrider = false
                }
                if (hexMap[um.hexLabel].move === "Difficult" && um.special.includes("Strider") === false) {
                    difficult = true;
                }
                if (hexMap[um.hexLabel].move === "Dangerous") {
                    dangerous.push(um.name);
                }
                if (hexMap[um.hexLabel].move === "Dangerous for Infantry" && um.type === "Infantry") {
                    dangerous.push(um.name);
                }
                if (hexMap[um.hexLabel].move === "Dangerous if Rush/Charge" && (order === "Rush" || order === "Charge")) {
                    dangerous.push(um.name);
                }
            }
        }

        if (flying === true) {
            specialOut += "Models with Flying may move through all obstacles,and may ignore terrain effects.";
        }
        if (anyStrider === true) {
            if (unitStrider === true) {
                specialOut += "The Unit has Strider and may ignore the effects of difficult terrain.";
            } else {
                specialOut += "Those Models with Strider may ignore the effects of difficult terrain.";
            }
        }
        if (unitLeader.type === "Aircraft") {
            difficult = false;
            unitStrider = true;
            specialOut = "Ignores all Units and Terrain";
        }

        if (unitLeader.special.includes("Bounding")) {
            let bound = randomInteger(3) + 1;
            outputCard.body.push("Those Models with Bounding may be placed " + bound + '" away');
        }

        currentActivation = order;

        switch(order) {
            case 'Hold':
                outputCard.body.push("Unit stays in place and may fire");
                //outputCard.body.push('Ranged Fire gets +1 for targets under 12"');
                break;
            case 'Advance':
                if (difficult === true && move > 6) {
                    outputCard.body.push("Some of the Unit started in Difficult Terrain");
                    outputCard.body.push("The Unit may move a max of 6 Hexes");
                } else {
                    outputCard.body.push("Unit may move " + move + " hexes and then Fire");
                    if (unitStrider === false && move > 6) {
                        outputCard.body.push("If entering Difficult Terrain it may only move 6 Hexes");
                    }
                }
                outputCard.body.push(specialOut);
                break;
            case 'Rush':
                if (difficult === true) {
                    outputCard.body.push("Some of the Unit started in Difficult Terrain");
                    outputCard.body.push("The Unit may move a max of 6 Hexes");
                } else {
                    outputCard.body.push("Unit may move " + (move*2) + " hexes");
                    if (unitStrider === false) {
                        outputCard.body.push("If any models enter Difficult Terrain all in the Unit may only move 6 Hexes");
                    }
                }
                outputCard.body.push(specialOut);
                outputCard.body.push("It may not fire");
                break;
            case 'Charge':
                if (difficult === true) {
                    outputCard.body.push("Some of the Unit started in Difficult Terrain");
                    outputCard.body.push("The Unit may Charge a max of 6 Hexes");
                } else {
                    outputCard.body.push("Unit may Charge " + (move*2) + " hexes");
                    if (unitStrider === false) {
                        outputCard.body.push("If any models enter Difficult Terrain all in the Unit may only move 6 Hexes");
                    }
                    outputCard.body.push("It may not fire but must charge at least one model into base contact with the enemy");
                }
                outputCard.body.push(specialOut);
                break;
            case 'Take Cover':
                outputCard.body.push("The Unit Takes Cover from Enemy Fire");
                outputCard.body.push("Enemy Attacks are at -1 to Hit");
                if (unit.shakenCheck() === true) {
                    outputCard.body.push("The Unit Rallies");
                    unit.rally();
                }
                unitLeader.token.set(sm.takecover,true);
                if (unitLeader.type === "Aircraft") {
                    outputCard.body.push("The Aircraft must complete movement, jinking in air while doing so");
                }
                break;
            case 'Overwatch':
                outputCard.body.push("The unit stays idle, and until its next activation it may react once to an enemy unit as it moves or shoots.");
                unitLeader.token.set("aura1_color",colours.purple);
                break;
        };
        if (dangerous.length > 0) {
            outputCard.body.push("[hr]");
            outputCard.body.push("The Following Models started in Dangerous Terrain");
            outputCard.body.push("And need to take a Dangerous Test before Moving");
            for (let i=0;i<dangerous.length;i++) {
                outputCard.body.push(dangerous[i]);
            }
        }
        PrintCard();
    }

    const ClearMarkers = (unit,type) => {
        let unitLeader = ModelArray[unit.modelIDs[0]];
        switch(type) {
            case 'Prev':
                //clear things like Take Aim from prev unit
                if (unitLeader.token.get(sm.fired) === true) {
                    unitLeader.token.set(sm.takeaim,false);
                    unitLeader.token.set(sm.focus,false);
                    unitLeader.token.set(sm.minusttohit,false);
                    //clear temp stealth from targets that were shot at by prev unit
                    for (let i=0;i<unit.targetIDs.length;i++) {
                        let targUnit = UnitArray[unit.targetIDs[i]];
                        if (!targUnit) {continue}
                        let targUnitLeader = ModelArray[targUnit.modelIDs[0]];
                        if (targUnitLeader) {
                            targUnitLeader.token.set(sm.tempstealth);
                            targUnitLeader.token.set(sm.defense2,false);
                            targUnitLeader.token.set(sm.bonusdef,false);
                        }
                    }
                }
                //clear movement markers and others
                let clear = [sm.speed3,sm.slow4,sm.slow2,sm.regeneration,sm.flying];
                for (let i=0;i<clear.length;i++) {
                    unitLeader.token.set(clear[i],false);
                }
                // markers
                if (unitLeader.token.get(sm.fatigue) === true) {
                    unitLeader.token.set(sm.meleeap,false);
                    unitLeader.token.set(sm.meleeap2,false);
                    unitLeader.token.set(sm.bonusatt,false);
                    unitLeader.token.set(sm.poison,false);


                }
                break;
            case 'Own':
                //clear any markers from current unit
                unitLeader.token.set(sm.takecover,false);
                unitLeader.token.set(sm.rangedap,false);
                unitLeader.token.set(sm.bonusrange,false);

                if (unitLeader.token.get("aura1_color") === colours.purple) {
                    unitLeader.token.set("aura1_color",colours.green)
                }
                unit.order = "";
                break;
            case 'New':
                //new turn, change all
                for (let i=0;i<unit.modelIDs.length;i++) {
                    let m = ModelArray[unit.modelIDs[i]];
                    m.token.set(sm.moved,false);
                    m.token.set(sm.fatigue,false);
                    m.token.set(sm.fired,false);
                    m.fired = [];
                    m.spellsCast = [];
                }
                break;
        }
    }

    const EndTurn = () => {
        WearyEnd = false;
        RemoveDead();
        RemoveLines();
        //check if any units didnt activate
        let keys = Object.keys(UnitArray);
        for (let i=0;i<keys.length;i++) {
            let unit = UnitArray[keys[i]];
            let unitLeader = ModelArray[unit.modelIDs[0]];
            if (unitLeader.token.get("aura1_color") === colours.green) {
                let pos = ModelArray[unit.modelIDs[0]].location;
                sendPing(pos.x,pos.y, Campaign().get('playerpageid'), null, true); 
                SetupCard(unit.faction,"",unit.faction);
                outputCard.body.push("Unit has not been activated");
                PrintCard();
                return;
            }
        }
        state.GDF.turn += 1;
        let gameContinues = true;
        let out = [];
        if (state.GDF.turn > 4) {
            if (state.GDF.options[3] === false) {
                gameContinues = false;
            } else {
                let roll = randomInteger(6);
                let needed = Math.min(state.GDF.turn - 1,6);
                out.push("Prolonged: " + roll + " vs. " + needed + "+");                
                if (roll < needed) {
                    gameContinues = false;
                    out.push("The Battle Ends");
                } else {                    
                    out.push("The Battle continues for at least one more turn...");
                }
                out.push("[hr]");
            }
        }

        if (gameContinues === true) {
            let tmID = state.GDF.turnMarkerID;
            let turnMarker = findObjs({_type:"graphic", id: tmID})[0];
            if (!turnMarker) {
                PlaceTurnMarker()
            } else {
                let newImg = getCleanImgSrc(TurnMarkers[state.GDF.turn]);
                turnMarker.set("imgsrc",newImg);
            }
            SetupCard("Turn: " + state.GDF.turn,"","Neutral");
            if (out.length > 0) {
                for (let i=0;i<out.length;i++) {
                    outputCard.body.push(out[i]);
                }
            }
            //same faction takes first go this turn
            //clear auras that arent yellow, set unit.orders to be ""
            let fact = state.GDF.factions[state.GDF.lastPlayer].toString();
            fact = fact.replace(","," + ");
            outputCard.body.push(fact + " gets the first Activation");
            let keys = Object.keys(UnitArray);
            for (let i=0;i<keys.length;i++) {
                let unit = UnitArray[keys[i]];
                for (let j=0;j<unit.modelIDs.length;j++) {
                    let model = ModelArray[unit.modelIDs[j]];
                    if (!model) {continue};
                    if (j===0 && model.token.get("aura1_color") === colours.black) {
                        model.token.set("aura1_color",colours.green);
                    }
                    if (model.special.includes("Caster")) {
                        let index = model.special.indexOf("Caster");
                        let X = parseInt(model.special.charAt(index+7));
                        let points = parseInt(model.token.get("bar2_value"));
                        points = Math.min(points + X,6);
                        model.token.set("bar2_value",points);
                    }
                    model.specialsUsed = [];
                }
                ClearMarkers(unit,"New");
                //clear order and targets
                unit.targetIDs = [];
                unit.activated = false;
            }
            Objectives();
        } else {
            let count = Objectives();
            let winningFaction,line;
            if (count[0] === count[1]) {
                line = "The game ends in a tie";
                winningFaction = "Neutral";
            } else {
                let winner = (count[0] > count[1]) ? 0:1;
                let loser = (winner === 0) ? 1:0;
                winningFaction = state.GDF.factions[winner].toString();
                winningFaction = winningFaction.replace(","," + ");
                line = winningFaction + ' has won with ' + count[winner] + " Objectives to " + count[loser];
            }
            SetupCard("Game Over","",winningFaction);
            if (out.length > 0) {
                for (let i=0;i<out.length;i++) {
                    outputCard.body.push(out[i]);
                }
            }
            outputCard.body.push(line);
        }
        PrintCard();
    }

    const Objectives = () => {
        let count = [0,0,0];
        for (let i=0;i<state.GDF.objectives.length;i++) {
            let objective = state.GDF.objectives[i];
            let keys = Object.keys(ModelArray);
            let modelsInRange = [false,false];
            let objToken = findObjs({_type:"graphic", id: objective.id})[0];
            for (let k=0;k<keys.length;k++) {
                let model = ModelArray[keys[k]];
                if (model.type === "Aircraft") {continue};
                let unit = UnitArray[model.unitID];
                if (unit.shakenCheck() === true) {continue};
                if (model.special.includes("Ambush") && unit.deployed === state.GDF.turn) {
                    continue;
                }
                let distance = ModelDistance(model,objective).distance;
                if (distance > 3) {continue};
                modelsInRange[model.player] = true;
            }
            let side;
            if (modelsInRange[0] === true && modelsInRange[1] === true) {
                side = 2;
            } else if (modelsInRange[0] === true && modelsInRange[1] === false) {
                side = 0;
            } else if (modelsInRange[0] === false && modelsInRange[1] === true) {
                side = 1;
            } else if (modelsInRange[0] === false && modelsInRange[1] === false) {
                side = parseInt(objToken.get("currentSide"));
            }
            let img = objToken.get("sides").split("|");
            img = img[side];
            objToken.set({
                currentSide: side,
                imgsrc: img,
            });
            count[side]++;
        }
        return count;
    } 

    const StartGame = () => {
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "objects",
        });
        for (let i=0;i<tokens.length;i++) {
            let token = tokens[i];
            let name = token.get("name");
            if (name.includes("Objective")) {
                sides = [];
                for (let i=0;i<2;i++) {
                    let faction = state.GDF.factions[i][0];
                    let tablename = Factions[faction].dice;
                    let table = findObjs({type:'rollabletable', name: tablename})[0];
                    let obj = findObjs({type:'tableitem', _rollabletableid: table.id, name: '6' })[0];        
                    let image = tokenImage(obj.get('avatar'));                    
                    sides.push(image);
                }
                let objNum = name.replace(/\D/g,'') - 1;
                let images = ["https://s3.amazonaws.com/files.d20.io/images/306331520/L67AAVS8GOrbFdWQMcg6JA/thumb.png?1664136875","https://s3.amazonaws.com/files.d20.io/images/306333377/ujCJ26GwCQblS4YxGtTJGA/thumb.png?1664137412","https://s3.amazonaws.com/files.d20.io/images/306334101/tByHNVqk10c0Rw2WX9pJpw/thumb.png?1664137597","https://s3.amazonaws.com/files.d20.io/images/306334428/y1rD_5GiD6apA9VOppxDcA/thumb.png?1664137681","https://s3.amazonaws.com/files.d20.io/images/306335099/fru3LTmrDslxAbHI-ALPUg/thumb.png?1664137844"];
                let neutral = tokenImage(images[objNum]);
                sides.push(neutral);
                sides = sides.toString();
                sides = sides.replace(/,/g,"|");
                token.set({
                    sides: sides,
                    currentSide: 2,
                    imgsrc: neutral,
                    height: 140,
                    width: 140,
                    layer: "map",
                });
                let location = new Point(token.get("left"),token.get('top'));
                let hex = pointToHex(location);
                let obj = {
                    id: token.id,
                    hex: hex,
                }
                state.GDF.objectives.push(obj);
            }



        }
        state.GDF.turn = 1;
        PlaceTurnMarker();
        SetupCard("Turn 1","","Neutral");
        outputCard.body.push("The Player that Deployed First takes the first Activation");
        PrintCard();
    }

    const PlaceTurnMarker = () => {
        let turnMarker = getCleanImgSrc(TurnMarkers[state.GDF.turn]);        
        let x = Math.floor((pageInfo.width + EDGE) / 2);
        let y = Math.floor((pageInfo.height/2));
        let newToken = createObj("graphic", {   
            left: x,
            top: y,
            width: 210, 
            height: 210,  
            name: "Turn",
            pageid: Campaign().get("playerpageid"),
            imgsrc: turnMarker,
            layer: "map",
        });
        toFront(newToken);
        state.GDF.turnMarkerID = newToken.id;
    }


    const ChangeOrder = (msg) => {
        let Tag = msg.content.split(";")
        let id = Tag[1];
        let newOrder = Tag[2];
        let model = ModelArray[id];
        let unit = UnitArray[model.unitID];
        unit.order = newOrder;
        currentActivation = newOrder;
        sendChat("","Order switched to " + newOrder);
    }

    const Specials = (msg) => {
        let Tag = msg.content.split(";")
        let specialName = Tag[1];
        let selectedID = Tag[2];
        let selectedModel = ModelArray[selectedID];
        let selectedUnit = UnitArray[selectedModel.unitID];
        let errorMsg;
        let outLines = [];
        SetupCard(specialName,selectedModel.name,selectedModel.faction);
        if (selectedModel.specialsUsed.includes(specialName)) {
            errorMsg = "Ability already used this turn";
        }
        if (selectedUnit.activated === false) {
            errorMsg = "Activate this Unit First";
        }

        let targetID = Tag[3];
        let targetModel = ModelArray[targetID];
        let targetUnit = UnitArray[targetModel.unitID];
        let targetUnitLeader = ModelArray[targetUnit.modelIDs[0]];

        //distance to targetModel
        let distance = ModelDistance(selectedModel,targetModel);
        if (hexMap[selectedModel.hexLabel].terrain.includes("Offboard") && targetModel.special.includes("Transport") && selectedModel.player === targetModel.player) {
            distance = 1; //onboard friendly
        }



        //check for field radios
        let radio = false;
        radioLoop:
        for (let i=0;i<selectedUnit.modelIDs.length;i++) {
            let stm = ModelArray[selectedUnit.modelIDs[i]];
            if (stm.special.includes("Field Radio")) {
                for (let j=0;j<targetUnit.modelIDs.length;j++) {
                    let tm = ModelArray[targetUnit.modelIDs[j]];
                    if (tm.special.includes("Field Radio")) {
                        radio = true;
                        break radioLoop;
                    }
                }
            }
        }

        if (specialName === "Advanced Tactics" || specialName === "Pheromones") {
            if (distance > 12) {
                errorMsg = 'Target is > 12" away';
            } else {
                outLines.push('Target Unit may now move an immediate 6"');
            }
        }

        if (specialName === "Repair") {
            if (distance > 2) {
                errorMsg = 'Target is > 2" away';
            } else {
                let wounds = parseInt(targetModel.token.get("bar1_value"));
                let max = parseInt(targetModel.token.get("bar1_max"));
                let heal = randomInteger(3);
                let healRoll = randomInteger(6);
                if (healRoll > 1) {
                    heal = Math.min(heal,(max - wounds));
                    wounds += heal;
                    outLines.push("Success!");
                    outLines.push(heal + " wounds Healed");
                    targetModel.token.set("bar1_value",wounds);
                } else {
                    outLines.push("[#ff0000]Failure![/#]");
                }
            }
        }
        
        let bonusMovements = ["Double Time","Dark Tactics","Scurry Away"];
        if (bonusMovements.includes(specialName)) {
            if (targetUnit === selectedUnit) {
                errorMsg = 'Cannot target own Unit';
            } else if (radio === false && distance > 12) {
                errorMsg = 'Distance > 12"';
            } else if (radio === true && distance > 24) {
                errorMsg = 'Distance > 24"';
            } else {
                outLines.push('Target Unit may move up to 6" immediately');
            }
        }

        if (specialName === "Company Standard" || specialName === "Safety in Numbers") {
            let targetModel2ID = Tag[4];
            let targetModel2 = ModelArray[targetModel2ID];
            let targetUnit2 = UnitArray[targetModel2.unitID];
            let targetUnit2Leader = ModelArray[targetUnit2.modelIDs[0]];
            let distance2 = selectedModel.hex.distance(targetModel2.hex);
            if (distance > 12 || distance2 > 12) {
                errorMsg = "Distance to Target 1: " + distance + "<br>Distance to Target2: " + distance2;
            } else {
                outLines.push(targetUnit.name + " gets +1 on their next Morale Test");
                targetUnitLeader.token.set(sm.bonusmorale,true);
                if (targetUnit2 !== targetUnit) {
                   outLines.push(targetUnit2.name + " gets +1 on their next Morale Test");
                   targetUnit2Leader.token.set(sm.bonusmorale,true);
                };
            }
        }

        if (specialName === "Focus Fire") {
            if (radio === false && distance > 12) {
                errorMsg = 'Distance > 12"';
            } else if (radio === true && distance > 24) {
                errorMsg = 'Distance > 24"';
            } else {
                outLines.push('Target Unit gets +1 AP when it next fires');
                targetUnitLeader.token.set(sm.focus,true);
            }
        }

        if (specialName === "Take Aim") {
            if (radio === false && distance > 12) {
                errorMsg = 'Distance > 12"';
            } else if (radio === true && distance > 24) {
                errorMsg = 'Distance > 24"';
            } else {
                outLines.push('Target Unit gets +1 to Hit when it next fires');
                targetUnitLeader.token.set(sm.takeaim,true);
            }
        }

        if (specialName === "Explode") {
            if (distance > 1) {
                errorMsg = 'Distance > 1"';
            } else {
                let x = parseInt(selectedModel.special.charAt(selectedModel.special.indexOf("Explode") + 8));
                let hitNumber = x*2;
                outputCard.body.push('Unit explodes, causing ' + hitNumber + " Hits");
                outputCard.body.push("[hr]");
                let weapon = {
                    name: "Spore Mine Explosion",
                    ap: 0,
                    special: " ",
                }
                PlaySound("Explosion");
                FX("System-Blast-explode-frost",selectedModel,targetModel);
                outputCard.body.push(targetUnit.name);
                let hits = [];
                for (let h=0;h<hitNumber;h++) {
                    hits.push(7);
                }
                //cover check
                let numberCoverTested = 0;
                let numberLOSCover = 0;
                let numberCover = 0;
                for (let j=0;j<targetUnit.modelIDs.length;j++) {
                    let tID = targetUnit.modelIDs[j];
                    let losResult = LOS(selectedModel.id,tID);
                    if (losResult.los === false) {continue};
                    numberCoverTested++;
                    if (losResult.cover === true) {numberCover++};
                    if (losResult.losCover === true) {numberLOSCover++};
                }
                let coverPercent = (numberCover/numberCoverTested) * 100;
                let losCoverPercent = (numberLOSCover/numberCoverTested) * 100;
                
                let cover = false; //targets are IN the cover, ignored by Blast and Lockon
                let losCover = false; //targets are behind cover, ignored by Indirect
                if (coverPercent >= 50) {
                    cover = true;
                }
                if (losCoverPercent >= 50) {
                    losCover = true;
                }
                let hitCover = false;
                if (cover === true || losCover === true) {
                    hitCover = true;
                }
        
                let hitInfo = {
                    hits: hits,
                    weapon: weapon,
                    cover: hitCover,
                }
                targetUnit.hitArray.push(hitInfo);
    
                let totalWounds = Saves("Ranged",targetUnit.id);
        
                if (targetUnit.halfStrength() === true && targetUnit.shakenCheck() === false && totalWounds > 0) {
                    outputCard.body.push("[hr]");
                    outputCard.body.push(targetUnit.name + " must take a Morale Check");
                    ButtonInfo("Morale Check","!Roll;Morale;" + targetUnit.modelIDs[0]);
                }
                selectedModel.kill();
                PrintCard();
                return;
            }
        }

        if (specialName === "Takedown") {
            if (distance > 3) {
                errorMsg = 'Has to be in Close Combat';
            }
            if (selectedModel.token.get(sm.onetime) === true) {
                errorMsg = "Can only use this ability once";
            }
            if (!errorMsg || errorMsg === undefined) {
                let roll = randomInteger(6);
                if (roll === 1) {
                    outLines.push("Attack misses!");
                } else {
                    weapon = {
                        name: "Takedown",
                        type: "CCW",
                        range: "3",
                        attack: 1,
                        ap: 1,
                        special: "Deadly(3)",
                        sound: "Axe",
                    }

                    hitInfo = {
                        hits: [roll],
                        weapon: weapon,
                        cover: false,
                    }
                    targetUnit.hitArray.push(hitInfo);
                    outputCard.body.push("The Attack Hits");
                    let totalWounds = Saves("Ranged",targetUnit.id,targetID);
                    if (totalWounds > 0) {
                        outputCard.body.push("Add " + totalWounds + " to the Close Combat total");
                    }
                    if (targetUnit.halfStrength() === true && targetUnit.shakenCheck() === false && totalWounds > 0) {
                        outputCard.body.push("[hr]");
                        outputCard.body.push(targetUnit.name + " must take a Morale Check");
                        ButtonInfo("Morale Check","!Roll;Morale;" + targetUnit.modelIDs[0]);
                    }
                    PrintCard();
                    selectedModel.token.set(sm.onetime,true);
                    return;
                }
            }
        }

        if (specialName === "Spell Warden") {
            if (distance > 6) {
                errorMsg = 'Distance > 6"';
            } else {
                outputCard.body.push("The targeted Caster gets +1 to its next cast");
                targetModel.token.set(sm.bonusCaster,1);
            }
        }

        if (specialName === "Breath Attack") {
            if (distance > 6) {
                errorMsg = 'Distance > 6"';
            } else {
                let roll = randomInteger(6);
                if (roll === 1) {
                    outputCard.body.push("The Scream Misses!");
                } else {
                    weapon = {
                        name: "Killing Scream",
                        type: "Heavy",
                        range: "6",
                        attack: 1,
                        ap: 1,
                        special: "Blast(3)",
                        sound: "Scream",
                    }

                    hitInfo = {
                        hits: [roll,7,7],
                        weapon: weapon,
                        cover: false,
                    }
                    targetUnit.hitArray.push(hitInfo);
                    outputCard.body.push("The Scream Hits");
                    let totalWounds = Saves("Ranged",targetUnit.id,targetID);
                    if (targetUnit.halfStrength() === true && targetUnit.shakenCheck() === false && totalWounds > 0) {
                        outputCard.body.push("[hr]");
                        outputCard.body.push(targetUnit.name + " must take a Morale Check");
                        ButtonInfo("Morale Check","!Roll;Morale;" + targetUnit.modelIDs[0]);
                    }
                    PrintCard();
                    return;
                }
            }
        }

        if (specialName === "Spotting Laser") {
            if (distance > 30) {
                errorMsg = 'Distance > 30"';
            } else {
                let roll = randomInteger(6);
                if (roll < 3) {
                    outputCard.body.push("Unable to place Spotting Laser this Turn");
                } else {
                    outputCard.body.push()
                    let sl = parseInt(targetUnitLeader.token.get(sm.spotting)) || 0;
                    sl++
                    targetUnitLeader.token.set(sm.spotting,sl);
                    outputCard.body.push("Target has been marked");
                }
            }
        }







        if (errorMsg === undefined|| !errorMsg) {
            for (let i=0;i<outLines.length;i++) {
                outputCard.body.push(outLines[i]);
            }
            selectedModel.specialsUsed.push(specialName);
        } else {
            outputCard.body.push(errorMsg);
        }




        PrintCard();
    }

    const RemoveDead = (info) => {
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "map",
        });
        tokens.forEach((token) => {
            if (token.get("status_dead") === true) {
                token.remove();
            }
            let removals = ["Objective","Turn"];
            for (let i=0;i<removals.length;i++) {
                if (token.get("name").includes(removals[i]) && info === "All") {
                    token.remove();
                }
            }
        });
    }

    const destroyGraphic = (tok) => {
        if (tok.get('subtype') === "token") {
            let model = ModelArray[tok.id];
            if (!model) {return};
            model.kill();
        }
    }

    const CheckLOS = (msg) => {
        RemoveLines();
        let Tag = msg.content.split(";");
        let shooterID = Tag[1];
        let shooter = ModelArray[shooterID];
        let shooterUnit = UnitArray[shooter.unitID];

        let targetID = Tag[2];
        let target = ModelArray[targetID];
        let targetUnit = UnitArray[target.unitID];

        SetupCard(shooterUnit.name,"LOS",shooter.faction);
        if (shooter.faction === target.faction) {
            outputCard.body.push("Friendly Fire!");
            PrintCard();
            return;
        }

        let weaponList = [];
        let ColourCodes = ["#00ff00","#ffff00","#ff0000","#00ffff","#000000"];
        let index;
        let lines = [0,0,0,0,0,0,0,0];
        let totalLines = 0;

        let losFlag = false;

        for (let i=0;i<shooterUnit.modelIDs.length;i++) {
            let stm = ModelArray[shooterUnit.modelIDs[i]];
            for (let j=0;j<targetUnit.modelIDs.length;j++) {
                let tm = ModelArray[targetUnit.modelIDs[j]];
                let losResult = LOS(stm.id,tm.id);
log(losResult)
                for (let w=0;w<stm.weaponArray.length;w++) { 
                    let weapon = stm.weaponArray[w];
log(weapon.name)
                    if (losResult.distance > weapon.range) {continue};
                    if (losResult.los === false && weapon.special.includes("Indirect") === false) {continue};
                    if (weapon.type === "CCW") {continue};
                    if (weaponList.includes(weapon.name)) {
                        index = weaponList.indexOf(weapon.name);
                    } else {
                        weaponList.push(weapon.name);
                        index = weaponList.length - 1;
                    }
                    losFlag = true;
log(index)
                    let lineID = DrawLine(stm.id,tm.id,index,"objects");
                    state.GDF.lineArray.push(lineID);
                    lines[index]++;
                    totalLines++
                }
            }
        }

        if (losFlag === false) {    
            outputCard.body.push("No LOS to Target Unit");
        } else if (totalLines === 0) {
            outputCard.body.push("LOS but No Weapons with Range to Target Unit");
        } else {
            for (let i=0;i<weaponList.length;i++) {
                if (lines[i] > 0) {
                    outputCard.body.push("[" + ColourCodes[i] + "]" + "█[/#] - " + weaponList[i]);
                }
            }
            ButtonInfo("Remove Lines","!RemoveLines");
        }
        PrintCard();
    }

    const DeploymentZones = () => {
        let type = randomInteger(6).toString();
        if (state.GDF.options[0] === false) {
            type = '1';
        }
        let x0,y0,x1,x2,y1,y2,m,b1,b2,lineID;
        switch(type) {
            case '1':
                outputCard.body.push("Front Line");
                outputCard.body.push("Dice Roll, Winner picks top or bottom and deploys first");
                x1 = 0;
                x2 = pageInfo.width;
                //top line
                y1 = Math.round(pageInfo.height/2) - (12*ySpacing);
                y2 = y1;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.GDF.deployLines.push(lineID);
                y1 = Math.round(pageInfo.height/2) + (12*ySpacing);
                y2 = y1;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.GDF.deployLines.push(lineID);
                break;
            case '2':
                outputCard.body.push("Long Haul");
                outputCard.body.push("Dice Roll, Winner picks left or right and deploys first");
                x1 = EDGE/2 - (12*xSpacing);
                x2 = x1;
                y1 = 0;
                y2 = pageInfo.height;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.GDF.deployLines.push(lineID);
                x1 = EDGE/2 + (12*xSpacing);
                x2 = x1;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.GDF.deployLines.push(lineID);
                break;
            case '3':
                outputCard.body.push("Side Battle");
                outputCard.body.push("Dice Roll, Winner picks a corner and deploys first");
                x1 = 0;
                y1 = 0;
                x2 = EDGE;
                y2 = pageInfo.height;
                x0 = x2 - x1;
                y0 = y2 - y1;
                m = y0/x0;//slope of line
                b1 = 0;
                b2 = 12*140*1.414*((m*m)-1);
                y1 = b2;
                y2 = x2 * m + b2;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.GDF.deployLines.push(lineID);
                y1 = -b2;
                y2 = x2 * m - b2;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.GDF.deployLines.push(lineID);

                break;
            case '4':
                outputCard.body.push("Ambush");
                outputCard.body.push("Dice Roll, Winner can choose to deploy in centre or in corners");
                x1 = 0;
                y1 = 0;
                x2 = EDGE;
                y2 = pageInfo.height;
                x0 = x2 - x1;
                y0 = y2 - y1;
                m = y0/x0;//slope of line
                b1 = 0;
                b2 = 6*140*1.414*((m*m)-1);
                y1 = b2;
                y2 = x2 * m + b2;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.GDF.deployLines.push(lineID);
                y1 = -b2;
                y2 = x2 * m - b2;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.GDF.deployLines.push(lineID);
                b2 = 24*140*1.414*((m*m)-1);
                y1 = b2;
                y2 = x2 * m + b2;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.GDF.deployLines.push(lineID);
                y1 = -b2;
                y2 = x2 * m - b2;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.GDF.deployLines.push(lineID);
                break;
            case '5':
                outputCard.body.push("Spearhead");
                outputCard.body.push("Dice Roll, Winner can choose to deploy on left or right");
                x1 = EDGE/2 - (12*xSpacing);
                y1 = Math.round(pageInfo.height/2);
                x2 = 0;
                y2 = 0;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.GDF.deployLines.push(lineID);
                y2 = pageInfo.height;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.GDF.deployLines.push(lineID);
                x1 = EDGE/2 + (12*xSpacing);
                x2 = EDGE;
                y2 = 0;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.GDF.deployLines.push(lineID);
                y2 = pageInfo.height;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.GDF.deployLines.push(lineID);
                break;
            case '6':
                outputCard.body.push("Flank Attack");
                outputCard.body.push("Dice Roll, Winner can choose to deploy on left or right");
                x1 = EDGE/2 - (12*xSpacing);
                y1 = Math.round(pageInfo.height/2);
                x2 = 0;
                y2 = y1;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.GDF.deployLines.push(lineID);
                x2 = x1;
                y2 = 0;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.GDF.deployLines.push(lineID);
                x1 = EDGE/2 + (12*xSpacing);
                x2 = EDGE;
                y2 = y1;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.GDF.deployLines.push(lineID);
                x2 = x1;
                y2 = pageInfo.height;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.GDF.deployLines.push(lineID);
                break;
        }
    }

    const Options = (msg) => {
        SetupCard("Game Info","","Neutral");
        RemoveDepLines();

        let Tag = msg.content.split(";");
        //0 = Random Deployment
        //1 = Random Mission
        //2 = Fog of War Possible
        //3 = Prolonged Battle
    
        for (let i=0;i<4;i++) {
            if (Tag[i+1] === "Yes") {
                state.GDF.options[i] = true;
            } else {
                state.GDF.options[i] = false;
            }
        }

        outputCard.body.push("[hr]");
        outputCard.body.push("[B]Deployment Info[/b]");
        DeploymentZones();
        outputCard.body.push("[hr]");
        outputCard.body.push("[B]Mission Info[/b]");
        MissionInfo();     
        outputCard.body.push("[hr]");
        outputCard.body.push("[B]Fog of War[/b]");
        FogOfWar();
        outputCard.body.push("[hr]");
        outputCard.body.push("[B]Battle Length[/b]");
        Prolonged();
        PrintCard();
    }

    const MissionInfo = () => {
        let type = randomInteger(4).toString();
        if (state.GDF.options[1] === false) {
            type = '1';
        }
        state.GDF.mission = type;
        switch(type) {
            case '1':
                outputCard.body.push("Standard Mission");
                let num = randomInteger(3) + 2;
                outputCard.body.push("Place " + num + " Objectives");
                break;
            case '2':
                outputCard.body.push("Seize Ground");
                outputCard.body.push("The players set up a total of 4 objective markers on the battlefield. Divide the non-deployment zone area of the table into 4 equal quarters, and place one marker at the center of each.");
                break;
            case '3':
                outputCard.body.push("Sabotage");
                outputCard.body.push('The players set up 1 objective marker each 12” away from their table edge. Each objective marker belongs to the player that placed it, and if at any point a unit seizes the enemy objective marker, then the marker is destroyed and removed from play.');
                break;
            case '4':
                outputCard.body.push("Breakthrough");
                outputCard.body.push('The players must set up 1 objective marker each on the battlefield. The objective markers must be placed at the center of each player’s deployment zone, 12” away from the table edge.');
                break;
        }
        outputCard.body.push("At the End of the Game, the player controlling the most objectives wins");
    }

    const FogOfWar = () => {
        if (state.GDF.options[2] === false) {
            outputCard.body.push("None");
        } else {
            let roll = randomInteger(6);
            if (roll === 1) {
                state.GDF.options[2] = "Surprise";
                outputCard.body.push("The Battle is a Surprise Engagement between the Two Forces");
                outputCard.body.push("First, each player divides their deployment zone into 3 equal sections and gives each section a number from 1 to 3. Then, when it’s a player’s turn to deploy a unit, roll a D3 and place the unit fully within the resulting section. Units that are deployed differently due to special rules (such as Ambush) have to follow the same rules, however the entire battlefield is divided into 3 equal sections along the long table edge, instead of only the deployment zones.");
            } else if (roll === 0) {
                outputCard.body.push("Ebb and Flow");
                outputCard.body.push("Activations will take place in a Random Order based on the number of Units on each side.");
                state.GDF.options[2] = "Ebb";
            } else if (roll === 2) {
                state.GDF.options[2] = "Weary"
                outputCard.body.push("Combat Weariness");
                outputCard.body.push("The Forces are battle weary from previous fighting.");
                outputCard.body.push("Starting from the second round on, whenever a player that has already activated at least half of their units finishes an activation, then they must roll 2D6. If the result is a 2 or a 12, then they may not activate any more units this round, and as soon as their opponent has finished activating at least half of their units, then the round ends.");
            } else {
                outputCard.body.push("No Fog of War Rolled");
            }
        }
    }

    const Prolonged = () => {
        if (state.GDF.options[3] === true) {
            outputCard.body.push("Battle may last more than 4 Turns");
        } else {
            outputCard.body.push("Battle will end after 4 Turns");
        }
    }

    const DrawEbb = () => {
        let factions = [0,0];
        let total = 0;
        let keys = Object.keys(UnitArray);
        for (let i=0;i<keys.length;i++) {
            let unit = UnitArray[keys[i]];
            let leader = ModelArray[unit.modelIDs[0]];
            if (leader.token.get("aura1_color") === colours.black) {
                continue;
            } 
            factions[unit.player]++;
            total++;
        }
        let roll = randomInteger(total);
log("Roll: " + roll)
        let faction;
        if (roll <= factions[0]) {
            faction = state.GDF.factions[0][0];
            factions[0]--;
        } else {
            faction = state.GDF.factions[1][0];
            factions[1]--
        }
        let mid = "Rolled " + roll + " of " + total
        SetupCard("Ebb and Flow",mid,faction);
        outputCard.body.push(DisplayDice(6,faction,48));
        outputCard.body.push("[hr]");

        for (let i=0;i<2;i++) {
            outputCard.body.push(state.GDF.factions[i][0] + ": " + factions[i] + " left");
        }
        EbbFaction = faction;
        PrintCard();
    }

    const UserImage = (msg) => {
        output = _.chain(msg.selected)
        .map( s => getObj('graphic',s._id))
        .reject(_.isUndefined)
        .map( o => o.get('imgsrc') )
        .map( getCleanImgSrc )
        .reject(_.isUndefined)
        .map(u => `<div><img src="${u}" style="max-width: 3em;max-height: 3em;border:1px solid #333; background-color: #999; border-radius: .2em;"><code>${u}</code></div>`)
        .value()
        .join('') || `<span style="color: #aa3333; font-weight:bold;">No selected tokens have images in a user library.</span>`
        ;
        output = '<div>' + output + '</div>'
        sendChat("",output);
    }

    const changeGraphic = (tok,prev) => {
        if (tok.get('subtype') === "token") {
            RemoveLines();
            log(tok.get("name") + " moving");
            if ((tok.get("left") !== prev.left) || (tok.get("top") !== prev.top)) {
                let model = ModelArray[tok.id];
                if (!model) {return};
                let oldHex = model.hex;
                let oldHexLabel = model.hexLabel;
                if (hexMap[oldHexLabel].terrain.includes("Offboard") && model.special.includes("Ambush")) {
                    UnitArray[model.unitID].deployed = state.GDF.turn;
                }
                let newLocation = new Point(tok.get("left"),tok.get("top"));
                let newHex = pointToHex(newLocation);
                let newHexLabel = newHex.label();
                newLocation = hexToPoint(newHex); //centres it in hex
                let newRotation = oldHex.angle(newHex);
                if (model.name.includes("Shard")) {
                    newRotation = prev.rotation;
                }
                tok.set({
                    left: newLocation.x,
                    top: newLocation.y,
                    rotation: newRotation,
                });
                model.hex = newHex;
                model.hexLabel = newHexLabel;
                model.location = newLocation;
                let index = hexMap[oldHexLabel].tokenIDs.indexOf(tok.id);
                if (index > -1) {
                    hexMap[oldHexLabel].tokenIDs.splice(index,1);
                }
                hexMap[newHexLabel].tokenIDs.push(tok.id);
                if (model.size === "Large") {
                    model.vertices = TokenVertices(tok);
                    LargeTokens(model);
                }
            };
        };
    };



    const handleInput = (msg) => {
        if (msg.type !== "api") {
            return;
        }
        let args = msg.content.split(";");
        log(args);
        switch(args[0]) {
            case '!Dump':
                log("STATE");
                log(state.GDF);
                log("Terrain Array");
                log(TerrainArray);
                log("Model Array");
                log(ModelArray);
                log("Unit Array");
                log(UnitArray)
                break;
            case '!StartNew':
                ClearState();
                break;
            case '!Roll':
                RollD6(msg);
                break;
            case '!UnitCreation':
                UnitCreation(msg);
                break;
            case '!UnitCreation2':
                UnitCreation2(msg);
                break;
            case '!TokenInfo':
                TokenInfo(msg);
                break;
            case '!CheckLOS':
                CheckLOS(msg);
                break;
            case '!AddAbilities':
                AddAbilities(msg);
                break;
            case '!Activate':
                ActivateUnit(msg);
                break;
            case '!EndTurn':
                EndTurn();
                break;
            case '!RemoveLines':
                RemoveLines();
                break;
            case '!Attack':
                Attack(msg);
                break;
            case '!Specials':
                Specials(msg);
                break;
            case '!StartGame':
                StartGame();
                break;
            case '!Options':
                Options(msg);
                break;
            case '!ChangeOrder':
                ChangeOrder(msg);
                break;
            case '!Cast':
                Cast(msg);
                break;
            case '!DrawEbb':
                DrawEbb(msg);
                break;
            case '!Cast2':
                Cast2(msg);
                break;
            case '!UserImage':
                UserImage(msg);
                break;
    
        }
    };
    const registerEventHandlers = () => {
        on('chat:message', handleInput);
        on('change:graphic',changeGraphic);
        on('destroy:graphic',destroyGraphic);
    };
    on('ready', () => {
        log("===> Grimdark Future Rules: " + rules + " <===");
        log("===> Software Version: " + version + " <===");
        LoadPage();
        BuildMap();
        registerEventHandlers();
        sendChat("","API Ready, Map Loaded")
        log("On Ready Done")
    });
    return {
        // Public interface here
    };




})();