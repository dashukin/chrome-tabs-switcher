import React, {Component} from 'react';
import TextField from 'material-ui/TextField';

class TabsSearch extends Component {

	constructor (props) {
		super(props);
		this.searchInput = null;
	}

	componentDidMount () {
		this.setFocus();
	}

	componentDidUpdate () {
		this.setFocus();
	}

	setFocus () {
		this.searchInput && this.searchInput.focus();
	}

	render () {

		let {filter = '', onChange, onKeyDown} = this.props;

		return (
			<div className="tabs-switcher__search-holder">
				<TextField
					fullWidth={true}
					defaultValue={filter}
					onChange={onChange}
					onKeyDown={onKeyDown}
					InputProps={{
						placeholder: 'Type to filter...',
						inputRef: input => this.searchInput = input
					}}
				/>
			</div>
		);
	}

}

export default TabsSearch;
