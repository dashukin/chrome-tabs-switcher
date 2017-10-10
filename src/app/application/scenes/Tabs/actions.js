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
	TABS_UPDATE,
	TABS_CLOSE,
	TABS_SWITCH,
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
		type: TABS_CLOSE,
		id
	}
}

export const switchTab = (windowId, index) => {
	return {
		type: TABS_SWITCH,
		windowId,
		index
	}
}

export const updateTabs = (tabs) => {
	return {
		type: TABS_UPDATE,
		tabs
	}
};

export const setWindowId = (windowId) => {
	return {
		type: SET_WINDOW_ID,
		windowId
	}
}

