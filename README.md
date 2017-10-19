Ethereum Canvas UI
=====================

This the UI project of the [Ethereum Canvas](https://github.com/farolfo/ethereum-canvas).

The goal of this project is to develop a canvas of pixels such that any user can buy and paint them using EHT, similar to the [MillionDollarHomePage.com](http://milliondollarhomepage.com/) project but in this case the pixels can be bought by other users if they pay more for it.
It makes usage of a Smart Contract as core backend service, developed with [Solidity](https://solidity.readthedocs.io/en/develop/#).

The backend will be consumed by this UI project via an RPC API with the Chrome extension [MetaMask](https://metamask.io/), and drawing the canvas with [D3](https://d3js.org/).

### Install

This was developed with the node version `^6.11.0`. We highly recommend [`nvm`](https://github.com/creationix/nvm) to manage node versions on your machine.

Run

```bash
$ npm install
```

Make sure you have the `grunt-cli` command installed in order to use the [Grunt](https://gruntjs.com/getting-started) task manager.

```bash
npm install -g grunt-cli
```

### Configure

Update the file at `config/config.js` setting the correct Smart Contract build JSON output. This means copying the generated JSON in the `build/contracts/EthereumContract.json` of the Smart Contract project and putting it in that field.

Please note that this configuration should be improved as it is a tedious manual process, but is also a good practice to keep the latest smart contract abi committed in the file in the mid time.

Also update the `config/config.js` setting the right Smart Contract address.

### Deploy and run

Make sure you have installed [MetaMask](https://metamask.io/) in your browser. Set it to listen to the `localhost:8545` chain.

Then just run the web app with

```bash
$ npm run deploy
```

And go to `localhost:9000`.
