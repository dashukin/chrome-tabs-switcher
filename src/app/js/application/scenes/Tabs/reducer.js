/**
 * @name chrome
 * @type {Object}
 */

import Fuse from 'fuse.js';

import constants from '../../constants';

const {
	APPLY_TABS_FILTER,
	RESET_TABS_FILTER,
	INCREMENT_SELECTED_INDEX,
	DECREMENT_SELECTED_INDEX,
	SWITCH_TAB_BY_SELECTED_INDEX,
	UPDATE_TABS,
	SWITCH_TAB,
	CLOSE_TAB,
	SET_WINDOW_ID
} = constants;

const initialState = {
	filter: '',
	tabs: [],
	filteredTabs: [],
	selectedIndex: 0,
	windowId: null
};

/**
 * Get next tab index depending on specified direction
 * @param selectedIndex {Number} Currently selected tab index
 * @param filteredTabs {Object[]} Array of filtered tabs
 * @param reverse {Boolean} Direction
 * @returns {Number} Next/previous index
 */
const getUpdatedSelectedIndex = ({selectedIndex, filteredTabs, reverse}) => {
	let lastIndex = filteredTabs.length - 1;
	let nextIndex = reverse ? selectedIndex - 1 : selectedIndex + 1;
	let outputIndex = nextIndex < 0 ? lastIndex : (nextIndex > lastIndex ? 0 : nextIndex);
	return outputIndex;
};

/**
 *
 * @param selectedIndex {Number} Tab index in filtered array
 * @param filteredTabs {Object[]} Filtered tabs
 */
const switchTabBySelectedIndex = ({selectedIndex, filteredTabs}) => {
	let tab = filteredTabs[selectedIndex];
	if (tab) {
		let {windowId, index} = tab;
		// TODO: move to service???
		chrome.runtime.sendMessage({
			name: 'highlightTab',
			windowId,
			index
		});
	}
};

/**
 *
 * @param windowId {Number} Window id
 * @param index {Number} Tab index
 */
const switchTab = (windowId, index) => {
	chrome.runtime.sendMessage({
		name: 'highlightTab',
		windowId,
		index
	});
}

/**
 *
 * @param id {Number} Tab id
 */
const closeTab = (id) => {
	chrome.runtime.sendMessage({
		name: 'closeTab',
		id
	});
};

/**
 * Filter Tabs according to filter string.
 * If no filter provided - return tabs sorted by current windowId id any.
 * @param tabs {Object[]}
 * @param filter {String}
 * @param windowId {Number}
 * @returns {*}
 */
const filterTabs = ({tabs, filter, windowId}) => {

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

	} else if (windowId) {
		// In case windowId is provided - sort tabs.
		// First of all - show tabs which belong to current window.
		let tabsCopy = Array.prototype.slice.call(tabs);

		filteredTabs = tabsCopy.filter(tab => {
			return tab.windowId === windowId
		}).concat(tabsCopy.filter(tab => {
			return tab.windowId !== windowId;
		}));

	} else {
		filteredTabs = tabs;
	}

	return filteredTabs;
};

const tabsReducer = (state = initialState, action) => {

	let filteredTabs;

	switch (action.type) {
		case APPLY_TABS_FILTER:
			filteredTabs = filterTabs({
				tabs: state.tabs,
				filter: action.filter,
				windowId: state.windowId
			});
			return {...state, filter: action.filter, filteredTabs};
			break;

		case RESET_TABS_FILTER:
			return {...state, filter: '', selectedIndex: 0};
			break;

		case INCREMENT_SELECTED_INDEX:
			let nextIndex = getUpdatedSelectedIndex({...state, reverse: false});
			return {...state, selectedIndex: nextIndex};
			break;

		case DECREMENT_SELECTED_INDEX:
			let prevIndex = getUpdatedSelectedIndex({...state, reverse: true});
			return {...state, selectedIndex: prevIndex};
			break;

		case SWITCH_TAB_BY_SELECTED_INDEX:
			// Side effect?
			switchTabBySelectedIndex(state);
			return state;
			break;

		case SWITCH_TAB:
			switchTab(action.windowId, action.index);
			return state;
			break;

		case CLOSE_TAB:
			// TODO: move to container's method???
			closeTab(action.id);
			return state;
			break;

		case UPDATE_TABS:
			let {tabs} = action;
			filteredTabs = filterTabs({
				tabs,
				filter: state.filter,
				windowId: state.windowId
			});
			return {...state, tabs, filteredTabs};
			break;

		case SET_WINDOW_ID:
			return {...state, windowId: action.windowId};
			break;

		default:
			return state;
	}
};

export default tabsReducer;