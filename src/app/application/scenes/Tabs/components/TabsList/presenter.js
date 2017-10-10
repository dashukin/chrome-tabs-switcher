import React, {Component}	from 'react';
import ReactDom				from 'react-dom';
import List, {ListItem, ListItemText, ListItemSecondaryAction}
							from 'material-ui/List';
import IconButton			from 'material-ui/IconButton';
import Avatar				from 'material-ui/Avatar';
import IconClose			from 'material-ui-icons/Clear';


class TabsList extends Component {

	constructor (props) {
		super(props);

		this.rootElement = null;
		this.selectedListItem = null;
		this.isSecureProtocol = /https/.test(location.protocol);
	}

	componentDidMount () {
		this.makeListItemVisible();
	}

	componentDidUpdate () {
		this.makeListItemVisible();
	}

	makeListItemVisible () {
		let {selectedListItem} = this;
		let listItemNode = ReactDom.findDOMNode(selectedListItem);

		if (!listItemNode) {
			return;
		}

		let rootCoordinates = this.rootElement.getBoundingClientRect();
		let listItemCoordinates = listItemNode.getBoundingClientRect();

		if (listItemCoordinates.top < rootCoordinates.top) {
			listItemNode.scrollIntoView(true);
		} else if (listItemCoordinates.bottom > rootCoordinates.bottom) {
			listItemNode.scrollIntoView(false);
		}
	}

	switchTab (windowId, index) {
		this.props.onItemClicked(windowId, index);
	}

	closeTab (id, e) {
		e.stopPropagation();
		this.props.onCrossIconClicked(id);
	}

	render () {
		const {tabs = [], selectedIndex} = this.props;
		const tabsList = tabs.map((tab, tabsCollectionIndex) => {

			let {title, url, windowId, index, id, favIconUrl} = tab;

			let favicon = <Avatar
				size={30}
				src={favIconUrl}
			/>;

			let outputAvatar = this.isSecureProtocol
				? (/https/.test(favIconUrl)
					? favicon
					: null)
				: favicon

			return (
				<ListItem
					key={tab.id}
					value={tabsCollectionIndex}
					ref={listItem => {
						if (tabsCollectionIndex === selectedIndex) {
							this.selectedListItem = listItem;
						}
					}}
					onClick={this.switchTab.bind(this, windowId, index)}
				>
					{outputAvatar}
					<ListItemText primary={title} secondary={url} />
					<ListItemSecondaryAction>
						<IconButton>
							<IconClose
								onClick={this.closeTab.bind(this, id)}
							/>
						</IconButton>
					</ListItemSecondaryAction>
				</ListItem>
			);

		})

		return (
			<div
				className="tabs-switcher__list-holder"
				ref={element => this.rootElement = element}
			>
				<List>
					{tabsList}
				</List>
			</div>
		);
	}

}

export default TabsList;
