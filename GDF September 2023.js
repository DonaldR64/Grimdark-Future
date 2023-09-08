const GDF = (()=> {
    const version = '1.9.5';
    if (!state.GDF) {state.GDF = {}};
    const pageInfo = {name: "",page: "",gridType: "",scale: 0,width: 0,height: 0};
    const rowLabels = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","AA","BB","CC","DD","EE","FF","GG","HH","II","JJ","KK","LL","MM","NN","OO","PP","QQ","RR","SS","TT","UU","VV","WW","XX","YY","ZZ","AAA","BBB","CCC","DDD","EEE","FFF","GGG","HHH","III","JJJ","KKK","LLL","MMM","NNN","OOO","PPP","QQQ","RRR","SSS","TTT","UUU","VVV","WWW","XXX","YYY","ZZZ"];

    let TerrainArray = {};

    let ModelArray = {}; //Individual Models, Tanks etc
    let UnitArray = {}; //Units of Models
    let lastFaction = ""; //used in End Turn to decide who has next activation
    let currentUnitID = ""; //used in melee to track the unit that has Charge order;
    let currentActivation = ""; //used to track current activation eg. a charge - for morale and other purposes
    let nameArray = {};
    let firstActivation = false; //game has started = true


    let hexMap = {}; 
    let edgeArray = [];

    const colours = {
        red: "#ff0000",
        blue: "#00ffff",
        yellow: "#ffff00",
        green: "#00ff00",
        purple: "#800080",
        black: "#000000",
    }

    const sm = {
        moved: "status_Advantage-or-Up::2006462", //if unit moved
        focus: "status_Bullseye::2006535", //if has focus fire 
        fatigue: "status_sleepy",
        takeaim: "status_Target::2006531", //if has take aim
        fired: "status_Shell::5553215",
        bonusmorale: "status_green", //when has eg company standard or spell adding 1 to morale
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




        "Neutral": {
            "image": "",
            "side": "Neutral",
            "backgroundColour": "#FFFFFF",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#00FF00",
            "borderStyle": "5px ridge",
        },

    };

    let specialInfo = {
        "Accelerator Drone": 'This model and its unit get +6” range when firing their Pulse Carbines.',
        "Advanced Tactics": 'Once per activation, before attacking, pick one other friendly unit within 12” of this model, which may move by up to 6".',
        "Aircraft": 'Must be deployed before all other units. This model ignores all units and terrain when moving/stopping, cannot seize objectives, and cannot be moved in contact with. When activated, must always move straight by 30”-36” in its front facing. If it moves off-table, it ends its activation, and must be deployed on any table edge at the beginning of the next round. Units targeting this model get -12” range and -1 to hit rolls.',
        "Ambush": 'This model may be kept in reserve instead of deploying. At the start of any round after the first, you may place the model anywhere, over 9” away from enemy units. If both players have Ambush, roll-off to see who goes first, and alternate deploying units. Units that deploy like this on the last round cannot seize or contest objective markers.',
        "Battle Drills": 'When this model and its unit charge, unmodified rolls of 6 to hit are multiplied by 2.',
        "Beacon": 'Friendly units using Ambush may ignore distance restrictions from enemies if they are deployed within 6” of this model.',
        "Blast(X)": 'Each attack ignores cover and multiplies hits by X, but cannot deal more hits than models in the target unit.',
        "Caster(X)": 'Gets X spell tokens at the beginning of each round, but cannot hold more than 6 tokens at once. At any point before attacking, spend as many tokens as the spells value to try casting one or more different spells. Roll one die, on 4+ resolve the effect on a target in line of sight. This model and other casters within 18” in line of sight may spend any number of tokens at the same time to give the caster +1/-1 to the roll.',
        "Chosen Veteran": 'This model gets +1 to hit rolls in melee and shooting.',
        "Counter": 'Strikes first with this weapon when charged. Enemies charging units where all models have this rule only hit on 6 when rolling Impact attacks.',
        "Dark Tactics": 'Once per activation, before attacking, pick one other friendly unit within 12” of this model, which may move by up to 6".',
        "Deadly(X)": 'Assign each wound to one model, and multiply it by X. Hits from Deadly must be resolved first, and these wounds do not carry over to other models if the target is killed.',
        "Double Time": 'Once per activation, before attacking, pick one other friendly unit within 12”, which may move by up to 6".',
        "Elemental Power": 'Once per activation, before attacking, pick one other friendly unit within 12” of this model, which may move by up to 6".',
        "Entrenched": 'Enemies get -2 to hit when shooting at this model from over 12” away, as long as it hasn’t moved since the beginning of its last activation.',
        "Fast": 'Moves +2” when using Advance, and +4” when using Rush/Charge.',
        "Fear(X)": 'Counts as having dealt +X wounds when checking who won melee.',
        "Fearless": 'When failing a morale test, roll one die. On a 4+ its passed instead.',
        "Field Radio": "If this unit has a hero with the Double Time, Focus Fire or Take Aim rule, then it may use it on units that have a Field Radio up to 24” away.",
        "Flying": 'May go over obstacles and ignores terrain effects when moving.',
        "Furious": 'When charging, unmodified rolls of 6 to hit are multiplied by 2.',
        "Gift of Plague": 'The hero and its unit get +1 to Regeneration rolls.',
        "Good Shot": 'This model shoots at Quality 4+.',
        "Heavy Armour": '+1 added to Defense',
        "Hold the Line": 'Whenever this models unit fails a morale test, it takes one wound, and the morale test counts as passed instead.',
        "Holy Chalice": 'The hero and its unit get +1 to hit in melee and the Regeneration rule.',
        "Immobile": 'May only use Hold actions.',
        "Impact(X)": 'Gets X attacks that hit on 2+ when charging.',
        "Indirect": 'May target enemies that are not in line of sight, and ignores cover from sight obstructions, but gets -1 to hit rolls when shooting after moving.',
        "Inhibitor Drone": 'Enemies get -3” movement when trying to charge this model and its unit.',
        "Lance": 'Gets AP(+2) when charging.',
        "Lock-On": 'Ignores cover and all negative modifiers to hit rolls and range.',
        "Medical Training": 'This model and its unit get the Regeneration rule.',
        "Mutations": 'When in melee, roll one die and apply one bonus to models with this rule: * 1-3: Attacks get Rending * 4-6: Attacks get AP(+1)',
        "Poison": 'Targets must re-roll successful Defense rolls of 6 when blocking hits.',
        "Protected": 'Attacks targeting units where all models have this rule count as having AP(-1), to a min. of AP(0).',
        "Regeneration": 'When taking a wound, roll one die. On a 5+ it is ignored.',
        "Relentless": 'When using Hold actions and shooting, unmodified rolls of 6 to hit are multiplied by 2.',
        "Reliable": 'Attacks at Quality 2+.',
        "Rending": 'Targets get -1 to Regeneration rolls, and unmodified results of 6 to hit count as having AP(4).',
        "Repair": 'Once per activation, if within 2” of a unit with Tough, roll one die. On a 2+ you may repair D3 wounds from the target.',
        "Ring the Bell": 'The hero and its unit move +2” on Advance, and +4” on Rush/Charge actions.',
        "Scout": 'This model may be deployed after all other units, and may then move by up to 12”, ignoring terrain. If both players have Scout, roll-off to see who goes first, and alternate deploying units.',
        "Shield Drone": 'This model and its unit count as having the Stealth special rule.',
        "Shield Wall": 'This model gets +1 to defense rolls against non-spell attacks.',
        "Slow": 'Moves -2” when using Advance, and -4” when using Rush/Charge.',
        "Sniper": 'Shoots at Quality 2+, and may pick one model in a unit as its target, which is resolved as if its a unit of 1.',
        "Spotting Laser": 'Once per activation, before attacking, this model may pick one enemy unit within 30” in line of sight and roll one die, on a 4+ place a marker on it. Friendly units may remove markers from their target to get +X to hit rolls when shooting, where X is the number of removed markers.',
        "Stealth": 'Enemies get -1 to hit rolls when shooting at units where all models have this rule from over 12" away.',
        "Stealth Drone": 'Enemy units over 18” away get -1 to hit rolls when shooting per drone.',
        "Strider": 'May ignore the effects of difficult terrain when moving.',
        'Take Aim': 'Once per activation, before attacking, pick one friendly unit within 12” of this model, which gets +1 to hit next time it shoots.',
        "Transport(X)": 'May transport up to X models or Heroes with up to Tough(6), and non-Heroes with up to Tough(3) which occupy 3 spaces each. Units may deploy inside or embark by moving into contact, and may use any action to disembark, but may only move up to 6”. If a unit is inside a transport when it is destroyed, then it takes a dangerous terrain test, is immediately Shaken, and surviving models must be placed within 6” of the transport before it is removed.',
        "Undead": 'Whenever this unit takes a morale test, it is passed automatically. Then, roll as many dice as remaining models/tough in the unit, and for each result of 1-2 the unit takes one wound, which can not be regenerated.',
        "Very Fast": 'This model moves +4” when using Advance and +8” when using Rush/Charge.',
        "Veteran Infantry": 'This model gets +1 to hit rolls in melee and shooting.',
        "Veteran Walker": 'This model gets +1 to hit rolls in melee and shooting.',
        "Volley Fire": 'The hero and its unit count as having the Relentless special rule: When using Hold actions, for each unmodified result of 6 to hit, this model deals 1 extra hit.',
        "War Chant": 'When this model and its unit charge, unmodified rolls of 6 to hit are multiplied by 2.',
    }


    const TerrainInfo = {
        "#000000": {name: "Hill 1", height: 1,los: "Open",cover: false},
        "#434343": {name: "Hill 2", height: 2,los: "Open",cover: false},    
    };


    const MapTokenInfo = {
        "Woods": {name: "Woods",height: 1,los: "Partial",cover: true},
        "Hedge": {name: "Hedge",height: 0,los: "Open",cover: true},
        "Crops": {name: "Crops",height: 0,los: "Open",cover: true},
        "Ruins": {name: "Ruins",height: 1,los: "Partial",cover: true},
        "Imperial Building A": {name: "Building",height: 1,los: "Blocked",cover: true},
        "Wood Building A": {name: "Building",height: 1,los: "Blocked",cover: true},
        "Minefield": {name: "Minefield",height: 0,los: "Open",cover: false},
        "Razorwire": {name: "Razorwire",height: 0,los: "Open",cover: false},

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

    const SpaceMarineFactions = ["Blood Angels","Ultramarines"];
    const SpaceMarineNames = ["Felix","Valerius","Valentine","Lucius","Cassius","Magnus","Claudius","Adrian","August","Gaius","Agrippa","Marcellus","Silas","Atticus","Jude","Sebastian","Miles","Magnus","Aurelius","Leo"];
    const FactionNames = {
        Deathguard: ["Blight","Pustus","Bilegore","Cachexis","Clotticus","Colathrax","Corpulux","Poxmaw","Dragan","Festardius","Fethius","Fugaris","Gangrous","Rotheart","Glauw","Leprus","Kholerus","Malarrus","Necrosius","Phage"],
        "Imperial Guard": ["Anders","Bale","Bask","Black","Creed","Dekkler","Gruber","Hekler","Janssen","Karsk","Kell","Lenck","Lynch","Mira","Niels","Odon","Ovik","Pask","Quill","Rogg","Ryse","Stahl","Stein","Sturm","Trane","Volkok","Wulfe"],
    }

    const Naming = (name,rank,faction) => {
        name = name.replace(faction + " ","");
        name = name.split("w/")[0];
        name = name.trim();

        if (rank > 3) {
            if (SpaceMarineFactions.includes(faction)) {
                name += " " + SpaceMarineNames[randomInteger(SpaceMarineNames.length - 1)];
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
        xSpacing: 75.1985619844599,
        halfX: 75.1985619844599/2,
        ySpacing: 66.9658278242677,
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
            for (let i=1;i<6;i++) {
                let wname = attributeArray["weapon"+i+"name"];
                if (!wname || wname === "" || wname === undefined) {continue};
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
            let specName1, specName2;
            specials = specials.split(";");
            for (let i=0;i<specials.length;i++) {
                let special = specials[i].trim();
                let attName = "special" + i;
                AttributeSet(char.id,attName,special);
                infoArray.push(special);
            }
            let upgrades = attributeArray.upgrades;
            if (!upgrades || upgrades === "") {
                upgrades = " ";
            }
            upgrades = upgrades.split(";");
            for (let i=0;i<upgrades.length;i++) {
                let upgrade = upgrades[i];
                if (!upgrade || upgrade === "" || upgrade === " ") {continue};
                let attName = "upgrade" + i;
                AttributeSet(char.id,attName,upgrade);
                if (upgrade.includes("(")) {
                    upgrade = upgrade.match(/\((.*?)\)/g).map(b=>b.replace(/\(|(.*?)\)/g,"$1"));
                }
                upgrade = upgrade.toString();
                upgrade = upgrade.split(",");
                for (let j=0;j<upgrade.length;j++) {
                    let up = upgrade[j].trim();
                    infoArray.push(up);
                }
            }
            infoArray.sort(function (a,b) {
                let a1 = a.charAt(0).toLowerCase();
                let b1 = b.charAt(0).toLowerCase();
                if (a1<b1) {return -1};
                if (a1>b1) {return 1};
                return 0;
            });
            for (let i=0;i<infoArray.length;i++) {
                let specName = infoArray[i];
                let specInfo = specialInfo[specName];
                if (!specInfo) {
                    specInfo = "Not in Database Yet";
                }
                let atName = "spec" + (i+1) + "Name";
                let atText = "spec" + (i+1) + "Text";
                AttributeSet(char.id,atName,specName + ": ");
                AttributeSet(char.id,atText,specInfo);
            }

            let special = infoArray.toString();
            if (!special || special === "" || special === " ") {
                special = " ";
            }
            if (sniperFlag === true) {
                special += ",Sniper";
            }

            let rank = parseInt(attributeArray.rank);
            let name;
            if (existing === false) {
                name = Naming(char.get("name"),rank,faction);
            } else {
                name = token.get("name");
            }

            this.name = name;
            this.type = type;
            this.id = tokenID;
            this.unitID = unitID;
            this.player = player;
            this.faction = faction;
            this.location = location;
            this.hex = hex;
            this.hexLabel = hexLabel;
            this.special = special;
            this.quality = parseInt(attributeArray.quality);
            this.defense = parseInt(attributeArray.defense);
            this.toughness = parseInt(attributeArray.toughness);
            this.token = token;
            this.weaponArray = weaponArray;
            this.weapons = wnames;
            this.counter = counterFlag;

            this.token.set({
                show_tooltip: true,
                tooltip: wnames,
            });
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
            this.opponentHex = "";
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
                    let pos = -1;
                    for (let i=0;i<this.modelIDs.length;i++) {
                        let model2 = ModelArray[this.modelIDs[0]];
                        if (model2.rank < model.rank) {
                            pos = i;
                            break;
                        }   
                    }
                    if (pos > -1) {
                        this.modelIDs.splice(pos,0,model.id);
                    } else {
                        this.modelIDs.push(model.id);
                    }
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
                    let sm = model.token.get("statusmarkers");
                    ModelArray[this.modelIDs[0]].token.set({
                        aura1_color: ac,
                        statusmarkers: sm,
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
                model.kill();
            });
        }

        shaken() {
            let leader = ModelArray[this.modelIDs[0]];
            leader.token.set("aura1_color",colours.yellow);
        }

        shakenCheck() {
            let leader = ModelArray[this.modelIDs[0]];
            if (!leader) {return false};
            if (leader.token.get("aura1_color") ===colours.yellow) {
                return true;
            } else {
                return false;
            }
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

        for (let i=0;i<hexes1.length;i++) {
            let hex1 = hexes1[i];
            for (let j=0;j<hexes2.length;j++) {
                let hex2 = hexes2[j];
                let dist = hex1.distance(hex2);
                if (dist < closestDist) {
                    closestDist = dist;
                }
            }
        }
        closestDist -= 1; //as its distance between bases
        return closestDist;
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
        for (let i=0;i<edges.length;i++) {
            edgeArray.push(edges[i].get("left"));
        }
        if (edgeArray.length === 0) {
            sendChat("","Add Edge(s) to map and reload API");
            return;
        } else if (edgeArray.length === 1) {
            if (edgeArray[0] < c) {
                edgeArray.push(pageInfo.width)
            } else {
                edgeArray.unshift(0);
            }
        } else if (edgeArray.length === 2) {
            if (edgeArray[0] > c) {
                let temp = edgeArray[0];
                edgeArray[0] = edgeArray[1];
                edgeArray[1] = temp;
            } 
        } else if (edgeArray.length > 2) {
            sendChat("","Error with > 2 edges, Fix and Reload API");
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
        let xSpacing = 75.1985619844599;
        let ySpacing = 66.9658278242677;
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
                    terrainIDs: [], //used to see if tokens in same building or such
                    los: "Open",
                    cover: false,
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
            if (key){
                let c = hexMap[key].centre;
                if (c.x >= edgeArray[1] || c.x <= edgeArray[0]) {
                    //Offboard
                    hexMap[key].terrain = ["Offboard"];
                } else {
                    let elevation = hexMap[key].elevation;
                    let height = hexMap[key].height;
                    let los = hexMap[key].los;
                    let cover = hexMap[key].cover;
                    let taKeys = Object.keys(TerrainArray);
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
                            if (polygon.name.includes("Hill")) {
                                elevation = Math.max(elevation,polygon.height);
                            } else {
                                height = Math.max(height,polygon.height);
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
                }
                setTimeout(burndown,0);
            }
        }
        burndown();

        let elapsed = Date.now()-startTime;
        log("Hex Map Built in " + elapsed/1000 + " seconds");
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
            let player;
            if (!state.GDF.factions[0]) {
                state.GDF.factions[0] = faction;
                player = 0;
            } else if (state.GDF.factions[0] === faction) {
                player = 0;
            } else {
                state.GDF.factions[1] = faction;
                player = 1;
            }

            let unitInfo = token.get("gmnotes").toString();
            if (!unitInfo) {return};
            unitInfo = unitInfo.split(";")
            unitName = unitInfo[0];
            unitID = unitInfo[1];
            unit = UnitArray[unitID];
            if (!unit) {
                unit = new Unit(player,faction,unitID,unitName);
                let markers = token.get("statusmarkers");
                let unitMarker = UnitMarkers.filter(value => markers.includes(value));
                unit.symbol = unitMarker;
            }
            model = new Model(token.id,unitID,player,true);
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
            };
            TerrainArray[id] = info;
        });
        //add tokens on map eg woods, crops
        let mta = findObjs({_pageid: Campaign().get("playerpageid"),_type: "graphic",_subtype: "token",layer: "map",});
        mta.forEach((token) => {
log(token.get("name"))
            let truncName = token.get("name").replace(/[0-9]/g, '');
            truncName = truncName.trim();
log(truncName)
            let t = MapTokenInfo[truncName];
log(t)
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
            };
            TerrainArray[id] = info;
        });
    };

    const modelHeight = (model) => {
        let height = parseInt(hexMap[model.hexLabel].elevation);
        //adjust for infantry that are in buildings, using height - 1 as max
        //need to have thing in here for vehicles
        if (hexMap[model.hexLabel].terrain.includes("Building")) {
            height = Math.max(height,(hexMap[model.hexLabel].height - 1));
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
            sendChat("","One of 2 is not in Model Array");
            let result = {
                los: false,
                cover: false,
                losCover: false,
                distance: -1,
                phi: 0,
            }
            return result
        }

        let distanceT1T2 = ModelDistance(model1,model2);
        if (model2.type === "Aircraft") {
            let result = {
                los: true,
                cover: false,
                losCover: false,
                distance: distanceT1T2 + 12,
                phi: 0,
            }
            return result;
        }
        let los = true;

        let model1Height = modelHeight(model1);
        let model2Height = modelHeight(model2);
//log("Team1 H: " + model1Height)
//log("Team2 H: " + model2Height)

        let modelLevel = Math.min(model1Height,model2Height);
        model1Height -= modelLevel;
        model2Height -= modelLevel;

        let interHexes = model1.hex.linedraw(model2.hex); 
        //interHexes will be hexes between shooter and target, not including their hexes
        let model1Hex = hexMap[model1.hexLabel];
        let model2Hex = hexMap[model2.hexLabel];
        cover = model2Hex.cover;

        let theta = model1.hex.angle(model2.hex);
        let phi = Angle(theta - model1.token.get('rotation')); //angle from shooter to target taking into account shooters direction

//log("Model: " + modelLevel)
        let sameTerrain = findCommonElements(model1Hex.terrainIDs,model2Hex.terrainIDs);
        let lastElevation = model1Height;
        let partialHexes = 0;

        if (sameTerrain === true && (model1Hex.los === "Partial" || model1Hex.los === "Blocked")) {
//log("In Same Terrain but Distance > 4")
            if (distanceT1T2 > 4) {
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
//log(i + ": " + qrs.label())
//log(interHex.terrain)
//log("Cover: " + interHex.cover)
//log("Blocks LOS? " + interHex.los)
            let interHexElevation = parseInt(interHex.elevation) - modelLevel
            let interHexHeight = parseInt(interHex.height);
            let B = i * model2Height / distanceT1T2; //max height of intervening hex terrain to be seen over

//log("InterHex Height: " + interHexHeight)
//log("InterHex Elevation: " + interHexElevation)
//log("Last Elevation: " + lastElevation)
//log("B: " + B);

            if (interHexElevation < lastElevation && lastElevation > model1Height && lastElevation > model2Height) {
//log("Intervening Higher Terrain")
                los = false;
                break;
            }            
            lastElevation = interHexElevation;

            if (interHexHeight + interHexElevation >= B && i>1) {
                if (interHex.los === "Blocked" && sameTerrain === false) {
//log("Intervening LOS Blocking Terrain")
                    los = false;
                    break;
                } else if (interHex.los === "Partial"  && sameTerrain === false) {
                    partialHexes += 1;
//log("Partial: " + partialHexes)
                    if (partialHexes > 4) {
//log("Too Deep into Partial ")                       
                        los = false;
                        break;
                    }
                } else if (interHex.los === "Open" && partialHexes > 0) {
                    partialHexes += 1;
//log("Partial: " + partialHexes)
                    if (partialHexes > 4) {
//log("Other side of Partial LOS Blocking Terrain")
                        los = false;
                        break;
                    }
                } 
            }





            
        }
        if (model2Height < lastElevation && lastElevation > model1Height && lastElevation > model2Height) {
//log("Intervening Higher Terrain")
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

                let neededText = "Needing: "  + needed + "+";
                if (leader.token.get("aura1_color") === colours.yellow) {
                    //shaken, auto fail test
                    needed = 7;
                    neededText = "Auto Fail";
                }

                let moraleRoll = randomInteger(6);
                let fearlessRoll = 0;


                //auto but roll for each model
                let autoMorales = ["Undead"];
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
                            if (roll < 3) {wounds++};
                        }
                    }
                    rolls.sort();
                    rolls.reverse();
                    let line = '[🎲](#" class="showtip" title="' + rolls + ' vs 3+ )';
                    if (wounds > 0) {
                        line += " " + wounds + " Wounds Taken";
                    } else {
                        line += " No Wounds Taken";
                    }
                    outputCard.body.push(line);

                    let killed = [];

                    for (let i=unit.modelIDs.length;i>0;i--) {
                        let um = ModelArray[unit.modelIDs[i-1]];
                        let w = parseInt(um.token.get("bar1_value"));
                        if (wounds >= w) {
                            wounds -= w;
                            killed.push(um);
                        } else {
                            w -= wounds;
                            um.token.set("bar1_value",um);
                            break;
                        }                       
                    }
                    killed.forEach((model) => {
                        model.kill();
                    })
                } else {
                    SetupCard(unit.name,neededText,unit.faction);
                    outputCard.body.push("Morale Roll: " + DisplayDice(moraleRoll,unit.faction,24));
                    if (leader.special.includes("Fearless") && moraleRoll < needed) {
                        fearlessRoll = randomInteger(6);   
                        outputCard.body.push("Fearless Roll: " + DisplayDice(fearlessRoll,unit.faction,24));
                    }
    
                    if (moraleRoll >= needed || fearlessRoll >= 4) {
                        outputCard.body.push("Success!");
                    } else {
                        let heroMorale = ["Hold the Line"];
                        let flag = false;
                        for (let i=0;i<heroMorale.length;i++) {
                            if (leader.special.includes(heroMorale[i])) {
                                flag = true;
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
                                outputCard.body.push(um.name + noun + leader.name + " due to " + heroMorale[i]);
                                outputCard.body.push("Morale Test Passed");
                                break;
                            }
                        }

                        if (flag === false) {
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
        firstActivation = false;
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
            });                
        })

        RemoveDead("All");

        state.GDF = {
            factions: ["",""],
            players: {},
            playerInfo: [[],[]],
            markers: [[],[]],
            turn: 0,
            lineArray: [],
            modelCounts: {},
            objectives: [],
        }
        for (let i=0;i<UnitMarkers.length;i++) {
            state.GDF.markers[0].push(i);
            state.GDF.markers[1].push(i);
        }
        sendChat("","Cleared State/Arrays");
    }

    const UnitCreation = (msg) => {
        let Tag = msg.content.split(";");
        let unitName = Tag[1];
        let tokenIDs = [];
        for (let i=0;i<msg.selected.length;i++) {
            tokenIDs.push(msg.selected[i]._id);
        }
        if (tokenIDs.length === 0) {return};
        let refToken = findObjs({_type:"graphic", id: tokenIDs[0]})[0];
        let refChar = getObj("character", refToken.get("represents")); 
        let faction = Attribute(refChar,"faction");
        let player;
        if (!state.GDF.factions[0] || state.GDF.factions[0] === "") {
            state.GDF.factions[0] = faction;
            player = 0;
        } else if (state.GDF.factions[0] === faction) {
            player = 0;
        } else {
            state.GDF.factions[1] = faction;
            player = 1;
        }
 
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
        unitInfo = unitName + ";" + unitID; 
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
            model.token.set("statusmarkers","");
            model.token.set("status_"+unit.symbol,true);
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

        outputCard.body.push("Terrain: " + terrain);
        if (cover === true) {
            outputCard.body.push("In Cover");
        } else {
            outputCard.body.push("Not in Cover");
        } 
        outputCard.body.push("Elevation: " + elevation);
        
        PrintCard();
    }

    const DrawLine = (id1,id2,w,layer) => {
        let ColourCodes = ["#00ff00","#ffff00","#ff0000","#00ffff","#000000"];
        let colour = ColourCodes[w];
//offset based on w


        let x1 = hexMap[ModelArray[id1].hexLabel].centre.x;
        let x2 = hexMap[ModelArray[id2].hexLabel].centre.x;
        let y1 = hexMap[ModelArray[id1].hexLabel].centre.y;
        let y2 = hexMap[ModelArray[id2].hexLabel].centre.y;

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
        if (currentUnitID === attackingUnit.id && attackingUnit.order !== "Charge" && attackType === "Melee") {
            errorMsg = "Need to be given a Charge Order";
        }
        if ((attackingUnit.order !== "Advance" && attackingUnit.order !== "Hold") && attackType === "Ranged") {
            errorMsg = "Can only fire if given Advance or Hold Orders";
        }
        if (attackingUnit.targetIDs.length > 1 && attackingUnit.targetIDs.includes(defendingUnit.id) === false && attackType === "Ranged") {
            errorMsg = "Max. of 2 Target Units in 1 Round";
        }

        let distFlag = false;
        let numberCover = 0;
        let numberCoverTested = 0;
        let numberLOSCover = 0;
        let fired = 0;

        loop1:
        for (let i=0;i<attackingUnit.modelIDs.length;i++) {
            let am = ModelArray[attackingUnit.modelIDs[i]];
            if (!am) {continue};
            if (attackType === "Ranged" && am.token.get(sm.fired) === true) {
                fired++;
                continue;
            }

            let range = 0;
            let indirect = false;
            for (let w=0;w<am.weaponArray.length;w++) {
                let weapon = am.weaponArray[w];
                if (weapon.type === weaponType && weapon.range > range) {
                    range = weapon.range;
                    if (weapon.special.includes("Indirect")) {
                        indirect = true;
                    }
                }
            }
            if (range === 0) {continue}; //no weapons of that type
            let minDistance = Infinity;
            for (let j=0;j<defendingUnit.modelIDs.length;j++) {
                let dm = ModelArray[defendingUnit.modelIDs[j]];
                if (!dm) {continue};
                if (dm.token.get(sm.fired) === false && dm.counter === true && attackType === "Melee" && currentUnitID === attackingUnit.id) {
                    errorMsg = "Defender's have weapons with Counter and may strike first";
                    break loop1;
                }
                let losResult = LOS(am.id,dm.id);
                if (losResult.distance === 0) {distFlag = true}; //B2B contact
                if (losResult.los === false && indirect === false) {continue};
                if (losResult.distance > range) {continue};
                if (losResult.distance < minDistance) {
                    minDistance = losResult.distance;
                    am.opponentHex = dm.hex;
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

        if (validAttackerIDs.length === 0) {
            if (fired > 0) {
                errorMsg = "Attackers have all fired";
            } else {
                errorMsg = "No attackers are in range or LOS";
            }
        }

        if (errorMsg !== "") {
            outputCard.body.push(errorMsg);
            PrintCard();
            return;
        }
    
        //check for Stealth 
        let stealth = false;
        if (attackType === "Ranged") {
            stealth = true;
            for (let i=0;i<defendingUnit.modelIDs.length;i++) {
                let m1 = ModelArray[defendingUnit.modelIDs[i]];
                if (m1.special.includes("Stealth") === false) {
                    stealth = false;
                    break;
                }
                for (let j=0;j<attackingUnit.modelIDs.length;j++) {
                    let m2 =  ModelArray[attackingUnit.modelIDs[i]];
                    let dist = ModelDistance(m1,m2);
                    if (dist <= 12) {
                        stealth = false;
                        break;
                    }
                }
            }
        }




        //for each attacker in range, run through its weapons, roll to hit etc and save hits in defender unit.hitArray
        let unitHits = 0;
    
        outputCard.body.push("[U][B]Hits[/b][/u]");
        for (let i=0;i<validAttackerIDs.length;i++) {
            let attacker = ModelArray[validAttackerIDs[i]];
            
            let weaponArray = attacker.weaponArray;
            let neededToHit = attacker.quality;
            let toHitTips = "<br>Base: " + neededToHit;

            let bonusToHit = 0;
            let minusToHit = 0;
            let minusTips = "";
            let bonusTips = "";

            let fatigue = false;
            if ((attacker.token.get(sm.fatigue) === true || attackingUnit.shakenCheck === true) && attackType === "Melee") {
                fatigue = true;
            }

            if (attacker.special.includes("Sniper") && attackType === "Ranged") {
                sniperTargetID = defenderID;
                neededToHit = 2;
                toHitTips = "<br>Sniper 2+";
            }
            if (attacker.special.includes("Good Shot") && attackType === "Ranged") {
                neededToHit = 4;
                toHitTips = "<br>Good Shot 4+";
            }

            if (defender.type === "Aircraft") {
                minusToHit -= 1;
                minusTips += "<br>Aircraft -1";
            }
    
            if (stealth === true) {
                minusToHit -= 1;
                minusTips += "<br>Stealth -1";
            }

            //attacker specials in format [name,attackType,bonus]
            if (attacker.special.includes("Veteran")) {
                bonusTips += "<br>Veteran +1";
                bonusToHit += 1;
            }

            //Leader specials




            //defender specials
            if (defendLeader.special.includes("Entrenched") && defendingUnit.order === "Hold") {
                minusToHit -= 2;
                bonusTips += "<br>Dug In -2"; 
            }

            //attacker conditions on leaders token in format [condition,attacktype,name,bonus or minus], to be removed
            let ac = [["takeaim","Ranged","Take Aim",1]];
            for (let a=0;a<ac.length;a++) {
                if (attackLeader.token.get(sm[ac[a][0]]) === true && attackType === ac[a][1]) {
                    mark = " ";
                    if (ac[a][3] > 0) {
                        mark = " +"
                        bonusToHit += ac[a][3];
                    } else {
                        minusToHit += ac[a][3];
                    }  
                    bonusTips += "<br>" + ac[a][2] + mark + ac[a][3];
                }
            }




            
            //Impact Hits inserted into weapon array
            if (attacker.special.includes("Impact") && currentUnitID === attackingUnit.id && attackType === "Melee") {
                let index = attacker.special.indexOf("Impact(") + 7;
                let att = parseInt(attacker.special.charAt(index));
                weaponArray.unshift({
                    name: "Impact",
                    type: "CCW",
                    range: 3,
                    attack: att,
                    ap: 0,
                    special: " ",
                    sound: "", 
                    fx: "",//add crunchy sound here
                })
            }    
    
            for (let w=0;w<weaponArray.length;w++) {
                let weapon = weaponArray[w];
                let rollTips = ""; //used for weapon specials
                let addon = "";
                if (weapon.type !== weaponType) {continue};
                if (attacker.minDistance > weapon.range) {continue};
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

                //weapon modifiers
                if (weapon.special.includes("Reliable")) {
                    bonusToHit = (neededToHit - 2); //drop needed to 2, without affecting it for other weapons
                    bonusTips += "<br>Reliable - Base changed to 2+";
                }
                if (weapon.special.includes("Indirect")) {
                    losCover = false;
                    if (attackingUnit.order === "Advance") {
                        minusToHit += 1;
                        minusTips += "<br>Indirect -1";
                    }
                }

                //Lock On should be last as negates all negative modifiers
                if (weapon.special.includes("Lock-On")) {
                    cover = false;
                    losCover = false;
                    minusToHit = 0; 
                    minusTips = "<br>Lock-On";
                }

                let toHit = neededToHit - bonusToHit + minusToHit;
                toHitTips += bonusTips + minusTips;

                if (fatigue === true) {
                    toHit = 6;
                    toHitTips = "<br>Fatigue: unmodified 6"
                }

                let hits = [];
                let rolls = [];

                for (let a=0;a<weapon.attack;a++) {
                    PlaySound(weapon.sound);
                    let roll = randomInteger(6);
                    rolls.push(roll);

                    if (roll === 1) {
                        continue;
                    } else if (roll === 6) {
                        hits.push(roll);
                        //weapons/abilities that do something on a 6
                        if (attacker.special.includes("Furious") && currentUnitID === attackingUnit.id) {
                            hits.push(6);
                            rollTips += "<br>Extra Hit from " + extraHitsList[a];
                        }
                        let leaderSpecials = ["War Chant","Battle Drills"];
                        for (let q=0;q<leaderSpecials.length;q++) {
                            if (attackLeader.special.includes(leaderSpecials[q])) {
                                hits.push(6);
                                rollTips += "<br>Extra Hit from " + leaderSpecials[q];
                            }
                        }
                        if (attackingUnit.order === "Hold" && ( attacker.special.includes("Relentless") ||  ModelArray[attackingUnit.modelIDs[0]].special.includes("Volley Fire"))) {
                            hits.push(6);
                            if (rollTips.includes("Relentless") === false) {
                                rollTips += "<br>Relentless";
                            }
                        }

                    } else if (roll !== 1 && roll !== 6 && roll >= toHit) {
                        hits.push(roll);
                    }

                    //Blast Weapons
                    if (weapon.special.includes("Blast") && roll >= neededToHit) {
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




            }
        }

        //rotate models that attacked, place fire or fatigue
        for (let i=0;i<validAttackerIDs.length;i++) {
            let am = ModelArray[validAttackerIDs[i]];
            let theta = am.hex.angle(am.opponentHex);
            am.token.set("rotation",theta);
            if (attackType === "Ranged") {
                am.token.set(sm.fired,true);
            } else {
                am.token.set(sm.fatigue,true);
            }
        }
        
        attackingUnit.targetIDs.push(defendingUnit.id);
        if (unitHits === 0) {
            outputCard.body.push("No Hits Scored");
            totalWounds = 0;
        } else {
            outputCard.body.push("[hr]");
            totalWounds = Saves(attackType,defendingUnit.id,sniperTargetID);
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
                if (defendingUnit.halfStrength() === true && defendingUnit.shakenCheck() === false && unitHits > 0) {
                    outputCard.body.push("[hr]");
                    outputCard.body.push(defendingUnit.name + " must take a Morale Check");
                    ButtonInfo("Morale Check","!Roll;Morale;" + defendingUnit.modelIDs[0]);
                }
            } else if (attackType === "Melee") {
                let noun = (totalWounds === 1) ? " Wound":" Wounds";
                let fear = 0;
                if (attackLeader.special.includes("Fear")) {
                    let index = attackLeader.special.indexOf("Fear");
                    fear = parseInt(attackLeader.special.charAt(index+5));
                }
                let line = "[hr]When deciding the winner of the Melee this unit caused [#ff0000]" + totalWounds + noun;
                if (fear > 0) {
                    line += " Plus " + fear + " from Fear for a Total of " + (totalWounds + fear);
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

        if (sniperTargetID) {
            modelIDs = [sniperTargetID];
        }
        let number = unit.modelIDs.length - 1;
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

                    out += currentModel.name + ": "
                    let save = currentModel.defense;
                    let saveTips = "<br>Defense: " + save;

                    let hp = parseInt(currentModel.token.get("bar1_value"));
                    if (isNaN(hp)) {hp = 1};

                    if (cover === true) {
                        save -= 1;
                        saveTips += "<br>Cover +1";
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
                    if (saveRoll === 6 && weapon.special.includes("Poison")) {
                        saveRoll = randomInteger(6);
                        saveRollTip = saveRoll + " rerolled";
                        saveTips += "<br>Poison";
                        addon += "Poisoned "
                    }

                    save = Math.max(2,save);

                    if (saveRoll >= save || saveRoll === 6) {
                        out += " saves vs. " + addon + weapon.name;
                    } else {
                        let wounds = 1;
                        if (weapon.special.includes("Deadly")) {
                            let index = weapon.special.indexOf("Deadly");
                            let X = parseInt(weapon.special.charAt(index+7));
                            wounds = X-1;
                            out += "(Deadly(" + X + ")";
                        } 

                        //Regen/Medic
                        let medic = false;
                        let regen = 0;
                        for (let w=0;w<number;w++) {
                            let model2 = ModelArray[modelIDs[w]];
                            if (model2.special.includes("Medical Training")) {
                                medic = true;
                            }
                        }
                        if (medic === true || currentModel.special.includes("Regeneration")) {
                            for (let w=0;w<wounds;w++) {
                                let regenRoll  = randomInteger(6);
                                let regenTarget = 5;
                                saveTips += "<br>Regen: " + regenRoll;
                                if (weapon.special.includes("Rending")) {
                                    regenTarget += 1;
                                }
                                if (ModelArray[modelIDs[0]].special.includes("Gift of Plague") || ModelArray[modelIDs[0]].special.includes("Holy Chalice")) {
                                    regenTarget -= 1;
                                }
                                saveTips += " vs. " + regenTarget + "+";
                                if (regenRoll >= regenTarget) {
                                    regen++;
                                }
                            }
                        }

                        hp -= wounds;
                        hp += regen;
                        let regenText = regen + " wound";
                        if (regen === wounds) {
                            regenText = "all";
                        }
                        totalWounds += (wounds - regen);
                        noun = "Wounds";
                        if (wounds = 1) {noun = "Wound"};

                        currentModel.token.set("bar1_value",hp);

                        if (hp <= 0) {
                            //dead, next model 
                            number--;
                            killed.push(currentModel);
                            out += "[#ff0000]killed by " + addon + " " + weapon.name + "[/#]";
                        } else if (hp > 0) {
                            if ((wounds - regen) > 0) {
                                out += "[#ff0000]";
                            }
                            out += "takes " + wounds + " " + noun + " from " + addon + " " + weapon.name;
                            if (regen > 0) {
                                out += ", and heals " + regenText; 
                            }
                            if ((wounds - regen) > 0) {
                                out += "[/#]";
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
        let abilityName,action;
        let abilArray = findObjs({  _type: "ability", _characterid: char.id});
        //clear old abilities
        for(let a=0;a<abilArray.length;a++) {
            abilArray[a].remove();
        } 

        abilityName = "Activate";
        action = "!Activate;@{selected|token_id};?{Order|Hold|Advance|Rush|Charge}";
        AddAbility(abilityName,action,char.id);

        abilityName = "Info";
        action = "!TokenInfo";
        AddAbility(abilityName,action,char.id);

        let model = ModelArray[id];
        if (!model) {return};
        let types = {
            "Rifle": [],
            "Pistol": [],
            "Heavy": [],
            "Mod": [],
            "CCW": [],
        }
        for (let i=0;i<model.weaponArray.length;i++) {
            let weapon = model.weaponArray[i];
            types[weapon.type].push(weapon.name);
        }
        
        let keys = Object.keys(types);
        let weaponNum = 1;
        for (let i=0;i<keys.length;i++) {
            let names = types[keys[i]];
            if (names.length === 0) {continue};
            names = names.toString();
            names = names.replace(",","+");
            abilityName = weaponNum + ": " + names;
            weaponNum += 1;
            let typ = "Ranged;";
            if (keys[i] === "CCW") {
                typ = "Melee;";
            } 
            action = "!Attack;@{selected|token_id};@{target|token_id};" + typ + keys[i];
            AddAbility(abilityName,action,char.id);
        }

        let macros = [["Repair",1],["Double Time",1],["Company Standard",2],["Focus Fire",1],["Take Aim",1],["Dark Tactics",1]]

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






    }

    const ActivateUnit = (msg) => {
        let Tag = msg.content.split(";")
        let id = Tag[1];
        let order = Tag[2];
        let model = ModelArray[id];
        if (!model) {return};
        let unit = UnitArray[model.unitID];
        let unitLeader = ModelArray[unit.modelIDs[0]];

        if (firstActivation === false) {
            FirstActivation();
            firstActivation = true;
        }

        RemoveDead();

        SetupCard("Activate Unit","",unitLeader.faction);
        if (lastFaction === unitLeader.faction) {
            let otherFaction = (state.GDF.factions[0] === lastFaction) ? state.GDF.factions[1]:state.GDF.factions[0];
            let flag = false;
            let keys = Object.keys(UnitArray);
            for (let i=0;i<keys.length;i++) {
                let u = UnitArray[keys[i]];
                if (u.order === "" && u.faction !== unitLeader.faction) {
                    flag = true;
                    break;
                }
            }
            if (flag === true) {
                outputCard.body.push(otherFaction + " has the next Activation");
                PrintCard();
                return;
            }
        }

        //clear last activated unit of markers
        let prevUnit = UnitArray[currentUnitID];
        if (prevUnit) {
            ClearMarkers(prevUnit,"Mid");
        }
  
        lastFaction = unitLeader.faction;
        currentUnitID = unit.id

        let specialOut = "";

        if (unit.order !== "") {
            outputCard.body.push("Unit has already been activated");
            PrintCard();
            return;
        }
        if (unit.shakenCheck() === true) {
            order = "Unpin";
        }
        if (unitLeader.special.includes("Immobile")) {
            order = "Hold";
            specialOut += "Unit may only take the Hold Order";
        }
        unit.order = order;
        outputCard.subtitle = order;
        unitLeader.token.set("aura1_color",colours.black);
        let move = 6;
        if (unitLeader.special.includes("Fast") || unitLeader.special.includes("Ring the Bell")) {
            move += 2;
        } else if (unitLeader.special.includes("Very Fast")) {
            move += 4;
        } else if (unitLeader.special.includes("Slow")) {
            move -= 2;
        }
        if (unitLeader.special.includes("Flying")) {
            specialOut += "Models may move through all obstacles,and may ignore terrain effects.";
        }
        if (unitLeader.special.includes("Strider")) {
            specialOut += "Models may ignore the effects of difficult terrain.";
        }

        currentActivation = order;

        switch(order) {
            case 'Unpin':
                outputCard.body.push("Unit unpins and may do nothing else");
                break;
            case 'Hold':
                outputCard.body.push("Unit stays in place and may fire");
                outputCard.body.push(specialOut);
                break;
            case 'Advance':
                outputCard.body.push("Unit may move " + move + " hexes and then Fire");
                outputCard.body.push(specialOut);
                break;
            case 'Rush':
                outputCard.body.push("Unit may move " + (move*2) + " hexes");
                outputCard.body.push("It may not fire");
                outputCard.body.push(specialOut);
                break;
            case 'Charge':
                outputCard.body.push("Unit may move " + (move*2) + " hexes");
                outputCard.body.push("It may not fire but must charge at least one model into contact with the enemy");
                outputCard.body.push(specialOut);
                break;
        };
        PrintCard();
    }

    const ClearMarkers = (unit,type) => {
        if (!type) {type = "Mid"};
        //clear things like Take Aim from prev unit
        let unitLeader = ModelArray[unit.modelIDs[0]];
        if (unitLeader.token.get(sm.fired) === true) {
            unitLeader.token.set(sm.takeaim,false);
            unitLeader.token.set(sm.focus,false);
        }
        if (type === "New") {
            unitLeader.token.set(sm.moved,false);
            unitLeader.token.set(sm.fatigue,false);
            unitLeader.token.set(sm.fired,false);
        }



    }




    const EndTurn = () => {
        //check if any units didnt activate
        let keys = Object.keys(UnitArray);
        for (let i=0;i<keys.length;i++) {
            let unit = UnitArray[keys[i]];
            let unitLeader = ModelArray[unit.modelIDs[0]];
            if (unitLeader.token.get("aura1_color") !== colours.black) {
                let pos = ModelArray[unit.modelIDs[0]].location;
                sendPing(pos.x,pos.y, Campaign().get('playerpageid'), null, true); 
                SetupCard(unit.faction,"",unit.faction);
                outputCard.body.push("Unit has not been activated");
                PrintCard();
                return;
            }
        }
        state.GDF.turn += 1;
        if (state.GDF.turn < 5) {
            SetupCard("Turn: " + state.GDF.turn,"","Neutral");
            //same faction takes first go this turn
            //clear auras that arent yellow, set unit.orders to be ""
            outputCard.body.push(lastFaction + " gets the first Activation");
            lastFaction = "";
            let keys = Object.keys(UnitArray);
            for (let i=0;i<keys.length;i++) {
                let unit = UnitArray[keys[i]];
                for (let j=0;j<unit.modelIDs.length;j++) {
                    let model = ModelArray[unit.modelIDs[j]];
                    if (!model) {continue};
                    if (j===0 && model.token.get("aura1_color") !== colours.yellow) {
                        model.token.set("aura1_color",colours.green);
                    }
                    model.specialsUsed = [];
                }
                ClearMarkers(unit,"New");
                //clear order and targets
                unit.order = "";
                unit.targetIDs = [];
            }
            Objectives();
        } else {
            let count = Objectives();
            let winner,line;
            if (count[0] > count[1]) {
                winner = state.GDF.factions[0];
                line = winner + ' has won with ' + count[0] + " Objectives to " + count[1];
            } else if (count[0] < count[1]) {
                winner = state.GDF.factions[1];
                line = winner + ' has won with ' + count[1] + " Objectives to " + count[0];
            } else if (count[0] === count[1]) {
                winner = "Neutral";
                line = "The game ends in a tie";
            }
            SetupCard("Game Over","",winner);
            outputCard.body.push(line);
            PrintCard();
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
                if (model.special.includes("Ambush") && unit.deployed !== state.GDF.turn) {
                    continue;
                }
                let distance = ModelDistance(model,objective);
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

    const FirstActivation = () => {
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
                    let faction = state.GDF.factions[i];
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
        SetupCard("Game Started","","Neutral");
        outputCard.body.push("[B]Turn 1[/b]");
        PrintCard();
    }

    const Specials = (msg) => {
        let Tag = msg.content.split(";")
        let specialName = Tag[1];
        let selectedID = Tag[2];
        let selectedModel = ModelArray[selectedID];
        let selectedUnit = UnitArray[selectedModel.unitID];
        let errorMsg = "";
        let outLines = [];
        SetupCard(specialName,selectedModel.name,selectedModel.faction);
        if (selectedModel.specialsUsed.includes(specialName)) {
            errorMsg = "Ability already used this turn";
        }
        let targetID = Tag[3];
        let targetModel = ModelArray[targetID];
        let targetUnit = UnitArray[targetModel.unitID];
        let targetUnitLeader = ModelArray[targetUnit.modelIDs[0]];

        //distance to targetModel
        let distance = selectedModel.hex.distance(targetModel.hex);

        //check for field radios
        let radio = false;
        radioLoop:
        for (let i=0;i<selectedUnit.modelIDs.length;i++) {
            let sm = ModelArray[selectedUnit.modelIDs[i]];
            if (sm.special.includes("Field Radio")) {
                for (let j=0;j<targetUnit.modelIDs.length;j++) {
                    let tm = ModelArray[targetUnit.modelIDs[j]];
                    if (tm.special.includes("Field Radio")) {
                        radio = true;
                        break radioLoop;
                    }
                }
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
        
        let bonusMovements = ["Double Time","Dark Tactics"];
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

        if (specialName === "Company Standard") {
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



        if (errorMsg !== "") {
            outputCard.body.push(errorMsg);
        } else {
            for (let i=0;i<outLines.length;i++) {
                outputCard.body.push(outLines[i]);
            }
            selectedModel.specialsUsed.push(specialName);
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
            if (token.get("name").includes("Objective") && info === "All") {
                token.remove();
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

        for (let i=0;i<shooterUnit.modelIDs.length;i++) {
            let sm = ModelArray[shooterUnit.modelIDs[i]];
log(sm.name)
            for (let w=0;w<sm.weaponArray.length;w++) {
                let weapon = sm.weaponArray[w];
log(weapon.name)
                if (weapon.type === "CCW") {continue};
                if (weaponList.includes(weapon.name)) {
                    index = weaponList.indexOf(weapon.name);
                } else {
                    weaponList.push(weapon.name);
                    index = weaponList.length - 1;
                }
log(index)

                for (let j=0;j<targetUnit.modelIDs.length;j++) {
                    let tm = ModelArray[targetUnit.modelIDs[j]];
                    let losResult = LOS(sm.id,tm.id);
log(losResult)
                    if (losResult.los === false && weapon.special.includes("Indirect") === false) {continue};
                    if (losResult.distance > weapon.range) {continue};
                    let lineID = DrawLine(sm.id,tm.id,index,"objects");
                    state.GDF.lineArray.push(lineID);
                    break;
                }
            }
        }
        log(weaponList)
        if (weaponList.length === 0) {
            outputCard.body.push("No LOS or Range to Target Unit");
        } else {
            for (let i=0;i<weaponList.length;i++) {
                outputCard.body.push("[" + ColourCodes[i] + "]" + "█[/#] - " + weaponList[i]);
            }
            ButtonInfo("Remove Lines","!RemoveLines");
        }
        PrintCard();
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
            case '!Ranged':
                Ranged(msg);
                break;
            case '!Attack':
                Attack(msg);
                break;
            case '!Specials':
                Specials(msg);
                break;

        }
    };
    const registerEventHandlers = () => {
        on('chat:message', handleInput);
        on('change:graphic',changeGraphic);
        on('destroy:graphic',destroyGraphic);
    };
    on('ready', () => {
        log("===> Grimdark Future Version: " + version + " <===");
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
