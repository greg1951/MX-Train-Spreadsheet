console.log("STARTING test-mx-maps\n");

// Using Map to store employee information
var aPlayer = {
    name: '',
    gameDate: '',
    score: 0
}
var gamePlayer1 = {
    name: 'John',
    gameDate: '02-09-25',
    score: 305
}
var gamePlayer2 = {
    name: 'Alice',
    gameDate: '03-06-25',
    score: 345
}
var gamePlayer3 = {
    name: 'Fred',
    gameDate: '02-15-25',
    score: 150
}


console.log("\nStarting LOW player logic...")
let lowMap = new Map();
lowMap.set('LOW', { name: 'INITIAL', gameDate: '12-31-25', score: 9999 });

var lowPlayer = lowMap.get('LOW');
console.log('gamePlayer1 score: ' + gamePlayer1.score + ' < lowPlayer score: ' + lowPlayer.score);
if (gamePlayer1.score < lowPlayer.score) {
    lowMap.set('LOW', { name: gamePlayer1.name, gameDate: gamePlayer1.gameDate, score: gamePlayer1.score});
}

lowPlayer = lowMap.get('LOW');
console.log('gamePlayer2 score: ' + gamePlayer2.score + ' < lowPlayer score: ' + lowPlayer.score);
if (gamePlayer2.score < lowPlayer.score) {
    lowMap.set('LOW', { name: gamePlayer2.name, gameDate: gamePlayer2.gameDate, score: gamePlayer2.score});
}

lowPlayer = lowMap.get('LOW');
console.log('gamePlayer3 score: ' + gamePlayer3.score + ' < lowPlayer score: ' + lowPlayer.score);
if (gamePlayer3.score < lowPlayer.score) {
    lowMap.set('LOW', { name: gamePlayer3.name, gameDate: gamePlayer3.gameDate, score: gamePlayer3.score});
}
console.log('Player with LOWEST score...')
console.log(lowMap.get('LOW'));

console.log("\nStarting HIGH player logic...")
let highMap = new Map();
highMap.set('HIGH', { name: 'INITIAL', gameDate: '12-31-25', score: 0 });

highPlayer = highMap.get('HIGH');
console.log('gamePlayer1 score: ' + gamePlayer1.score + ' > highPlayer score: ' + highPlayer.score);
if (gamePlayer1.score > highPlayer.score) {
    highMap.set('HIGH', { name: gamePlayer1.name, gameDate: gamePlayer1.gameDate, score: gamePlayer1.score});
}
highPlayer = highMap.get('HIGH');
console.log('gamePlayer3 score: ' + gamePlayer3.score + ' > highPlayer score: ' + highPlayer.score);
if (gamePlayer3.score > highPlayer.score) {
    highMap.set('HIGH', { name: gamePlayer3.name, gameDate: gamePlayer3.gameDate, score: gamePlayer3.score});
}
highPlayer = highMap.get('HIGH');
console.log('gamePlayer2 score: ' + gamePlayer2.score + ' > highPlayer score: ' + highPlayer.score);
if (gamePlayer2.score > highPlayer.score) {
    highMap.set('HIGH', { name: gamePlayer2.name, gameDate: gamePlayer2.gameDate, score: gamePlayer2.score});
}
console.log('Player with HIGHEST score...')
console.log(highMap.get('HIGH'));



console.log("\nENDING test-mx-maps");