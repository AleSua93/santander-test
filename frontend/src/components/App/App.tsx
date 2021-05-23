import React, { useState } from 'react';
import Layout from '../Layout/Layout';
import Home from "../../pages/Home";
import Admin from "../../pages/Admin";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import ApiService from '../../services/ApiService';
import Login from '../../pages/Login';
import { useAuth } from '../../hooks/useAuth';

function App() {
  const [apiService] = useState<ApiService>(new ApiService());
  const auth = useAuth();

  return (
      <Router>
      <Layout>
      <Switch>
      {auth && auth.accessToken ?
      <>
        <Route exact path="/">
          <Home apiService={apiService}/>
        </Route>
        {auth.userInfo && auth.userInfo.isAdmin ?
          <Route exact path="/admin">
            <Admin apiService={apiService}/>
          </Route>
        : <></> }
      </> :
        <>
          <Redirect to="/login"/>
          <Route path="/login">
            <Login />
          </Route>
        </>
       }  
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
