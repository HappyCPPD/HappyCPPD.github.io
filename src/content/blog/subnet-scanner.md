---
title: "Writing a subnet scanner to see how host discovery works"
description: "A standard library Python tool that pings a subnet for live hosts and checks common ports, and what it showed me about the network stack."
pubDate: 2026-05-28
---

I use tools like nmap without really knowing what they do under the surface, so I built a small version of one myself.

## What it does

You give it a subnet in CIDR notation, like `192.168.1.0/24`. The scan runs in two stages that line up with two layers of the network stack:

- **Ping sweep:** it shells out to the operating system's `ping` for every address in the range. A reply means the host is reachable.
- **Port check:** for each host that answered, it opens a short lived TCP connection to a few well known ports. A successful handshake means something is listening.

It prints the result as a table of live hosts and their open ports:

```text
Live IP Address     Open Ports
---------------------------------------------
192.168.1.1         80, 443
192.168.1.14        22
192.168.1.20        445, 3389
```

## What I learned

The thing that stuck was that these are two different questions. A ping tells you a machine is alive. It tells you nothing about what it runs. The TCP handshake is what actually proves a service is listening. Splitting the scan into those two stages made the difference between Layer 3 and Layer 4 concrete in a way a textbook never did.

The other lesson was speed. Network calls spend almost all their time waiting, so doing them one at a time is painfully slow across a whole subnet. I put the work on a thread pool, which dropped a full scan from minutes to seconds.

## Limits and ethics

Some firewalls drop ICMP, so a host that ignores pings looks down even when its ports are open. A future version could skip the ping step and check ports directly for those cases.

One rule matters more than any feature: only scan networks you own or have explicit permission to test. Scanning someone else's network can be illegal where you live.

[Source on GitHub](https://github.com/HappyCPPD/Subnet-Scanner)
