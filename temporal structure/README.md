# Temporal Structures — Full Original Structure

This corrected version preserves all five original D3 sections and canvas containers:

1. Basic setup and axes
2. Event timeline
3. Concurrent events / Gantt chart
4. CSV-loaded timeline
5. Calendar heatmap

The CSV timeline still uses exactly:
name,start,end,category

The calendar dataset still uses exactly:
Date,Close

## Run
Open this folder in VS Code and use the Live Server extension on index.html.
Directly double-clicking index.html may block CSV loading.


## CSV schema compliance

The replacement datasets preserve the original schemas exactly.

events.csv
- name
- start
- end
- category

synthetic-data.csv
- Date
- Close

No additional columns were introduced. The visualization changes are handled entirely in JavaScript and CSS.


## Record-count restoration

- events.csv: 15 data rows, matching the original.
- synthetic-data.csv: 754 data rows, matching the original.
- The date coverage in synthetic-data.csv remains 2021–2023.


## Merged precedent study

The original five D3 exercises remain intact.

The following Evros/Meriç precedent-study visualizations were added:
1. verified historical timeline
2. verified duration chart
3. interpretive event sequence
4. binary wildfire calendar

Separate filenames prevent the precedent data from overwriting the original datasets:
- evros-timeline.csv
- evros-events.csv
- evros-sequence.csv
- evros-fire.csv

The fire calendar is binary and does not claim to represent daily fire intensity.
