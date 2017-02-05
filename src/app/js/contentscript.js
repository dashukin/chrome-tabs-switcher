// Content script

import appConfig from './app.config';
import React from 'react';
import ReactDom from 'react-dom';
import Application from './components/application';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

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
}

ReactDom.render(<App/>, appHolder);
