console.log("STARTING test-array-find\n");

/*
  The following JS will create an array, do a find on the array and then update one of the
  counts in the array object. If the array does not contain the player, then create a new row
  and update the new row count afterwards.
*/

const players = [
    {name: 'Fred', playedCount: 5, wonCount: 3, lostCount: 2},
    {name: 'John', playedCount: 5, wonCount: 1, lostCount: 4},
    {name: 'Alice', playedCount: 5, wonCount: 1, lostCount: 4},
]
var playerName='Ted'; /* not found */
//var playerName='John'; /* found */
/*
  The find method below is a function that has been shortened for readability. It returns
  either the object in the array if found or "undefined" if not.
*/
var player = players.find(player => player.name === playerName);
if (player===undefined) {
    console.log('Did not find ' + playerName + ', adding to array...')
    var player={name: playerName, playedCount: 0, wonCount: 0, lostCount: 0};
    players.push(player); 
}
else console.log('Found player ' +playerName +' in the array');
console.log(player);
console.log('Incrementing the lostCount...')
player.playedCount=player.playedCount+1;
player.lostCount=player.lostCount+1;
console.log(players);

console.log("\nENDING test-array-find");