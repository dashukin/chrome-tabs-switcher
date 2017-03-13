/*
* Navigation bar component
* */

import React from 'react';
import ConfigurationIcon from 'material-ui/svg-icons/action/settings';
import TabsIcon from 'material-ui/svg-icons/action/reorder';
import constants from '../../constants';
const {
	CONFIGURATION_SCREEN
} = constants;

class NavigationBar extends React.Component {

	constructor (props) {
		super(props);
	}

	render () {

		let regularColor = 'rgba(29, 82, 88, 0.3)';
		let hoverColor = 'rgba(29, 82, 88, 0.7)';
		let activeColor = 'rgba(29, 82, 88, 0.6)';

		let configurationColor = this.props.screen === CONFIGURATION_SCREEN ? activeColor : regularColor;

		return (
			<div className="navigation-bar">
				<div className="navigation-bar__holder">
					<a
						className="navigation-bar__link navigation-bar__link--configuration"
						href="javascript:void(0);"
						onClick={this.props.toggleConfigurationScreen}>
						<ConfigurationIcon
							color={configurationColor}
							hoverColor={hoverColor}
						/>
					</a>
					<a
						className="navigation-bar__link navigation-bar__link--tabs"
						href="javascript:void(0);">
						<TabsIcon
							color={regularColor}
							hoverColor={hoverColor}
						/>
					</a>
				</div>
			</div>
		);
	}

}

export default NavigationBar;