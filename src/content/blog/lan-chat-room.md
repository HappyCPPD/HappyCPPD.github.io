---
title: "My first socket program: a LAN chat room"
description: "A console chat app in Python with a server and multiple clients, and the networking basics I picked up building it."
pubDate: 2026-05-12
---

This was my first real socket project. The idea is simple: run a server on one machine, connect to it from others on the same network, and pass messages between them.

## How it works

One machine runs the server. Each client opens the script, points at the server's local IP, and connects. From there, messages typed on one client show up for the others in real time. It only works on a LAN, which kept the scope small enough to actually finish.

## What tripped me up

Getting two machines to talk was harder than the code itself. Finding the right local IP, making sure the port was open, and handling a client that disconnects without warning were all small lessons that do not show up when everything runs on one laptop.

## Why it mattered

Sockets felt abstract until I had two terminals on two machines sending text back and forth. After this I understood the client to server model in a way that reading about it never gave me.

[Source on GitHub](https://github.com/HappyCPPD/python-chat-room)
