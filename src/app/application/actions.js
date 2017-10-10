import constants from './constants';
const {
	APP_OPEN,
	APP_CLOSE,
	TOGGLE_CONFIGURATION_SCREEN,
	CONFIGURATION_SCREEN
} = constants;

export const openApp = () => {
	return {
		type: APP_OPEN
	}
};

export const closeApp = () => {
	return {
		type: APP_CLOSE
	};
};

export const toggleConfigurationScreen = () => {
	return {
		type: TOGGLE_CONFIGURATION_SCREEN
	}
};