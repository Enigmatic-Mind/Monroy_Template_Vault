```dataview
TABLE WITHOUT ID name, priority, start, review, added, tags
FROM (#somedaymaybe)
WHERE !contains(tags, "undefined") AND !contains(tags, "#undefined")
```
