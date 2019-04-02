import { action, observable } from 'mobx';

import * as $ from 'jquery';

export const NETWORK_UI_NAMES: { [key:string]: string } = {
  mainnet: 'Ethereum Mainnet',
  kovan: 'Kovan - Ethereum Testnet',
  rinkeby: 'Rinkeby - Ethereum Testnet',
  ropsten: 'Ropsten - Ethereum Testnet',
  goerli: 'Goerli - Ethereum Testnet',
};

// Key is name of the example call, i.e. eth_getBlockNumber
// Value is stringified JSON of example call for that method
export type ExampleCallMap = { [key:string]: string };

// Key is the network key (i.e. kovan, goerli)
export type NetworkExamplesMap = { [key:string]: ExampleCallMap };

// Special rate limited key for demo purposes only - get your own full access key at https://beta.dashboard.nodesmith.io
const API_KEY = '7636d5cb49914f62b4e106bae02b9e25';

export default class AppState {
  constructor() {
    this.setIsLoading(true);

    // This app comes pre loaded with sample JSON-RPC methods for each network, so
    // that developers can quickly try out various calls.
    this.loadSamples().then(() => {
      this.setIsLoading(false);
    });
  }

  @observable public isLoading: boolean;
  @action public setIsLoading = (isLoading: boolean) => {
    this.isLoading = isLoading;
  }

  /**
   * First we populate the request payload with an example, but as the user starts interacting
   * with the console, switch to using this store variable, so their changes persist between re-renders.
   */
  @observable public userRequestPayload?: string;
  @action public setUserRequestPayload = (userRequestPayload?: string) => {
    this.userRequestPayload = userRequestPayload;
  }

  @observable public networkExamplesMap: NetworkExamplesMap;
  @action private setNetworkExamplesMap = (examples: NetworkExamplesMap) => {
    this.networkExamplesMap = examples;
  }

  @observable public requestResponse: string;
  @action public changeRequestResponse = (response: string) => {
    this.requestResponse = response;
  }

  @observable public isSendingRequest: boolean;
  @action public changeIsSendingRequest = (isSending: boolean) => {
    this.isSendingRequest = isSending;
  }

  /**
   * Takes a JSON payload as a string and sends the request to the Nodesmith endpoint.
   */
  @action public sendQuery = async (requestBody: string, network: string) => {
    this.changeIsSendingRequest(true);
    const endpoint = `https://ethereum.api.nodesmith.io/v1/${network}/jsonrpc?apiKey=${API_KEY}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Traffic-Source': 'playground'
      },
      body: requestBody
    });

    try {
      const responseJson = await response.json();
      this.changeRequestResponse(JSON.stringify(responseJson));
    } catch (e) {
      this.changeRequestResponse(JSON.stringify({ errorMessage: 'Unknown error occurred, please try again.' }));
    }

    this.changeIsSendingRequest(false);
  }

  /**
   * Parse examples found in JSON files stored in public/exampleCalls
   */
  private loadSamples = async() => {
    const networkKeys = Object.keys(NETWORK_UI_NAMES);
    const networkExamples: NetworkExamplesMap = {};
    for (let i = 0; i < networkKeys.length; i++) {
      const key = networkKeys[i];
      const examples: ExampleCallMap = {};

      try {
        const jsonExamples = await $.getJSON(`./exampleCalls/${key}.json`) as Array<any>;
        jsonExamples.forEach((example) => {
          const apiName = example.method as string;
          examples[apiName] = JSON.stringify(example);
        });

        networkExamples[key] = examples;
      } catch (e) {
        throw `Unexpected error trying to read ./exampleCalls/${key}.json`;
      }
    }

    this.setNetworkExamplesMap(networkExamples);
  }
}
