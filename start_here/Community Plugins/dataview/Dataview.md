**About**: Provides a JavaScript API and pipeline-based query language for filtering, sorting, and extracting data from Markdown pages.
- Major aspects: data indexing and querying.
- Dataview generates _data_ from your vault by pulling information from **Markdown frontmatter** and **Inline fields**.
	- Markdown frontmatter is arbitrary YAML enclosed by `---` at the top of a markdown document which can store metadata about that document.
		---
		alias: "document"
		last-reviewed: 2021-08-17
		thoughts:
		  rating: 8
		  reviewable: false
		---
	- Inline fields are a Dataview feature which allow you to write metadata directly inline in your markdown document via `Key:: Value` syntax.
		Basic Field:: Value
		**Bold Field**:: Nice!
		You can also write [field:: inline fields]; multiple [field2:: on the same line].
		If you want to hide the (field3:: key), you can do that too.
	- Tags, bullet points (including tasks) are available automatically in dataview
- Dataview's four query modes:
	- **Dataview Query Language (DQL)**: A pipeline-based, vaguely SQL-looking expression language which can support basic use cases.
		![[Screenshot 2023-12-26 at 4.35.30 PM.png]]
	- **Inline Expressions**: DQL expressions which you can embed directly inside markdown and which will be evaluated in preview mode. 
		![[Screenshot 2023-12-26 at 4.36.10 PM.png]]
	- **DataviewJS**: A high-powered JavaScript API which gives full access to the Dataview index and some convenient rendering utilities. Highly recommended if you know JavaScript, since this is far more powerful than the query language.
		![[Screenshot 2023-12-26 at 4.36.17 PM.png]]
	- **Inline JS Expressions**: The JavaScript equivalent to inline expressions, which allow you to execute arbitrary JS inline:
		![[Screenshot 2023-12-26 at 4.36.22 PM.png]]
- Data types:
	- *Text*
	- *Numbers and floats*
	- *Boolean*
	- *Date*
		Example:: 2021-04 
		Example:: 2021-04-18
		Example:: 2021-04-18T04:19:35.000
		Example:: 2021-04-18T04:19:35.000+06:30
	- *Duration*
		Example:: 7 hours
		Example:: 16days
		Example:: 4min
		Example:: 6hr7min
		Example:: 9 years, 8 months, 4 days, 16 hours, 2 minutes
		Example:: 9 yrs 8 min
		- Note, date and duration are compatible with each other. They can be added.
	- *Links to other pages*
	- *List/Array*:
		Example1:: 1, 2, 3
		Example2:: "yes", "or", "no"
	- *Objects* - map of multiple fields under one parent field.
		---
		obj:
		  key1: "Val"
		  key2: 3
		  key3: 
				    - "List1"
				    - "List2"
				    - "List3"
		---


