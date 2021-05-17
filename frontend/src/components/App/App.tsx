import React, { useState } from 'react';
import Layout from '../Layout/Layout';
import Home from "../../pages/Home";
import Admin from "../../pages/Admin";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import ApiService from '../../services/ApiService';

function App() {
  const [apiService] = useState<ApiService>(new ApiService());

  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/">
            <Home apiService={apiService}/>
          </Route>
          <Route exact path="/admin">
            <Admin apiService={apiService}/>
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
