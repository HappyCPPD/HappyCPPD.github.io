---
title: "Reading auth logs by hand before reaching for a tool"
description: "A small Python script that counts failed SSH logins per IP, and what it taught me about log triage."
pubDate: 2026-06-10
---

When I started looking at how attacks show up on a real server, everyone points at the authentication log first. So I wrote a small Python tool to read it myself instead of installing something bigger.

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
- `count_failed_ips` runs the regex and tallies matches in a `Counter`
- `print_report` formats the sorted table and the summary
- `main` reads the command line argument and handles the missing file and permission cases

The regular expression is `Failed password.*?from (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})`. It matches a standard sshd failure line and captures the address after `from`.

## What I actually learned

The interesting part was not the regex, it was deciding what a clean report should say. If the file has no failed logins, the tool says so instead of printing an empty table. If the file is missing or unreadable, it prints a clear error and exits with a non zero status. Small choices, but they are the difference between a script and something another person could use.

## Limits

Right now it only handles IPv4 and only the `Failed password` message. Real logs record failures in other shapes too. I left those out on purpose, because the goal was to learn how to filter and automate with Python, not to cover every case on the first pass.

[Source on GitHub](https://github.com/HappyCPPD/AuthLogReader)
