import * as React from "react";

import { CssBaseline } from "@material-ui/core";

import { Challenge } from "./Challenge";

export const App: React.FC = () => (
  <>
    <CssBaseline />
    <h1>Alg.Wiki</h1>
    <Challenge />
  </>
);
