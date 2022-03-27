import { Editor, MarkdownView, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, TextToolbarSettings, TextToolbarSettingTab } from 'settings/settings';
import { ToolBarBuilder } from 'utils/ToolBarBuilder';
import { detachToolBar, toolBarPosInit, WheelScroll, KeyScroll, fontSizeAdjust } from 'utils/Utils';

export default class TextToolbar extends Plugin {
	settings: TextToolbarSettings;
	static toolBar: HTMLDivElement;
	static iwSize: { iw: number; ih: number };
	static wheelScroll: WheelScroll;
	static keyScroll: KeyScroll;

	async onload() {
		await this.loadSettings();

		const newToolBar = new ToolBarBuilder(this.app, this.manifest, this.settings);
		TextToolbar.toolBar = newToolBar.get;
		TextToolbar.wheelScroll = new WheelScroll(this.app, this.manifest, this.settings);
		TextToolbar.wheelScroll.handler = (ev: WheelEvent) => {
			ev.preventDefault();
			TextToolbar.wheelScroll.snap(ev);
		};
		TextToolbar.keyScroll = new KeyScroll(this.app, this.manifest, this.settings);
		TextToolbar.keyScroll.handler = (ev: KeyboardEvent) => {
			if (ev.key === 'Tab') {
				ev.preventDefault();
			}
			TextToolbar.keyScroll.snap(ev);
		};

		const showToolBar = (caller: string) => {
			if (this.settings.trigger_auto_manual === 'Manual' && caller === 'selectionchange') return;

			const view = this.app.workspace.getActiveViewOfType(MarkdownView);

			if (view && view.getState().mode === 'source') {
				const selection = view.editor.getSelection();

				if (selection && !document.getElementsByClassName('text-tool-bar')[0]) {
					document.querySelector('body').appendChild(TextToolbar.toolBar);

					document
						.getElementsByClassName('text-tool-bar')[0]
						.addEventListener('wheel', TextToolbar.wheelScroll.handler, {
							passive: false,
							capture: true,
						});
					document.addEventListener('keydown', TextToolbar.keyScroll.handler, true);

					toolBarPosInit(TextToolbar.toolBar, this.settings);
					fontSizeAdjust('text-tool-bar-label');
				} else if (!selection) {
					detachToolBar(TextToolbar.toolBar);
				}
			}
		};
		TextToolbar.iwSize = { iw: window.innerWidth, ih: window.innerHeight };

		const rebuildToolBar = () => {
			detachToolBar(TextToolbar.toolBar);
			delete TextToolbar.toolBar;
			const newToolBar = new ToolBarBuilder(this.app, this.manifest, this.settings);
			TextToolbar.toolBar = newToolBar.get;
			TextToolbar.iwSize = { iw: window.innerWidth, ih: window.innerHeight };
		};

		this.app.workspace.onLayoutReady(() => {
			this.registerDomEvent(document, 'selectionchange', (ev) => showToolBar(ev.type));
			this.registerEvent(this.app.workspace.on('active-leaf-change', () => detachToolBar(TextToolbar.toolBar)));
			this.registerEvent(this.app.workspace.on('layout-change', () => detachToolBar(TextToolbar.toolBar)));
			this.registerEvent(this.app.workspace.on('editor-menu', () => detachToolBar(TextToolbar.toolBar)));
			this.registerEvent(this.app.workspace.on('quit', () => detachToolBar(TextToolbar.toolBar)));
			this.registerDomEvent(window, 'resize', () => rebuildToolBar());
		});

		this.addCommand({
			id: 'show-tool-bar',
			name: 'Show Tool Bar',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				showToolBar('cmd');
			},
		});

		this.addSettingTab(new TextToolbarSettingTab(this.app, this));
	}

	onunload() {
		detachToolBar(TextToolbar.toolBar);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		detachToolBar(TextToolbar.toolBar);
		const newToolBar = new ToolBarBuilder(this.app, this.manifest, this.settings);
		TextToolbar.toolBar = newToolBar.get;
	}
}
