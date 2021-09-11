import * as React from "react";

import * as ReactDOM from "react-dom";

import { App } from "./App";

export const render = (container: HTMLElement): void => {
  ReactDOM.render(<App />, container);
};
