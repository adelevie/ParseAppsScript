// Returns an object with the given attribute key/value pair
// If the object exists with that attribute, it merely finds and returns it.
// If the object does not exist, it creates and returns it.
// Example:
// obj = parseFindOrCreateByAttribute("GameScore", {
//   "playerName" : "Sean Plott"
// });
// If multiple results are returned from the parseQuery, an array of the results is returned here.
// If one result is returned from the parseQuery, just that result is returned here.
function parseFindOrCreateByAttribute(className, attributeNameAndValue) {
  var obj = parseQuery(className, attributeNameAndValue);
  var result;
  if (obj == false) {
    result = parseInsert(className, attributeNameAndValue);
  }
  else {
    if (obj.length > 1) { result = obj; }
    else                { result = obj[0]; }
  }

  return result;
}

// Query Parse to get results from server
// Example:
// var results = parseQuery("GameScore", {
//   "playerName" : "Sean Plott"
// }, {
//   "limit" : 20,
//   "skip" : 5
// });
// results[0].playerName #=> Sean Plott
function parseQuery(className, params, optionals) {

  // encodes query params
  var encoded_params = encodeURIComponent(JSON.stringify(params));

  // starts up url with query params
  var url = PARSE_URL + className + "?where=" + encoded_params;

  // if optional params are provided then added them
  for (var i=0;i<optionals.length;i++){
    var optional = optionals[i];
    for (var property in optional) {
      if (optional.hasOwnProperty(property)) {
        url += '&' + property + '=' + encodeURIComponent(optional[property]);
      }
    }
  }

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
    result = JSON.parse(resp.getContentText())["results"];
  }

  return result;
}

// Update an existing Parse object
// Example:
// parseUpdate("GameScore", "6K0FnTtGZC", {
//   "playerName" : "Sean Plott Jr."
//});
function parseUpdate(className, objectId, params) {
  var url = PARSE_URL + className + "/" + objectId;
  var payload = JSON.stringify(params);
  var options = {
    "method"  : "put",
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
    result = JSON.parse(resp.getContentText());
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
  var url = PARSE_URL + className;
  var payload = JSON.stringify(params);
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
    result = JSON.parse(resp.getContentText());
  }

  return result;
}

// Sent DELETE request to delete from the database
// Example:
// parseDelete("GameScore","ade04fa");
function parseDelete(className, objectId) {
  var url = PARSE_URL + className + '/' + objectId;
  var options = {
    "method"  : "delete",
    "headers" : makeHeaders(),
    "contentType" : "application/json"
  };

  var resp = UrlFetchApp.fetch(url, options);
  var result;
  if (resp.getResponseCode() != 200) {
    Logger.log(resp.getContentText());
    result = false;
  } else {
    result = true;
  }

  return result;
}

// calls getAPIKeys() and assembles into HTTP headers
function makeHeaders() {
  var headers = {
    "X-Parse-Application-Id": "ENTER-YOUR-APP-ID",
    "X-Parse-REST-API-Key": "ENTER-THE-REST-API-KEY-FOR-YOUR-APP"
  };

  return headers;
}

// base url for parse requests
var PARSE_URL = "https://YOUR-PARSE-SERVER-URL/classes/";