/**
 * @name chrome
 * @type {Object}
 */

import React from 'react';
import {connect} from 'react-redux';
import TabsSearch from './components/TabsSearch';
import TabsList from './components/TabsList';

// Tabs actions
import {
	applyFilter,
	incrementSelectedIndex,
	decrementSelectedIndex,
	switchTabBySelectedIndex,
	resetTabsFilter,
	closeTab,
	switchTab
} from './actions';

// App actions
import {
	closeApp
} from '../../actions';

class Tabs extends React.Component {

	constructor (props) {
		super(props);
	}

	render () {

		let {filter, tabs, selectedIndex, applyFilter, handleKeyboard, switchTab, closeTab} = this.props;

		return (
			<div className="tabs-switcher__tabs">
				<TabsSearch
					filter={filter}
					onChange={applyFilter}
					onKeyDown={handleKeyboard}
				/>
				<TabsList
					tabs={tabs}
					onItemClicked={switchTab}
					onCrossIconClicked={closeTab}
					selectedIndex={selectedIndex}
				/>
			</div>
		);
	}

}

const mapStateToProps = (state) => {
	// TODO: wtf?
	return {
		filter: state.TabsReducer.filter,
		tabs: state.TabsReducer.filteredTabs,
		selectedIndex: state.TabsReducer.selectedIndex
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		applyFilter: (e) => {
			let {value: filter} = e.target;
			dispatch(applyFilter(filter));
		},
		handleKeyboard: (e) => {

			// handle Top/Bottom arrow keys
			if (~[38, 40].indexOf(+e.which)) {

				e.preventDefault();

				if (e.which === 38) {
					dispatch(decrementSelectedIndex());
				} else {
					dispatch(incrementSelectedIndex());
				}

			}

			// handle Tab key
			if (e.which === 9) {

				e.preventDefault();

				if (e.shiftKey) {
					dispatch(decrementSelectedIndex());
				} else {
					dispatch(incrementSelectedIndex());
				}
			}

			// handle Enter key
			if (e.which === 13) {

				e.preventDefault();

				dispatch(switchTabBySelectedIndex());
				dispatch(resetTabsFilter());
				// TODO: check if app should be closed
				dispatch(closeApp());
			}
		},
		switchTab: (windowId, index) => {
			dispatch(switchTab(windowId, index));
			// TODO: check if app should be closed
			dispatch(closeApp());
		},
		closeTab: (id) => {
			dispatch(closeTab(id));
		}
	}
};

const TabsContainer = connect(mapStateToProps, mapDispatchToProps)(Tabs);

export default TabsContainer;