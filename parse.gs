/**
 * Trys to find an object from Parse given a set of named params 
 * and if doesn't find it, it creates an object using given params.
 * @param {String} classname the name of the class to query.
 * @param {Object} params an object defining the parameters of the query (where clause) or new object to be created.
 */
function parseFindOrCreateByAttribute(className, params) {
  var obj = parseQuery(className, params, null);
  if (obj == []) {
    // if no object was found, try and create one
    // if creation was succesful, fetch new object
    // otherwsie return null
    if (parseInsert(className, params) != null) {
      obj = parseQuery(className, params, null);
    } else {
      return null;
    }
  }
  
  // if query has at least one object, return the top most object
  // otherwise return null
  return obj.length > 0 ? obj[0] : null;
}

/**
 * Returns all items of a class taking into account defined optionals.
 * @param {String} classname the name of the class to query
 * @param {Object} params an object defining the parameters of the query (where clause)
 * @param {Object} optionals an object defining optional params (order, includes, etc.)
 * @returns all items of a class taking into account defined optionals.
 */
function parseQueryAll(className,params,optionals){
  var i = 0;
  var results = [];
  
  // checks if optinals are provided, else initialises it.
  if (optionals == null || optionals == undefined){
    optionals = {};
  }
  
  // checks if limits is provided, else adds it
  if (optionals.limit == null || optionals.limit == undefined){
    optionals.limit = 999;
  }

  while(i > -1){
    optionals.skip = optionals.limit * i;
    var qa = parseQuery(className,params,optionals);
    
    if (qa != null) {
      // concatenate results
      results = results.concat(qa);
      
      // check if there is any left to be queried
      // and query again
      if (qa.length == optionals.limit){
        i++
      } else {
        i = -1;
      }
    } else {
      // nothing there return
      i = -1;
    }
  }
  
  return results;
}

/**
 * Queries Parse using given params and optionals.
 * @param {String} classname the name of the class to query
 * @param {Object} params an object defining the parameters of the query (where clause)
 * @param {Object} optionals an object defining optional params (order, limit, skips, includes)
 * @returns all items of a class taking into account defined params and optionals.
 */
function parseQuery(className, params, optionals) {
  
  // starts up url with query params
  var url = PARSE_URL + className;
  
  // encodes query params
  if (params != null){    
    var encoded_params = encodeURIComponent(JSON.stringify(params));
    url += "?where=" + encoded_params;
  }
  
  // verifies optionals were provided if not initializes with defaults
  optionals = optionals != null ? optionals : {};
  optionals.limit = optionals.limit != null ? optionals.limit : 999;
  optionals.skip = optionals.skip != null ? optionals.skip : 0;
  
  // builds optionals query string
  var optStr = '';  
  for (var key in optionals) {
    if (optionals.hasOwnProperty(key)) {
      optStr += key + '=' + encodeURIComponent(optionals[key]) + '&';
    }
  }
     
  // builds request url with optional parameters
  url += params != null ? '&' + optStr : '?' + optStr;
  
  var options = { 
    "method"  : "get",
    "headers" : makeHeaders(),
  };
    
  var resp = UrlFetchApp.fetch(url, options);   // fetches query results
  var rsText = resp.getContentText();           // gets response as text
  var results = [];                             // default response is empty array

  Logger.log("Query Result: " + rsText);
  
  if (resp.getResponseCode() == 200) {
    results = JSON.parse(rsText)["results"];
  }
  
  return results;
}

/**
 * Updates an object in Parse with given params.
 * @param {String} classname the name of the class to be updated
 * @param {String} objectId the id of the object to be updated
 * @param {Object} params an object defining the parameters to be updated
 * @return {Object} a JSON object containing just an updatedAt field with the timestamp of the update.
 */
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
  if (resp.getResponseCode() == 200) {
    result = JSON.parse(resp.getContentText());
  } else {
    Logger.log(resp.getContentText());
  }
  
  return result;
}

/**
 * Inserts a new object with the givem params.
 * @param {String} classname the name of the class to be updated
 * @param {Object} params an object defining the parameters to be inserted.
 * @return {Object} a JSON object containing the objectId and the createdAt timestamp of the newly-created object, null otherwise.
 */
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
  
  // per http://docs.parseplatform.org/rest/guide/#creating-objects
  // when the creation is successful, the HTTP response is a 201 Created 
  if (resp.getResponseCode() == 201) {
    result = JSON.parse(resp.getContentText());
  } else {
    Logger.log(resp.getContentText());
  }
  
  return result;
}

/**
 * Deletes an object from Parse given an id.
 * @param {String} classname the name of the class to be updated
 * @param {String} objectId the id of the object to be updated
 * @return {Bool} true if object was deleted succesfully.
 */
function parseDelete(className, objectId) {
  var url = PARSE_URL + className + '/' + objectId;
  var options = {
    "method"  : "delete",
    "headers" : makeHeaders(),
    "contentType" : "application/json"
  };
  
  var resp = UrlFetchApp.fetch(url, options);
  var result = false;
  if (resp.getResponseCode() == 200) {
    result = true;
  } else {
    Logger.log(resp.getContentText());
  }
  
  return result;
}

/**
 * Utility function that creates a pointer object with a classname and objectId filled in.
 * @param {String} classname the name of the pointed been defined
 * @param {String} objectId the id of the pointed been defined
 * @return a pointer object with a classname and objectId filled in.
 */
function parseMakePointerWithId(className, objId) {
  return {
    "__type": "Pointer", 
    "className": className,
    "objectId": objId
  };
}

/**
 * Utility function that returns the header keys to authenticate the calls.
 * @return an object holding the header keys to authenticate the network calls.
 */
function makeHeaders() {
  var headers = {
    "X-Parse-Application-Id": "ENTER-YOUR-APP-ID",
    "X-Parse-REST-API-Key": "ENTER-THE-REST-API-KEY-FOR-YOUR-APP"
  };

  return headers;
}

// base url for parse requests
var PARSE_URL = "https://YOUR-PARSE-SERVER-URL/classes/";