// Query Parse to get results from server
// Example:
// var results = parseQuery("GameScore", {
//   "playerName" : "Sean Plott"
// });
// results[0].playerName #=> Sean Plott
function parseQuery(className, params) {
  var encoded_params = encodeURIComponent(Utilities.jsonStringify(params));
  var url = "https://api.parse.com/1/classes/" + className + "?where=" + encoded_params;
  var options = { 
    "method"  : "get",
    "headers" : makeHeaders(),
  };
    
  var resp = UrlFetchApp.fetch(url, options);
  var result;
  if (resp.getResponseCode() != 200) {
    Logger.log(resp.getContentText());
    result = false;
  } else {
    result = Utilities.jsonParse(resp.getContentText())["results"];
  }
  
  return result;
}

// Sent POST request to insert into the database
// Example:
// parseInsert("GameScore", {
//   "playerName" : "Sean Plott",
//   "score"      : "1337"
// });
function parseInsert(className, params) {
  var url = "https://api.parse.com/1/classes/" + className;
  var payload = Utilities.jsonStringify(params);
  var options = {
    "method"  : "post",
    "payload" : payload,
    "headers" : makeHeaders(),
    "contentType" : "application/json"
  };
  
  var resp = UrlFetchApp.fetch(url, options);
  var result;
  if (resp.getResponseCode() != 200) {
    Logger.log(resp.getContentText());
    result = false;
  } else {
    result = Utilities.jsonParse(resp.getContentText());
  }
  
  return result;
}


// Looks for the first Sheet in a Speadsheet 
// and gets the first two rows of the 2nd column
function getAPIKeys() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  SpreadsheetApp.setActiveSheet(ss.getSheets()[0]);
  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = getRows(sheet);
  keys = {
    "application_id" : rows[0][1],
    "rest_api_key"   : rows[1][1]
  };

  return keys;
}

// calls getAPIKeys() and assembles into HTTP headers
function makeHeaders() {
  var keys = getAPIKeys();
  var headers = {
    "X-Parse-Application-Id": keys["application_id"],
    "X-Parse-REST-API-Key": keys["rest_api_key"]
  };
  
  return headers;
}

// Grabs all the rows for a given sheet
function getRows(sheet) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = sheet.getDataRange();
  var values = rows.getValues();
  
  return values;
};