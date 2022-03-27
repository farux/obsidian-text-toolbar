import { App, Editor, Plugin, PluginManifest } from 'obsidian';
import { TextToolbarSettings } from 'settings/settings';
import { ttAction } from './Action';
import { iwCheck } from './Utils';

export class ToolBarBuilder extends Plugin {
	toolBar: HTMLDivElement;
	settings: TextToolbarSettings;
	editor: Editor;
	constructor(app: App, manifest: PluginManifest, settings: TextToolbarSettings) {
		super(app, manifest);
		this.settings = settings;
	}
	get get() {
		const toolbar = createEl('div', { cls: 'text-tool-bar' });
		const container = createEl('div', { cls: 'text-tool-bar-container' });
		const toolBarLength = this.settings.action_set.length;
		const newttAction = new ttAction(this.app, this.manifest);

		for (let i = 0; i < toolBarLength; i++) {
			const btn = createEl('button', { cls: 'text-tool-bar-btn' });
			btn.name = i.toString();
			btn.type = 'button';
			btn.tabIndex = 0;
			this.registerDomEvent(btn, 'click', (ev) => newttAction.replace(ev, this.settings, this.toolBar));
			const label = (() => {
				if (this.settings.action_set[i].class) {
					return `${this.settings.action_set[i].class} text-tool-bar-label`;
				} else {
					return 'text-tool-bar-label';
				}
			})();
			const btnLabelContainer = createEl('div', { cls: 'text-tool-bar-label-container' });
			const btnLabel = createEl('label', { cls: label });
			btnLabel.innerText = this.settings.action_set[i].label;
			btnLabelContainer.appendChild(btnLabel);
			btn.appendChild(btnLabelContainer);
			container.appendChild(btn);
			toolbar.appendChild(container);
		}

		const wSize = iwCheck(this.settings);
		const button_size = parseInt(this.settings[`${wSize}button_size`]);
		const button_spacing = parseInt(this.settings[`${wSize}button_spacing`]);
		const button_font_size = this.settings[`${wSize}button_font_size`];
		const toolbar_margin = parseInt(this.settings[`${wSize}toolbar_margin`]);
		const number_of_buttons_per_line = parseInt(this.settings[`${wSize}toolbar_number_of_buttons_per_line`]);
		const number_of_rows_in_the_toolbar = parseInt(this.settings[`${wSize}toolbar_number_of_rows`]);

		const barBgColor = this.settings.toolbar_background_color;
		const barBgOpacity = Math.round(this.settings.toolbar_background_opacity * 2.55)
			.toString(16)
			.padStart(2, '0');
		const toolbarBg = barBgColor + barBgOpacity;
		const toolbarBlur = this.settings.toolbar_background_blur;
		const toolbarBorder = `${this.settings.toolbar_border_width}px solid ${this.settings.toolbar_border_color}`;
		const toolbarBorderRadius = this.settings.toolbar_border_radius;
		const btnDefaultBgColor = this.settings.button_default_color;
		const btnFocusBgColor = this.settings.button_focus_color;
		const btnHoverBgColor = this.settings.button_hover_color;
		const btnDefaultBorder = `${this.settings.button_border_width}px solid ${this.settings.button_border_default_color}`;
		const btnFocusBorder = `${this.settings.button_border_width}px solid ${this.settings.button_border_focus_color}`;
		const btnHoverBorder = `${this.settings.button_border_width}px solid ${this.settings.button_border_hover_color}`;
		const btnBorderRadius = this.settings.button_border_radius;
		const btnDefaultFontColor = this.settings.button_default_font_color;
		document.documentElement.style.setProperty('--tt-btn-size', button_size + 'px');
		document.documentElement.style.setProperty('--tt-btn-gap', button_spacing + 'px');
		document.documentElement.style.setProperty('--tt-btn-font-size', button_font_size + 'px');
		document.documentElement.style.setProperty('--tt-toolbar-padding', toolbar_margin + 'px');
		document.documentElement.style.setProperty('--tt-toolbar-bg-color', toolbarBg);
		document.documentElement.style.setProperty('--tt-toolbar-blur', `blur(${toolbarBlur}px)`);
		document.documentElement.style.setProperty('--tt-toolbar-border', toolbarBorder);
		document.documentElement.style.setProperty('--tt-toolbar-border-radius', `${toolbarBorderRadius}px`);
		document.documentElement.style.setProperty('--tt-btn-default-bg-color', btnDefaultBgColor);
		document.documentElement.style.setProperty('--tt-btn-focus-bg-color', btnFocusBgColor);
		document.documentElement.style.setProperty('--tt-btn-hover-bg-color', btnHoverBgColor);
		document.documentElement.style.setProperty('--tt-btn-default-border', btnDefaultBorder);
		document.documentElement.style.setProperty('--tt-btn-focus-border', btnFocusBorder);
		document.documentElement.style.setProperty('--tt-btn-hover-border', btnHoverBorder);
		document.documentElement.style.setProperty('--tt-btn-border-radius', `${btnBorderRadius}px`);
		document.documentElement.style.setProperty('--tt-btn-default-font-color', btnDefaultFontColor);

		document.documentElement.style.setProperty(
			'--tt-toolbar-buttons-per-line',
			'repeat(' + number_of_buttons_per_line + ', 1fr)'
		);
		document.documentElement.style.setProperty(
			'--tt-toolbar-number-of-rows',
			button_size * number_of_rows_in_the_toolbar +
				button_spacing * number_of_rows_in_the_toolbar -
				button_spacing +
				'px'
		);

		this.toolBar = toolbar;

		return this.toolBar;
	}
}
