import TextToolbar from 'main';
import { App, debounce, Editor, Plugin, PluginManifest } from 'obsidian';
import { TextToolbarSettings } from 'settings/settings';

export const arrayMove = <T>(array: T[], fromIndex: number, toIndex: number): void => {
	if (toIndex < 0 || toIndex === array.length) {
		return;
	}
	const temp = array[fromIndex];
	array[fromIndex] = array[toIndex];
	array[toIndex] = temp;
};

export const iwCheck = (settings: TextToolbarSettings) => {
	const iw = window.innerWidth;
	const lThreshold = parseInt(settings.l_window_width_thresholds);
	const sThreshold = parseInt(settings.s_window_width_thresholds);
	const wSize = (() => {
		if (iw >= lThreshold) {
			return 'l_';
		} else if (iw <= sThreshold) {
			return 's_';
		} else {
			return 'm_';
		}
	})();
	return wSize;
};

export const fontSizeAdjust = (Class: string) => {
	const el = <HTMLCollection>document.getElementsByClassName(Class);
	for (let i = 0; i < el.length; i++) {
		const label = <HTMLElement>el[i];

		label.style.position = 'relative';
		label.style.boxSizing = 'border-box';
		label.style.margin = '0';
		label.style.padding = '0';
		label.style.maxWidth = '100%';
		label.style.maxHeight = '100%';
		label.style.borderWidth = '1em';
		label.style.zIndex = 'auto';

		const contentWidth = label.parentElement.clientWidth;
		const font_size = document.defaultView.getComputedStyle(label, null).fontSize;
		const labelWidth = label.clientWidth;

		if (labelWidth > contentWidth) {
			label.style.left = -Math.floor((label.offsetWidth - contentWidth) / 2) + 'px';

			const newLabelWidth = label.clientWidth;
			const scale = Math.fround((contentWidth / newLabelWidth) * 10) / 10;

			label.style.transform = `scale(${scale})`;
		}
		if (label.offsetHeight > label.parentElement.clientWidth) {
			label.style.top = -Math.floor((label.offsetHeight - label.parentElement.clientWidth) / 2) + 'px';
		}
	}
};

export const toolBarPosInit = (toolBar: HTMLDivElement, settings: TextToolbarSettings) => {
	const wSize = iwCheck(settings);

	const display_position = settings[`${wSize}toolbar_display_position`];
	const vertical_offset = parseInt(settings[`${wSize}toolbar_vertical_offset`]);
	const horizontal_offset = parseInt(settings[`${wSize}toolbar_horizontal_offset`]);

	if (display_position === 'top') {
		const editorContainer = document.querySelector('div.workspace-split.mod-vertical.mod-root');
		const editorPosition = editorContainer.getBoundingClientRect();
		const newPositionTop = vertical_offset + 'px';
		const newPositionLeft =
			editorPosition.left + editorContainer.clientWidth / 2 - toolBar.clientWidth / 2 + horizontal_offset + 'px';
		document.documentElement.style.setProperty('--tt-toolbar-top', newPositionTop);
		document.documentElement.style.setProperty('--tt-toolbar-bottom', 'unset');
		document.documentElement.style.setProperty('--tt-toolbar-left', newPositionLeft);
		document.documentElement.style.setProperty('--tt-toolbar-right', 'unset');
	} else if (display_position === 'bottom') {
		const editorContainer = document.querySelector('div.workspace-split.mod-vertical.mod-root');
		const editorPosition = editorContainer.getBoundingClientRect();
		const newPositionBottom = vertical_offset + 'px';
		const newPositionLeft =
			editorPosition.left + editorContainer.clientWidth / 2 - toolBar.clientWidth / 2 + horizontal_offset + 'px';
		document.documentElement.style.setProperty('--tt-toolbar-top', 'unset');
		document.documentElement.style.setProperty('--tt-toolbar-bottom', newPositionBottom);
		document.documentElement.style.setProperty('--tt-toolbar-left', newPositionLeft);
		document.documentElement.style.setProperty('--tt-toolbar-right', 'unset');
	} else if (display_position === 'left') {
		const bodyHeight = document.body.clientHeight;
		const newPositionTop = bodyHeight / 2 - toolBar.clientHeight / 2 + vertical_offset + 'px';
		const newPositionLeft = horizontal_offset + 'px';
		document.documentElement.style.setProperty('--tt-toolbar-top', newPositionTop);
		document.documentElement.style.setProperty('--tt-toolbar-bottom', 'unset');
		document.documentElement.style.setProperty('--tt-toolbar-left', newPositionLeft);
		document.documentElement.style.setProperty('--tt-toolbar-right', 'unset');
	} else if (display_position === 'right') {
		const bodyHeight = document.body.clientHeight;
		const newPositionTop = bodyHeight / 2 - toolBar.clientHeight / 2 + vertical_offset + 'px';
		const newPositionRight = horizontal_offset + 'px';
		document.documentElement.style.setProperty('--tt-toolbar-top', newPositionTop);
		document.documentElement.style.setProperty('--tt-toolbar-bottom', 'unset');
		document.documentElement.style.setProperty('--tt-toolbar-left', 'unset');
		document.documentElement.style.setProperty('--tt-toolbar-right', newPositionRight);
	}
};

