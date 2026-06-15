---
title: "Reading auth logs by hand before reaching for a tool"
description: "A small Python script that counts failed SSH logins per IP, and what it taught me about log triage."
pubDate: 2026-06-10
---

In school, in multiple of my modules, I have been told about logs. In several games I play and programs I run, there's logs. So, I thought that if any actual attacks would show up on a server, the logs would be able to point out what happened. So to understand how to make a script to automate and make my life easier because I realize that there are logs that are massive, is to write a script to pull out a certain type of information I needed.

## What it does

The script scans a Linux `auth.log` for lines that contain `Failed password`, pulls the IPv4 address out of each line, and counts how many times each address appears. It prints a table sorted from most attempts to fewest, so the noisiest source sits at the top.

```
IP Address    Failed Attempts
------------  ---------------
192.168.1.50  3
172.16.254.1  2
10.0.0.99     1
```

## How I structured it

I split the work into four small functions so each piece was easy to follow:

- `read_log` opens the file and returns its lines
- `count_failed_ips` runs the regex and counts matches in a `Counter`
- `print_report` formats the sorted table and the summary
- `main` reads the command line argument and handles the missing file and permission cases

My first regex was `Failed password.*?from (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})`. It worked on real logs, but it has a quiet bug: `\d{1,3}` happily matches `999.999.999.999`, which is not a valid address. This was not going to work if I had to filter out thousands of logs, what if there was a lot of those invalid addresses, it would totally mess up the table.

So I tightened each octet to the 0–255 range:

```
Failed password.*?from ((?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})
```

It is uglier, but it now rejects malformed addresses instead of silently counting them.

## What I actually learned

The interesting part was not the regex, it was deciding what a clean report should say. If the file has no failed logins, the tool says so instead of printing an empty table. If the file is missing or unreadable, it prints a clear error and exits with a non zero status. 

## Limits

Right now it only handles IPv4 and only the `Failed password` message. Real logs record failures in other shapes too. I left those out on purpose, because the goal was to learn how to filter and automate with Python, not to cover everything during my first try although I am very excited to start working on those.

[Source on GitHub](https://github.com/HappyCPPD/AuthLogReader)
