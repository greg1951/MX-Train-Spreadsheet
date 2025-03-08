console.log("STARTING test-mx-counts\n");

class Player {
    constructor(name, gameDate, score) {
        this.name = name;
        this.gameDate = gameDate;
        this.score = score;
    }
}
class GameStat {
    constructor(name, gameCount=0, winCount=0, lossCount=0) {
        this.name = name;
        this.gameCount=gameCount;
        this.winCount=winCount;
        this.lossCount=lossCount;
    }
    getName() {
        return this.name;
    }
    incrementGame() {
        this.gameCount++;
    }
    incrementWin() {
        this.winCount++;
    }
    incrementLoss() {
        this.lossCount++;
    }
}

var players1=[];
var player=new Player('Fred', '02-09-25', 200);
players1.push(player);
player=new Player('Alice', '02-09-25', 145);
players1.push(player);
player=new Player('John', '02-09-25', 250);
players1.push(player);
players1.sort((a,b) => a.score - b.score);

var players2=[];
var player=new Player('Fred', '02-15-25', 300);
players2.push(player);
player=new Player('Alice', '02-15-25', 345);
players2.push(player);
player=new Player('John', '02-15-25', 150);
players2.push(player);
players2.sort((a,b) => a.score - b.score);


console.log(players1);

function buildGameStats(players) {
    let gamesWonMap = new Map();
    let gamesLostMap = new Map();
    let gamesPlayedMap = new Map();
    var playerNames=[];
    var playerStats=[];
    for (var ix=0; ix < players.length; ix++) {
    var player = players[ix];
    playerNames[ix]=player.name;
    gamesPlayedMap.set(player.name, 1);
    if (ix == 0) 
        gamesWonMap.set(player.name, 1);
    else 
        gamesLostMap.set(player.name, 1);
    }
    console.log('# playerNames: ' + playerNames.length);
    playerStats=[];
    for (var nm=0; nm < playerNames.length; nm++) {
        var playerName=playerNames[nm];
        var gameStat = new GameStat(playerName);
        gameStat.incrementGame(playerName);
        if (gamesWonMap.has(playerName))
            gameStat.incrementWin(playerName);
        if (gamesLostMap.has(playerName))
            gameStat.incrementLoss(playerName);
        playerStats.push(gameStat);
    }
    console.log('playerStats...')
    console.log(playerStats);
    return playerStats;
        
}
var player1Stats = buildGameStats(players1);


// var players2=[];
// var player=new Player('Fred', '02-15-25', 300);
// players2.push(player);
// player=new Player('Alice', '02-15-25', 345);
// players2.push(player);
// player=new Player('John', '02-15-25', 150);
// players2.push(player);
// players2.sort((a,b) => a.score - b.score);


// console.log(players2);



console.log("\nENDING test-mx-maps");