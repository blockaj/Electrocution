#BugFree Archer
Bugfree Archer is a server built on node.js. As of now, the only functionality is an online chat but
who knows what's going to come next.
##Setup
1. Download Bugfree Archer: `git clone https://github.com/blockaj/bugfree-archer.git`
2. `cd` into the directory where you downloaded Bugfree Archer
3. Configure the server in configure.json

    {
      "db": "name of database",
      "port": "port to run server on",
      "adminUsername": "admin username",
      "adminPassword": "admin password",
      "sessionSecret": "session secret for security purposes"
    }
4. Run `make install` to download and install all of the node modules
