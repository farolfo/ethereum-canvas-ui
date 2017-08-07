Ethereum Million Dollar Homepage UI
=====================

This the UI project of the Ethereum Million Dollar Homepage (https://github.com/farolfo/eth-million-dollar-homepage).
The goal of this project is to develop the million dollar home page (http://www.milliondollarhomepage.com/) using a Smart Contract as core backend service, developed with Solidity (https://solidity.readthedocs.io/en/develop/#). This backend will be consumed by a web UI via an RPC API and Solidity events.

This project uses the amazing library D3.js to draw the window.

### Install

```bash
$ npm install
```

### Run

```bash
$ browserify app.js -o bundle.js && python -m SimpleHTTPServer 8000
```