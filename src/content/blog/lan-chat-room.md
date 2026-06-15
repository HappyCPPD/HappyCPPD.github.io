---
title: "My first socket program: a LAN chat room"
description: "A console chat app in Python with a server and multiple clients, and the networking basics I picked up building it."
pubDate: 2026-05-12
---

This was my first real socket project. The idea is simple: run a server on one machine, connect to it from others on the same network, and pass messages between them.

## How it works

So one machine would run the server while clients could connect to the server's local ip to chat in real time.

## What tripped me up

Getting machines to talk to each other was a lot harder than I thought, having to research how to find the right local ip, port, and handling what happens when a client disconnects without any reason. 

## Why it mattered

Sockets felt alien to me until I had researched it and now I feel a lot more confident on how they work and how to utilize them.

[Source on GitHub](https://github.com/HappyCPPD/python-chat-room)
