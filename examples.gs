function postToParse() {  
  parseInsert("GameScore",{
    "score" : 1000,
    "playerName" : "Sean Plott"
  });
};

function queryParse() {
  var results = parseQuery("GameScore", {
     'playerName' : 'Sean Plott'
  });
  
  Logger.log(results[0].playerName);
}

/**
 * Adds a custom menu to the active spreadsheet, containing a single menu item
 * for invoking the readRows() function specified above.
 * The onOpen() function, when defined, is automatically invoked whenever the
 * spreadsheet is opened.
 * For more information on using the Spreadsheet API, see
 * https://developers.google.com/apps-script/service_spreadsheet
 */
function onOpen() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{
    name : "Read Data",
    functionName : "readRows"
  }];
  sheet.addMenu("Script Center Menu", entries);
};
