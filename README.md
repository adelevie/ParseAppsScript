Helps your Spreadsheets interact with Parse.com.

## Quickstart

The Google Apps Script gallery is being finnicky, so for now, this is the easiest way to get started:

1. Copy `parse.gs`.
2. Create a new Google Spreadsheet.
3. Create a new sheet and make sure it is first sheet (closes to left side of the screen).
4. Enter your Parse Application ID in Cell B:1 and your Parse REST API Key in Cell B:2.
5. Tools -> Script Editor
6. Paste
7. See `examples.gs` or below:

```javascript
parseInsert("GameScore",{
  "score" : 1000,
  "playerName" : "Sean Plott"
});

results = parseQuery("GameScore", {
  'playerName' : 'Sean Plott'
});

var objectId = results[0].objectId;
parseUpdate("GameScore", objectId, {
	"playerName" : "Sean Plott III"
});
```

## Cron

Here's a neat trick to run cron tasks for free:

1. Open the Google Apps Script editor.
2. Define function that you want to run in the cron task.
3. Resources -> Current Script Triggers
4. Select the function from step two, and customize to your needs.

### Cron example

Let's say you're running a script that will tally the score for a multiplayer game. You have a class called `Game` with the boolean field `scored` and the integer fields `homeScore` and `awayScore`.

Let's load some sample data:

```javascript
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
```

And here's the scoring script:

```javascript
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
```

So to get this script to run every minute, just click "Resources" -> "Current Script Triggers", then select "scoreGames()" from the function list and set it to run every minute.