# Implicit Data:
|Field Name|Data Type|Description|
|---|---|---|
|`file.name`|Text|The file name as seen in Obsidians sidebar.|
|`file.folder`|Text|The path of the folder this file belongs to.|
|`file.path`|Text|The full file path, including the files name.|
|`file.ext`|Text|The extension of the file type; generally `md`.|
|`file.link`|Link|A link to the file.|
|`file.size`|Number|The size (in bytes) of the file.|
|`file.ctime`|Date with Time|The date that the file was created.|
|`file.cday`|Date|The date that the file was created.|
|`file.mtime`|Date with Time|The date that the file was last modified.|
|`file.mday`|Date|The date that the file was last modified.|
|`file.tags`|List|A list of all unique tags in the note. Subtags are broken down by each level, so `#Tag/1/A` will be stored in the list as `[#Tag, #Tag/1, #Tag/1/A]`.|
|`file.etags`|List|A list of all explicit tags in the note; unlike `file.tags`, does not break subtags down, i.e. `[#Tag/1/A]`|
|`file.inlinks`|List|A list of all incoming links to this file, meaning all files that contain a link to this file.|
|`file.outlinks`|List|A list of all outgoing links from this file, meaning all links the file contains.|
|`file.aliases`|List|A list of all aliases for the note as defined via the [YAML frontmatter](https://help.obsidian.md/How+to/Add+aliases+to+note).|
|`file.tasks`|List|A list of all tasks (I.e., `\| [ ] some task`) in this file.|
|`file.lists`|List|A list of all list elements in the file (including tasks); these elements are effectively tasks and can be rendered in task views.|
|`file.frontmatter`|List|Contains the raw values of all frontmatter in form of `key \| value` text values; mainly useful for checking raw frontmatter values or for dynamically listing frontmatter keys.|
|`file.day`|Date|Only available if the file has a date inside its file name (of form `yyyy-mm-dd` or `yyyymmdd`), or has a `Date` field/inline field.|
|`file.starred`|Boolean|If this file has been bookmarked via the Obsidian Core Plugin "Bookmarks".|


# Task and List Fields
|Field name|Short hand syntax|
|---|---|
|due|`🗓️YYYY-MM-DD`|
|completion|`✅YYYY-MM-DD`|
|created|`➕YYYY-MM-DD`|
|start|`🛫YYYY-MM-DD`|
|scheduled|`⏳YYYY-MM-DD`|

## Implicit Fields
|Field name|Data Type|Description|
|---|---|---|
|`status`|Text|The completion status of this task, as determined by the character inside the `[ ]` brackets. Generally a space `" "` for incomplete tasks and a `"x"` for complete tasks, but allows for plugins which support alternative task statuses.|
|`checked`|Boolean|Whether or not this task status is empty, meaning it has a space in its `[ ]` brackets|
|`completed`|Boolean|Whether or not this _specific_ task has been completed; this does not consider the completion/non-completion of any child tasks. A task is explicitly considered "completed" if it has been marked with an 'x'. If you use a custom status, i.e. `[-]`, `checked` will be true, whereas `completed` will be false.|
|`fullyCompleted`|Boolean|Whether or not this task and **all** of its subtasks are completed.|
|`text`|Text|The plain text of this task, including any metadata field annotations.|
|`visual`|Text|The text of this task, which is rendered by Dataview. It can be modified to render arbitrary text.|
|`line`|Number|The line of the file this task shows up on.|
|`lineCount`|Number|The number of Markdown lines that this task takes up.|
|`path`|Text|The full path of the file this task is in. Equals to `file.path` for [pages](https://blacksmithgu.github.io/obsidian-dataview/annotation/metadata-pages/)|
|`section`|Link|link to the section this task is contained in.|
|`tags`|List|Any tags inside of the text task.|
|`outlinks`|List|Any links defined in this task.|
|`link`|Link|link to the closest linkable block near this task; useful for making links which go to the task.|
|`children`|List|ny subtasks or sublists of this task.|
|`task`|Boolean|If true, this is a task; otherwise, it is a regular list element.|
|`annotated`|Boolean|True if the task text contains any metadata fields, false otherwise.|
|`parent`|Number|The line number of the task above this task, if present; will be null if this is a root-level task.|
|`blockId`|Text|The block ID of this task / list element, if one has been defined with the `^blockId` syntax; otherwise null.|


# Query
- Data query language supports:
	- Choosing an **output format** of your output (the [Query Type](https://blacksmithgu.github.io/obsidian-dataview/queries/query-types/))
	- Fetch pages **from a certain [source](https://blacksmithgu.github.io/obsidian-dataview/reference/sources/)**, i.e. a tag, folder or link
	- **Filtering pages/data** by simple operations on fields, like comparison, existence checks, and so on
	- **Transforming fields** for displaying, i.e. with calculations or splitting up multi-value fields
	- **Sorting** results based on fields
	- **Grouping** results based on fields
	- **Limiting** your result count
- Query structure:
	- exactly one **Query Type** with zero, one or many [fields](https://blacksmithgu.github.io/obsidian-dataview/annotation/add-metadata/), depending on query type
	- zero or one **FROM** data commands with one to many [sources](https://blacksmithgu.github.io/obsidian-dataview/reference/sources/)
	- zero to many other **data commands** with one to many [expressions](https://blacksmithgu.github.io/obsidian-dataview/reference/expressions/) and/or other infos depending on the data command
	- Pattern:
		![[Screenshot 2023-12-26 at 5.21.39 PM.png]]
- Output Format:
	1. **TABLE**: A table of results with one row per result and one or many columns of field data.
	2. **LIST**: A bullet point list of pages which match the query. You can output one field for each page alongside their file links.
	3. **TASK**: An interactive task list of tasks that match the given query.
	4. **CALENDAR**: A calendar view displaying each hit via a dot on its referred date.
	- After the output format, the fields can include:
		- `file.folder` - adds folder to each item
		- `File path: + file.folder + ...` - String interpolatation/concatenation
- Source
	- Folder - "folder_name"
	- Tag - `#inprogress`
	- Outgoing links - outgoing(`[[source_file]]`)
- Filter, source, group, or limit results
	- **WHERE**: Filter notes based on information **inside** notes, the meta data fields.
	- **SORT**: Sorts your results depending on a field and a direction.
	- **GROUP BY**: Bundles up several results into one result row per group.
	- **LIMIT**: Limits the result count of your query to the given number.
	- **FLATTEN**: Splits up one result into multiple results based on a field or calculation.
- Querying commands:
	- Combine sources with `OR` and `AND`
	- `AS`
	- contains( , )
	- typeof() = ""
	- `DESC` is descending order and `ASC` is ascending order



# Examples:
- Track your sleep by recording it in daily notes, and automatically create weekly tables of your sleep schedule.
- Automatically collect links to books in your notes, and render them all sorted by rating.
- Automatically collect pages associated with today's date and show them in your daily note.
- Find pages with no tags for follow-up, or show pretty views of specifically-tagged pages.
- Create dynamic views which show upcoming birthdays or events recorded in your notes and many more things.


Show all games in the game folder, sorted by rating, with some metadata:
```dataview
table time-played, length, rating
from "games"
sort rating desc
```


List all markdown tasks in un-completed projects:
```dataview
task from #projects/active
```



Show all files in the `books` folder that you read in 2021, grouped by genre and sorted by rating:
dataviewjs
for (let group of dv.pages("#book").where(p => p["time-read"].year == 2021).groupBy(p => p.genre)) {
	dv.header(3, group.key);
	dv.table(["Name", "Time Read", "Rating"],
		group.rows
			.sort(k => k.rating, 'desc')
			.map(k => [k.file.link, k["time-read"], k.rating]))
}

# References:
- Official plug-in GitHub page: https://github.com/blacksmithgu/obsidian-dataview
- Official plug-in documentation: https://blacksmithgu.github.io/obsidian-dataview/
- YouTube Videos
	- https://www.youtube.com/watch?v=buOxN65U0qE