// Content script

import appConfig from './application/app.config';
import React from 'react';
import ReactDom from 'react-dom';
import Application from './application/';
import * as reducers from './application/reducer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';

let appId = String.prototype.toLowerCase.call(appConfig.appId || '').replace(/\s/g, '');

let appHolder = document.createElement('div');
appHolder.id = appId;
appHolder.className = appId;

document.body.appendChild(appHolder);

const App = () => {
	return (
		<MuiThemeProvider>
			<Application />
		</MuiThemeProvider>
	);
};

const appStore = createStore(combineReducers(reducers));

ReactDom.render(
	<Provider store={appStore}>
		<App/>
	</Provider>,
	appHolder
);
