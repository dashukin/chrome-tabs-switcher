import TabsReducer from './scenes/Tabs/reducer';
import constants from './constants';

const {
	OPEN_APP,
	CLOSE_APP,
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

		case OPEN_APP:
			return {...state, active: true};
			break;

		case CLOSE_APP:
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