This project uses [npm audit](https://docs.npmjs.com/cli/audit) to scan dependencies for vulnerabilities
and automatically install any compatible updates to vulnerable dependencies.
The security audit is also integrated into the project's CI pipeline via [audit-ci](https://github.com/IBM/audit-ci) command
which fails the build if there is any vulnerability found.
It is possible to ignore specific errors by whitelisting them in [audit-ci config.](./audit-ci.json).

## NPM audit whitelist
Whenever you whitelist a specific advisory it is required to refer it to here and justify the whitelisting.

### Advisories

| #    | Level | Module | Title | Explanation |
|------|-------|---------|------|-------------|
| 1500 | Low | babel-minify>yargs-parser | Prototype Pollution | dev dependency only |
| 1490 | Low | babel-cli > chokidar > ...<multiple> > kind-of | Validation Bypass | dev dependency only |
| 1589 | Low | babel/cli>chokidar>fsevents>node-pre-gyp>rc>ini | Prototype Pollution | dev dependency only |