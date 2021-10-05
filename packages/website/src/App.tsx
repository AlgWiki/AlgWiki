import * as React from "react";

import { CssBaseline } from "@material-ui/core";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import { Challenge } from "./Challenge";
import { Header } from "./Header";

export const App: React.FC = () => (
  <Router>
    <CssBaseline />
    <Header />
    <Switch>
      <Route path="/login/github">Logged in!</Route>

      <Route path="/">
        <Challenge />
      </Route>
    </Switch>
  </Router>
);
