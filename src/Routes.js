import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NotFound from "./containers/NotFound";
import NewMusicSheet from "./containers/NewMusicSheet";
import MusicSheet from "./containers/MusicSheet";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

export default function Routes() {
  return (
    <Switch>
        <Route exact path="/">
            <Home />
        </Route>

        <UnauthenticatedRoute exact path="/login">
            <Login />
        </UnauthenticatedRoute>
        <UnauthenticatedRoute exact path="/signup">
            <Signup />
        </UnauthenticatedRoute>
        <AuthenticatedRoute exact path="/mymusicsheetrepo/new">
            <NewMusicSheet />
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path="/mymusicsheetrepo/:id">
            <MusicSheet />
        </AuthenticatedRoute>

        {/* Finally, catch all unmatched routes */}
        <Route>
            <NotFound />
        </Route>
    </Switch>
  );
}