/*global
 document
 */

/**
 * @name chrome
 * @type {Object}
 */

/**
 * @name runtime
 * @memberOf chrome
 * @type {Object}
 * @property sendMessage
 * @property onMessage
 */

import React from 'react';
import {connect} from 'react-redux';
import NavigationBar from './components/NavigationBar';
import {Tabs} from './scenes';
import injectTapEventPlugin from 'react-tap-event-plugin';

// App actions
import {
	openApp,
	closeApp,
	toggleConfigurationScreen
} from './actions';

// Tabs actions
import {
	resetTabsFilter,
	updateTabs,
	setWindowId
} from './scenes/Tabs/actions';

injectTapEventPlugin();

class Application extends React.Component {

	constructor (props) {

		super(props);

		this.wrapper = null;
		this.keyboardHandler = this.keyboardHandler.bind(this);

	}

	componentDidMount () {
		this.getTabs();
		this.addTabsListeners();
		this.addEventListeners();
	}

	componentWillUnmount () {
		this.removeEventListeners();
	}

	render () {

		let {active} = this.props;

		let wrapperClassName = active ? 'active' : '';

		let activeStateOutput = active
			?	<div className="tabs-switcher__content">
					<NavigationBar
						screen={this.props.screen}
						toggleConfigurationScreen={this.toggleConfigurationScreen}
					/>
					<div className="tabs-switcher__components">
						<Tabs />
					</div>
				</div>

			: null;

		return (
			<div
				className={`tabs-switcher__wrapper ${wrapperClassName}`}
				onClick={this.handleOverlayClick}
				ref={wrapper => this.wrapper = wrapper}
			>
				{activeStateOutput}
			</div>

		);
	}

	getTabs () {
		// TODO: move to service
		chrome.runtime.sendMessage({
			name: 'getTabs',
			data: {
				currentWindow: true
			}
		}, null, r => {});
	}

	addTabsListeners () {

		// TODO: Move to service
		chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

			let {name, data: {tabs, windowId = null}} = request;

			switch (name) {
				case 'tabsListUpdate':

					this.props.updateTabs(tabs);

					if (windowId) {
						this.props.setWindowId(windowId);
					}

					break;
			}

		});
	}

	keyboardHandler (e) {

		if (e.which === 66) {
			// B
			// TODO: process configuration
			if (e.ctrlKey && !e.shiftKey) {
				this.props.openApp();
				e.preventDefault();
			}
		} else if (e.which === 27) {
			// Esc
			this.props.closeApp();
		}
	}

	addEventListeners () {
		document.addEventListener('keydown', this.keyboardHandler, false);
	}

	removeEventListeners () {
		document.removeEventListener('keydown', this.keyboardHandler);
	}

	handleOverlayClick = (e) => {
		if (e.target === this.wrapper) {
			this.props.closeApp();
			this.props.resetTabsFilter();
		}
	}

	toggleConfigurationScreen = (e) => {
		e.preventDefault();
		this.props.toggleConfigurationScreen();
	}
}

const mapStateToProps = (state) => {
	return {
		// TODO: wtf?
		active: state.AppReducer.active,
		screen: state.AppReducer.screen
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		openApp: () => {
			dispatch(openApp());
		},
		closeApp: () => {
			dispatch(closeApp());
		},
		resetTabsFilter: () => {
			dispatch(resetTabsFilter());
		},
		updateTabs: tabs => {
			dispatch(updateTabs(tabs));
		},
		setWindowId: windowId => {
			dispatch(setWindowId(windowId));
		},
		toggleConfigurationScreen: () => {
			dispatch(toggleConfigurationScreen());
		}
	}
};

const ConnectedApplication = connect(mapStateToProps, mapDispatchToProps)(Application);

export default ConnectedApplication;