export const detachToolBar = (toolBar: HTMLDivElement) => {
	if (document.getElementsByClassName('text-tool-bar')[0]) {
		document
			.getElementsByClassName('text-tool-bar')[0]
			.removeEventListener('wheel', TextToolbar.wheelScroll.handler, true);
		document.removeEventListener('keydown', TextToolbar.keyScroll.handler, true);
		document.querySelector('body').removeChild(toolBar);
		const view = <HTMLElement>document.getElementsByClassName('cm-content')[0];
		if (view) view.focus();
	}
};

export class WheelScroll extends Plugin {
	toolBar: HTMLDivElement;
	settings: TextToolbarSettings;
	editor: Editor;
	handler: (ev: WheelEvent) => void;
	constructor(app: App, manifest: PluginManifest, settings: TextToolbarSettings) {
		super(app, manifest);
		this.settings = settings;
	}
	snap(ev: WheelEvent) {
		const snap = debounce(
			(ev: WheelEvent) => {
				const wSize = iwCheck(this.settings);
				const container = document.getElementsByClassName('text-tool-bar-container');
				const button_size = parseInt(this.settings[`${wSize}button_size`]);
				const button_spacing = parseInt(this.settings[`${wSize}button_spacing`]);
				const number_of_rows_in_the_toolbar = parseInt(this.settings[`${wSize}toolbar_number_of_rows`]);
				const clientHeight = container[0].clientHeight;
				const scrollHeight = container[0].scrollHeight;
				const isScrollBottom = () => {
					if (scrollHeight - (clientHeight + container[0].scrollTop) <= button_spacing * 1.2) {
						return true;
					}
				};
				const isScrollTop = () => {
					if (container[0].scrollTop <= button_spacing * 1.2) return true;
				};
				//down
				if (ev.deltaY > 50) {
					if (isScrollBottom()) {
						container[0].scrollTo({
							top: 0,
							left: 0,
							behavior: 'smooth',
						});
					} else if (!isScrollBottom()) {
						container[0].scrollBy({
							top: (button_size + button_spacing) * number_of_rows_in_the_toolbar,
							left: 0,
							behavior: 'smooth',
						});
					}
					//up
				} else if (ev.deltaY < -50) {
					if (isScrollTop()) {
						container[0].scrollTo({
							top: scrollHeight,
							left: 0,
							behavior: 'smooth',
						});
					} else if (!isScrollTop()) {
						container[0].scrollBy({
							top: -(button_size + button_spacing) * number_of_rows_in_the_toolbar,
							left: 0,
							behavior: 'smooth',
						});
					}
				}
			},
			100,
			true
		);
		snap(ev);
	}
}

