import React from 'react';
import ReactDom from 'react-dom';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import ActionClose from 'material-ui/svg-icons/content/clear';
import {cyan800} from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';

const SelectableList = makeSelectable(List);

export default class TabsList extends React.Component {

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

		let {tabs = [], selectedIndex} = this.props;

		let tabsList = tabs.map((tab, tabsCollectionIndex) => {

			let {title, url, windowId, index, id, favIconUrl} = tab;

			let favicon = <Avatar
				size={30}
				src={favIconUrl}
				style={{
					background: 'transparent',
					borderRadius: 'none'
				}}/>;

			let outputAvatar = this.isSecureProtocol
				? (/https/.test(favIconUrl)
					? favicon
					: null)
				: favicon

			return (
				<ListItem
					key={tab.id}
					value={tabsCollectionIndex}
					primaryText={title}
					ref={listItem => {
						if (tabsCollectionIndex === selectedIndex) {
							this.selectedListItem = listItem;
						}
					}}
					secondaryText={url}
					onClick={this.switchTab.bind(this, windowId, index)}
					rightIcon={
						<ActionClose
							hoverColor={cyan800}
							onClick={this.closeTab.bind(this, id)}
						/>
					}
					hoverColor='rgba(0,0,0, 0.05)'
					leftAvatar={outputAvatar}
				/>
			);

		})

		return (
			<div
				className="tabs-switcher__list-holder"
				ref={element => this.rootElement = element}
			>
				<SelectableList
					defaultValue={0}
					value={selectedIndex}
				>
					{tabsList}
				</SelectableList>
			</div>
		);
	}

}
