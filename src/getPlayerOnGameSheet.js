function getPlayerOnGameSheet() {getPlayerOnGameSheet
  /* ====================================================================================
    This Google apps script is associated with a Mexican Train spreadsheet. It's purpose is  
    to populate the Game History and a Leader Board sheets. The script assumes that those 
    sheets exist in the spreadsheet.
    - The GAME HISTORT will summarize the results of each game sheet, highlighting the lowest
      score in the game in green and the highest score in pink.
    - The LEADERBOARD will show three sets of stats: Low Score, High Score as well individual 
      player stats consisting of the number of games played and the number of wins and losses.
    ====================================================================================== */
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const gameSheetNames=[];
  const gameSheets=[];
  const NotGameSheets = {
    INSTRUCTIONS:     'INSTRUCTIONS',
    MMDDYY_TEMPLATE:  'MM-DD-YY TEMPLATE',
    LEADER_BOARD:     'LEADER BOARD',
    GAME_HISTORY:     'GAME HISTORY',
    IGNORE_SHEET:     'IGNORE'
  }
  const HighlightColors = {
    GREEN: 'lightgreen',
    RED:   'pink',
    GRAY:  'lightgray'
  }
  const RowOffsets = {
    GAME_HISTORY: 7,
    LEADER_LOW: 4,
    LEADER_HIGH: 8,
    LEADER_STATS: 12,
    MAX_ROW: 200
  }
  class Player {
    constructor(name, score) {
      this.name = name;
      this.gameDate = currentGameSheetName;
      this.score = score;
    }
  }
  var players=[];
  var playerStats=[];
  var lowPlayer = new Map();
  lowPlayer.set('LOW',{name:'', gameDate: '', score:99999});
  var highPlayer = new Map();
  highPlayer.set('HIGH',{name:'', gameDate: '', score:0});

  /*
    The Leaderboard class is responsible for iterating through the sheet players and producing 
    the playerStats that summarizes the # games played, won, and lost for each player. The logPlayer 
    and highPlayer maps, and playerStats are cummulative, updated while iterating through all of the 
    game sheets.
  */
  class LeaderBoard {
    constructor(players, playerStats, lowPlayer, highPlayer) {
        this.players=players;
        this.playerStats=playerStats;
        this.lowPlayer=lowPlayer;
        this.highPlayer=highPlayer;
    }
    buildStats() {
        /*
          First, the players will be sorted in score sequence, so the lowest score is ix=0.
          Then, loop through players and check whether they are in the playerStats array:
          The first time, they are all added to playerStats but on subsequent iterations
          we would find some and use the previous counts.
        */ 
        this.players.sort((a,b) => a.score - b.score);        
        for (let ix=0; ix < this.players.length; ix++) {
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
        for (let ix=0; ix < this.players.length; ix++) {
            var playerName = this.players[ix].name;
            var playerScore=this.players[ix].score;
            var gameDate = this.players[ix].gameDate;
            // console.log('working on playerStat updates for ' +playerName);
            var playerStat = this.playerStats.find(player => player.name === playerName);
            // console.log('playerStat to be updated...');
            // console.log(playerStat);
            /*
              if first row in the players array then it is the lowest score so increment the wonCount
              otherwise increment the lostCount. Always increment the playedCount.
            */
            if (ix==0) { 
                playerStat.wonCount=playerStat.wonCount+1;
                var lowScore = this.lowPlayer.get('LOW');
                console.log('playerScore: ' + playerScore + ' > lowScore: ' + lowScore.score + '?');
                if (playerScore < lowScore.score) {
                  console.log('YES...LOW updated for: ' + playerName +', score: ' +playerScore);
                  this.lowPlayer.set('LOW', {name: playerName, gameDate: gameDate, score: playerScore});
                }
            }
            else {    
                playerStat.lostCount=playerStat.lostCount+1;
                var highScore = this.highPlayer.get('HIGH');
                console.log('playerScore: ' + playerScore + ' > highScore: ' + highScore.score + '?');
                if (playerScore > highScore.score) {
                  console.log('YES...HIGH updated for: ' + playerName +', score: ' +playerScore);
                  this.highPlayer.set('HIGH', {name: playerName, gameDate: gameDate, score: playerScore});
                }
            }
            playerStat.playedCount=playerStat.playedCount+1;
        }
        console.log('Updated playerStats...')
        console.log(this.playerStats);
        // remove players for another iteration
        players=[];
  }       
}

  var allSheets=ss.getSheets();
  var gameHistorySheet="";
  var leaderBoardSheet="";
  // The "u" variable controls the summary rows transferred to the Summary sheet.
  var u=0;

  /* ----------------------------------------------------------------------------------- 
    Any exceptions thrown in the logic will alert the user trying to create the Summary.
    ------------------------------------------------------------------------------------ */
  try {
    /* ---------------------------------------------------------------------------------
      for loop below will retrieve all of the game sheets, which are any sheets other than
      the Instructions or the Summary itself.
      ----------------------------------------------------------------------------------- */
    for (let i=0; i < allSheets.length; i++) {
      var thisSheetName=allSheets[i].getName();
      if (thisSheetName.toUpperCase() !== NotGameSheets.INSTRUCTIONS
      && thisSheetName.toUpperCase()  !== NotGameSheets.GAME_HISTORY
      && thisSheetName.toUpperCase()  !== NotGameSheets.LEADER_BOARD
      // the IGNORE sheet should use a "startsWith" function as it could be IGNORE1 or IGNORE2, etc.
      && thisSheetName.toUpperCase()  !== NotGameSheets.IGNORE_SHEET
      && thisSheetName.toUpperCase()  !== NotGameSheets.MMDDYY_TEMPLATE) {
        gameSheetNames.push(thisSheetName);
        gameSheets.push(allSheets[i]);
      }
      if (thisSheetName.toUpperCase() === NotGameSheets.GAME_HISTORY)
        gameHistorySheet=allSheets[i];
      if (thisSheetName.toUpperCase() === NotGameSheets.LEADER_BOARD)
        leaderBoardSheet=allSheets[i];
    }
    Logger.log('gameSheets found: ' + gameSheetNames.length);

    /* ---------------------------------------------------------------------------------
      A little defensive programming before starting
      ----------------------------------------------------------------------------------- */
    if (gameHistorySheet.length==0)
      throw Error('The "Game History" sheet was not found and it is required.');
    if (leaderBoardSheet.length==0)
      throw Error('The "Leader Board" sheet was not found and it is required.');
    if (gameSheets.length==0) {
      throw Error('There must be at least one actual gamesheet in the Spreadsheet.');
    }

    /* ---------------------------------------------------------------------------------
      for loop below will process all of the game sheets in the spreadsheet.
      The sheet name should ideally be in a mm-dd-yy format to appear in Summary nicely.
      ----------------------------------------------------------------------------------- */
    for (let gi=0; gi < gameSheetNames.length; gi++) {
      var currentGameSheetName = gameSheetNames[gi];
      var currentGameSheet = gameSheets[gi];
      Logger.log('currentGameSheet: ' +currentGameSheetName);
      var sheet = SpreadsheetApp.setActiveSheet(currentGameSheet);

      /* ---------------------------------------------------------------------------------
        Iterate through all of the game sheet rows, capturing name, score and the game date.
        Example shown below. If there is no player name, ignore the count.
        ----------------------------------------------------------------------------------- */
      // const players = [
      //     {name: 'Fred', gameDate: '02-09-25', score: 200},
      //     {name: 'Alice', gameDate: '02-09-25', score: 145},
      //     {name: 'John', gameDate: '02-09-25', score: 250},
      // ]
      let gameSheetData = sheet.getDataRange().getValues();
      Logger.log('# of gamesheets rows: ' +gameSheetData.length);

      // Process game sheet rows (Row 0 is a header containing the Player Name)
      for (let ri = 0; ri <= gameSheetData.length; ri++) {
          /*
            Only the first player row is required, the score can be extracted from 
            the last row in the range.
          */
          if (ri==0) {
            let gameTotalRow=gameSheetData.length;
            Logger.log('Game Total row: ' + gameTotalRow);

            // Process player columns (Column 0 is a header)
            for (let ci=1; ci < gameSheetData[ri].length; ci++) { 
              console.log('player name: ' +gameSheetData[ri][ci]);

              let playerName=gameSheetData[0][ci].trim();
              if (playerName.length !== 0) { // no player name, skip
                let score=gameSheetData[gameTotalRow-1][ci];
                if (typeof score !== "number") // edge case where player column but no scoring
                  score=0;
                var player = new Player(gameSheetData[ri][ci], score);
                players.push(player);  
              }
            }
          }
          else break;
        Logger.log('# players: ' + players.length);

        /* ---------------------------------------------------------------------------------
          GAME HISTORY SECTION
          Iterate through players captured above and transfer to the Summary sheet in columns 
          B-D. Each game sheet rows will be separated with an empty gray highlighted row.
          ----------------------------------------------------------------------------------- */
        console.log('Start GAME HISTORY...');
        // players.forEach(player => {
        //   console.log(player);
        // });
        var rangeClear = gameHistorySheet.getRange('A' + parseInt(u+RowOffsets.GAME_HISTORY) + ':C' + parseInt(RowOffsets.MAX_ROW));
        rangeClear.clear();
        var winnerRow=true;
        var loserRow = players.length-1;
        var loserIx=0;
        var sortedPlayers = players.sort((a,b) => a.score - b.score);
        sortedPlayers.forEach(player => {
          var rangeA = gameHistorySheet.getRange('A' + parseInt(u+RowOffsets.GAME_HISTORY));
          rangeA.setValue(player.name);
          var rangeB = gameHistorySheet.getRange('B' + parseInt(u+RowOffsets.GAME_HISTORY));
          rangeB.setValue(player.gameDate);
          var rangeC = gameHistorySheet.getRange('C' + parseInt(u+RowOffsets.GAME_HISTORY));
          rangeC.setValue(player.score);
          if (winnerRow) {
            var rangeWinner = gameHistorySheet.getRange('A' + parseInt(u+RowOffsets.GAME_HISTORY) + ':C' + parseInt(u+RowOffsets.GAME_HISTORY));
            rangeWinner.setBackground(HighlightColors.GREEN);
            winnerRow=false;
            rangeWinner.setBorder(true, false, false, false, false, false);
          }
          if (++loserIx > loserRow) {
            var rangeLoser = gameHistorySheet.getRange('A' + parseInt(u+RowOffsets.GAME_HISTORY) + ':C' + parseInt(u+RowOffsets.GAME_HISTORY));
            rangeLoser.setBackground(HighlightColors.RED);
            rangeLoser.setBorder(false, false, true, false, false, false);
          }
          u++;
        });
        var rangeBB = gameHistorySheet.getRange('A' + parseInt(u+RowOffsets.GAME_HISTORY) + ':C' + parseInt(u+RowOffsets.GAME_HISTORY));
        // rangeBB.setBackground(HighlightColors.GRAY); 
        u++;

        /*
          Calculate the leaderboard stats, pass in this sheet's players and 
          accumulate the playerStats for all sheets.
        */
        var leaderBoard = new LeaderBoard(players, playerStats, lowPlayer, highPlayer);
        leaderBoard.buildStats();
        }       

    }
    /* ---------------------------------------------------------------------------------
      Set the game history sheet as active for the user to see the magic.
      ----------------------------------------------------------------------------------- */
    /*
      LEADERBOARD SECTION
      Create a section for the Lowest Score, the Highest Score and lines for the playerStats
      which record the games played, games won and lost.
    */
    console.log('Start LEADERBOARD processing...');
    console.log('Low Player...');
    var lowPlayer = lowPlayer.get('LOW');
    console.log(lowPlayer);
    var rangeLow1 = leaderBoardSheet.getRange('A' + parseInt(RowOffsets.LEADER_LOW));
    rangeLow1.setValue(lowPlayer.name);
    var rangeLow2 = leaderBoardSheet.getRange('B' + parseInt(RowOffsets.LEADER_LOW));
    rangeLow2.setValue(lowPlayer.gameDate);
    var rangeLow3 = leaderBoardSheet.getRange('C' + parseInt(RowOffsets.LEADER_LOW));
    rangeLow3.setValue(lowPlayer.score);

    console.log('High Player...');
    var highPlayer = highPlayer.get('HIGH');
    console.log(highPlayer);
    var rangeHigh1 = leaderBoardSheet.getRange('A' + parseInt(RowOffsets.LEADER_HIGH));
    rangeHigh1.setValue(highPlayer.name);
    var rangeHigh2 = leaderBoardSheet.getRange('B' + parseInt(RowOffsets.LEADER_HIGH));
    rangeHigh2.setValue(highPlayer.gameDate);
    var rangeHigh3 = leaderBoardSheet.getRange('C' + parseInt(RowOffsets.LEADER_HIGH));
    rangeHigh3.setValue(highPlayer.score);

    console.log('Player Stats History...')
    var rangeClear = leaderBoardSheet.getRange('A' + parseInt(u+RowOffsets.LEADER_STATS) + ':D' + parseInt(RowOffsets.MAX_ROW));
    rangeClear.clear();
    var lineNbr=0;
    var sortedStats = playerStats.sort((a,b) => {
      var nameA = a.name.toUpperCase();
      var nameB = b.name.toUpperCase();
      if (nameA < nameB) return -1;
      else if (nameA > nameB) return +1;
      else return 0;
    });
    sortedStats.forEach((playerStat) => {
      var rangeStat1 = leaderBoardSheet.getRange('A' + parseInt(lineNbr+RowOffsets.LEADER_STATS));
      rangeStat1.setValue(playerStat.name);
      var rangeStat2 = leaderBoardSheet.getRange('B' + parseInt(lineNbr+RowOffsets.LEADER_STATS));
      rangeStat2.setValue(playerStat.playedCount);
      var rangeStat3 = leaderBoardSheet.getRange('C' + parseInt(lineNbr+RowOffsets.LEADER_STATS));
      rangeStat3.setValue(playerStat.wonCount);
      var rangeStat4 = leaderBoardSheet.getRange('D' + parseInt(lineNbr+RowOffsets.LEADER_STATS));
      rangeStat4.setValue(playerStat.lostCount);
      lineNbr++;
    });



    SpreadsheetApp.setActiveSheet(gameHistorySheet);
  }
  catch (error) {
    console.error('Something bad happened: ' + error);
    Browser.msgBox('Oops! ' + error);
  }
}
