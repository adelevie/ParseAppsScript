Helps your Spreadsheets interact with Parse.com.

## Quickstart

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
```