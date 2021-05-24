import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useHistory } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import ErrorBoundary from "./components/ErrorBoundary";
import { AppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import Routes from "./Routes";
import { ReactComponent as Logo } from "./assets/logo-new.svg";
import "./App.css";

function App() {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  useEffect(() => {
    onLoad();
  }, []);
  
  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();
  
    userHasAuthenticated(false);

    history.push("/login");
  }

  return (
    !isAuthenticating && (
      <div className="App container py-3">
        <Navbar bg="transparent" className="mb-3 d-flex">
          <LinkContainer to="/">
              <Navbar.Brand className="font-weight-bold text-dark text-uppercase brand-mobile">
                <Logo fill="#444444"/>
                My Music Sheet Repo
              </Navbar.Brand>
          </LinkContainer>
          <LinkContainer to="/">
          <Navbar.Brand className="font-weight-bold text-dark text-uppercase brand-desktop">
                <Logo fill="#444444"/>
                MMSR
              </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
            <Nav activeKey={window.location.pathname} className="d-flex justify-content-end w-100 mobile">
              {isAuthenticated ? (
                <>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link className="dark">Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link className="dark">Login</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
        </Navbar>
        <ErrorBoundary>
          <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
            <Routes />
          </AppContext.Provider>
        </ErrorBoundary>
      </div>
    )
  );
}

export default App;