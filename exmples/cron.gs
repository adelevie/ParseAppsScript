function setupData() {
  parseInsert("Game", {
    "scored" : true,
    "homeScore" : 55,
    "awayScore" : 44,
    "winner" : "home"
  });
  parseInsert("Game", {
    "scored" : false,
    "homeScore" : 99,
    "awayScore" : 59
  });
  parseInsert("Game", {
    "scored" : false,
    "homeScore" : 46,
    "awayScore" : 12,
  });
  parseInsert("Game", {
    "scored" : false,
    "homeScore" : 66,
    "awayScore" : 100,
  });
}

function scoreGames() {
  var games = parseQuery("Game", {
    "scored" : false
  });
  for (var i = 0; i < games.length; i++) {
    var objectId = games[i].objectId;
    var winner;
    if (games[i].homeScore > games[i].awayScore) { // home team wins
      winner = "home";
    } else if (games[i].homeScore < games[i].awayScore) { //away team wins
      winner = "away";
    } else { // tie
      winner = "tie";
    }
    parseUpdate("Game", objectId, {
      "scored" : true,
      "winner" : winner
    });
  }
}