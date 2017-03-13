/**
 * Tabs actions
 */

import constants from '../../constants';

const {
	APPLY_TABS_FILTER,
	RESET_TABS_FILTER,
	INCREMENT_SELECTED_INDEX,
	DECREMENT_SELECTED_INDEX,
	SWITCH_TAB_BY_SELECTED_INDEX,
	UPDATE_TABS,
	CLOSE_TAB,
	SWITCH_TAB,
	SET_WINDOW_ID
} = constants;

export const applyFilter = (filter) => {
	return {
		type: APPLY_TABS_FILTER,
		filter
	}
}

export const incrementSelectedIndex = () => {
	return {
		type: INCREMENT_SELECTED_INDEX
	}
}

export const decrementSelectedIndex = () => {
	return {
		type: DECREMENT_SELECTED_INDEX
	}
}

export const switchTabBySelectedIndex = () => {
	return {
		type: SWITCH_TAB_BY_SELECTED_INDEX
	}
}

export const resetTabsFilter = () => {
	return {
		type: RESET_TABS_FILTER
	}
}

export const closeTab = (id) => {
	return {
		type: CLOSE_TAB,
		id
	}
}

export const switchTab = (windowId, index) => {
	console.warn(windowId, index);
	return {
		type: SWITCH_TAB,
		windowId,
		index
	}
}

export const updateTabs = (tabs) => {
	return {
		type: UPDATE_TABS,
		tabs
	}
};

export const setWindowId = (windowId) => {
	return {
		type: SET_WINDOW_ID,
		windowId
	}
}

