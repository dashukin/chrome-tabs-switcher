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
import {TabsSearch} from './tabs';
import TabsList from './tabs/tabsList';
import Fuse from 'fuse.js';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

export default class Application extends React.Component {

	constructor (props) {
		super(props);

		this.state = {
			active: false,
			tabs: [],
			sortedTabs: [],
			filteredTabs: [],
			filter: '',
			selectedIndex: 0,
			windowId: null
		};

		this.wrapper = null;
		this.keyboardHandler = this.keyboardHandler.bind(this);

	}

	componentWillMount () {

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

		let {active, filter, selectedIndex} = this.state;

		let wrapperClassName = active ? 'active' : '';

		let outputTabs = this.getOutputTabs();

		let activeStateOutput = active
			?	<div className="tabs-switcher--content">
					<div className="tabs-switcher--components">
						<TabsSearch
							filter={filter}
							onChange={this.applyFilter.bind(this)}
							onKeyDown={this.handleInputKeyboardInteractions.bind(this)}
						/>
						<TabsList
							tabs={outputTabs}
							onItemClicked={this.switchTab.bind(this)}
							onCrossIconClicked={this.closeTab.bind(this)}
							selectedIndex={selectedIndex}
						/>
					</div>
				</div>

			: null;

		return (
			<div
				className={`tabs-switcher--wrapper ${wrapperClassName}`}
				onClick={this.handleOverlayClick.bind(this)}
				ref={wrapper => this.wrapper = wrapper}
			>
				{activeStateOutput}
			</div>

		);
	}

	getTabs () {
		chrome.runtime.sendMessage({
			name: 'getTabs',
			data: {
				currentWindow: true
			}
		}, null, r => {});
	}

	getOutputTabs () {
		let {filter, sortedTabs, filteredTabs} = this.state;
		return filter.length ? filteredTabs : sortedTabs;
	}

	addTabsListeners () {

		chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

			let {name, data: {tabs, windowId = null}} = request;

			switch (name) {
				case 'tabsListUpdate':

					this.updateTabs(tabs);

					if (windowId) {
						this.setState({
							windowId
						});
					}

					break;
			}

		});
	}

	updateTabs (tabs) {

		let {windowId, filter} = this.state;

		let tabsCopy = Array.prototype.slice.call(tabs);

		let sortedTabs = tabsCopy.filter(tab => {
			return tab.windowId === windowId
		}).concat(tabsCopy.filter(tab => {
			return tab.windowId !== windowId;
		}));

		let filteredTabs = this.filterTabs(tabs, filter);

		this.setState({
			tabs,
			sortedTabs,
			filteredTabs
		});
	}

	keyboardHandler (e) {

		if (e.which === 66) {
			// B
			if (e.ctrlKey && !e.shiftKey) {
				this.openApp();
				e.preventDefault();
			}
		} else if (e.which === 27) {
			// Esc
			this.closeApp();
		}
	}

	addEventListeners () {
		document.addEventListener('keydown', this.keyboardHandler, false);
	}

	removeEventListeners () {
		document.removeEventListener('keydown', this.keyboardHandler);
	}

	handleOverlayClick (e) {
		if (e.target === this.wrapper) {
			this.closeApp();
		}
	}

	openApp () {
		this.setState({
			active: true
		});
	}

	closeApp () {

		this.setState({
			active: false,
			filter: '',
			selectedIndex: 0
		});
	}

	filterTabs (tabs, filter) {

		let filteredTabs;

		if (filter.length) {
			let fuse = new Fuse(tabs, {
				caseSensitive: false,
				// include: ['matches', 'score'],
				shouldSort: true,
				tokenize: true,
				matchAllTokens: true,
				threshold: 0.5,
				location: 0,
				distance: 1000,
				maxPatternLength: 32,
				minMatchCharLength: 2,
				keys: [
					'title',
					'url'
				]
			});

			filteredTabs = fuse.search(filter);

		} else {
			filteredTabs = tabs;
		}

		return filteredTabs;
	}

	applyFilter (e) {

		let {value: filter} = e.target;

		let {tabs} = this.state;

		let filteredTabs = this.filterTabs(tabs, filter);

		this.setState({
			filter,
			filteredTabs,
			selectedIndex: 0
		});
	}

	handleInputKeyboardInteractions (e) {

		if (~[38, 40].indexOf(+e.which)) {
			let reverse;

			e.preventDefault();

			if (e.which === 38) {
				reverse = true;
			}

			this.processResultSelection({
				reverse
			});
		} else if (e.which === 13) {
			let {selectedIndex} = this.state;
			this.switchTabBySelectedIndex(selectedIndex);
		}

	}

	switchTabBySelectedIndex (selectedTabIndex) {
		let outputTabs = this.getOutputTabs();
		let tab = outputTabs[selectedTabIndex];
		if (tab) {
			let {windowId, index} = tab;
			this.switchTab(windowId, index);
		}
	}

	processResultSelection ({reverse = false}) {

		let {selectedIndex, filteredTabs} = this.state;
		let lastIndex = filteredTabs.length - 1;
		let nextIndex = reverse ? selectedIndex - 1 : selectedIndex + 1;

		nextIndex = nextIndex < 0 ? lastIndex : (nextIndex > lastIndex ? 0 : nextIndex);

		this.setState({
			selectedIndex: nextIndex
		});
	}

	switchTab (windowId, index) {
		chrome.runtime.sendMessage({
			name: 'highlightTab',
			windowId,
			index
		});
		this.closeApp();
	}

	closeTab (id) {
		chrome.runtime.sendMessage({
			name: 'closeTab',
			id
		});
	}

}
