import React from 'react';
import Layout from '../Layout/Layout';
import Home from "../../pages/Home";
import Admin from "../../pages/Admin";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/admin">
            <Admin />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
