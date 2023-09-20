const Cast = (msg) => {
    SpellStored = {};

    let Tag = msg.content.split(";");
    let casterID = Tag[1];
    let spellName = Tag[2];
    let targetIDs = Tag.splice(0,2); //remaining info
    targetIDs = [...new Set(targeIDs)]; //eliminate duplicates

    let caster = ModelArray[casterID];
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
    let extraPointsMax = casterPoints - spell.cost; //casters own
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
            extraPointsMax += pts;
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
    friendlyCasters.unshift({id: casterID, range: 0});
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


    if (extraPointsMax === 0 && enemyPointsMax === 0) {
        //proceed right to casting spell, using SpellStored
        Cast3();
    } else if (extraPointsMax === 0 && enemyPointsMax > 0) {
        //send other player q re points
        SetupCard("Oppose Casting","",opponentFaction);
        ButtonInfo("Points","!Cast2;" + opponent + ";?{Extra Points|"+ enemyPointsMax + "};0");
        PrintCard(oppID);
    } else if (extraPointsMax > 0 && enemyPointsMax === 0) {
        ButtonInfo("Extra Points","!Cast2;" + player + ";?{Extra Points|"+ extraPointsMax+"};0");
        PrintCard(playerID);
    } else if (extraPointsMax > 0 && enemyPointsMax > 0) {
        ButtonInfo("Extra Points","!Cast2;" + player + ";?{Extra Points|"+ extraPointsMax+"};1");
        PrintCard(playerID);
    }
}


const Cast2 = (msg) => {
    //extra points 'spent' by caster
    let Tag = msg.content.split(";");
    let player = parseInt(Tag[1]);
    let pts = parseInt(Tag[2]);
    let flag = parseInt(Tag[3]);
    if (player === SpellStored.player) {
        SpellStored.extraAlliedPts = pts;
    } else {
        SpellStored.opposingPts = opposingPts;
    }
    if (flag === 0) {
        Cast3();
    } else if (flag === 1) {
        SetupCard("Oppose Casting","",opponentFaction);
        ButtonInfo("Points","!Cast2;" + opponent + ";?{Extra Points|"+ SpellStored.enemyPointsMax + "};0");
        PrintCard(oppID);
    } 
}


const Cast3 = () => {
    sendChat("","Cast !!!!")




}


