console.log("STARTING test-mx-counts\n");

var playerStats=[];
const players1 = [
    {name: 'Fred', gameDate: '02-09-25', score: 200},
    {name: 'Alice', gameDate: '02-09-25', score: 145},
    {name: 'John', gameDate: '02-09-25', score: 250},
]


class LeaderBoard {
    constructor(players, playerStats) {
        this.players=players;
        this.playerStats=playerStats;
    }
    buildStats() {
        /*
          First, the players will be sorted in score sequence, so the lowest score is ix=0.
          Then, loop through players and check whether they are in the playerStats array:
          The first time, they are all added to playerStats but on subsequent iterations
          we would find some and use the previous counts.
        */ 
        this.players.sort((a,b) => a.score - b.score);        
        for (var ix=0; ix < this.players.length; ix++) {
            var playerName=this.players[ix].name;
            var playerStat = this.playerStats.find(player => player.name === playerName);
            if (playerStat===undefined) {
                console.log('Did not find ' + playerName + ', adding to playerStats...')
                var playerStat={name: playerName, playedCount: 0, wonCount: 0, lostCount: 0};
                this.playerStats.push(playerStat); 
            }
            else console.log('Found player ' +playerName +' in playerStats');
        }
        // logic below to increment counters
        for (var ix=0; ix < this.players.length; ix++) {
            var playerName = this.players[ix].name;
            // console.log('working on playerStat updates for ' +playerName);
            var playerStat = this.playerStats.find(player => player.name === playerName);
            // console.log('layerStat to be updated...');
            // console.log(playerStat);
            /*
              if first row in the players array then it is the lowest score so increment the wonCount
              otherwise increment the lostCount. Always increment the playedCount.
            */
            if (ix==0) 
                playerStat.wonCount=playerStat.wonCount+1;
            else    
                playerStat.lostCount=playerStat.lostCount+1;
            playerStat.playedCount=playerStat.playedCount+1;
        }
        console.log('Updated playerStats...')
        console.log(this.playerStats);
  }
        
}
var leaderBoard = new LeaderBoard(players1, playerStats);
leaderBoard.buildStats();

const players2 = [
    {name: 'Fred', gameDate: '02-09-25', score: 300},
    {name: 'Alice', gameDate: '02-09-25', score: 245},
    {name: 'John', gameDate: '02-09-25', score: 350},
    {name: 'Ted', gameDate: '02-09-25', score: 150}
]

leaderBoard = new LeaderBoard(players2, playerStats);
leaderBoard.buildStats();




console.log("\nENDING test-mx-maps");