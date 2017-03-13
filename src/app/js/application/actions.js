import constants from './constants';
const {
	OPEN_APP,
	CLOSE_APP,
	TOGGLE_CONFIGURATION_SCREEN,
	CONFIGURATION_SCREEN
} = constants;

export const openApp = () => {
	return {
		type: OPEN_APP
	}
};

export const closeApp = () => {
	return {
		type: CLOSE_APP
	};
};

export const toggleConfigurationScreen = () => {
	return {
		type: TOGGLE_CONFIGURATION_SCREEN
	}
};