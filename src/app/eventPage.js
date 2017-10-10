// Background script

/**
 * @name chrome
 * @type {Object}
 * @property onCreated
 * @property onUpdated
 * @property onDetached
 * @property onAttached
 * @property onRemoved
 * @property onReplaced
 */

/**
 * @name tabs
 * @type {Object}
 * @memberOf chrome
 * @property highlight
 */

/**
 * @name windows
 * @type {Object}
 * @memberOf chrome
 * @property WINDOW_ID_CURRENT {Number}
 */

/**
 * @name Promise
 * @type {Object}
 * @property all
 */

import Promise from 'bluebird';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	const {name} = request;

	switch (name) {
		case 'getTabs':
			const {id: tabId, windowId: senderWindowId} = sender.tab;

			chrome.tabs.query({
				//currentWindow: data.currentWindow
			}, (tabs) => {
				tabsListUpdate({
					tabId,
					windowId: senderWindowId,
					tabs
				});
			});
			break;

		case 'highlightTab':
			const {index, windowId} = request;

			highlightTab(windowId, index);

			break;

		case 'closeTab':
			const {id} = request;

			chrome.tabs.remove(id, r => {
				chrome.tabs.query({
					currentWindow: true
				}, (tabs) => {
					const [{index, windowId}] = tabs.filter(tab => {
						return tab.id === sender.tab.id
					});
					highlightTab(windowId, index);
				})
			});
			break;
	}

});

// update tabs list when tab is created
chrome.tabs.onCreated.addListener(() => {
	updateAllTabsWithTabsList();
});
// update tabs list when any tab is updated
chrome.tabs.onUpdated.addListener(() => {
	updateAllTabsWithTabsList();
});
// update tabs list when any tab is detached
chrome.tabs.onDetached.addListener(() => {
	updateAllTabsWithTabsList();
});
// update tabs list when any tab is attached
chrome.tabs.onAttached.addListener(() => {
	updateAllTabsWithTabsList();
});
// update tabs list when any tab is removed
chrome.tabs.onRemoved.addListener(() => {
	updateAllTabsWithTabsList();
});
// update tabs list when any tab is replaced
chrome.tabs.onReplaced.addListener(() => {
	updateAllTabsWithTabsList();
});


function updateAllTabsWithTabsList () {
	chrome.tabs.query({
		//currentWindow: true
	}, (tabs) => {
		tabs.forEach(({id: tabId}) => {
			tabsListUpdate({tabId, tabs});
		});
	});
}

function tabsListUpdate ({tabId, tabs, windowId = null}) {
	chrome.tabs.sendMessage(tabId, {
		name: 'tabsListUpdate',
		data: {
			tabs,
			windowId
		}
	});
}

function highlightTab (windowId, index) {
	// query all already higlighted tabs
	chrome.tabs.query({
		//currentWindow: true,
		windowId,
		highlighted: true
	}, (tabs) => {
		const promises = [];

		// reset "highlighted" property for all tabs
		tabs.forEach(tab => {
			const promise = new Promise((resolve, reject) => {
				chrome.tabs.update(tab.id, {
					highlighted: false
				}, r => resolve());
			});
			promises.push(promise);
		});

		Promise.all(promises).then(() => {
			// switch to target window if it's not the current one
			if (windowId !== chrome.windows.WINDOW_ID_CURRENT) {
				chrome.windows.update(windowId, {
					focused: true
				}, () => {

				});
			}

			// make required tab highlighted
			chrome.tabs.highlight({
				windowId,
				tabs: index
			});
		});

	});
}

