import React from 'react';
import TextField from 'material-ui/TextField';

export default class TabsSearch extends React.Component {

	constructor (props) {
		super(props);

		this.searchInput = null;
	}

	componentDidMount () {

		this.searchInput && this.searchInput.focus();

	}

	render () {

		let {filter = '', onChange, onKeyDown} = this.props;

		return (
			<div className="tabs-switcher--search-holder">
				<TextField
					fullWidth={true}
					ref={input => this.searchInput = input}
					hintText="Type to filter..."
					defaultValue={filter}
					onChange={onChange}
					onKeyDown={onKeyDown}
				/>
			</div>
		);
	}

}
