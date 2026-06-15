---
title: "Writing a subnet scanner to see how host discovery works"
description: "A standard library Python tool that pings a subnet for live hosts and checks common ports, and what it showed me about the network stack."
pubDate: 2026-05-28
---

I use tools like nmap without really knowing what they do under the surface, so I built a small version of one myself.

## What it does

You give it a subnet in CIDR notation, like `192.168.1.0/24`. The scan runs in two stages that line up with two layers of the network stack:

- **Ping sweep:** It pings every ip in range. If it receives a reply, that host is reachable.
- **Port check:** After finding the reachable hosts, it opens a TCP connection to a few well known ports. A successful handshake means something is listening.



It prints the result as a table of live hosts and their open ports:

```text
Live IP Address     Open Ports
---------------------------------------------
192.168.1.1         80, 443
192.168.1.14        22
192.168.1.20        445, 3389
```

## What I learned

I initially thought that there was no difference between being able to ping and being able to get a successful handshake, however doing research led me to know that a ping just tells you the machine is alive while the receiving a handshake proves that the service is listening. 

I also learnt that network calls spend almost all their time waiting so doing it one at a time is very slow. I researched that I had to put the work on a thread pool which causes it to speed up.

## Limits and ethics

Some firewalls drop ICMP, so a host that ignores pings looks down even when its ports are open. A future version could skip the ping step and check ports directly for those cases.

Of course, I would never use this tool in a place where I do not have explicit permission to test. 


[Source on GitHub](https://github.com/HappyCPPD/Subnet-Scanner)
