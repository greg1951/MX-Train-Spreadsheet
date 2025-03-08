function getPlayerOnGameSheet() {
  /* ====================================================================================
    This Google apps script is associated with a Mexican Train scoresheet. It's purpose is  
    to produce a report in columns B-D in the Summary tab. This script assumes that there 
    is already a Summary tab there, as there is a button in that sheet to run this script.
    ====================================================================================== */
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const gameSheetNames=[];
  const gameSheets=[];
  const NotGameSheets = {
    INSTRUCTIONS:     'INSTRUCTIONS',
    MMDDYY_TEMPLATE:  'MM-DD-YY TEMPLATE',
    IGNORE_SHEET:     'IGNORE',
    SUMMARY:          'SUMMARY'
  }
  const HighlightColors = {
    GREEN: 'lightgreen',
    RED:   'pink',
    GRAY:  'lightgray'
  }
  var allSheets=ss.getSheets();
  var summarySheet="";
  // The "u" variable controls the summary rows being added.
  var u=0;

  /* ----------------------------------------------------------------------------------- 
    Any exceptions thrown in the logic will alert the user trying to create the Summary.
    ------------------------------------------------------------------------------------ */
  try {
    /* ---------------------------------------------------------------------------------
      for loop below will retrieve all of the game sheets, which are any sheets other than
      the Instructions or the Summary itself.
      ----------------------------------------------------------------------------------- */
    for (var i=0; i < allSheets.length; i++) {
      var thisSheetName=allSheets[i].getName();
      if (thisSheetName.toUpperCase() !== NotGameSheets.INSTRUCTIONS 
      && thisSheetName.toUpperCase()  !== NotGameSheets.SUMMARY
      && thisSheetName.toUpperCase()  !== NotGameSheets.IGNORE
      && thisSheetName.toUpperCase()  !== NotGameSheets.MMDDYY_TEMPLATE) {
        gameSheetNames.push(thisSheetName);
        gameSheets.push(allSheets[i]);
      }
      if (thisSheetName.toUpperCase() === NotGameSheets.SUMMARY)
        summarySheet=allSheets[i];
    }
    Logger.log('gameSheets found: ' + gameSheetNames.length);

    /* ---------------------------------------------------------------------------------
      A little defensive programming at the start
      ----------------------------------------------------------------------------------- */
    if (summarySheet.length==0)
      throw e('The Summary sheet was not found and is required.');
    if (gameSheets.length==0)
      throw e('There must be at least one gamesheet in the Spreadsheet.');

    /* ---------------------------------------------------------------------------------
      for loop below will process all of the sheets in the spreadsheet.
      The sheet name should ideally be in a mm-dd-yy format to appear in Summary nicely.
      ----------------------------------------------------------------------------------- */
    for (var gi=0; gi < gameSheetNames.length; gi++) {
      var currentGameSheetName = gameSheetNames[gi];
      var currentGameSheet = gameSheets[gi];
      Logger.log('currentGameSheet: ' +currentGameSheetName);
      var sheet = SpreadsheetApp.setActiveSheet(currentGameSheet);

      /* ---------------------------------------------------------------------------------
        This object is currenly unused. It's here for possible use instead of the Player function.
        ---------------------------------------------------------------------------------- */ 
      const playerObject = {
        name: '',
        gameDate:'',
        score:0,
        gameWinner:false,
        get gameWinner() {return gameWinner;},
        set gameWinner(value) {gameWinner=value;}
      }

      function Player(name, gameDate, score) {
        this.name=name;
        this.gameDate=currentGameSheetName;
        this.score=score;
        this.gameWinner=false;
      }
       
      /* ---------------------------------------------------------------------------------
        Iterate through all of the game sheet rows, capturing name, score and the game date.
        ----------------------------------------------------------------------------------- */
      var data = sheet.getDataRange().getValues();
      var lastRow = data[data.length-1];
      const playersArray=[];
      let players=playersArray; 
      for (var i = 0; i <= data.length; i++) {
        if (i==1) {
          var gameTotalRow=data.length-1;
          Logger.log('length: ' + gameTotalRow);
          let player=new Player(data[i][1], currentGameSheetName, data[gameTotalRow][1]);
          players.push(player);
          player=new Player(data[i][2], currentGameSheetName, data[gameTotalRow][2]);
          players.push(player);
          player=new Player(data[i][3], currentGameSheetName, data[gameTotalRow][3]);
          players.push(player);
          break;
        }
      }
      Logger.log('# players: ' + players.length);

      /* ---------------------------------------------------------------------------------
        The logic below will determine who the game winner is by the lowest score and set
        a boolean indicating such.
        ----------------------------------------------------------------------------------- */
      const sortResult = players.sort((a,b) => a.score - b.score);
      Logger.log('sortResult length: ' + sortResult.length);

      /* ---------------------------------------------------------------------------------
        Iterate through players captured above and transfer to the Summary sheet in columns 
        B-D. Each game sheet rows will be separated with an empty gray highlighted row.
        ----------------------------------------------------------------------------------- */
      var winnerRow=true;
      var loserRow = sortResult.length-1;
      var loserIx=0;
      sortResult.forEach(player => {
        var rangeB = summarySheet.getRange('B' + parseInt(u+3));
        rangeB.setValue(player.name);
        var rangeC = summarySheet.getRange('C' + parseInt(u+3));
        rangeC.setValue(player.gameDate);
        var rangeD = summarySheet.getRange('D' + parseInt(u+3));
        rangeD.setValue(player.score);
        if (winnerRow) {
          var rangeWinner = summarySheet.getRange('B' + parseInt(u+3) + ':D' + parseInt(u+3));
          rangeWinner.setBackground(HighlightColors.GREEN);
          winnerRow=false;
        }
        if (++loserIx > loserRow) {
          var rangeLoser = summarySheet.getRange('B' + parseInt(u+3) + ':D' + parseInt(u+3));
          rangeLoser.setBackground(HighlightColors.RED);
        }
        u++;
      });
      var rangeBB = summarySheet.getRange('B' + parseInt(u+3) + ':D' + parseInt(u+3));
      rangeBB.setBackground(HighlightColors.GRAY);
      u++;
    }
    /* ---------------------------------------------------------------------------------
      Set the Summary sheet as active for the user to see the magic.
      ----------------------------------------------------------------------------------- */
    SpreadsheetApp.setActiveSheet(summarySheet);
  }
  catch (e) {
    alert(e);
  }
}
