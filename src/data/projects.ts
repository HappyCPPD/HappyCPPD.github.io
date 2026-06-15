export interface Project {
  title: string;
  kicker: string;        // short discipline label (mono eyebrow)
  summary: string;       // one strong sentence
  detail: string;        // what you actually did / learned
  tags: string[];
  links: { label: string; href: string }[];
  featured?: boolean;
}

export const projects: Project[] = [
  {
    title: 'Hack The Box: Oopsie',
    kicker: 'Offensive security',
    summary: 'My first full Hack The Box machine, taken from a guest cookie to a shell on the box.',
    detail:
      'I chained four small web flaws into a foothold: an IDOR that leaked the admin account ID, a role cookie I could edit in the browser to become that admin, and an upload form with no checks that let me run a PHP reverse shell. From there I found a reused database password and switched to a real user account. It was my first time using Burp Suite and reverse shells, and I spent a solid hour pointing the netcat listener at the wrong machine before the idea of a callback connection finally clicked. The write-up explains the whole thing from scratch, including that mistake.',
    tags: ['Hack The Box', 'Web exploitation', 'Burp Suite', 'Reverse shell', 'Linux'],
    links: [{ label: 'Read the write-up', href: '/blog/oopsie-hackthebox/' }],
    featured: true,
  },
  {
    title: 'SSH Failed Login Analyzer',
    kicker: 'Security tooling',
    summary: 'A Python tool that reads a Linux auth log and reports which IP addresses keep failing to log in over SSH.',
    detail:
      'It scans auth.log for "Failed password" lines, pulls the IPv4 address out of each one with a regex, and counts attempts per address so the noisiest sources sit at the top. Standard library only, split into small read, count, and report functions with clear handling for a missing or unreadable file. I built it because triaging auth logs is the kind of work a junior analyst actually does, and I wanted to do it by hand before reaching for a bigger tool.',
    tags: ['Python', 'Log parsing', 'Regex', 'SSH'],
    links: [
      { label: 'Read the write-up', href: '/blog/ssh-failed-login-analyzer/' },
      { label: 'Source', href: 'https://github.com/HappyCPPD/AuthLogReader' },
    ],
  },
  {
    title: 'Subnet Scanner',
    kicker: 'Networking',
    summary: 'A command line tool that finds live hosts on a network and checks which common ports they have open.',
    detail:
      'You give it a subnet in CIDR notation. It pings every address to find live hosts, then opens short lived TCP connections to common ports like SSH, HTTP, HTTPS, SMB, and RDP on each host that answered, and prints a table of hosts and their open ports. It runs on a thread pool, so a full subnet finishes in seconds instead of minutes, and it stays on the Python standard library. Building it made me separate the two questions a scan really asks: is this host alive, and is something listening behind that port.',
    tags: ['Python', 'Networking', 'Port scanning', 'Threading'],
    links: [
      { label: 'Read the write-up', href: '/blog/subnet-scanner/' },
      { label: 'Source', href: 'https://github.com/HappyCPPD/Subnet-Scanner' },
    ],
    featured: true,
  },
  {
    title: 'LAN Chat Room',
    kicker: 'Sockets',
    summary: 'A console chat app in Python that runs a server and connects multiple clients over a local network.',
    detail:
      'One machine runs the server, others join as clients by pointing at its local IP, and messages pass between them in real time. It was my first proper look at sockets and the client to server model, including the small frustrations of getting two machines to talk on the same network.',
    tags: ['Python', 'Sockets', 'Networking'],
    links: [
      { label: 'Read the write-up', href: '/blog/lan-chat-room/' },
      { label: 'Source', href: 'https://github.com/HappyCPPD/python-chat-room' },
    ],
  },
];
