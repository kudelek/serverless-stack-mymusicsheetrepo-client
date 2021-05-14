import React from 'react';
import ReactDOM from 'react-dom';
// import * as Sentry from "@sentry/react";
// import { Integrations } from "@sentry/tracing";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import config from './config';
import { Amplify } from 'aws-amplify';
import { initSentry } from './libs/errorLib';
import { ReactComponent as Eighths } from './assets/eighths.svg';

initSentry();

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID
  },
  API: {
    endpoints: [
      {
        name: "mymusicsheetrepo-api",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
    ]
  }
});

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ul className="background">
        <li><Eighths/></li>
        <li><Eighths/></li>
        <li><Eighths/></li>
        <li><Eighths/></li>
        <li><Eighths/></li>
        <li><Eighths/></li>
        <li><Eighths/></li>
        <li><Eighths/></li>
        <li><Eighths/></li>
        <li><Eighths/></li>
        <li><Eighths/></li>
        <li><Eighths/></li>
        <li><Eighths/></li>
        <li><Eighths/></li>
        <li><Eighths/></li>
        <li><Eighths/></li>
        <li><Eighths/></li>
        <li><Eighths/></li>
        <li><Eighths/></li>
        <li><Eighths/></li>
        <li><Eighths/></li>
        <li><Eighths/></li>
      </ul>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
