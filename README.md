Helps your Spreadsheets interact with Parse.com.

## Quickstart

The Google Apps Script gallery is being finnicky, so for now, this is the easiest way to get started:

1. Copy `parse.gs`.
2. Create a new Google Spreadsheet.
3. Tools -> Script Editor
4. Paste
5. See `examples.gs` or below:

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
