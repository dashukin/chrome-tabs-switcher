import TabsReducer from './scenes/Tabs/reducer';
import constants from './constants';

const {
	APP_OPEN,
	APP_CLOSE,
	TOGGLE_CONFIGURATION_SCREEN,
	TABS_SCREEN,
	CONFIGURATION_SCREEN
} = constants;

const initialState = {
	active: false,
	screen: TABS_SCREEN
};

const AppReducer = (state = initialState, action) => {

	switch (action.type) {

		case APP_OPEN:
			return {...state, active: true};
			break;

		case APP_CLOSE:
			return {...state, active: false};
			break;

		case TOGGLE_CONFIGURATION_SCREEN:
			let {screen} = state;
			let newScreen = screen === CONFIGURATION_SCREEN ? TABS_SCREEN : CONFIGURATION_SCREEN;
			return {...state, screen: newScreen}
			break;

		default:
			return state;
	}
}

export {
	TabsReducer,
	AppReducer
};