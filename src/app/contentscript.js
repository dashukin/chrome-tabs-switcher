// Content script

import appConfig from	'./application/config';
import React from		'react';
import ReactDom from	'react-dom';
import Application from './application/';
import * as reducers from './application/reducer';
import createMuiTheme		from 'material-ui/styles/createMuiTheme';
import {MuiThemeProvider}	from 'material-ui/styles';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';

const appId = String.prototype.toLowerCase.call(appConfig.appId || '').replace(/\s/g, '');

const appHolder = document.createElement('div');
appHolder.id = appId;
appHolder.className = appId;

document.body.appendChild(appHolder);

const muiTheme = createMuiTheme({

});

const App = () => {
	return (
		<MuiThemeProvider theme={muiTheme}>
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
