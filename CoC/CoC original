const CoC = (() => { 
    const version = '1.7.29';
    if (!state.CoC) {state.CoC = {}};

    const rowLabels = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","AA","BB","CC","DD","EE","FF","GG","HH","II","JJ","KK","LL","MM","NN","OO","PP","QQ","RR","SS","TT","UU","VV","WW","XX","YY","ZZ","AAA","BBB","CCC","DDD","EEE","FFF","GGG","HHH","III","JJJ","KKK","LLL","MMM","NNN","OOO","PPP","QQQ","RRR","SSS","TTT","UUU","VVV","WWW","XXX","YYY","ZZZ"];
    const pageInfo = {name: "",page: "",gridType: "",scale: 0,width: 0,height: 0};
    let TerrainArray = [];
    let BaseArray = {}; //used for tokens on board, with their info
    let TeamArray = {}; //Teams of tokens, or could be individual
    let UnitArray = {}; //Unit info for teams/tokens

    let hexMap = {}; 
    let edgeArray = [];
    let InfoPoints = [[],[]];
    let cDiceArray = [];

    let PatrolArray = {};
    let JumpOffArray = {};
    
    let currentBase;

    const colours = {
        red: "#ff0000",
        blue: "#00ffff",
        yellow: "#ffff00",
        green: "#00ff00",
        purple: "#800080",
        black: "#000000",
    }

    const sm = {
        overwatch: "status_sentry-gun",
        tactical: "status_Prone::2006547",
        order: "status_green",
        floor1: "",
        floor2: "",
        floor3: "",
        fired: "status_Shell::5553215",
        wounded: "status_dead",  //temp
        lightWound: "status_dead",
    }

    let outputCard = {title: "",subtitle: "",nation: "",body: [],buttons: [],};
    const CharacterCountries = ["Soviet ","US ", "German ","UK "];

    const Axis = ["Germany","Italy","Japan"];
    const Allies = ["Soviet","USA","British","Canada"];

    const Nations = {
        "Soviet": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/304547168/fMk9mH9WMsr8VSQFg6AZew/thumb.png?1663171370",
            "dice": "Soviet",
            "backgroundColour": "#FFFF00",
            "titlefont": "Anton",
            "fontColour": "#000000",
            "borderColour": "#FF0000",
            "borderStyle": "5px ridge",
            "overwatch": "-N_aLWelhXtAj2-HmbhX",
            "covering": "-N_aLMELJpCFCSdc38-r",
            "platoonmarkers": ["","letters_and_numbers0099::4815235","letters_and_numbers0100::4815236","letters_and_numbers0101::4815237","letters_and_numbers0102::4815238","letters_and_numbers0103::4815239","letters_and_numbers0104::4815240","letters_and_numbers0105::4815241","letters_and_numbers0106::4815242","letters_and_numbers0107::4815243","letters_and_numbers0108::4815244","letters_and_numbers0109::4815245","letters_and_numbers0110::4815246","letters_and_numbers0111::4815247","letters_and_numbers0112::4815248","letters_and_numbers0113::4815249","letters_and_numbers0114::4815250","letters_and_numbers0115::4815251","letters_and_numbers0116::4815252","letters_and_numbers0117::4815253","letters_and_numbers0118::4815254","letters_and_numbers0119::4815255","letters_and_numbers0120::4815256","letters_and_numbers0121::4815257","letters_and_numbers0122::4815258","letters_and_numbers0123::4815259","letters_and_numbers0124::4815260"],       
        },
        "Germany": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/329415788/ypEgv2eFi-BKX3YK6q_uOQ/thumb.png?1677173028",
            "dice": "Germany",
            "backgroundColour": "#000000",
            "titlefont": "Bokor",
            "fontColour": "#FFFFFF",
            "borderColour": "#000000",
            "borderStyle": "5px double",
            "overwatch": "-N_aLRXvf68lFjYj5V3V",
            "covering": "-N_aLD7-Jrij3WlVHaUl",
            "platoonmarkers": ["","letters_and_numbers0197::4815333","letters_and_numbers0198::4815334","letters_and_numbers0199::4815335","letters_and_numbers0200::4815336","letters_and_numbers0201::4815337","letters_and_numbers0202::4815338","letters_and_numbers0203::4815339","letters_and_numbers0204::4815340","letters_and_numbers0205::4815341","letters_and_numbers0206::4815342","letters_and_numbers0207::4815343","letters_and_numbers0208::4815344","letters_and_numbers0209::4815345","letters_and_numbers0210::4815346","letters_and_numbers0211::4815347","letters_and_numbers0212::4815348","letters_and_numbers0213::4815349","letters_and_numbers0214::4815350","letters_and_numbers0215::4815351","letters_and_numbers0216::4815352","letters_and_numbers0217::4815353","letters_and_numbers0218::4815354","letters_and_numbers0219::4815355","letters_and_numbers0220::4815356","letters_and_numbers0221::4815357","letters_and_numbers0222::4815358"],   
        },
        "Neutral": {
            "image": "",
            "backgroundColour": "#FFFFFF",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#00FF00",
            "borderStyle": "5px ridge",
            "dice": "UK",
        },

    }

    //cover: 0 = none, 1 = soft, 2 = hard, 3 = bunker
    //los: 0 = open, 1 = obscures 6", 2 = obscures 4", 3 = obscures 1", 4 = 0"
    const TerrainInfo = {
        "#00ff00": {name: "Woods", height: 3, cover: 1, los: 2},
        "#20124d": {name: "Ruins", height: 1, cover: 2, los: 2},
        "#000000": {name: "Hill 1", height: 1, cover: 0, los: 0},
        "#434343": {name: "Hill 2", height: 2, cover: 0, los: 0},
        "#980000": {name: "Stone Building 1", height: 1, cover: 2, los: 4},
        "#": {name: "Wood Building 1", height: 1, cover: 1, los: 4},
        "#ffffff": {name: "Ridgeline", height: 0, cover: 2, los: 3},

    }

    const LinearTerrain = ["Ridgeline"];

    const simpleObj = (o) => {
        p = JSON.parse(JSON.stringify(o));
        return p;
    }

    const getCleanImgSrc = (imgsrc) => {
        let parts = imgsrc.match(/(.*\/images\/.*)(thumb|med|original|max)([^?]*)(\?[^?]+)?$/);
        if(parts) {
            return parts[1]+'thumb'+parts[3]+(parts[4]?parts[4]:`?${Math.round(Math.random()*9999999)}`);
        }
        return;
    }

    const tokenImage = (img) => {
        //modifies imgsrc to fit api's requirement for token
        img = getCleanImgSrc(img);
        img = img.replace("%3A", ":");
        img = img.replace("%3F", "?");
        img = img.replace("med", "thumb");
        return img;
    }

    const stringGen = () => {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 6; i++) {
            text += possible.charAt(Math.floor(randomInteger(possible.length)));
        }
        return text;
    }

    const findCommonElements = (arr1,arr2) => {
        //iterates through array 1 and sees if array 2 has any of its elements
        //returns true if the arrays share an element
        return arr1.some(item => arr2.includes(item));
    }

    const DeepCopy = (variable) => {
        variable = JSON.parse(JSON.stringify(variable))
        return variable;
    }

    const PlaySound = (name) => {
        let sound = findObjs({type: "jukeboxtrack", title: name})[0];
        if (sound) {
            sound.set({playing: true,softstop:false});
        }
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
    }

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
    }

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
    }


    const ButtonInfo = (phrase,action) => {
        let info = {
            phrase: phrase,
            action: action,
        }
        outputCard.buttons.push(info);
    }

    const SetupCard = (title,subtitle,nation) => {
        outputCard.title = title;
        outputCard.subtitle = subtitle;
        outputCard.nation = nation;
        outputCard.body = [];
        outputCard.buttons = [];
        outputCard.inline = [];
    }

    const DisplayDice = (roll,nation,size) => {
        roll = roll.toString();
        let tablename = Nations[nation].dice;
        let table = findObjs({type:'rollabletable', name: tablename})[0];
        let obj = findObjs({type:'tableitem', _rollabletableid: table.id, name: roll })[0];
        let avatar = obj.get('avatar');
        let out = "<img width = "+ size + " height = " + size + " src=" + avatar + "></img>";
        return out;
    }


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
    }

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
    }

    class Base {
        constructor(t,character) {
            let attributeArray = AttributeArray(character.id);
            let nation = attributeArray.nation;
            let player = (Allies.includes(nation)) ? 0:1;
            if (nation === "Neutral") {player = 2};
            let gmnotes = decodeURIComponent(t.get("gmnotes"));
            gmnotes = gmnotes.toString().split(";");
            log("New Token")
            log(t.get("name"))
            log(gmnotes)
            let location = new Point(t.get("left"),t.get("top"));
            let hex = pointToHex(location);
            let label = hex.label();
            let type = attributeArray.type;
            let unitID,teamID,vertices;
            if (gmnotes) {
                teamID = gmnotes[1];
                unitID = gmnotes[3];
            }
            if (type === "Vehicle" || type === "Gun" || type === "System Unit") {
                vertices = TokenVertices(t); //larger tokens
            }

            this.id  = t.id;
            this.token = t;
            this.name = t.get("name");
            this.player = player;
            this.nation = nation;
            this.unitID = unitID;
            this.teamID = teamID;
            this.charName = character.get("name");
            this.characterID = character.id;
            this.type = type;
            this.hex = hex;
            this.hexLabel = label;
            this.startHex = hex;
            this.rank = parseInt(attributeArray.rank);
            this.quality = attributeArray.quality;
            let special = attributeArray.special;
            if (special === "" || !special) {special = " "};
            this.special = special;
            this.initiative = 0; //tracked for leaders also used for wounds
            this.leaderTeamIDs = []; // ID of teams a leader is attached to
            this.soloNCO = false; //true if is an NCO that loses all its team(s)
            if (this.rank === 1 || this.rank === 2) {
                this.initiative = 2;
            } else if (this.rank > 2) {
                this.initiative = this.rank;
            }
            if (hexMap[label].tokenIDs.includes(t.id) === false) {
                hexMap[label].tokenIDs.push(t.id);
            } 
            if (this.name.includes("Patrol")) {
                this.locked = false;
                PatrolArray[this.id] = this;
                return;
            }
            if (this.name.includes("Jump Off")) {
                JumpOffArray[this.id] = this;
                return;
            }
            this.vertices = vertices;
            this.mainWeaponName = attributeArray.weaponname;
            this.mainWeaponType = attributeArray.weapontype;

            this.cover = 0; //used in shooting
            this.fp = 0;
            this.shockTokenID = "";

            BaseArray[t.id] = this;
        }

        casualty() {
            let health = parseInt(this.token.get("bar1_value")) - 1;
            let side = health - 1; //0 indexed
            if (side < 0) {
                this.remove();
            } else {
                let sides = this.token.get("sides").split("|");
                let img = tokenImage(sides[side]);
                this.token.set({
                    bar1_value: health,
                    currentSide: side, //zero indexed
                    imgsrc: img,
                });
            }
        }

        reverseCasualty() {
            let health = parseInt(base.token.get("bar1_value")) + 1;
            let side = health - 1; //0 indexed
            let sides = this.token.get("sides").split("|");
            if (health > sides.length) {
                //add new token with health of 1 beside it in empty space
            } else {
                let img = tokenImage(sides[side]);
                this.token.set({
                    bar1_value: health,
                    currentSide: side, //zero indexed
                    imgsrc: img,
                });
            }
        }


        remove() {
                let team = TeamArray[this.teamID];
                team.remove(this);
                this.token.remove();
                let stok = findObjs({_type:"graphic", id: this.shockTokenID})[0];
                if (stok) {stok.remove()};
                delete BaseArray[this.id];
        }

        pinned() {
            let pinned = false;
            if (this.token.get("aura1_color") === colours.red) {
                pinned = true;
            }
            return pinned;
        }

        broken() {
            let broken = false;
            if (this.token.get("aura1_color") === colours.yellow) {
                broken = true;
            }
            return broken;
        }


    }

    class Team {
        constructor(name,player,nation,unitID,teamID) {
            if (!teamID) {
                teamID = stringGen();
            }
            this.id = teamID;
            this.unitID = unitID;
            this.player = player;
            this.nation = nation;
            this.name = name;
            this.pinned = false;
            this.broken = false;
            this.bases = []; //ids of bases/tokens comprising team
            this.nco = []; //id of nco attached if any
            this.co = []; //ids of co's attached if any
            this.parentTeamID = [];//parent team if scout
            this.scout = false; //checked when looking to see if a scout team
            this.leader = false;
            this.crew= false; //tracker for crewed weapons eg MG teams
            this.order = "";
            this.hits = 0; //used to track # of hits on team
            this.toHit = 0;//used in firing
            this.shock = 0;


            TeamArray[teamID] = this;
        }
        add(base) {
            if (this.bases.includes(base.id) === false) {
                if (base.token.get("aura1_color") !== "transparent") {
                    this.bases.unshift(base.id);
                    let shock = parseInt(base.token.get("bar3_value"));
                    this.shock = shock;
                } else {
                    this.bases.push(base.id);
                }
            }
            if (base.special.includes("Crew")) {
                this.crew = true;
            }
            if (base.rank > 0) {
                this.leader = true;
            }


        }
        remove(base) {
            let index = this.bases.indexOf(base.id);
            if (index > -1) {
                if (index === 0) {
                    let newLeader = BaseArray[this.bases[1]];
                    newLeader.token.set({
                        aura1_color: base.token.get("aura1_color"),
                        aura1_radius: 0.1,
                        showplayers_aura1: true,
                        bar3_value: this.shock,
                    })
                }
                this.bases.splice(index,1);
            }
            if (this.bases.length === 0) {
                let unit = UnitArray[this.unitID];
                unit.remove(this);
                //bad thing looked after in respective routines
            } else {
                UpdateShock(this);
            }
        }


    }



    class Unit {
        //presumably each team belongs to a unit, even if unit is itself
        constructor(name,player,nation,unitID,core) {
            if (!unitID) {
                unitID = stringGen();
            }
            this.id = unitID;
            this.nco = ""; // id of the nco commanding the unit, if any
            this.co = false; //changed to true if is a senior leader
            this.name = name;
            this.player = player;
            this.nation = nation;
            this.teams = [];
            this.core = false;
            if (core === "Core") {
                this.core = true;
            }
            UnitArray[unitID] = this;
        }

        add(team) {
            if (this.teams.includes(team.id) === false) {
                this.teams.push(team.id);
            }
        }
        remove(team) {
            let index = this.teams.indexOf(team.id);
            if (index > -1) {
                this.teams.splice(index,1);
            }
            if (this.teams.length === 0) {
                //team destroyed, bad thing ? (maybe already captured in team.remove)

            }



        }




    }

    const WeaponArray = {
        SMG: {
            Close: {Range: 6, FP: 4},
            Eff: {Range: 12, FP: 2},
            Reroll: false,
            Penalty: 0,
            Cover: "Nil",
        },
        Rifle: {
            Close: {Range: 18, FP: 1},
            Eff: {Range: 150, FP: 1},
            Reroll: false,
            Penalty: 0,
            Cover: "Nil",
        },
        Carbine: {
            Close: {Range: 18, FP: 1},
            Eff: {Range: 150, FP: 1},
            Reroll: true,
            Penalty: 0,
            Cover: "Nil",
        },
        BAR: {
            Close: {Range: 18, FP: 3},
            Eff: {Range: 150, FP: 3},
            Reroll: true,
            Penalty: 0,
            Cover: "Nil",
        },
        "Magazine LMG": {
            Close: {Range: 18, FP: 6},
            Eff: {Range: 150, FP: 6},
            Reroll: false,
            Penalty: 2,
            Cover: "Nil",
        },
        "Belt-Fed LMG": {
            Close: {Range: 18, FP: 8},
            Eff: {Range: 150, FP: 8},
            Reroll: false,
            Penalty: 3,
            Cover: "Nil",
        },
        SMG: {
            Close: {Range: 6, FP: 4},
            Eff: {Range: 12, FP: 2},
            Reroll: false,
            Penalty: 0,
            Cover: "Nil",
        },
        "Assault Rifle": {
            Close: {Range: 18, FP: 3},
            Eff: {Range: 48, FP: 1},
            Reroll: false,
            Penalty: 0,
            Cover: "Nil",
        },
        "MMG/HMG": {
            Close: {Range: 24, FP: 10},
            Eff: {Range: 150, FP: 10},
            Reroll: false,
            Penalty: 3,
            Cover: "Reduces",
        },
        "Pistol": {
            Close: {Range: 9, FP: 1},
            Eff: {Range: 0, FP: 0},
            Reroll: false,
            Penalty: 0,
            Cover: "Nil",
        },



    }

    const ToHitArray = {
        Green: {Close: 3, Eff: 4},
        Regular: {Close: 4, Eff: 5},
        Elite: {Close: 5, Eff: 6},
    }

    const HitEffect = [
        [0,0,0,1,1,2,2], //0 = Miss, 1 = Shock, 2 = Kill, extra 0 at start as zero index array
        [0,0,0,0,1,1,2],
        [0,0,0,0,0,1,2],
    ]

    const BaseDistance = (base1,base2) => {
        let closestD = base1.hex.distance(base2.hex);
        //is center base1 token to center base 2 OR closest vertices if Vehicle or gun
        if (base2.type === "Gun" || base2.type === "Vehicle") {
            vertices = base2.vertices;
            if (!vertices || vertices.length === 0) {
                base2.vertices = TokenVertices(base2.token);
                vertices = base2.vertices;
            }
            for (let i=0;i<4;i++) {
                let pt = base2.vertices[i];
                let hex = pointToHex(pt);
                let dist = base1.hex.distance(hex);
                closestD = Math.min(closestD,dist);
            }
        }
        return closestD;
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


    const getAbsoluteControlPt = (controlArray, center, w, h, rot, scaleX, scaleY) => {
        let len = controlArray.length;
        let point = new Point(controlArray[len-2], controlArray[len-1]);
        //translate relative x,y to actual x,y 
        point.x = scaleX*point.x + center.x - (scaleX * w/2);
        point.y = scaleY*point.y + center.y - (scaleY * h/2);
        point = RotatePoint(center.x, center.y, rot, point);
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
        //cx, cy = coordinates of the center of rotation
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

    const TokenVertices = (tok) => {
      //Create corners with final being the first
      let corners = []
      let tokX = tok.get("left")
      let tokY = tok.get("top")
      let w = tok.get("width")
      let h = tok.get("height")
      let rot = tok.get("rotation") * (Math.PI/180)
      //define the four corners of the target token as new points
      //also rotate those corners around the target tok center
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

        if (!outputCard.nation) {
            outputCard.nation = "Neutral";
        }

        //start of card
        output += `<div style="display: table; border: ` + Nations[outputCard.nation].borderStyle + " " + Nations[outputCard.nation].borderColour + `; `;
        output += `background-color: #EEEEEE; width: 100%; text-align: center; `;
        output += `border-radius: 1px; border-collapse: separate; box-shadow: 5px 3px 3px 0px #aaa;;`;
        output += `"><div style="display: table-header-group; `;
        output += `background-color: ` + Nations[outputCard.nation].backgroundColour + `; `;
        output += `background-image: url(` + Nations[outputCard.nation].image + `), url(` + Nations[outputCard.nation].image + `); `;
        output += `background-position: left,right; background-repeat: no-repeat, no-repeat; background-size: contain, contain; align: center,centre; `;
        output += `border-bottom: 2px solid #444444; "><div style="display: table-row;"><div style="display: table-cell; padding: 2px 2px; text-align: center;"><span style="`;
        output += `font-family: ` + Nations[outputCard.nation].titlefont + `; `;
        output += `font-style: normal; `;

        let titlefontsize = "1.4em";
        if (outputCard.title.length > 12) {
            titlefontsize = "1em";
        }

        output += `font-size: ` + titlefontsize + `; `;
        output += `line-height: 1.2em; font-weight: strong; `;
        output += `color: ` + Nations[outputCard.nation].fontColour + `; `;
        output += `text-shadow: none; `;
        output += `">`+ outputCard.title + `</span><br /><span style="`;
        output += `font-family: Arial; font-variant: normal; font-size: 13px; font-style: normal; font-weight: bold; `;
        output += `color: ` +  Nations[outputCard.nation].fontColour + `; `;
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
                out += `"> <div style='text-align: center; display:block;'>`;
                out += line + " ";

                for (let q=0;q<num;q++) {
                    let info = outputCard.inline[inline];
                    out += `<a style ="background-color: ` + Nations[outputCard.nation].backgroundColour + `; padding: 5px;`
                    out += `color: ` + Nations[outputCard.nation].fontColour + `; text-align: center; vertical-align: middle; border-radius: 5px;`;
                    out += `border-color: ` + Nations[outputCard.nation].borderColour + `; font-family: Tahoma; font-size: x-small; `;
                    out += `"href = "` + info.action + `">` + info.phrase + `</a>`;
                    inline++;                    
                }
                out += `</div></span></div></div>`;
            } else {
                line = line.replace(/\[hr(.*?)\]/gi, '<hr style="width:95%; align:center; margin:0px 0px 5px 5px; border-top:2px solid $1;">');
                line = line.replace(/\[\#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})\](.*?)\[\/[\#]\]/g, "<span style='color: #$1;'>$2</span>"); // [#xxx] or [#xxxx]...[/#] for color codes. xxx is a 3-digit hex code
                line = line.replace(/\[[Uu]\](.*?)\[\/[Uu]\]/g, "<u>$1</u>"); // [U]...[/u] for underline
                line = line.replace(/\[[Bb]\](.*?)\[\/[Bb]\]/g, "<b>$1</b>"); // [B]...[/B] for bolding
                line = line.replace(/\[[Ii]\](.*?)\[\/[Ii]\]/g, "<i>$1</i>"); // [I]...[/I] for italics
                let lineBack = (i % 2 === 0) ? "#D3D3D3" : "#EEEEEE";
                out += `<div style="display: table-row; background: ` + lineBack + `;; `;
                out += `"><div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                out += `"><span style="line-height: normal; color: #000000; `;
                out += `"> <div style='text-align: center; display:block;'>`;
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
                out += `"> <div style='text-align: center; display:block;'>`;
                out += `<a style ="background-color: ` + Nations[outputCard.nation].backgroundColour + `; padding: 5px;`
                out += `color: ` + Nations[outputCard.nation].fontColour + `; text-align: center; vertical-align: middle; border-radius: 5px;`;
                out += `border-color: ` + Nations[outputCard.nation].borderColour + `; font-family: Tahoma; font-size: x-small; `;
                out += `"href = "` + info.action + `">` + info.phrase + `</a></div></span></div></div>`;
                output += out;
            }
        }

        output += `</div></div><br />`;
        sendChat("",output);
        outputCard = {title: "",subtitle: "",nation: "",body: [],buttons: [],};
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
                    if (polygon.cover === 1) {
                        hexMap[hexLabel].coverID.push(polygon.id);
                    }
                    hexMap[hexLabel].los = Math.max(hexMap[hexLabel].los,polygon.los);
                    hexMap[hexLabel].height = Math.max(hexMap[hexLabel].height,polygon.height);
                    hexMap[hexLabel].cover = Math.max(hexMap[hexLabel].cover,polygon.cover);
                }
            }
        }
    }



    const BuildMap = () => {
        let startTime = Date.now();
        AddTerrain();
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
                    smoke: false,
                    smokeGrenade: false,
                    elevation: 0, //based on hills
                    height: 0, //height of top of terrain over elevation
                    terrainIDs: [], //used to see if tokens in same building or such
                    buildingHeight: 0,
                    cover: 0,
                    los: 0,
                    coverID: [],// used to track ID of light cover 
                };
                hexMap[label] = hexInfo;
                columnLabel += 2;
            }
            startX += halfToggleX;
            halfToggleX = -halfToggleX;
            rowLabelNum += 1;
            columnLabel = (columnLabel % 2 === 0) ? 1:2; //swaps odd and even
        }

        let x = Math.floor((pageInfo.width + edgeArray[1]) / 2);
        let y = 43.8658278242683;
        //setup location for Force Morale and Chain of Command Info
        let rightEdgePt = new Point(x,y);
        for (let o=0;o<4;o++) {
            y += 66.9658278242677;
            InfoPoints[0][o] = new Point(x,y);
            InfoPoints[1][o] = new Point(x,y + pageInfo.height/2);
        }