export class KeyScroll extends Plugin {
	settings: TextToolbarSettings;
	editor: Editor;
	handler: (ev: KeyboardEvent) => void;
	isFromBtm: boolean;
	constructor(app: App, manifest: PluginManifest, settings: TextToolbarSettings) {
		super(app, manifest);
		this.settings = settings;
	}

	snap(ev: KeyboardEvent) {
		const wSize = iwCheck(this.settings);
		const button_size = parseInt(this.settings[`${wSize}button_size`]);
		const button_spacing = parseInt(this.settings[`${wSize}button_spacing`]);
		const number_of_buttons_per_line = parseInt(this.settings[`${wSize}toolbar_number_of_buttons_per_line`]);
		const number_of_rows_in_the_toolbar = parseInt(this.settings[`${wSize}toolbar_number_of_rows`]);
		const activeEl = <HTMLButtonElement>document.activeElement;
		const activeNum = parseInt(activeEl.name);
		const activeNumP = activeNum + 1;
		const container = document.getElementsByClassName('text-tool-bar-container');
		const btn = document.getElementsByClassName('text-tool-bar-btn');
		const btn0 = <HTMLButtonElement>btn[0];

		//Remove toolbar with escape key
		if (ev.key === 'Escape') {
			detachToolBar(TextToolbar.toolBar);
			return;
		}
		//If the button is unfocused, focus with the tab key.
		if (activeEl.className !== 'text-tool-bar-btn' && ev.key === 'Tab') {
			btn0.focus();
		}

		const inRange = (min: number, max: number, num: number) => min <= num && num <= max;
		const btnCount = container[0].childElementCount;
		let lastMultiple: number;

		if (btnCount % number_of_buttons_per_line == 0) {
			lastMultiple = btnCount;
		} else {
			lastMultiple = (Math.floor(btnCount / number_of_buttons_per_line) + 1) * number_of_buttons_per_line;
		}

		const page = number_of_buttons_per_line * number_of_rows_in_the_toolbar;
		const pageCount = Math.floor(lastMultiple / page);
		const pageBreak: number[] = new Array();

		for (let i = 0; i <= lastMultiple; i += page) {
			pageBreak.push(i);
		}
		pageBreak.shift();

		const isFirstPage = () => {
			const min = 1;
			let max;
			if (!this.isFromBtm) {
				max = page;
			} else if (this.isFromBtm) {
				max = lastMultiple - page * pageCount;
			}
			if (inRange(min, max, activeNumP)) {
				return true;
			} else {
				return false;
			}
		};

		const isLastPage = () => {
			let min;
			if (pageBreak[pageBreak.length - 1] < btnCount) {
				min = pageBreak[pageBreak.length - 1] + 1;
			} else {
				min = lastMultiple - page + 1;
			}

			const max = lastMultiple;
			if (inRange(min, max, activeNumP)) {
				this.isFromBtm = true;
			} else if (isFirstPage()) {
				this.isFromBtm = false;
			}
		};
		isLastPage();

		const isPageBreak = () => {
			if (ev.key === 'ArrowDown' && !this.isFromBtm) {
				for (let i = 0; i < pageBreak.length; i++) {
					const min = pageBreak[i] - number_of_buttons_per_line + 1;
					const max = pageBreak[i];
					if (inRange(min, max, activeNumP)) {
						return true;
					}
				}
			} else if (ev.key === 'ArrowDown' && this.isFromBtm) {
				const newArr = pageBreak.map((value) => {
					return value + number_of_buttons_per_line;
				});
				for (let i = 0; i < newArr.length; i++) {
					const min = newArr[i] - number_of_buttons_per_line + 1;
					const max = newArr[i];
					const num = lastMultiple - activeNumP + 1;
					if (inRange(min, max, num)) {
						return true;
					}
				}
			} else if (ev.key === 'ArrowUp' && !this.isFromBtm) {
				const newArr = pageBreak.map((value) => {
					return value + number_of_buttons_per_line;
				});
				for (let i = 0; i < newArr.length; i++) {
					const min = newArr[i] - number_of_buttons_per_line + 1;
					const max = newArr[i];
					if (inRange(min, max, activeNumP)) {
						return true;
					}
				}
			} else if (ev.key === 'ArrowUp' && this.isFromBtm) {
				for (let i = 0; i < pageBreak.length; i++) {
					const min = pageBreak[i] - number_of_buttons_per_line + 1;
					const max = pageBreak[i];
					const num = lastMultiple - activeNumP + 1;
					if (inRange(min, max, num)) {
						return true;
					}
				}
			} else if (ev.key === 'ArrowRight' && !this.isFromBtm) {
				for (let i = 0; i < pageBreak.length; i++) {
					if (activeNumP === pageBreak[i]) {
						return true;
					}
				}
			} else if (ev.key === 'ArrowRight' && this.isFromBtm) {
				const num = lastMultiple - activeNumP + 1;
				const arr = pageBreak.map((value) => {
					return value + 1;
				});
				for (let i = 0; i < arr.length; i++) {
					if (num === arr[i]) {
						return true;
					}
				}
			} else if (ev.key === 'ArrowLeft' && !this.isFromBtm) {
				const arr = pageBreak.map((value) => {
					return value + 1;
				});
				for (let i = 0; i < arr.length; i++) {
					if (activeNumP === arr[i]) {
						return true;
					}
				}
			} else if (ev.key === 'ArrowLeft' && this.isFromBtm) {
				const num = lastMultiple - activeNumP + 1;
				for (let i = 0; i < pageBreak.length; i++) {
					if (num === pageBreak[i]) {
						return true;
					}
				}
			}
		};

		const isFirstRow = () => {
			const min = 1;
			const max = number_of_buttons_per_line;
			if (inRange(min, max, activeNumP)) {
				return true;
			}
		};

		const isLastRow = () => {
			const min = lastMultiple - number_of_buttons_per_line + 1;
			const max = lastMultiple;
			if (inRange(min, max, activeNumP)) {
				return true;
			}
		};

		const moveNext = () => {
			ev.preventDefault();

			const nextNum = activeNum + 1;
			//If it's the last button, go back to the first button.
			if (nextNum === container[0].childElementCount) {
				const nextEl = <HTMLButtonElement>container[0].firstElementChild;
				nextEl.focus({ preventScroll: true });
				container[0].scrollTo({
					top: 0,
					left: 0,
					behavior: 'smooth',
				});
				//If it's a page break, go to the next page.
			} else if (isPageBreak()) {
				const nextEl = <HTMLButtonElement>container[0].children[nextNum];
				nextEl.focus({ preventScroll: true });
				container[0].scrollBy({
					top: (button_size + button_spacing) * number_of_rows_in_the_toolbar,
					left: 0,
					behavior: 'smooth',
				});
				//Next button exists
			} else if (nextNum < container[0].childElementCount) {
				const nextEl = <HTMLElement>container[0].children[nextNum];
				nextEl.focus();
			}
		};

		const movePrev = () => {
			ev.preventDefault();
			const prevNum = activeNum - 1;
			//If it's the first button, go to the last button.
			if (activeNum === 0) {
				const prevEl = <HTMLElement>container[0].lastElementChild;
				prevEl.focus({ preventScroll: true });
				container[0].scrollTo({
					top: container[0].scrollHeight,
					left: 0,
					behavior: 'smooth',
				});
				//If it's a page break, go to the previous page.
			} else if (isPageBreak()) {
				const prevEl = <HTMLElement>container[0].children[prevNum];
				prevEl.focus({ preventScroll: true });
				container[0].scrollBy({
					top: -(button_size + button_spacing) * number_of_rows_in_the_toolbar,
					left: 0,
					behavior: 'smooth',
				});
				//Focus on previous button
			} else if (activeNum !== 0) {
				const prevEl = <HTMLElement>container[0].children[prevNum];
				prevEl.focus();
			}
		};
		const moveDown = () => {
			ev.preventDefault();
			const nextNum = activeNum + number_of_buttons_per_line;
			const nextEl = <HTMLElement>container[0].children[nextNum];

			//No next button, but if there is a next row, focus on the last button.
			if (!nextEl && !isLastRow()) {
				const prevEl = <HTMLElement>container[0].lastElementChild;
				prevEl.focus({ preventScroll: true });
				container[0].scrollTo({
					top: container[0].scrollHeight,
					left: 0,
					behavior: 'smooth',
				});
			}
			//If there is no next button, go back to the beginning.
			else if (!nextEl) {
				const nextNum = activeNum % number_of_buttons_per_line;
				const nextEl = <HTMLButtonElement>container[0].children[nextNum];
				nextEl.focus({ preventScroll: true });
				container[0].scrollTo({
					top: 0,
					left: 0,
					behavior: 'smooth',
				});
				//If it's a page break, turn the page.
			} else if (isPageBreak()) {
				const nextNum = activeNum + number_of_buttons_per_line;
				const nextEl = <HTMLButtonElement>container[0].children[nextNum];
				nextEl.focus({ preventScroll: true });
				container[0].scrollBy({
					top: (button_size + button_spacing) * number_of_rows_in_the_toolbar,
					left: 0,
					behavior: 'smooth',
				});
				//Focus on the button below
			} else {
				nextEl.focus({ preventScroll: true });
			}
		};

		const moveUp = () => {
			ev.preventDefault();
			const prevNum = activeNum - number_of_buttons_per_line;
			const prevEl = <HTMLElement>container[0].children[prevNum];
			const min = lastMultiple - number_of_buttons_per_line;
			const max = lastMultiple;
			const arr = new Array();
			for (let i = min; i < max; i++) {
				arr.push(i);
			}
			if (isFirstRow()) {
				const prevEl = <HTMLElement>container[0].children[arr[activeNum]];

				if (prevEl) {
					prevEl.focus({ preventScroll: true });
					container[0].scrollTo({
						top: container[0].scrollHeight,
						left: 0,
						behavior: 'smooth',
					});
				} else if (!prevEl) {
					const prevEl = <HTMLElement>container[0].lastElementChild;
					prevEl.focus({ preventScroll: true });
					container[0].scrollTo({
						top: container[0].scrollHeight,
						left: 0,
						behavior: 'smooth',
					});
				}
			} else if (isPageBreak()) {
				prevEl.focus({ preventScroll: true });
				container[0].scrollBy({
					top: -(button_size + button_spacing) * number_of_rows_in_the_toolbar,
					left: 0,
					behavior: 'smooth',
				});
			} else {
				prevEl.focus({ preventScroll: true });
			}
		};

		//tab
		if (activeEl.className == 'text-tool-bar-btn' && ev.key === 'Tab' && !ev.shiftKey) {
			moveNext();
		}
		//shift+tab
		if (activeEl.className == 'text-tool-bar-btn' && ev.key === 'Tab' && ev.shiftKey) {
			movePrev();
		}
		//ArrowRight
		if (activeEl.className == 'text-tool-bar-btn' && ev.key === 'ArrowRight') {
			moveNext();
		}
		//ArrowLeft
		if (activeEl.className == 'text-tool-bar-btn' && ev.key === 'ArrowLeft') {
			movePrev();
		}
		//ArrowDown
		if (activeEl.className == 'text-tool-bar-btn' && ev.key === 'ArrowDown') {
			moveDown();
		}
		//ArrowUp
		if (activeEl.className == 'text-tool-bar-btn' && ev.key === 'ArrowUp') {
			moveUp();
		}
	}
}
