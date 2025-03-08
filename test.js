console.log("STARTING test\n");
function Player(name, gameDate, score) {
    this.name=name;
    this.gameDate=gameDate;
    this.score=score;
    this.gameWinner=false;
}
const highPlayer = {
    type: 'HIGH',
    playerName: '',
    gameDate: '',
    score: 9999
}
var players=[];
var player = new Player('Fred', '02-09-25', 325);
players.push(player);
var player = new Player('Jane', '02-09-25', 300);
players.push(player);
console.log("players size: " + players.length);
console.log(players);
console.log("\nENDING test");