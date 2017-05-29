/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import 'babel-polyfill';

// Import all the third party stuff
// ** Stuff for Rover project
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import { Router, Route } from 'react-router';
import configureStore from './store';
// ** END Stuff for Rover project

// import { applyRouterMiddleware, Router} from 'react-router';

// import { syncHistoryWithStore } from 'react-router-redux';
// import { useScroll } from 'react-router-scroll';

import 'sanitize.css/sanitize.css';

// Import root app
// import App from 'containers/App';
import RoversApp from 'containers/RoversApp';

// Import i18n messages
// import { translationMessages } from './i18n';


// Import root routes
// import createRoutes from './routes';

// Create redux store with history
// this uses the singleton browserHistory provided by react-router
// Optionally, this could be changed to leverage a created history
// e.g. `const browserHistory = useRouterHistory(createBrowserHistory)();`
// const initialState = {};
// const store = configureStore(initialState, browserHistory);


// Sync history and store, as the react-router-redux reducer
// is under the non-default key ("routing"), selectLocationState
// must be provided for resolving how to retrieve the "route" in the state
// const history = syncHistoryWithStore(browserHistory, store, {
//     selectLocationState: makeSelectLocationState(),
// });

// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./favicon.ico';
import '!file-loader?name=[name].[ext]!./manifest.json';
import 'file-loader?name=[name].[ext]!./.htaccess';
/* eslint-enable import/no-unresolved, import/extensions */


// Import CSS reset and Global Styles
import './global-styles';

const store = configureStore();

// Set up the router, wrapping all Routes in the App component
// const render = () => {
  ReactDOM.render(
    <Provider store={store}>
        <RoversApp/>
    </Provider>,
    document.getElementById('app')
  );
// };


// Hot reloadable translation json files
// if (module.hot) {
//   // modules.hot.accept does not accept dynamic dependencies,
//   // have to be constants at compile-time
//   module.hot.accept('./i18n', () => {
//     render(translationMessages);
//   });
// }

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}