//modify above if using left and right areas 

        let keys = Object.keys(hexMap);
        const burndown = () => {
            let key = keys.shift();
            if (key){
                let elevation = hexMap[key].elevation;
                let height = hexMap[key].height;
                let cover = hexMap[key].cover;
                let buildingHeight = hexMap[key].buildingHeight;
                let c = hexMap[key].centre;
                if (c.x >= edgeArray[1] || c.x <= edgeArray[0]) {
                    //Offboard
                    hexMap[key].terrain = ["Offboard"];
                } else {
                    for (let t=0;t<TerrainArray.length;t++) {
                        let polygon = TerrainArray[t];
                        if (hexMap[key].terrain.includes(polygon.name)) {continue};
                        if (LinearTerrain.includes(polygon.name)) {
                            continue;
                        }
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

                            if (polygon.los > hexMap[key].los) {
                                hexMap[key].los = polygon.los;
                            }
                            if (polygon.cover === 1) {
                                hexMap[key].coverID.push(polygon.id);
                            }
                            if (polygon.name.includes("Hill")) {
                                elevation = Math.max(elevation,polygon.height);
                            } else {
                                height = Math.max(height,polygon.height);
                                cover = Math.max(cover,polygon.cover);
                                if (polygon.name.includes("Building")) {
                                    buildingHeight = parseInt(polygon.name.replace(/[^0-9]+/g, "")) - 1; //max height for infantry in building
                                };
                            };
                        };
                    };
                    if (hexMap[key].los === 0) {
                        hexMap[key].terrain.push("Open Ground");
                    }
                    hexMap[key].elevation = elevation;
                    hexMap[key].cover = cover;
                    hexMap[key].height = height;
                    hexMap[key].buildingHeight = buildingHeight;
                }
                setTimeout(burndown,0);
            }
        }
        burndown();
        for (let t=0;t<TerrainArray.length;t++) {
            let polygon = TerrainArray[t];
            if (LinearTerrain.includes(polygon.name)) {
                Linear(polygon);
            }   
        }
        let elapsed = Date.now()-startTime;
        log("Hex Map Built in " + elapsed/1000 + " seconds");
        //add tokens to hex map, rebuild Team/Unit Arrays
        TA();
    }


    const AddTerrain = () => {
        TerrainArray = [];
        let paths = findObjs({_pageid: Campaign().get("playerpageid"),_type: "path",layer: "map"});
        let vertices = [];
        paths.forEach((pathObj) => {
            toFront(pathObj);
            let colour = pathObj.get("stroke").toLowerCase();
            let t = TerrainInfo[colour];
            if (!t) {return};    
            let path = JSON.parse(pathObj.get("path"));
            let center = new Point(pathObj.get("left"), pathObj.get("top"));
            let w = pathObj.get("width");
            let h = pathObj.get("height");
            let rot = pathObj.get("rotation");
            let scaleX = pathObj.get("scaleX");
            let scaleY = pathObj.get("scaleY");

            //covert path vertices from relative coords to actual map coords
            path.forEach((vert) => {
                let tempPt = getAbsoluteControlPt(vert, center, w, h, rot, scaleX, scaleY);
                if (isNaN(tempPt.x) || isNaN(tempPt.y)) {return}
                vertices.push(tempPt);            
            });
            let info = {
                name: t.name,
                colour: colour,
                id: stringGen(),
                tokenID: "",
                vertices: vertices,
                height: t.height,
                cover: t.cover,
                los: t.los,
            }
            TerrainArray.push(info);
            vertices = [];
        });
    }

    const TA = () => {
        //add tokens on map into various arrays
        BaseArray = {};
        TeamArray = {};
        UnitArray = {};
        PatrolArray = {};
        //create an array of all tokens
        let start = Date.now();
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "objects",
        })

        tokens.forEach((token) => {
            let character = getObj("character", token.get("represents"));           
            if (character === null || character === undefined) {return};
            let base = new Base(token,character);
            let gmnotes = decodeURIComponent(token.get("gmnotes"))
            if (gmnotes) {
                gmnotes = gmnotes.toString().split(";");    
                let teamName = gmnotes[0];       
                let teamID = gmnotes[1];
                let unitName = gmnotes[2];
                let unitID = gmnotes[3];
                let core = gmnotes[4];
                let parentTeamID = gmnotes[5];

                let team = TeamArray[teamID];
                if (team) {
                    team.add(base);
                } else {
                    team = new Team(teamName,base.player,base.nation,unitID,teamID);
                    team.add(base);
                }
                if (base.rank > 0) {
                    team.leader = true;
                }
                if (parentTeamID) {
                    team.parentTeamID = parentTeamID;
                    team.scout = true;
                }
                let unit = UnitArray[unitID];
                if (unit) {
                    unit.add(team);
                } else {
                    unit = new Unit(unitName,team.player,team.nation,unitID,core);
                    unit.add(team);
                }
            }
        });
        //now run through gmlayer for shock tokens and add their ID to parent Base
        tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "gmlayer",
        })
        tokens.forEach((token) => {
            let parentID = decodeURIComponent(token.get("gmnotes"))
            BaseArray[parentID].shockTokenID = token.id;
        })

        let elapsed = Date.now()-start;
        log(elapsed + " milliseconds to add Tokens");
    }

    const OfficerName = (base) => {
        let ranks = {
            "Germany": ["Obergefreiter ","Unteroffizier ","Leutnant ","Hauptmann ", ],
            "Soviet": ["Serzhant ","Serzhant ","Leytenant ","Kapitan "],
            "USA": ["Sergeant ","Platoon Sgt. ","Lieutenant ","Captain "],
            "UK": ["Sergeant ","Platoon Sgt. ","Lieutenant ","Captain "],
        };
        let name = ranks[base.nation][base.rank - 1] + Surname(base.nation);
        return name;
    }

	const Surname = (nat) => {
	    let num = randomInteger(25) - 1
	    let names = {
	        Germany: ["Schmidt","Schneider","Fischer","Weber","Meyer","Wagner","Becker","Schulz","Hoffmann","Bauer","Richter","Klein","Wolf","Schroder","Neumann","Schwarz","Braun","Hofmann","Werner","Krause","Konig","Lang","Vogel","Frank","Beck"],
	        Soviet: ["Ivanov","Smirnov","Petrov","Sidorov","Popov","Vassiliev","Sokolov","Novikov","Volkov","Alekseev","Lebedev","Pavlov","Kozlov","Orlov","Makarov","Nikitin","Zaitsev","Golubev","Tarasov","Ilyin","Gusev","Titov","Kuzmin","Kiselyov","Belov"],
	        USA: ["Smith","Johnson","Williams","Brown","Jones","Wright","Miller","Davis","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Thompson","White","Harris","Clark","Lewis","Robinson","Walker","Young","Allen"],
	        UK: ["Smith","Jones","Williams","Taylor","Davies","Brown","Wilson","Evans","Thomas","Johnson","Roberts","Walker","Wright","Robinson","Thompson","White","Hughes","Edwards","Green","Lewis","Wood","Harris","Martin","Jackson","Clarke"],
	    }
	    let nameList = names[nat]
	    let surname = nameList[num]
	    return surname	
	}

    const TokenInfo = (msg) => {
        if (!msg.selected) {
            //StatusInfo()
            return;
        };
        let id = msg.selected[0]._id;
        let base = BaseArray[id];
        if (!base) {return};
        let label = base.hexLabel;
        let nation = base.nation;
        if (!nation) {nation = "Neutral"};
        SetupCard(base.name,base.hexLabel,nation);
        let h = hexMap[label];
        let terrain = h.terrain;
        terrain = terrain.toString();
        let elevation = baseHeight(base);
        let covers = ["None","Soft","Hard","Bunker"];
        let cover = covers[h.cover]
        let effects = ["Open",'Obscures at 6"','Obscures at 4"','Obscures at 1"','Obscures at 0"'];
        let effect = effects[h.los]
        outputCard.body.push("Terrain: " + terrain);
        outputCard.body.push("Elevation: " + elevation);
        outputCard.body.push("Cover: " + cover);
        outputCard.body.push("LOS Effect: " + effect);
        outputCard.body.push("[hr]");
        outputCard.body.push("Team: " + TeamArray[base.teamID].name);
        outputCard.body.push("Unit: " + UnitArray[base.unitID].name);

        PrintCard();
    }
    
    const baseHeight = (base) => {
        let height = parseInt(hexMap[base.hexLabel].elevation);
        //adjust for infantry that are in buildings

        return height;
    }

	const View = (msg) => {
	    let Tag = msg.content.split(";");
	    let shooterID = Tag[1];
	    let shooter = BaseArray[shooterID];
	    let targetID = Tag[2];
	    let losResult = LOS(shooterID,targetID);
        let coverNames = ["No","Soft","Hard"]
        SetupCard(shooter.name,"LOS",shooter.nation);
	    if (losResult.los == false) {
            outputCard.body.push("No LOS");
        } else {
            outputCard.body.push("Target is in LOS");
            outputCard.body.push("Range: " + losResult.distance);
            outputCard.body.push("Target has " + coverNames[losResult.cover] + " Cover");
	    }
        PrintCard();
	}

    const LOS = (id1,id2,special) => {
        if (!special) {special = " "};
        let base1 = BaseArray[id1];
        let base2 = BaseArray[id2];
        if (!base1 || !base2) {
            sendChat("","One of 2 is not in Base Array");
            let result = {
                los: false,
                cover: 0,
                distance: -1,
            }
            return result
        }

        let distanceT1T2 = BaseDistance(base1,base2);
        //let distanceT1T2 = team1.hex.distance(team2.hex);
        let los = true;
        let sg = false;
        let lightCover = [];
        let heavyCover = 0;
        let cover = 0;

        let base1Height = baseHeight(base1);
        let base2Height = baseHeight(base2);
//log("Team1 H: " + base1Height)
//log("Team2 H: " + base2Height)

        let baseLevel = Math.min(base1Height,base2Height);
        base1Height -= baseLevel;
        base2Height -= baseLevel;

        let interHexes = base1.hex.linedraw(base2.hex); 
        //interHexes will be hexes between shooter and target, not including their hexes
        let base1Hex = hexMap[base1.hexLabel];
        let base2Hex = hexMap[base2.hexLabel];
        let theta = base1.hex.angle(base2.hex);
        let phi = Angle(theta - base1.token.get('rotation'));
        theta = base2.hex.angle(base1.hex);
        let kappa = Angle(theta - base2.token.get('rotation'));

        if (base1.type === "Infantry") {
            if ((phi > 90 && phi < 270) || ((special === "Overwatch" || base1Hex.terrain.includes("Building") && phi > 45 && phi < 315))) {
                los = false;
            }
        }
        if (base1.type === "Gun" && (phi > 45 && phi < 315)) {
            los = false;
        }
        if (base2Hex.terrain.includes("Building") && (kappa > 45 && kapp < 315)) {
            los = false;
        }

        if (los === true) {
    //log("Base: " + baseLevel)
            let sameTerrain = findCommonElements(base1Hex.terrainIDs,base2Hex.terrainIDs);
            let lastElevation = base1Height;

            for (let i=1;i<interHexes.length;i++) {
                //0 is tokens own hex
                let qrs = interHexes[i];
                let interHex = hexMap[qrs.label()];
    //log(i + ": " + qrs.label())
    //log(interHex.terrain)
    //log("Cover: " + interHex.cover)
    //log("LOS #: " + interHex.los)
                let interHexElevation = parseInt(interHex.elevation) - baseLevel
                let interHexHeight = parseInt(interHex.height);
                let B = i * base2Height / distanceT1T2; //max height of intervening hex terrain to be seen over

    //log("InterHex Height: " + interHexHeight)
    //log("InterHex Elevation: " + interHexElevation)
    //log("Last Elevation: " + lastElevation)
    //log("B: " + B);

                if (interHex.smoke === true) {
                    //log("Smoke")
                    los = false;
                    break;
                }
                if (interHexElevation < lastElevation && lastElevation > base1Height && lastElevation > base2Height) {
                    //log("Intervening Higher Terrain")
                    los = false;
                    break;
                }            
                lastElevation = interHexElevation;
                if (interHex.smokeGrenade === true) {
                    sg = true;
                }
                if (interHex.los === 0) {continue}; //open
                if ((interHexHeight + interHexElevation) >= B) {
                    //los goes through terrain, check now if blocks LOS or offers cover
                    //also check if troops in way
                    let ihTokenIDs = interHex.tokenIDs;
                    if (ihTokenIDs) {
                        let idBase = BaseArray[ihTokenIDs[0]];
                        if (idBase) {
                            if (idBase.player === base1.player && idBase.unitID !== base1.unitID) {
                                //log("Friendly Infantry")
                                los = false;
                                break;
                            }
                        }
                        //Vehicles and Larger Tokens
                    }
                    if (interHex.los > 0) {
                        //Obscuring Terrain
                        //log("Hex S LOS: " + base1Hex.los)
                        let st1 = findCommonElements(base1Hex.terrainIDs,interHex.terrainIDs);
                        //log("ST1: " + st1)
                        let st2 = findCommonElements(base2Hex.terrainIDs,interHex.terrainIDs);
                        //log("Hex T LOS: " + base2Hex.los)
                        //log("ST2: " + st2)
                        //can fire out if S in X" of edge or fire in if T in 4" of edge
                        let obsDist = [0,6,4,1,0];
                        //1,2 is for things like woods, orchards, ruins
                        //3 is for walls, fences, ridgelines
                        //4 is for buildings
                        if (i<=obsDist[interHex.los]) {
                            if ((interHex.los === 1 || interHex.los === 2) && st1 === false) {
                                //log("Obscuring Woods/Ruins");
                                los = false;
                                break;
                            }
                        } else if (i>=(distanceT1T2 - obsDist[interHex.los])) {
                            //can fire in if T in X" of edge
                            if ((interHex.los === 1 || interHex.los === 2) && st2 === false) {
                                //log("Obscuring Woods/Ruins");
                                los = false;
                                break;
                            }
                        } else {
                            //log("Obscuring Terrain");
                            los = false;
                            break;
                        }
                    }
                    if (i>1) {
                        if (interHex.cover === 1) {
                            let lc = findCommonElements(lightCover,interHex.coverID);
                            if (lc === false) {
                                for (let c=0;c<interHex.coverID.length;c++) {
                                    let covID = interHex.coverID[c];
                                    if (lightCover.includes(covID)) {continue};
                                    lightCover.push(covID);
                                }
                            }
                            //log("Light Cover from " + interHex.terrain)
                        }
                        if (interHex.cover === 2) {
                            heavyCover += 1;
                            //log("Heavy Cover from " + interHex.terrain)
                        }
                    }
                }
            }
            if (base2Height < lastElevation && lastElevation > base1Height && lastElevation > base2Height) {
                //log("Intervening Higher Terrain")
                los = false;
            }   
        }
        if (los === true) {
            //team2 Hex 
            if (base2Hex.cover === 1) {
                let lc = findCommonElements(lightCover,base2Hex.coverID);
                if (lc === false) {
                    for (let c=0;c<base2Hex.coverID.length;c++) {
                        let covID = base2Hex.coverID[c];
                        if (lightCover.includes(covID)) {continue};
                        lightCover.push(covID);
                    }
                }
                //log("Light Cover from " + base2Hex.terrain)
            }
            if (base2Hex.cover === 2) {
                heavyCover += 1;
                //log("Heavy Cover from " + base2Hex.terrain)
            }           
            if (lightCover.length > 0) {
                cover = 1;
            }
            if (heavyCover > 0 || lightCover.length > 2) {
                cover = 2;
            }
        }
        let result = {
            los: los,
            cover: cover,
            distance: distanceT1T2,
            smokeGrenade: sg,
            angle: phi,
        }
        return result;
    }


    const ClearState = (msg) => {
        //clear arrays, display force morale, CoC Pts
        BaseArray = {};
        TeamArray = {};
        UnitArray = {};
        PatrolArray = {};
        JumpOffArray = {};
        let playerInfo = [[],[]];
        if (state.CoC.playerInfo) {
            playerInfo = state.CoC.playerInfo;
        }

        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "objects",
        })
        tokens.forEach((token) => {
            token.set({
                name: "",
                tint_color: "transparent",
                aura1_color: "transparent",
                aura1_radius: 0.1,
                showplayers_bar1: true,
                showname: true,
                showplayers_aura1: true,
                bar1_value: 0,
                showplayers_bar3: true,
                bar3_value: 0,
                gmnotes: "",
                statusmarkers: "",
            });                
            let character = getObj("character", token.get("represents"));           
            if (character === null || character === undefined) {return};
            let base = new Base(token,character);
        })




        state.CoC = {
            nations: [],
            players: [],
            playerInfo: [[],[]],
            forceMorale: [0,0],
            CoCPoints: [0,0],
            commandDice: [5,5],
            JOLines: [],
            unitnumbers: [[0],[0]],
            markers: {},
        }

        let info = ["Nation","Force Morale: 0","Chain of Command Points:  0"];
        for (let p=0;p<2;p++) {
            for (let o=0;o<3;o++) {
                let objID = playerInfo[p][o];
                let obj = findObjs({type: 'text',id: objID})[0];
                if (obj) {
                    obj.remove();
                }
                obj = createObj("text",{
                    left: InfoPoints[p][o].x,
                    top: InfoPoints[p][o].y,
                    font_size: 72,
                    font_family: "Arial",
                    pageid: Campaign().get("playerpageid"),
                    layer: "map",
                    text: info[o],
                });
                state.CoC.playerInfo[p].push(obj.id);
            }
        }
        //later, can change Nation to actual Nation name, colour, update Force Morale based on roll etc

        sendChat("","Cleared State/Arrays");
    }

    const StartNewGame = (msg) => {
        let Tag = msg.content.split(";");
        let player1Nation = Tag[1];
        let player1Morale = parseInt(Tag[2]);
        let player2Nation = Tag[3];
        let player2Morale = parseInt(Tag[4]);

        SetupCard("Start New Game","","Neutral");
        outputCard.body.push("[U]" + player1Nation + "[/U]");
        outputCard.body.push("Starting Force Morale: " + player1Morale );
        outputCard.body.push("[hr]");
        outputCard.body.push("[U]" + player2Nation + "[/U]");
        outputCard.body.push("Starting Force Morale: " + player2Morale );
        PrintCard();

        state.CoC.nations = [player1Nation,player2Nation];
        state.CoC.forceMorale = [player1Morale,player2Morale];

        for (let p=0;p<2;p++) {
            UpdateDisplay(p)
        }
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
        let abilityName,action;
        let abilArray = findObjs({  _type: "ability", _characterid: char.id});
        //clear old abilities
        for(let a=0;a<abilArray.length;a++) {
            abilArray[a].remove();
        } 
        let type = Attribute(char,"type");
        if (type === "System Unit" && token.get("name").includes("Patrol")) {
            abilityName = "Lockdown";
            action = "!Lockdown";
            AddAbility(abilityName,action,char.id);
            return;
        }

        if (type === "Infantry") {
            let rank = Attribute(char,"rank");
            let special = Attribute(char,"special");
            let nation = Attribute(char,"nation");
            if (rank < 1) {
                abilityName = "Activate" ;
                if (special.includes("Squad Only") === false) {
                    action = "!Activate;@{selected|token_id};?{Unit|Team|Squad};?{Action|Stand and Fire|Tactical Move|Move and Fire|Normal Move|At the Double|Covering Fire|Deploy}";
                    AddAbility(abilityName,action,char.id);
                }
                if (special.includes("Squad Only") === true) {
                    action = "!Activate;@{selected|token_id};Squad;?{Action|Stand and Fire|Tactical Move|Move and Fire|Normal Move|At the Double|Covering Fire|Deploy}";
                    AddAbility(abilityName,action,char.id);
                } 
                if (special.includes("Fire Team") === true) {
                    action = "!Activate;@{selected|token_id};Team;?{Action|Stand and Fire|Tactical Move|Move and Fire|Normal Move|At the Double|Covering Fire|Deploy}";
                    AddAbility(abilityName,action,char.id);
                } 
                abilityName = "Overwatch";
                action = "!Activate;@{selected|token_id};Team;Overwatch";
                AddAbility(abilityName,action,char.id);

                abilityName = "Rejoin";
                action = "!Rejoin;@{selected|token_id}";
                AddAbility(abilityName,action,char.id);



                abilityName = "Fire";
                action = "!Fire;@{selected|token_id};@{target|token_id}";
                AddAbility(abilityName,action,char.id);


            } else {
                //Leader
                abilityName = "Order Unit";
                action = "!Order;@{selected|token_id};?{Order|Activate|Overwatch|Covering Fire|Rally|Throw/Fire Grenade|Smoke Grenades|Fire Squad AT Weapon|Transfer Man to Team|Detach Team};@{target|token_id}";
                AddAbility(abilityName,action,char.id);
                abilityName = "Move";
                action = "!LeaderSelf;@{selected|token_id};?{Tactical Move|Normal Move|At the Double|Deploy}";
                AddAbility(abilityName,action,char.id);
                abilityName = "Join Team";
                action = "!LeaderJoin;@{selected|token_id};@{target|token_id}";
                AddAbility(abilityName,action,char.id);



            }





        }

        if (type === "Gun") {
            let special = Attribute(char,"special");
            abilityName = "[1] Activate Team";
            if (special.includes("Immobile")) {
                action = "!Activate;@{selected|token_id};Team;?{Stand and Fire|Rotate|Deploy}";
            } else {
                action = "!Activate;@{selected|token_id};Team;?{Stand and Fire|Rotate|Normal Move|Deploy}";
            }
            AddAbility(abilityName,action,char.id);
            abilityName = "Fire";
            action = "!Fire;@{selected|token_id};@{target|token_id}";
            AddAbility(abilityName,action,char.id);





        }





    }

    const Rejoin = (msg) => {
        let Tag = msg.content.split(";");
        let id = Tag[1];
        let base = BaseArray[id];
        let shock;
        let scoutTeam = TeamArray[base.teamID];
        let parentTeam = TeamArray[scoutTeam.parentTeamID];
        let inRange = false;
        SetupCard("Rejoin","",base.nation);
        if (InRange(base,parentTeam,4) === false) {
            outputCard.body.push("Out of Range to Rejoin");
        } else {
            let parentBase = BaseArray[parentTeam.bases[0]];
            let gmnotes = parentBase.token.get("gmnotes");
            //Bring over any shock, clear aura
            if (base.token.get("aura1_color") === colours.black) {
                parentBase.token.set("aura1_color",colours.black);
            }
            base.token.set("aura1_color","transparent");
            base.token.set("gmnotes",gmnotes);
            shock = parentTeam.shock + scoutTeam.shock;
            parentBase.token.set("bar3_value",shock);
            base.token.set("bar3_value",0);
            parentTeam.add(base);
            scoutTeam.remove(base);
            UpdateShock(parentTeam);
            outputCard.body.push("Scout Team Rejoins Parent Team");
        }
        PrintCard();
    }

    const LeaderTeam = (leader) => {
        //see what teams a leader is near, place into their info if appropriate
        //nco only goes with its own team unless teams destroyed
        //override with Join, which for a troopless NCO will just add his token to team, and for a CO, will place the ID
        if ((leader.rank === 1 || leader.rank === 2) && leader.soloNCO === false) {
            //junior leader / NCO
            let unit = UnitArray[leader.unitID];
            if (!unit) {return};
            for (let i=0;i<unit.teams.length;i++) {
                let team = TeamArray[unit.teams[i]];
                if (team.id === leader.teamID) {continue};
                if (InRange(leader,team,4) === true) {
                    team.nco = [leader.id];
                    if (leader.leaderTeamIDs.includes(team.id)) {
                        return;
                    } else {
                        leader.leaderTeamIDs.push(team.id);
                    }
                } else {
                    team.nco = [];
                    let index = leader.leaderTeamIDs.indexOf(team.id);
                    if (index > -1) {
                        leader.leaderTeamIDs.splice(index,1);
                    }
                }
            }
        } else if (leader.rank > 2) {
            if (leader.leaderTeamIDs.length !== 0) {
                //check if still with this team or section/teams
                for (let i=0;i<leader.leaderTeamIDs.length;i++) {
                    let team = TeamArray[leader.leaderTeamIDs[i]];
                    if (InRange(leader,team,4) === false) {
                        let index = team.co.indexOf(leader.id);
                        if (index > -1) {
                            team.co.splice(index,1);
                        }
                        index = leader.leaderTeamIDs.indexOf(team.id);
                        if (index > -1) {
                            leader.leaderTeamIDs.splice(index,1);
                        }
                    }
                }
            }
            //if not with a team, then check for any team in range, then choose largest
            if (leader.leaderTeamIDs.length !== 0) {
                let finalTeam;
                let finalMen = 0;
                let keys = Object.keys(TeamArray);
                for (let i=0;i<keys.length;i++) {
                    let team = TeamArray[keys[i]];
                    if (team.nation !== leader.nation) {continue};
                    if (InRange(leader,team,4) === false) {continue};
                    let men = Men(team);
                    if (men> finalMen) {
                        finalMen = men;
                        finalTeam = team;
                    }
                }
                if (finalMen > 0) {
                    if (finalTeam.co.includes(leader.id) === false) {
                        finalTeam.co.push(leader.id);
                    }
                    if (leader.leaderTeamIDs.includes(finalTeam.id) === false) {
                        leader.leaderTeamIDs.push(finalTeam.id);
                    }
                }
            }
            //now if in range of one team, check other teams in that teams section
            if (leader.leaderTeamIDs.length !== 0) {
                let team = TeamArray[leader.leaderTeamIDs[0]];
                let unit = UnitArray[team.unitID];
                for (let i=0;i<unit.teams.length;i++) {
                    let team2 = unit.teams[i];
                    if (team2.id === team.id) {continue};
                    if ((leader.leaderTeamIDs.includes(team2.id) === false || team2.co.includes(leader.id) === false) && InRange(leader,team2,4) === true) {
                            if (team2.co.includes(leader.id) === false) {
                                team2.co.push(leader.id);
                            }
                            if (leader.leaderTeamIDs.includes(team2.id) === false) {
                                leader.leaderTeamIDs.push(team2.id);
                            }
                        }
                    }
            }
        } 
    }

    const Fire = (msg) => {
        let Tag = msg.content.split(";");
        
        let shooterID = Tag[1];
        let shooter = BaseArray[shooterID];
        let shooterTeam = TeamArray[shooter.teamID];
        let shooterUnit = UnitArray[shooter.unitID];
        let validOrders = ["Stand and Fire","Move and Fire","Overwatch"];
        let shooterOrder = shooterTeam.order.split(";");
        let unitSize = shooterOrder[1];
        shooterOrder = shooterOrder[0];
        SetupCard(shooterTeam.name,"",shooter.nation);
        let errorMsg = "";
        if (validOrders.includes(shooterOrder) === false) {
            if (shooterTeam.order === "") {
                errorMsg = "Team has not been activated/given an order";
            } else {
                errorMsg = "Team does not have a valid order";
            }
        }
        let targetID = Tag[2];
        let target = BaseArray[targetID];
        let targetTeam = TeamArray[target.teamID];
        //check if target is a leader, if is, then check if is attached and change targets to 1st team
        if (target.rank > 0) {
            let ltID = target.leaderTeamIDs[0];
            if (ltID) {
                targetTeam = TeamArray[ltID];
                target = BaseArray[TeamArray.bases[0]];
            }
        }
        //initial LOS and Range check, using initial shooter and target
        let initialLOS = LOS(shooter.id,target.id);
        if (initialLOS.los === false) {
            errorMsg = shooter.name + " does not have LOS to Target";
        }
        if (initialLOS.distance > WeaponArray[shooter.mainWeaponType]["Eff"]) {
            errorMsg = shooter.name + " does not have Range to Target";
        }
        if (errorMsg !== "") {
            outputCard.body.push(errorMsg);
            PrintCard();
            return;
        }
        //get initial target teams cover level
        let initialCover = initialLOS.cover;
        let initialWeaponType = shooter.mainWeaponType;
        if (target.token.get("sm.tactical") === true) {initialCover += 1};
        if (target.pinned() === true || target.broken() === true) {initialCover += 1};
        if (target.special.includes("Gun Shield")) {initialCover += 1};
        if (WeaponArray[initialWeaponType]["Cover"] === "Reduces") {initialCover -= 1};
        if (WeaponArray[initialWeaponType]["Cover"] === "Ignores") {initialCover = 0};
        initialCover = Math.max(Math.min(initialCover,2),0);
    
        let eligibleShooterTeams = [];
        let eligibleShooterBaseIDs = [];
        eligibleShooterTeams.push(shooterTeam);
        if (unitSize === "Squad") {
            for (let i=0;i<shooterUnit.teams.length;i++) {
                let team2 = TeamArray[shooterUnit.teams[i]];
                if (team2.id === shooterTeam.id || team2.leader === true) {continue};
                for (let j=0;j<team2.bases.length;j++) {
                    let base2 = BaseArray[team2.bases[j]];
                    if (InRange(base2,shooterTeam,4) === true) {
                        eligibleShooterTeams.push(team2);
                        break;
                    }
                }
            }
        }
        //check for leaders attached to teams and add their teams into shooter teams
        let tempArray = [];
        for (let i=0;i<eligibleShooterTeams.length;i++) {
            let team2 = eligibleShooterTeams[i];
            if (team2.nco.length > 0) {
                for (let j=0;j<team2.nco.length;j++) {
                    if (tempArray.includes(team2.nco[j]) === false) {
                        tempArray.push(team2.nco[j]);
                    };
                }
            }
            if (team2.co.length > 0) {
                for (let j=0;j<team2.co.length;j++) {
                    if (tempArray.includes(team2.co[j]) === false) {
                        tempArray.push(team2.co[j]);
                    };
                }
            }
        }
        for (let i=0;i<tempArray.length;i++) {
            eligibleShooterTeams.push(TeamArray[BaseArray[tempArray[i]].teamID]);
        }
    
        let eligibleTargetTeams = [];
        let eligibleTargetBaseIDs = [];
        eligibleTargetTeams.push(targetTeam);
        //see if any nearby target teams in same level of cover as initial target team
        //leaders (that are attached) will be referenced once kills allocated
        let keys = Object.keys(TeamArray);
        for (let i=0;i<keys.length;i++) {
            let team2 = TeamArray[keys[i]];
            if (team2.player !== targetTeam.player || team2.id === targetTeam.id || team2.leader === true) {continue};
            for (let j=0;j<team2.bases.length;j++) {
                let base2 = BaseArray[team2.bases[j]];
                if (InRange(base2,targetTeam,4) === true) {
                    let losTest = LOS(shooter.id,base2.id);
                    if (losTest.los === false || losTest.cover !== initialLOS.cover) {continue};
                    eligibleTargetTeams.push(team2);
                    break;
                }
            }
        }
    
        //for each shooter, get FP and To Hit info
        //and for valid targets get cover level
    
        for (let i=0;i<eligibleShooterTeams.length;i++) {
            let sTeam = eligibleShooterTeams[i];
            let lowestToHit = 10;
            for (let j=0;j<sTeam.bases.length;j++) {
                let id1 = sTeam.bases[j];
                let base1 = BaseArray[id1];
                let weaponType = base1.mainWeaponType;
                let baseFP;
                let men = parseInt(base1.token.get("bar1_value"));
                let smokeGrenade = false;
    
                //run through target teams to get to Hit
                for (let h=0;h<eligibleTargetTeams.length;h++){
                    let tTeam = eligibleTargetTeams[h];
                    for (let k=0;k<tTeam.bases.length;k++) {
                        let id2 = tTeam.bases[k];
                        let base2 = BaseArray[id2];
                        let losResult = LOS(id1,id2);
                        if (losResult.los === true) {
                            //check range to target
                            let range;
                            if (losResult.distance <= WeaponArray[weaponType]["Close"]["Range"]) {
                                range = "Close";
                            } else if (losResult.distance > WeaponArray[weaponType]["Close"]["Range"] && losResult.distance <= WeaponArray[weaponType]["Eff"]["Range"]) {   
                                range = "Eff";
                            } else {
                                continue; //out of range, next target
                            }
                            //if not identified as eligible shooter ID, add ID to array
                            if (eligibleShooterBaseIDs.includes(id1) === false) {
                                eligibleShooterBaseIDs.push(id1);
                            }
        
                            //calculate base FP, will add up later into team FP and then adjust for shock and order/pin status
                            if (base1.type === "Infantry") {
                                baseFP = parseInt(WeaponArray[weaponType][range]["FP"]);
                                if (base1.special.includes("Crew")) {
                                    if (men === 1) {
                                        baseFP -= WeaponArray[weaponType]["Penalty"];
                                    }
                                } else {
                                    baseFP *= men;
                                }
                            }
        
                            //calculate toHit for this target, will look for best toHit and keep that with corresponding FP
                            toHit = ToHitArray[base2.quality][range];
                            //check for covering Fire
                            let keys = Object.keys(state.CoC.markers);
                            for (let i=0;i<keys.length;i++) {
                                let mid = keys[i];
                                let markerBase = BaseArray[mid];
                                if (markerBase.name.includes("Covering")) {
                                    let flag = pointInPolygon(base2.location,markerBase)
                                    if (flag === true) {
                                        toHit += 1;
                                    }
                                }
                            }
                            //check for smoke grenades
                            if (losResult.smokeGrenade === true || smokeGrenade === true) {
                                toHit += 1;
                                smokeGrenade = true; //all team affected if even 1 is affected
                            }
                            //if lowest to Hit, save FP and toHit #s
                            if (toHit < lowestToHit) {
                                base1.fp = baseFP;
                                sTeam.toHit = toHit;
                            }
        
                            //for the target, add to ID list and work out coverlevel as will be used later for saves
                            if (eligibleTargetBaseIDs.includes(id2) === false) {
                                eligibleTargetBaseIDs.push(id2);
                                base2.cover = 3;
                            }
                            let base2Cover = losResult.cover;
                            if (base2.token.get("sm.tactical") === true) {base2Cover += 1};
                            if (base2.pinned() === true || base2.broken() === true) {base2Cover += 1};
                            if (base2.special.includes("Gun Shield")) {base2Cover += 1};
                            if (WeaponArray[weaponType]["Cover"] === "Reduces") {base2Cover -= 1};
                            if (WeaponArray[weaponType]["Cover"] === "Ignores") {base2Cover = 0};
                            base2Cover = Math.max(Math.min(base2Cover,2),0);
                            base2.cover = Math.min(base2.cover,base2Cover);
                        }
                    } //next target
                }//next target team
            }//next shooter
        }//next shooter team
    
        //now run through shooter teams and add up FP and roll dice
    
        let totalHits = 0;
    
        for (let i=0;i<eligibleShooterTeams.length;i++) {
            let sTeam = eligibleShooterTeams[i];
            let teamFP = [0,0]; //0 is for regular, 1 is for fp with rerolls
            let toHit = parseInt(sTeam.toHit);

            let weapons = [[],[]];
            for (let j=0;j<sTeam.bases.length;j++) {
                let sBase = BaseArray[sTeam.bases[j]];
                if (eligibleShooterBaseIDs.includes(sBase.id) === false) {
                    continue;//didnt have LOS or range
                }
                let weaponType = sBase.mainWeaponType;
                if (weapons.includes(sBase.mainWeaponName) === false) {
                    weapons.push(sBase.mainWeaponName)
                }
                let reroll = WeaponArray[weaponType]["Reroll"];
                if (reroll === true) {
                    teamFP[1] += sBase.fp;
                    if (weapons[1].includes(sBase.mainWeaponName) === false) {
                        weapons[1].push(sBase.mainWeaponName)
                    }
                } else {
                    teamFP[0] += sBase.fp;
                    if (weapons[0].includes(sBase.mainWeaponName) === false) {
                        weapons[0].push(sBase.mainWeaponName)
                    }
                }
            }
    
            let sTeamLeader = BaseArray[sTeam.bases[0]];
            let se = Math.floor(sTeam.shock/2); //1/2 of shock, rounded down
            let shockEffect = [se,se];
log("Shock Effect: " + shockEffect)
            if (teamFP[0] > 0 && teamFP[1] > 0) {
                shockEffect[0] = Math.floor(se/2);
                shockEffect[1] = se - shockEffect[0]; 
            } 
            for (let t=0;t<2;t++) {
                teamFP[t] = Math.max(0,teamFP[t] - shockEffect[t]);
                if (sTeamLeader.pinned() === true) {
                    teamFP[t] = Math.floor(teamFP[t]/2);
                } 
                if (shooterOrder === "Move and Fire") {
                    teamFP[t] = Math.floor(teamFP[t]/2);
                }
            }
    
            
            for (let t=0;t<2;t++) {
                let rolls = [];
                if (teamFP[t] === 0) {continue}
                let hits = 0;
                for (let r=0;r<teamFP[t];r++) {
                    let roll = randomInteger(6);
                    if (roll === 1 && t === 1) {
                        roll = randomInteger(6);
                    }
                    rolls.push(roll);
                    if (roll >= toHit) {hits += 1};
                }
                rolls.sort((a,b) => a-b);
                let tip = rolls.toString() + " vs. " + toHit + "+"
                tip = '[🎲](#" class="showtip" title="' + tip + ')';
                totalHits += hits;
                let weaponOut = weapons[t].toString();
                weaponOut = weaponOut.replace(/,/g," & ")
                if (hits === 0) {
                    outputCard.body.push(tip + " " + sTeam.name + " misses.");
                } else if (hits > 0) {
                    let s = (hits > 1) ? "s":"";
                    let s2 = (hits === 1) ? "s ":" ";
                    outputCard.body.push(tip + "[#ff0000] " + sTeam.name + " score" + s2 + hits + " hit" + s + " with " + weaponOut + "[/#]");
                } 
            }    
        }
    

        outputCard.body.push("Total Hits: " + totalHits);
        outputCard.body.push("[hr]");
        outputCard.body.push("[hr]");
        outputCard.body.push(targetTeam.nation + " Results");
        //distribute hits to teams, if odd # then extra goes on MG team if in open or Rifle Team if in cover
        let teamHits = Math.floor(totalHits/eligibleTargetTeams.length);
        let remainder = totalHits - (teamHits*eligibleTargetTeams.length);
        let crewedTeams = [];
        let regTeams = [];

        for (let i=0;i<eligibleTargetTeams.length;i++) {
            let tTeam = eligibleTargetTeams[i];
            tTeam.hits = teamHits;
            if (tTeam.crew === true) {
                crewedTeams.push(i)
            } else {
                regTeams.push(i)
            }

        }
        if (remainder > 0) {
            if (crewedTeams.length === 0 || regTeams.length === 0) {
                //only one type of team, distribute randomly
                for (let i=0;i<remainder;i++) {
                    let t = randomInteger(eligibleTargetTeams.length) - 1;
                    eligibleTargetTeams[t].hits += 1;
                }
            } else {
                if (initialCover > 0) {
                    //put remainder onto the reg team(s) if in cover
                    for (let i=0;i<remainder;i++) {
                        let t = randomInteger(regTeams.length) - 1;
                        eligibleTargetTeams[regTeams[t]].hits += 1;
                    }
                } else {
                    //place on MG Team(s) if in open
                    for (let i=0;i<remainder;i++) {
                        let t = randomInteger(crewedTeams.length) - 1;
                        eligibleTargetTeams[crewedTeams[t]].hits += 1;
                    }
                }
            }
        }
//log(crewedTeams)
//log(regTeams)
//log(initialCover)
log(eligibleTargetTeams)
log(eligibleTargetBaseIDs)

        //apply hits to each team, order bases based on cover level
        for (let i=0;i<eligibleTargetTeams.length;i++) {
            let tTeam = eligibleTargetTeams[i];
            let tTeamLeader = BaseArray[tTeam.bases[0]];
            let results = [0,0,0];
            let totalKills = 0;
            //sort based on cover
            let etbIDs = [[],[],[]];
            for (let j=0;j<tTeam.bases.length;j++) {
                let tBase = BaseArray[tTeam.bases[j]];
log("Base: " + tBase.id)
log("Cover: " + tBase.cover)
                if (eligibleTargetBaseIDs.includes(tTeam.bases[j]) === false) {continue}; //not an eligible target
                etbIDs[tBase.cover].push(tBase.id);
            }
log(etbIDs)
            let hits = tTeam.hits;
            if (hits === 0) {continue};
            let damageRolls = [];
            let casualtyIDs = [];

            for (let cC=0;cC < 3;cC ++) {
                do {
                    if (etbIDs[cC].length === 0) {continue};
                    let num = randomInteger(etbIDs[cC].length) - 1;
                    let tBase = BaseArray[etbIDs[cC][num]];
                    if (!tBase) {
                        etbIDs[cC].splice(num,1);
                        continue;
                    };
                    let roll = randomInteger(6);
                    damageRolls.push(roll);
                    let res = HitEffect[cC][roll]
                    results[res] += 1;
                    if (res === 1) {
                        tTeam.shock += 1;
                    } else if (res === 2) {
                        totalKills += 1;
                        if (tBase.special.includes("Crew") && etbIDs[cC].length > 1) {
log("In Sub Routine for Crewed Weapons")

                            //check if any other base in team is non-crewed and can take the casualty instead
                            let sub = false
                            for (let w=0;w<etbIDs[cC].length;w++) {
                                let subBase = BaseArray[etbIDs[cC][w]];
                                if (!subBase) {
                                    etbIDs[cC].splice(w,1); 
                                    continue;
                                }
                                if (subBase.special.includes("Crew") === true) {continue};
                                casualtyIDs.push(subBase.id);
                                subBase.casualty();
                                if (!subBase.token) {
                                    etbIDs[cC].splice(w,1); 
                                }
                                sub = true;
                                break;
                            }
                            if (sub === false) {
                                casualtyIDs.push(tBase.id);
                                tBase.casualty();
                            }
                        } else {
                            casualtyIDs.push(tBase.id);
                            tBase.casualty();
                        }
                        if (!tBase.token) {
                            etbIDs[cC].splice(num,1); 
                        }
                    }
                    hits -= 1;
                }
                while (hits > 0 && etbIDs[cC].length > 0);
            }

            //leader hits if any kills
            let leaderOut = false;
            if (totalKills > 0) {
                let num = Math.min(totalKills,6);
                let leaderBaseIDs = [];
                leaderBaseIDs.concat(tTeam.nco);
                leaderBaseIDs.concat(tTeam.nco);
                leaderBaseIDs = [...new Set(leaderBaseIDs)];
                let leaderNums = leaderBaseIDs.length;
                if (leaderNums > 0) {
                    let roll = randomInteger(6);
                    if (roll <= num) {
                        //leader hit
                        let tip = '[🎲](#" class="showtip" title="' + 'Leader Roll: ' + roll + ')';
                        let leaderNum = randomInteger(leaderNums) - 1;
                        let leaderID = leaderBaseIDs[leaderNum];
                        let leader = BaseArray[leaderID];
                        let roll2 = randomInteger(6);
                        if (roll2 === 1) {
                            //dead
                            leader.casualty();
                            leaderOut = tip + " " + leader.name + " is hit and Killed!";
                        } else if (roll2 === 2 || roll2 === 3) {
                            //wounded
                            leaderToken.set(sm.wound,true);
                            leaderOut = tip + " " + leader.name + " is hit and Wounded!<br>He can't be activated for the rest of this Turn.";
                        } else {
                            //lightly wounded
                            leaderToken.set(sm.lightWound,true);
                            leaderOut = tip + " " + leader.name + " is hit and Lightly Wounded!<br>His initiative is reduced by 1 for the rest of the Game";
                        }
                        //put back a casualty
                        let retBases = []
                        for (let c=0;c<casualtyIDs.length;c++) {
                            let cID = casualtyIDs[c];
                            let cBase = BaseArray[cBase];
                            if (!cBase) {continue};
                            let cToken = cBase.token;
                            if (!cToken) {continue};
                            retBases.push(cBase);
                        }
                        let n = randomInteger(retBases.length) - 1;
                        let retBase = retBases[n];
                        retBase.reverseCasualty();
                        results[2] -= 1;
                        //Bad THing rolls


                    }
                }
            }

            damageRolls.sort((a,b) => a-b);
            let tip = '[🎲](#" class="showtip" title="' + damageRolls.toString() + ')';
            let s = (tTeam.hits >1) ? "s":"";
            let out = tip + " " + tTeam.name + " takes " + tTeam.hits + " hit" + s;
            if (results[1] === 0 && results[2] === 0 && leaderOut === false)  {
                out += "<br>The Unit makes all its saves";
            } else {
                if (results[1] > 0) {
                    let s = (results[1] > 1) ? "s":"";
                    out += "<br>The Unit takes " + results[1] + " point" + s + " of shock"
                    if (results[2] > 0) {out += " and"}
                }
                if (results[2] > 0) {
                    if (results[1] === 0) {
                        out += "<br>The Unit";
                    }
                    let s = (results[2] > 1) ? "s":"";
                    out += " suffers " + results[2] + " kill" + s;
                }
                if (leaderOut !== false) {
                    out += "<br>" + leaderOut;
                }
            }

            outputCard.body.push(out);
            if (!tTeam) {
                outputCard.body.push("Team destroyed");
                //Bad Thing
            }

        }





        //run through and check shock/pinned etc for teams
        for (let i=0;i<eligibleTargetTeams.length;i++) {
            let tTeam = eligibleTargetTeams[i];
            if (!tTeam) {continue};
            UpdateShock(tTeam);
        }

        PrintCard();
    }

    



    const UnitActivation = (msg) => {
        //Teams and Squads
        let Tag = msg.content.split(";");
        let id = Tag[1];
        let size = Tag[2];
        let action = Tag[3];
        let moveAction = false;
        let errorMsg = "";
        if (action.includes("Move") || action.includes("At the")) {
            moveAction = true;
        }
        let base = BaseArray[id];
        let quality = base.quality;
        let team = TeamArray[base.teamID];
        let teams = [];
        teams.push(team);
        let teamLeader = BaseArray[team.bases[0]];
        let tlc = teamLeader.token.get("aura1_color");
        if (tlc === colours.black) {
            errorMsg = "Target has already been activated";
        } else if (tlc === colours.red) {
            errorMsg = "Target is Broken";
        } else if (tlc === colours.yellow && moveAction === true) {
            errorMsg = "Target is Pinned and Cannot Move";
        }
        let unit = UnitArray[base.unitID];
        let requires;
        if (teamLeader.token.get(sm.order) === true) {
            requires = "Using Leader's Order";
        } else {
            requires = "Needs a "; 
            if (size === "Team") {
                requires += DisplayDice(1,team.nation,16);
            } else {
                requires += DisplayDice(2,team.nation,16);
            }
        }
        SetupCard(action,requires,team.nation);
        if (size === "Squad") {
            //check if other team is in range and that it hasnt been activated
            let inRange = false;
            for (let i=0;i<unit.teams.length;i++) {
                let team2 = TeamArray[unit.teams[i]];
                if (team2.id === team.id || team2.scout === true || team2.leader === true) {continue};
                for (let j=0;j<team2.bases.length;j++) {
                    let base2 = BaseArray[team2.bases[j]];
                    if (j===0) {
                        let c = base2.token.get("aura1_color");
                        if (c === colours.black) {
                            errorMsg = "Other Team has already been activated";
                        } else if (c === colours.red) {
                            errorMsg = "Other Team is Broken";
                        } else if (c === colours.yellow && moveAction === true) {
                            errorMsg = "Other Team is Pinned and Cannot Move";
                        } 
                    }
                    if (InRange(base2,team,4) === true) {
                        inRange = true;
                        break;
                    }
                }
                if (inRange === false) {
                    errorMsg = "Cannot Activate as Squad as Teams not in Proximity";
                } else {
                    teams.push(team2);
                }
            }
        };

        if ((action === "Overwatch" || action === "Covering Fire") && teamLeader.token.get(sm.order) === false) {
            errorMsg = "Needs an Order to perform this action";
        }
        if (errorMsg !== "") {
            outputCard.body.push(errorMsg);
            PrintCard();
            return;
        }

        order = action + ";" + size;
        let weaponMoveMod = 0;

        if (size === "Team" && teamLeader.special.includes("Fire Team")) {
            //check if is a 3 man crew weapon eg MMG/HMG and has < 3 crew
            //2 men = -1 on each dice => weaponMoveMod = 1
            // 1 man = can only rotate - change action to "Rotate"

        }

        let moveDice = [];
        for (let i=0;i<3;i++) {
            moveDice.push(randomInteger(6));
        }
        teamLeader.token.set(sm.order,false);

        switch (action) {
            case 'Tactical Move':
                outputCard.body.push("Rolls: " + DisplayDice(moveDice[0],team.nation,14));
                break;
            case 'Move and Fire':
                outputCard.body.push("Rolls: " + DisplayDice(moveDice[0],team.nation,14));
                break;
            case 'Normal Move':
                outputCard.body.push("Rolls: " + DisplayDice(moveDice[0],team.nation,14) + " / " + DisplayDice(moveDice[1],team.nation,14));
                break;
            case 'At the Double':
                outputCard.body.push("Rolls: " + DisplayDice(moveDice[0],team.nation,14) + " / " + DisplayDice(moveDice[1],team.nation,14) + " / " + DisplayDice(moveDice[2],team.nation,14));
                break;
            case 'Deploy':
                let roll = randomInteger(6);
                let keys = Object.keys(UnitArray);
                let leaderOffboard = false;
                for (let i=0;i<keys.length;i++) {
                    let uni = UnitArray[keys[i]];
                    if (uni.player !== unit.player || uni.co === false) {continue};
                    let seniorTeam = TeamArray[uni.teams[0]];
                    if (!seniorTeam) {continue};
                    let seniorBase = BaseArray[seniorTeam.bases[0]];
                    if (hexMap[seniorBase.hexLabel].terrain.includes("Offboard")) {
                        leaderOffboard = true;
                    }
                }
                if (leaderOffboard === false) {
                    outputCard.body.push("No Senior Leader Offboard: " + DisplayDice(roll,team.nation,14));
                    if (roll < 4) {
                        outputCard.body.push(size + " failed to receive the Orders");
                        let nco = TeamArray[unit.nco];
                        if (nco) {
                            nco.token.set("aura1_color",colours.black);
                        }                        
                        PrintCard();
                        return;
                    }
                }
                let radius;
                if (quality === "Green") {radius = 4};
                if (quality === "Regular") {radius = 6};
                if (quality === "Elite") {radius = 9};

                outputCard.body.push("The " + size + " can deploy within " + radius + '"' + " of a Jump Off Point");
                outputCard.body.push("They may not move, but may fire at full effect");
                break;
            case 'Overwatch':
                PlaceMarker("overwatch",teamLeader);
                outputCard.body.push("Place Overwatch Marker and rotate to desired position, then Activate it");
                break;
            case 'Covering Fire':
                PlaceMarker("covering",teamLeader,size);
                outputCard.body.push("Place Covering Fire in desired area, then Activate it");
                break;
        }

        teams.forEach((indTeam) => {
            let move;
            let teamLeader = BaseArray[indTeam.bases[0]];
            indTeam.order = order;
            teamLeader.token.set("aura1_color",colours.black);
            let shock = indTeam.shock;
            switch (action) {
                case 'Stand and Fire':
                    outputCard.body.push("[#ff0000]" + indTeam.name + " fires at full effect[/#]");
                    break;
                case 'Tactical Move':
                    move = Math.max(0,moveDice[0] - shock) + '"';
                    outputCard.body.push("[#ff0000]" + indTeam.name + " can move " + move + "[/#]");
                    break;
                case 'Move and Fire':
                    move = Math.max(0,moveDice[0] - shock - weaponMoveMod) + '"';
                    outputCard.body.push("[#ff0000]" + indTeam.name + " can move " + move + "[/#]");
                    break;
                case 'Normal Move':
                    move = Math.max(0,moveDice[0] + moveDice[1] - shock  - (2*weaponMoveMod)) + '"';
                    move2 = Math.max(0,Math.max(moveDice[0],moveDice[1]) - shock) + '"';
                    move3 = Math.max(0,Math.min(moveDice[0],moveDice[1]) - shock) + '"';
                    if (teamLeader.type === "Gun") {
                        if (teamLeader.special.includes("Light")) {
                            outputCard.body.push("[#ff0000]" + indTeam.name + " can move " + move + "[/#]");   
                        } else if (teamLeader.special.includes("Medium")) {
                            outputCard.body.push("[#ff0000]" + indTeam.name + " can move " + move2 + "[/#]");
                        } else if (teamLeader.special.includes("Heavy")) {
                            outputCard.body.push("[#ff0000]" + indTeam.name + " can move " + move3 + "[/#]");
                        }
                        outputCard.body.push("The Team may not cross Obstacles");
                    } else {
                        outputCard.body.push("[#ff0000]" + indTeam.name  + " can move " + move + "[/#]");
                        outputCard.body.push('Low Obstacle/Building: ' + move2);
                        outputCard.body.push('High Obstacle: ' + move3);
                    }
                    break;
                case 'At the Double':
                    move = Math.max(0,moveDice[0] + moveDice[1] + moveDice[2] - shock  - (3*weaponMoveMod)) + '"'; 
                    outputCard.body.push("[#ff0000]" + indTeam.name + " can move " + move + "[/#]");
                    indTeam.shock += 1;
                    break;
            }
            UpdateShock(indTeam);
        });
        switch (action) {
            case "Rotate":
                outputCard.body.push("Team can only rotate the Weapon");
                break;
            case 'Tactical Move':
                outputCard.body.push("Teams take cover while doing so");
                outputCard.body.push('-1" for Heavy Going');
                outputCard.body.push("No Crossing Obstacles");
                break;
            case 'Move and Fire':
                outputCard.body.push("Teams can fire before or after moving, at 1/2 effect");
                outputCard.body.push('-1" for Heavy Going');
                outputCard.body.push("No Crossing Obstacles"); 
                break;
            case 'Normal Move':
                outputCard.body.push('-2" for Heavy Going');
                break;
            case 'At the Double':
                outputCard.body.push("Cannot Move in Broken or Heavy Ground");
                outputCard.body.push("Teams takes 1 point of Shock each");
                break;
        }


        let ncoIDs = [];
        for (let i=0;i<teams.length;i++) {
            let team = teams[i];
            for (let j=0;j<team.nco.length;j++) {
                let ncoID = team.nco[j];
                let ncoBase = BaseArray[ncoID];
                if (ncoIDs.includes(ncoID) === false) {
                    ncoBase.token.set("aura1_color",colours.black);
                    outputCard.body.push("[#ff0000]" + ncoBase.name + " accompanies the Squad but may not use his Command Initiative this Phase[/#]");
                    ncoBase.token.set(sm.tactical,false);
                    ncoBase.token.set(sm.overwatch,false);
                    if (action === "Tactical Move") {
                        ncoBase.token.set(sm.tactical,true);
                    }
                    ncoIDs.push(ncoID); //in case attached to multiple teams
                }
            }
            for (let j=0;j<team.co.length;j++) {
                let coID = team.co[j];
                let coBase = BaseArray[coID];
                if (coIDs.includes(coID) === false) {
                    coBase.token.set("aura1_color",colours.black);
                    outputCard.body.push("[#ff0000]" + coBase.name + " accompanies the Squad but may not use his Command Initiative this Phase[/#]");
                    coBase.token.set(sm.tactical,false);
                    coBase.token.set(sm.overwatch,false);
                    if (action === "Tactical Move") {
                        coBase.token.set(sm.tactical,true);
                    }
                    coIDs.push(coID); //in case attached to multiple teams
                }
            }
        }
        PrintCard();
    }

    const InRange = (base,team,range) => {
        let inRange = false;
        for (let i=0;i<team.bases.length;i++) {
            let base2 = BaseArray[team.bases[i]];
            let dist = base.hex.distance(base2.hex);
            if (dist <= range) {
                inRange = true;
                break;
            }
        }
        return inRange;
    }

    const Men = (team) => {
        let men = 0;
        for (let i=0;i<team.bases.length;i++) {
            let base = BaseArray[team.bases[i]];
            men += parseInt(base.token.get("bar1_value"));
        }
        return men;
    }

    const PlaceMarker = (type,base,size) => {
        let img,w,h;
        if (type === "overwatch")  {
            img = getCleanImgSrc("https://s3.amazonaws.com/files.d20.io/images/350758041/b68-lK7VEeV5kUXd8OgekA/thumb.png?1689607404");
            w = 140;
            h = 70;
        } else if (type === "covering") {
            img = getCleanImgSrc("https://s3.amazonaws.com/files.d20.io/images/350758027/C1hQ7gQRBQpTshndyQ-XCw/thumb.png?1689607395");
            w = 280;
            if (size === "Squad") {
                w = 600;
            }
            h = 140;
        }
        let represents = Nations[base.nation][type];
        let location = hexMap[base.hexLabel].centre;
        let newToken = createObj("graphic", {   
            left: location.x,
            top: location.y,
            width: w, 
            height: h,  
            name: type,
            represents: represents,
            pageid: Campaign().get("playerpageid"),
            imgsrc: img,
            layer: "objects",
        });
        toFront(newToken);
        let character = getObj("character", newToken.get("represents"));  
        let marker = new Base(newToken,character);
        state.CoC.markers[newToken.id] = base.teamID;
    }

    const FinalizeMarker = (msg) => {
        let Tag = msg.content.split(";");
        let markerID = Tag[1];
        let marker = BaseArray[markerID];
        let teamID = state.CoC.markers[markerID];
        let team = TeamArray[teamID];
        //Covering should be in LOS of one of team, move it to map layer
        if (marker.name === "overwatch") {
            SetupCard("Overwatch","",team.nation);
            let rotation = Angle(marker.token.get("rotation"));
            let hex = BaseArray[team.bases[0]].hex;
            let pos = Math.floor(rotation/60);
            pos = Math.max(0,Math.min(pos,6));
            let dirs = ["Northeast","East","Southeast","Southwest","West","Northwest"];
            hex = hex.neighbour(dirs[pos]);          
            let location = hexMap[hex.label()].centre;

            marker.token.set({
                left: location.x,
                top: location.y,
                layer: "map",
            });
            for (let i=0;i<team.bases.length;i++) {
                let base = BaseArray[team.bases[i]];
                base.token.set("rotation",rotation);   



            }
            outputCard.body.push(team.name + " set on Overwatch");
        } else if (marker.name === "covering") {
            SetupCard("Covering Fire","",team.nation);
            let losCheck = false;
            for (let i=0;i<team.bases.length;i++) {
                let los = LOS(team.bases[i],markerID);
                if (los.los === true) {
                    losCheck = true;
                    break;
                }
            }
            if (losCheck === false) {
                outputCard.body.push("Team doesn't have LOS to the area selected");
                PrintCard();
                return;
            }
            marker.token.set("layer","map");
            outputCard.body.push(team.name + " lays down Covering Fire");
        }
        PrintCard();
    }

    const LeaderJoin = (msg) => {
        let Tag = msg.content.split(";");
        let leaderID = Tag[1];
        let targetID = Tag[2];
        let leader = BaseArray[leaderID];
        let leaderTeam = TeamArray[leader.teamID];
        let target = BaseArray[targetID];
        let targetTeam = TeamArray[target.teamID];

        SetupCard(leader.name,"Join",leader.nation);
        if (InRange(leader,targetTeam,4) === false) {
            outputCard.body.push('Must be within 4"');
            PrintCard();
            return;
        }
        if (leader.rank === 1 || leader.rank === 2) {
            if (leader.soloNCO === false) {
                outputCard.body.push("No Need");
                PrintCard();
                return;
            } else {
                //add him to selected Team
                //check if that team has lost its NCO
                //if not, then joins as another man
                let targetUnit = UnitArray[targetTeam.unitID];
                if (targetUnit.nco === "") {
                    outputCard.body.push(leader.name + " takes command of " + targetUnit.name);
                    targetUnit.nco = leaderID;
                    let originalGMN = leader.token.get("gmnotes").split(";");
                    let gmnotes = target.token.get("gmnotes").split(";");
                    //change unit
                    originalGMN[2] = gmnotes[2];
                    originalGMN[3] = gmnotes[3];
                    originalGMN[4] = gmnotes[4];
                    gmnotes = originalGMN[0] + ";" + originalGMN[1] + ";" + originalGMN[2] + ";" + originalGMN[3] + ";" + originalGMN[4];
                    leader.token.set("gmnotes",gmnotes);
                    targetUnit.add(leaderTeam);
                } else {
                    outputCard.body.push(leader.name + " joins the Team as another man...");
                    targetTeam.add(leader);
                    leader.token.set("gmnotes",target.token.get("gmnotes"));
                    leaderTeam.remove(leader);
                    leader.token.set("aura1_color","transparent");
                }
                leaderTeam.unitID = targetUnit.id;
                leader.unitID = targetUnit.id;
                leader.soloNCO = false;
            }
        } else {
            let targetTeam = TeamArray[target.teamID];
            let targetUnit = UnitArray[targetTeam.unitID];
            if (targetTeam.co.includes(leaderID) === false) {
                targetTeam.co.push(leaderID);
            }
            if (leader.leaderTeamIDs.includes(targetTeam.id) === false) {
                leader.leaderTeamIDs.push(targetTeam.id);
            }
            //now check if in range of another team in section/squad
            for (let i=0;i<targetUnit.teams.length;i++) {
                let team2 = targetUnit.teams[i];
                if (team2.id === targetTeam.id) {continue};
                if ((leader.leaderTeamIDs.includes(team2.id) === false || team2.co.includes(leader.id) === false) && InRange(leader,team2,4) === true) {
                    if (team2.co.includes(leader.id) === false) {
                        team2.co.push(leader.id);
                    }
                    if (leader.leaderTeamIDs.includes(team2.id) === false) {
                        leader.leaderTeamIDs.push(team2.id);
                    }
                }
            }
            outputCard.body("Leader joins the Selected Team");
        }
        PrintCard();
    }









    const LeaderSelf = (msg) => {
        //!LeaderSelf;@{selected|token_id};?{Tactical Move|Normal Move|At the Double|Deploy};
        let Tag = msg.content.split(";");
        let leaderID = Tag[1];
        let choice = Tag[2];
        let leader = BaseArray[leaderID];
        SetupCard(leader.name,choice,leader.nation);
        if (leader.command >= leader.initiative) {
            outputCard.body.push(leader.name + " has used all his Command Initiatives for this Phase");
            PrintCard();
            return;
        }
        if (choice !== "Deploy") {
            leader.command += 1;
            outputCard.body.push("1 Command Initiative Used");
        }

        let moveDice = [];
        for (let i=0;i<3;i++) {
            moveDice.push(randomInteger(6));
        }
        switch (choice) {
            case 'Tactical Move':
                outputCard.body.push("Rolls: " + DisplayDice(moveDice[0],leader.nation,14));
                outputCard.body.push(leader.name + " can move " + moveDice[0] + '"');
                outputCard.body.push('-1" for Heavy Going');
                outputCard.body.push("No Crossing Obstacles");
                break;
            case 'Normal Move':
                outputCard.body.push("Rolls: " + DisplayDice(moveDice[0],leader.nation,14) + " / " + DisplayDice(moveDice[1],leader.nation,14));
                outputCard.body.push(leader.name + " can move " + move);
                outputCard.body.push('Low Obstacle/Building: ' + move2);
                outputCard.body.push('High Obstacle: ' + move3);
                outputCard.body.push('-2" for Heavy Going');
                break;
            case 'At the Double':
                outputCard.body.push("Rolls: " + DisplayDice(moveDice[0],leader.nation,14) + " / " + DisplayDice(moveDice[1],leader.nation,14) + " / " + DisplayDice(moveDice[2],leader.nation,14));
                outputCard.body.push(leader.name + " can move " + moveDice[0] + moveDice[1] + moveDice[1] + '"');
                outputCard.body.push("Cannot Move in Broken or Heavy Ground");
                break;
            case 'Deploy':
                let roll = randomInteger(6);
                let keys = Object.keys(UnitArray);
                if (leaderTeam.rank < 3 ) {
                    let leaderOffboard = false;
///*****
                    for (let i=0;i<keys.length;i++) {
                        let uni = UnitArray[keys[i]];
                        if (uni.player !== unit.player || !uni.senior) {continue};
                        let seniorTeam = TeamArray[uni.senior];
                        if (!seniorTeam) {continue};
                        if (hexMap[seniorTeam.hexLabel].terrain.includes("Offboard")) {
                            leaderOffboard = true;
                        }
                    }
                    if (leaderOffboard === false) {
                        outputCard.body.push("No Senior Leader Offboard: " + DisplayDice(roll,team.nation,14));
                        if (roll < 4) {
                            outputCard.body.push(leaderTeam.name + " failed to receive the Orders");
                            leaderTeam.token.set("aura1_color",colours.black);
                            PrintCard();
                            return;
                        }
                    }
                }
                let radius;
                if (quality === "Green") {radius = 4};
                if (quality === "Regular") {radius = 6};
                if (quality === "Elite") {radius = 9};

                outputCard.body.push(leader.name + " can deploy within " + radius + '"' + " of a Jump Off Point");
                outputCard.body.push("He may not move, but may issue Orders");
                break;
        }




    }


    const Order = (msg) => {
        //!Order;@{selected|token_id};?{Order|Activate|Overwatch|Covering Fire|Rally|Throw/Fire Grenade|Smoke Grenades|Fire Squad AT Weapon|Transfer Man to Team};@{target|token_id}
        let Tag = msg.content.split(";");
        let leaderID = Tag[1];
        let order = Tag[2];
        let targetID = Tag[3];
        let leader = BaseArray[leaderID];
        SetupCard(leader.name,order,leader.nation);
        let errorMsg = "";
        if (leader.command >= leader.initiative) {
            errorMsg = "Unable to give any more orders this Phase";
        }
        let target = BaseArray[targetID];
        let targetTeam = TeamArray[target.teamID];
        let targetUnit = UnitArray[targetTeam.unitID];
        if (targetUnit.teams.length < 2 && (order === "Transfer Man to Team" || order === "Detach Team")) {
            errorMsg = "Only the one Team";
        }
        inCommandRange = false;
        withTeam = (targetTeam.nco === leaderID || targetTeam.co === leaderID) ? true:false;
        for (let i=0;i<targetTeam.bases.length;i++) {
            let t2 = BaseArray[targetTeam.bases[i]]
            let dist = leader.hex.distance(t2.hex);
            if (dist <= (3 * leader.initiative)) {
                inCommandRange = true;
                break;
            }
        }
        if (inCommandRange === false) {
            errorMsg = "Target is too far to Command/Rally";
        }

        //change target to be the first base of team
        targetLeaderID = targetTeam.bases[0];
        targetLeader = BaseArray[targetLeaderID];

        if (order === "Rally" && withTeam === false && inCommandRange === true) {
            //check if enemy in LOS
            for (let i=0;i<targetTeam.bases.length;i++) {
                if (errorMsg !== "") {continue};
                let friendlyTeam = targetTeam.bases[i];
                let keys = Object.keys(BaseArray);
                for (let j=0;j<keys.length;j++) {
                    let enemyTeam = BaseArray[keys[j]];
                    if (enemyTeam.player === leaderTeam.player) {continue};
                    let losResult = LOS(friendlyTeam.id,enemyTeam.id);
                    if (losResult.los === true) {
                        errorMsg = "Can't Rally due to Enemy in LOS";
                        break;
                    }
                }
            }
        }
        if (targetTeam.pinned === true && (order === "Covering Fire" || order === "Throw/Fire Grenade" || order === "Fire Squad AT Weapon" )) {
            errorMsg = "Pinned Unit cannot follow that order";
        }
        if (targetLeader.token.get("aura1_color") === colours.black && (order === "Activate" || order === "Overwatch" || order === "Covering Fire")) {
            errorMsg = "Target has already been activated";
        }
        if (target.broken() === true && order !== "Rally") {
            errorMsg = "Target is Broken";
        }
        if (order.includes("Grenade") || order.includes("AT Weapon")) {
            if (targetTeam.order === "Overwatch" || targetTeam.order === "Tactical") {
                errorMsg = "Teams on Overwatch or Tactical can't throw Grenades or fire Section AT Weapons";
            }
        }

        if (errorMsg !== "") {
            outputCard.body.push(errorMsg);
        } else {
            leader.command += 1;
            if (order === "Rally") {
                outputCard.body.push("1 point of Shock rallied");
                targetTeam.shock -= 1;
                UpdateShock(targetTeam);
            } else if (order === "Transfer Man to Team") {
                let donatingTeam,donatingBase;
                for (let t=0;t<targetUnit.teams.length;t++) {
                    let tid = targetUnit.teams[t];
                    if (tid === target.teamID) {continue};
                    if (TeamArray[tid].leader === true) {continue};
                    donatingTeam = TeamArray[tid];
                }
                if (!donatingTeam) {
                    outputCard.body.push("Error with other team");
                    PrintCard();
                    return;
                }
                let lastBaseNum = donatingTeam.bases.length - 1;
                donatingBase = BaseArray[donatingTeam.bases[lastBaseNum]];              

                let tH = parseInt(target.token.get("bar1_value")) + 1;
                let tsides = target.token.get("sides").split("|");
                let currentSideMax = tsides.length;

                if (tH > currentSideMax) {
                    outputCard.body.push("Target is at Max # of Men");
                    PrintCard();
                    return;
                } else {
                    outputCard.body.push("Man Transferred");
                }
                let tside = tH - 1;
                let timg = tokenImage(tsides[tside]);
                target.token.set({
                    bar1_value: tH,
                    currentSide: tside, //zero indexed
                    imgsrc: timg,
                })
                let dbH = parseInt(donatingBase.token.get("bar1_value")) - 1;
                if (dbH === 0) {
                    donatingBase.remove();
                } else {
                    let dsides = donatingBase.token.get("sides").split("|");
                    let dside = dbH - 1;
                    let dimg = tokenImage(dsides[dside]);
                    donatingBase.token.set({
                        bar1_value: dbH,
                        currentSide: dside, //zero indexed
                        imgsrc: dimg,
                    });
                }
            } else if (order === "Detach Team") {
                //detach target to be a new scout team
                let newTeam = new Team("Scouts",target.player,target.nation,targetUnit.id);
                newTeam.add(target);   
                newTeam.scout = true;
                newTeam.parentTeamID = targetTeam.id;
                target.teamID = newTeam.id;
                let gmnotes = target.token.get("gmnotes").split(";");
                gmnotes[0] = "Scouts";
                gmnotes[1] = newTeam.id;
                gmnotes = gmnotes[0] + ";" + gmnotes[1] + ";" + gmnotes[2] + ";" + gmnotes[3] + ";" + gmnotes[4] + ";" + targetTeam.id;
                target.token.set("gmnotes",gmnotes);
                targetTeam.remove(target);
                targetUnit.add(newTeam);
                let colour = BaseArray[targetTeam.bases[0]].token.get("aura1_color");
                target.token.set("aura1_color",colour);
                outputCard.body.push("Scout Team Created and can operate independently");
            } else {
                outputCard.body.push("Unit can execute the " + order + " Order");
                //place status marker on team leader so that can use order
                targetLeader.token.set(sm.order,true);
            }
        }
        PrintCard();
    }








    const UpdateShock = (team) => {
        //updates graphic display of shock and checks for pin, broken status
        let tok = BaseArray[team.bases[0]].token;
        let shock = team.shock;
        let men = Men(team);
        tok.set("bar3_value",shock);
log(team.name)
log("Shock: " + shock)

        for (let i=0;i<team.bases.length;i++) {
            let base = BaseArray[team.bases[i]];
            let id = base.shockTokenID;
            let stok = findObjs({_type:"graphic", id: id})[0];
            if (stok) {stok.remove()};
        }
        if (shock > 0) {
            let st = Math.ceil(shock/6);
            for (let i=0;i<st;i++) {
                let b = BaseArray[team.bases[i]];
                let loc = hexMap[b.hexLabel].centre;
                let s = Math.min(shock - (i*6),6);
                let imgArray = ["https://s3.amazonaws.com/files.d20.io/images/352467816/n5_MSiM1fRvX5lmdkUAxXA/thumb.png?1690646201","https://s3.amazonaws.com/files.d20.io/images/352467815/jVKFc9Xh-OwQUL4q4dZEtQ/thumb.png?1690646201","https://s3.amazonaws.com/files.d20.io/images/352467814/9JRm06E6hxxb-BhogSHsHw/thumb.png?1690646201","https://s3.amazonaws.com/files.d20.io/images/352467817/3sUCWzGb4hXP-V79haeZjw/thumb.png?1690646201","https://s3.amazonaws.com/files.d20.io/images/352468536/v3SyXot8060lvgZ2txUDeQ/thumb.png?1690646525","https://s3.amazonaws.com/files.d20.io/images/352468537/XMyzGS-o8RLIHZG9evK_gg/thumb.png?1690646525"];
                let img = getCleanImgSrc(imgArray[s-1]);
                let newToken = createObj("graphic", {
                    left: loc.x,
                    top: loc.y,
                    width: 70,
                    height: 70,
                    imgsrc: img,
                    pageid: Campaign().get("playerpageid"),
                    layer: "gmlayer",
                    gmnotes: b.id,
                });
                toFront(newToken);
                b.shockTokenID = newToken.id;
            }
            //see if assoc team nearby to share shock
            let unit = UnitArray[team.unitID];
            for (let i=0;i<unit.teams.length;i++) {
                let team2 = TeamArray[unit.teams[i]];
                if (team2.id === team.id) {continue};
                if (team2.leader === true) {
                    let leaderToken = BaseArray[team2.bases[0]].token;
                    if (leaderToken.get(sm.wounded) === false) {
                        men += 1;
                    }
                } else {
                    for (let j=0;j<team2.bases.length;j++) {
                        let base2 = BaseArray[team2.bases[j]];
                        if (InRange(base2,team,4) === true) {
                            men += Men(team2);
                            break;
                        } 
                    }
                }
            }
log("Men: " + men)
            //check Pinned 
            if (shock > men) {
                BaseArray[team.bases[0]].token.set("aura1_color",colours.red);
                if (team.pinned === false) {
                    outputCard.body.push(team.name + " is Pinned!");
                    //more info
                    team.pinned = true;
                }
            }
            //Check Broken 
            if (shock >= (men*2)) {
                BaseArray[team.bases[0]].token.set("aura1_color",colours.yellow);
                if (team.broken === false) {
                    outputCard.body.push(team.name + " Breaks!");
                    //more info
                    team.broken = true;
                }
            }
        }
    }





    const Lockdown = (msg) => {
        let id = msg.selected[0]._id;
        if (!id) {return};
        let patrol1 = PatrolArray[id];
        let keys = Object.keys(PatrolArray);
        let lockdown = false;
        for (let i=0;i<keys.length;i++) {
            if (keys[i] == id) {continue};
            let patrol2 = PatrolArray[keys[i]];
            if (patrol2.player === patrol1.player) {continue};
            let dist = patrol1.hex.distance(patrol2.hex);
            if (dist <= 12) {
                lockdown = true;
                patrol2.locked = true;
                patrol2.token.set("aura1_color",colours.black);
            }
        }
        SetupCard("Patrol Phase","Lockdown",patrol1.nation);
        if (lockdown === true) {
            outputCard.body.push("Patrols Locked Down");
            patrol1.locked = true;
            patrol1.token.set("aura1_color",colours.black);
            plock = [true,true];
            for (let i=0;i<keys.length;i++) {
                let patrol2 = PatrolArray[keys[i]];
                if (patrol2.locked === false) {
                    plock[patrol2.player] = false;
                }
            }
            if (plock[0] === true || plock[1] === true) {
                outputCard.body.push("All Tokens of One Player now Locked");
                outputCard.body.push("Proceed to Set Jump Off Points");
//might be able to proceed directly to this
            }
        } else {
            outputCard.body.push('No Enemy Patrols in 12"');
        }
        PrintCard();
    }

    const SetJumpOff = () => {
        RemoveLines("JO");
        let lineIDArray = [];
        let keys = Object.keys(PatrolArray);
        for (let i=0;i<keys.length;i++) {
            //for each patrol marker, find closest 2 enemy patrol markers
            let closest = [{id: "",dist: 1000},{id: "",dist: 1000}];
            let id1 = keys[i];
            let patrol1 = PatrolArray[id1];
            for (let j=0;j<keys.length;j++) {
                let id2 = keys[j];
                let patrol2 = PatrolArray[id2];
                if (patrol1.nation === patrol2.nation) {continue};
                let dist = patrol1.hex.distance(patrol2.hex);
                if (dist < closest[0].dist) {
                    if (closest[0].dist < closest[1].dist) {
                        closest[1].id = closest[0].id;
                        closest[1].dist = closest[0].dist;
                    }
                    closest[0].id = patrol2.id;
                    closest[0].dist = dist;
                    continue;
                }
                if (dist < closest[1].dist) {
                    closest[1].id = patrol2.id;
                    closest[1].dist = dist;
                }
            }
log(closest)
            //now draw lines to each of closest and past it
            for (let j=0;j<2;j++) {
                lineID = DrawLine(closest[j].id,id1,4,"objects","JumpOff");
                lineIDArray.push(lineID);
            }
        }
        state.CoC.JOLines = lineIDArray;
        SetupCard("Jump Off Points","","Neutral");
        outputCard.body.push("Take Turns Placing Jump Off Points");
        outputCard.body.push("Click button when done placing all");
        ButtonInfo("Start Game","!StartGame");
        PrintCard();
    }

    const DrawLine = (id1,id2,colour,layer,special) => {
        let ColourCodes = ["#00ff00","#ffff00","#ff0000","#00ffff","#000000"];
        colour = ColourCodes[colour];
        let x1,x2,y1,y2,left,top,right,bottom,width,height;
        if (special === "JumpOff") {
            log(PatrolArray[id1].nation);
            colour = Nations[PatrolArray[id1].nation].borderColour;
            x1 = hexMap[PatrolArray[id1].hexLabel].centre.x;
            x2 = hexMap[PatrolArray[id2].hexLabel].centre.x;
            y1 = hexMap[PatrolArray[id1].hexLabel].centre.y;
            y2 = hexMap[PatrolArray[id2].hexLabel].centre.y;
            left = 0;
            right = pageInfo.width;
            top = 0;
            bottom = pageInfo.height;
            let dx, dy, py, vx, vy;
            vx = x2 - x1;
            vy = y2 - y1;
            dx = vx < 0 ? left : right;
            dy = py = vy < 0 ? top : bottom;
            if (vx === 0) {
                dx = x1;
            } else if (vy === 0){
                dy = y1;
            } else {
                dy = y1 + (vy / vx) * (dx - x1);
                if (dy < top || dy > bottom) {
                    dx = x1 + (vx / vy) * (py - y1);
                    dy = py;
                }
            }
            x2 = dx;
            y2 = dy;
        } else {
            x1 = hexMap[BaseArray[id1].hexLabel].centre.x;
            x2 = hexMap[BaseArray[id2].hexLabel].centre.x;
            y1 = hexMap[BaseArray[id1].hexLabel].centre.y;
            y2 = hexMap[BaseArray[id2].hexLabel].centre.y;
        }

        width = (x1 - x2);
        height = (y1 - y2);
        left = width/2;
        top = height/2;

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
        toFront(newLine);
        let id = newLine.id;
        return id;
    }

    const RemoveLines = (type) => {
        let lineIDArray;
        if (type === "JO") {
            lineIDArray = state.CoC.JOLines;
            state.CoC.JOLines = []; 
        } else {
            lineIDArray = state.CoC.LOSLines;
            state.CoC.LOSLines = []; 
        }
        if (!lineIDArray) {
            state.CoC.LOSLines = [];
            state.CoC.LOSLines = []; 
            return;
        }
        for (let i=0;i<lineIDArray.length;i++) {
            let id = lineIDArray[i];
            let path = findObjs({_type: "path", id: id})[0];
            if (path) {
                path.remove();
            }
        }
    }

    const StartGame = () => {
        RemoveLines("JO");
        let keys = Object.keys(PatrolArray);
        for (let i=0;i<keys.length;i++) {
            let patrol = PatrolArray[keys[i]];
            patrol.token.remove();
        }
        PatrolArray = {};
        keys = Object.keys(JumpOffArray);
        for (let i=0;i<keys.length;i++) {
            let jop = JumpOffArray[keys[i]];
            jop.token.set("layer","map");
        }



    }

    const ResetActivations = () => {
        //use this to reset any units/teams activated in prior phase
        //exclude any leaders 'down'



    }


    const CommandDice = (msg) => {
        for (let i=0;i<cDiceArray.length;i++) {
            let obj = cDiceArray[i];
            obj.remove();
        }
        ResetActivations();
        let playerID = msg.playerid;
        let nation = state.CoC.players[playerID]; //set in initial Rolld6
        let player = (Allies.includes(nation)) ? 0:1;
        if (!nation) {nation = "Neutral"};
        SetupCard("New Phase","",nation);
        let number = state.CoC.commandDice[player];
        let rolls = [];
        let fives = 0;
        let sixes = 0;
        let command = [];
        for (let i=0;i<number;i++) {
            let roll = randomInteger(6);
            rolls.push(roll);
            if (roll === 5) {
                fives += 1
            } else if (roll === 6) {
                sixes += 1
            } else {
                command.push(roll);
            }
        }
        rolls.sort();
        command.sort();
        let line = "";
        let flip = false;
        if (rolls[0] > 4) {flip = true};
        for (let i=0;i<rolls.length;i++) {
            if (i > 0 && rolls[i] > 4 && flip === false) {
                line += "| ";
                flip = true;
            }
            line += DisplayDice(rolls[i],nation,30) + " ";
        }
        outputCard.body.push(line);
        if (fives > 0 || sixes > 1) {
            outputCard.body.push("[hr]");
        }
        if (fives > 0) {
            outputCard.body.push(fives + " Added to Chain of Command");
            state.CoC.CoCPoints[player] += fives;
            outputCard.body.push("Total: " + state.CoC.CoCPoints[player]);
        }
        if (sixes > 1) {
            outputCard.body.push(nation + " Retains Initiative for next Phase");
        }
        if (sixes > 2) {
            outputCard.body.push("This is also the final Phase of the Turn");
        }
        if (sixes > 3) {
            outputCard.body.push("Player gains a complete Chain of Command Dice");
            state.CoC.CoCPoints[player] += 6;
            let ran = randomInteger(6);
            outputCard.body.push("A Random Event Occurs")
            if (ran === 1) {
                outputCard.body.push("Random Mortar Barrage");
                outputCard.body.push("Consult Book");
            } else if (ran === 2) {
                outputCard.body.push("Jabos! Aircraft overhead, hit the dirt!");
                outputCard.body.push("Nobody knows whose planes they are but movement is halted for this Phase and the next. Other activity continues as normal.");
            } else if (ran === 3) {
                outputCard.body.push("Fire! A building catches fire. Consult Book");
            } else if (ran === 4) {
                outputCard.body.push("A true patriot (or vile collaborator has informed you where one of your opponent’s Units is lurking. Your opponent must place one of his as yet un‐deployed Units on the table immediately. He may choose which Jump‐Off Point they deploy to.");
            } else if (ran === 5) {
                outputCard.body.push("It has begun to rain very heavily. Visibility is reduced to 18” for the remainder of this Turn. At the end of the Turn roll a D6 and consult Book");
            } else if (ran === 6) {
                outputCard.body.push("Your men have discovered a cache of fine wine buried by its rightful owner and intended to be dug up at the end of the war. Sadly for him, it won’t be there when he returns. Fortunately for you, your Force Morale increases by one point. Bottoms Up!");
                state.CoC.forceMorale[player] += 1;
            }
        }
        UpdateDisplay(player); //updates CoC Points, Force Morale
        let pos = DeepCopy(InfoPoints[player][3]);
        pos.y += 66.9658278242677;
        pos.x -= (Math.floor(command.length - 1)/2) * 75.1985619844599;
        sendPing(pos.x,pos.y, Campaign().get('playerpageid'), null, true); 
        for (let i=0;i<command.length;i++) {
            let roll = command[i];
            roll = roll.toString();
            let tablename = Nations[nation].dice;
            let table = findObjs({type:'rollabletable', name: tablename})[0];
            let obj = findObjs({type:'tableitem', _rollabletableid: table.id, name: roll })[0];
            let imageURL = getCleanImgSrc(obj.get('avatar'));
            let diceObj = createObj("graphic", {
                left: pos.x,
                top: pos.y,
                width: 70,
                height: 70,
                isdrawing: true,
                pageid: Campaign().get("playerpageid"),
                imgsrc: imageURL,
                layer: "objects",
            });
            toFront(diceObj);
            pos.x += 75.1985619844599;
            cDiceArray.push(diceObj);
        }
        PrintCard();
    }
               
	const UpdateDisplay = (player) => {
        for (let o=0;o<3;o++) {
            let id = state.CoC.playerInfo[player][o];
            let obj = findObjs({type: 'text',id: id})[0];
            let text = "";
            if (obj) {
                if (o===0) {text = state.CoC.nations[player]};
                if (o===1) {text = "Force Morale: " + state.CoC.forceMorale[player]};
                if (o===2) {text = "Chain of Command Points: " + state.CoC.CoCPoints[player]};
                obj.set("text",text);
                obj.set("color",Nations[state.CoC.nations[player]].borderColour);
            }
        }		
	}

    const RollD6 = (msg) => {
        let Tag = msg.content.split(";");
        PlaySound("Dice");
        let roll = randomInteger(6);
        if (Tag.length === 1) {
            let playerID = msg.playerid;
log("PlayerID: " + playerID)
            if (!state.CoC.players[playerID] || state.CoC.players[playerID] === undefined) {
                if (msg.selected) {
                    let id = msg.selected[0]._id;
log("ID: " + id)
                    if (id) {
                        let base = BaseArray[id];
                        if (!base) {
                            let tok = findObjs({_type:"graphic", id: id})[0];
                            let character = getObj("character", tok.get("represents"));    
                            base = new Base(tok,character);
                        }
                        if (base) {
                            let nation = base.nation;
                            state.CoC.players[playerID] = nation;
                        }
                    }
                }
            }
            let nation = state.CoC.players[playerID];
            if (!nation) {nation = "Neutral"};
            let res = "/direct " + DisplayDice(roll,nation,40);
            sendChat("player|" + playerID,res);
        } else {
            let type = Tag[1];
            //type being used for times where fed back by another function
        }
    }

    const UnitCreation = (msg) => {
        
//if ids already exist, need to amend unit array and team array and reuse platoon marker possibly
        let Tag = msg.content.split(";");
        let unitName = Tag[1];
        let unitComp = Tag[2]; //Squad, Team, Sr Leader
        let core = Tag[3];
        let tokenIDs = [];
        for (let i=0;i<msg.selected.length;i++) {
            tokenIDs.push(msg.selected[i]._id);
        }
        if (tokenIDs.length === 0) {return};
        let refToken = findObjs({_type:"graphic", id: tokenIDs[0]})[0];
        let refChar = getObj("character", refToken.get("represents")); 
        let nation = Attribute(refChar,"nation");
        let player = (Allies.includes(nation)) ? 0:1;
        let unitID = stringGen();
        let unit = new Unit(unitName,player,nation,unitID,core);
        let statusNum = parseInt(state.CoC.unitnumbers[player]);
        statusNum += 1;
        state.CoC.unitnumbers[player] = statusNum;
        let statusmarkers = Nations[nation].platoonmarkers[statusNum];
        if (unitComp.includes("Leader")) {
            //senior leader, who is single token/unit/team
            let base = BaseArray[tokenIDs[0]];
            let name = OfficerName(base);
            base.name = name;
            let teamID = stringGen();
            let team = new Team(name,player,nation,unitID,teamID);
            team.leader = true;
            unitName = name;
            unit.core = true;
            unit.add(team);
            let gmn = teamName + ";" + teamID + ";" +  unitName + ";" + unit.id + ";" + core;
            base.token.set({
                name: name,
                tint_color: "transparent",
                aura1_color: colours.green,
                aura1_radius: 0.1,
                showplayers_bar1: true,
                showname: true,
                showplayers_aura1: true,
                bar1_value: team.initiative,
                showplayers_bar3: true,
                bar3_value: 0,
                gmnotes: gmn,
            });
            base.token.set("statusmarkers",statusmarkers);
            base.unitID = unit.id;
            base.teamID = team.id;
        } else {
            //sort into units in squad based on spacing
            //when creating units, need to seperate each subunit on map
            let groups = [];
            let sortedIDs = [];
            for (let i=0;i<tokenIDs.length;i++) {
                let id = tokenIDs[i];
                if (sortedIDs.includes(id)) {continue};
                //check if adjacent to a team in existing group
                sortLoop1:
                for (let j=0;j<groups.length;j++) {
                    let group = groups[j];
                    for (let k=0;k<group.length;k++) {
                        let id2 = group[k];
                        let dist = BaseArray[id].hex.distance(BaseArray[id2].hex);
                        if (dist > 1) {continue};
                        sortedIDs.push(id);
                        groups[j].push(id);
                        break sortLoop1
                    }
                }
                if (sortedIDs.includes(id)) {continue};
                //check if any adjacent teams which will be themselves unsorted
                //if so, the 2 form a group
                //if not, id becomes its own group
                for (let j=0;j<tokenIDs.length;j++) {
                    let id2 = tokenIDs[j];
                    if (id2 === id) {continue};
                    let dist = BaseArray[id].hex.distance(BaseArray[id2].hex);
                    if (dist > 1) {continue};
                    sortedIDs.push(id);
                    sortedIDs.push(id2);
                    groups.push([id,id2]);
                    break;
                }
                if (sortedIDs.includes(id)) {continue};
                groups.push([id]);
            }


            //now sort into "Teams" and Jr. Leaders
            for (let i=0;i<groups.length;i++) {
                let group = groups[i];
                let team = new Team("",player,nation,unit.id);
                let teamID = team.id;
                let nco = false;
                for (let j=0;j<group.length;j++) {
                    let base = BaseArray[group[j]];
                    let name = base.charName;
                    let hp = parseInt(base.token.get("currentSide")) + 1; //# men in token
                    if (base.rank > 0) {
                        name = OfficerName(base);
                        nco = true;
                        hp = base.initiative;
                        tName = name;
                    } else {
                        for (let c=0;c<CharacterCountries.length;c++) {
                            let cName = CharacterCountries[c];
                            if (name.includes(cName)) {
                                name = name.replace(cName,"");
                            }
                        }
                        tName = name;
                        if (group.length > 1) {
                            name += "/" + (j+1);
                        }
                    }
                    base.name = name;                    
                    base.token.set({
                        name: name,
                        tint_color: "transparent",
                        showplayers_bar1: true,
                        showname: true,
                        showplayers_bar3: true,
                        bar3_value: 0,
                        bar1_value: hp,
                    })
                    if (nco === true || j === 0) {
                        base.token.set({
                            aura1_color: colours.green,
                            aura1_radius: 0.1,
                            showplayers_aura1: true,
                        })
                    }
                    base.token.set("statusmarkers",statusmarkers);
                    team.bases.push(base.id);
                    if (nco === true) {
                        unit.nco = base.id;
                        team.leader = true;
                    }
                    team.name = tName;
                    if (base.special.includes("Crew")) {
                        team.crew = true;
                    }
                    let gmn = tName + ";" + teamID + ";" +  unitName + ";" + unit.id + ";" + core;
                    base.token.set("gmnotes",gmn);
                    base.unitID = unit.id;
                    base.teamID = team.id;
                    unit.add(team);
                }
            }
        }



        SetupCard("Unit Creation",unitName,nation);
        outputCard.body.push("Unit Added");
        PrintCard();

    
    
    
    }
    
    





    const changeGraphic = (tok,prev) => {
        if (tok.get('subtype') === "token") {
            log(tok.get("name") + " moving");
            if ((tok.get("left") !== prev.left) || (tok.get("top") !== prev.top) || (tok.get("rotation") !== prev.rotation)) {
                if (tok.get("name").includes("Patrol")) {
                    let patrol = PatrolArray[tok.id];
                    if (!patrol) {
                        let character = getObj("character", tok.get("represents"));    
                        patrol = new Base(tok,character);
                    }
                    if (patrol.locked === true) {
                        tok.set({
                            left: prev.left,
                            top: prev.top,
                        });
                        return;
                    }
                    if (!currentBase) {currentBase = patrol};
                    if (currentBase.id !== patrol.id) {
                        currentBase.startHex = currentBase.hex;
                        currentBase = patrol;
                    }
                    patrol.token.set({
                        aura1_color: colours.green,
                    })
                    let newLocation = new Point(tok.get("left"),tok.get("top"));
                    let newHex = pointToHex(newLocation);
                    if (newHex.distance(patrol.startHex) > 12) {
                        newHex = patrol.startHex.linedraw(newHex)[12];
                    }
                    let keys = Object.keys(PatrolArray);
                    for (let i=0;i<keys.length;i++) {
                        if (keys[i] === team.id) {continue};
                        let patrol2 = PatrolArray[keys[i]];
                        let dist = newHex.distance(patrol2.hex);
                        if (patrol2.player !== patrol.player && dist <= 12) {
                            patrol.token.set("aura1_color",colours.black);
                            if (dist < 12) {
                                let hexes = patrol2.hex.linedraw(patrol.hex);
                                newHex = hexes[12]; //distance of 12
                            };
                            sendChat("","Click Button to Lockdown");
                        };
                        if (patrol.player === patrol.player && dist > 12) {
                            patrol.token.set("aura1_color",colours.red);
                        };
                    }
                    //player to click macro on token to lock down if want
                    newLocation = hexToPoint(newHex);
                    patrol.token.set({
                        left: newLocation.x,
                        top: newLocation.y,
                    });
                    patrol.hex = newHex;
                } else {
                    let base = BaseArray[tok.id];
                    if (!base) {
                        let character = getObj("character", tok.get("represents"));    
                        if (!character) {return}
                        base = new Base(tok,character);
                    }
                    let oldHexLabel = base.hexLabel;
                    let newLocation = new Point(tok.get("left"),tok.get("top"));
                    let newHex = pointToHex(newLocation);
                    let newHexLabel = newHex.label();
                    newLocation = hexToPoint(newHex); //centres it in hex
                    tok.set({
                        left: newLocation.x,
                        top: newLocation.y,
                    });
                    base.hex = newHex;
                    base.hexLabel = newHexLabel;
                    base.location = newLocation;
                    let index = hexMap[oldHexLabel].tokenIDs.indexOf(tok.id);
                    if (index > -1) {
                        hexMap[oldHexLabel].tokenIDs.splice(index,1);
                    }
                    hexMap[newHexLabel].tokenIDs.push(tok.id);
                    if (base.type === "Gun" || base.type === "Vehicle" || base.type === "System Unit") {
                        base.vertices = TokenVertices(tok);
                    }
                    if (base.rank > 0) {
                        //place leader into a teams its nearby
                        LeaderTeam(base);
                    }
                    if (base.shockTokenID !== "") {
                        let id = base.shockTokenID;
                        let stok = findObjs({_type:"graphic", id: id})[0];
                        stok.set({
                            left: newLocation.x,
                            top: newLocation.y,
                        });
                    }
                }


            }
        }
    }

    const handleInput = (msg) => {
        if (msg.type !== "api") {
            return;
        }
        let args = msg.content.split(";");
        log(args);
        switch(args[0]) {
            case '!Dump':
                log("STATE");
                log(state.CoC);
                log("Terrain Array");
                log(TerrainArray);
                log("Hex Map");
                log(hexMap);
                log("Patrol Array");
                log(PatrolArray)
                log("Unit Array");
                log(UnitArray);
                log("Team Array");
                log(TeamArray);
                log("Base Array");
                log(BaseArray)
                break;
            case '!TokenInfo':
                TokenInfo(msg);
                break;
            case '!View':
                View(msg);
                break;
            case '!ClearState':
                ClearState();
                break;
            case '!StartNew':
                StartNewGame(msg);
                break;
            case '!Lockdown':
                Lockdown(msg);
                break;
            case '!AddAbilities':
                AddAbilities(msg);
                break;
            case '!SetJumpOff':
                SetJumpOff(msg);
                break;
            case '!StartGame':
                StartGame();
                break;
            case '!Roll':
                RollD6(msg);
                break;
            case '!CommandDice':
                CommandDice(msg);
                break;
            case '!UnitCreation':
                UnitCreation(msg);
                break;
            case '!Activate':
                UnitActivation(msg);
                break;
            case '!Order':
                Order(msg);
                break;
            case '!LeaderSelf':
                LeaderSelf(msg);
                break;
            case '!Rejoin':
                Rejoin(msg);
                break;
            case '!LeaderJoin':
                LeaderJoin(msg);
                break;
            case '!FinalizeMarker':
                FinalizeMarker(msg);
                break;
            case '!Fire':
                Fire(msg);
                break;
        }
    };
    const registerEventHandlers = () => {
        on('chat:message', handleInput);
        on('change:graphic',changeGraphic);
       // on('destroy:graphic',destroyGraphic);
    };
    on('ready', () => {
        log("===> Chain of Command Version: " + version + " <===");
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
