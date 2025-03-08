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
let winnersMap = new Map();
let losersMap = new Map();

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

var gameStats=[];
console.log('Starting 1st game of players...')
var gameStat = new GameStat(players1[0].name);

gameStat.incrementGame();
gameStat.incrementWin();
gameStats.push(gameStat);
gameStat = new GameStat(players1[1].name);
gameStat.incrementGame();
gameStat.incrementLoss();
gameStats.push(gameStat);
gameStat = new GameStat(players1[2].name);
gameStat.incrementGame();
gameStat.incrementLoss();
gameStats.push(gameStat);

let playersMap = new Map();
gameStats.forEach(myFunction);
function myFunction(value) {
    // console.log(value.name + ': ' +value.gameCount + ', ' + value.winCount +', ' + value.lossCount);
    playersMap.set(value.name, {gameCount: value.gameCount, winCount: value.winCount, lossCount: value.lossCount});
}

console.log(playersMap);

console.log('Starting 2nd game of players...')
gameStat = new GameStat(players2[0].name);
gameStat.incrementGame();
gameStat.incrementWin();
gameStats.push(gameStat);
gameStat = new GameStat(players2[1].name);
gameStat.incrementGame();
gameStat.incrementLoss();
gameStats.push(gameStat);
gameStat = new GameStat(players2[2].name);
gameStat.incrementGame();
gameStat.incrementLoss();
gameStats.push(gameStat);

gameStats.forEach(myFunction);
function myFunction(value) {
    var player = playersMap.get(value.name);
    console.log(player);
    // playersMap.set(value.name, {gameCount: player.gameCount+value.gameCount, winCount: player.winCount+value.winCount, lossCount: player.lossCount+value.lossCount});
}

console.log(gameStats);

console.log("\nENDING test-mx-maps");