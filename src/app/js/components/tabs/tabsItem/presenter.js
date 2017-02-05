import React from 'react';
import {Card, CardTitle} from 'material-ui/Card';

function switchTab (index) {

	chrome.runtime.sendMessage({
		name: 'highlightTab',
		index
	});
}

export default ({url, title, id, index}) =>
	<div className="tabs-switcher--tab-card" onClick={switchTab.bind(null, index)}>
		<Card>
			<CardTitle
				title={title}
				subtitle={url}
				style={{
					padding: '5px 10px'
				}}
			/>
		</Card>
	</div>