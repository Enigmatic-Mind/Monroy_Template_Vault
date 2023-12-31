Display all tasks that have a start date within 4 weeks from today:
```dataview
TASK
WHERE !completed  AND (start < date(today) + dur(4 weeks)) AND contains(file.folder, this.file.folder)
GROUP BY meta(section).subpath
```
