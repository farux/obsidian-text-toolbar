import TextToolbar from 'main';
import { App, PluginSettingTab, Setting, ButtonComponent } from 'obsidian';

import { actionSuggest } from 'suggests/action-suggest';
import { arrayMove } from 'utils/Utils';

export interface ActionSet {
	action: string;
	label: string;
	class: string;
}

export interface TextToolbarSettings {
	trigger_auto_manual: string;
	l_window_width_thresholds: string;
	l_button_size: string;
	l_button_spacing: string;
	l_button_font_size: string;
	l_toolbar_margin: string;
	l_toolbar_number_of_buttons_per_line: string;
	l_toolbar_number_of_rows: string;
	l_toolbar_display_position: string;
	l_toolbar_vertical_offset: string;
	l_toolbar_horizontal_offset: string;
	m_button_size: string;
	m_button_spacing: string;
	m_button_font_size: string;
	m_toolbar_margin: string;
	m_toolbar_number_of_buttons_per_line: string;
	m_toolbar_number_of_rows: string;
	m_toolbar_display_position: string;
	m_toolbar_vertical_offset: string;
	m_toolbar_horizontal_offset: string;
	s_window_width_thresholds: string;
	s_button_size: string;
	s_button_spacing: string;
	s_button_font_size: string;
	s_toolbar_margin: string;
	s_toolbar_number_of_buttons_per_line: string;
	s_toolbar_number_of_rows: string;
	s_toolbar_display_position: string;
	s_toolbar_vertical_offset: string;
	s_toolbar_horizontal_offset: string;
	button_default_font_color: string;
	button_focus_color: string;
	button_hover_color: string;
	button_border_radius: number;
	button_border_width: number;
	button_border_focus_color: string;
	button_border_hover_color: string;
	button_border_default_color: string;
	button_default_color: string;
	action_set: Array<ActionSet>;
	toolbar_background_blur: number;
	toolbar_background_color: string;
	toolbar_background_opacity: number;
	toolbar_border_color: string;
	toolbar_border_radius: number;
	toolbar_border_width: number;
}

export const DEFAULT_SETTINGS: TextToolbarSettings = {
	action_set: [{ action: '', label: '', class: '' }],
	trigger_auto_manual: 'Automatic',
	l_window_width_thresholds: '1000',
	l_button_size: '50',
	l_button_spacing: '15',
	l_button_font_size: '30',
	l_toolbar_margin: '15',
	l_toolbar_number_of_buttons_per_line: '8',
	l_toolbar_number_of_rows: '1',
	l_toolbar_display_position: 'bottom',
	l_toolbar_vertical_offset: '0',
	l_toolbar_horizontal_offset: '0',
	m_button_size: '50',
	m_button_spacing: '15',
	m_button_font_size: '30',
	m_toolbar_margin: '15',
	m_toolbar_number_of_buttons_per_line: '8',
	m_toolbar_number_of_rows: '1',
	m_toolbar_display_position: 'bottom',
	m_toolbar_vertical_offset: '0',
	m_toolbar_horizontal_offset: '0',
	s_window_width_thresholds: '500',
	s_button_size: '50',
	s_button_spacing: '15',
	s_button_font_size: '30',
	s_toolbar_margin: '15',
	s_toolbar_number_of_buttons_per_line: '8',
	s_toolbar_number_of_rows: '1',
	s_toolbar_display_position: 'bottom',
	s_toolbar_vertical_offset: '0',
	s_toolbar_horizontal_offset: '0',
	toolbar_background_blur: 2,
	toolbar_background_color: '#666666',
	toolbar_background_opacity: 75,
	toolbar_border_color: '#666666',
	toolbar_border_radius: 6,
	toolbar_border_width: 0,
	button_default_color: '#202020',
	button_border_default_color: '#202020',
	button_border_focus_color: '#7F6DF2',
	button_border_hover_color: '#7F6DF2',
	button_border_width: 4,
	button_border_radius: 6,
	button_focus_color: '#202020',
	button_hover_color: '#404040',
	button_default_font_color: '#DCDDDE',
};

export class TextToolbarSettingTab extends PluginSettingTab {
	plugin: TextToolbar;

	constructor(app: App, plugin: TextToolbar) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		this.containerEl.empty();
		this.add_text_toolbar_setting();
	}

	add_text_toolbar_setting(): void {
		this.containerEl.createEl('h2', { text: 'Text Toolbar' });

		const descEl = document.createDocumentFragment();

		const instructionsDesc = document.createDocumentFragment();
		instructionsDesc.append(
			descEl.createEl('strong', { text: 'Instructions ' }),
			descEl.createEl('br'),
			'Tab key: Focus on toolbar or next button',
			descEl.createEl('br'),
			`Shift+Tab: Focus on previous button`,
			descEl.createEl('br'),
			`Cursor key: Move button focus`,
			descEl.createEl('br'),
			`Esc key: Hide toolbar`
		);

		new Setting(this.containerEl).setDesc(instructionsDesc);

		const triggerDesc = document.createDocumentFragment();
		triggerDesc.append(
			'Select how to activate the toolbar.',
			descEl.createEl('br'),
			descEl.createEl('strong', { text: 'Automatic ' }),
			'will automatically show a toolbar when text is selected on the edit view and will be hidden when an action is executed or text is deselected.',
			descEl.createEl('br'),
			descEl.createEl('strong', { text: 'Manual ' }),
			' does not automatically show/hide the toolbar.',
			descEl.createEl('br'),
			'The toolbar can be activated from a command with text selected and hidden with the ESC key.'
		);
		new Setting(this.containerEl)
			.setName('Trigger')
			.setDesc(triggerDesc)
			.addDropdown((dropDown) =>
				dropDown
					.addOption('Automatic', 'Automatic')
					.addOption('Manual', 'Manual')
					.setValue(this.plugin.settings.trigger_auto_manual)
					.onChange(async (value: string) => {
						this.plugin.settings.trigger_auto_manual = value;
						await this.plugin.saveSettings();
						this.display();
					})
			);

		const structureDesc = document.createDocumentFragment();
		structureDesc.append(
			'One of three different structure toolbars will appear based on the Obsidian window size.',
			descEl.createEl('br'),
			'It can be set to match the screen of your desktop, tablet, smartphone, etc.',
			descEl.createEl('br'),
			' To configure settings for each screen size, switch between the following tabs'
		);
		new Setting(this.containerEl).setDesc(structureDesc).setClass('tt-setting-structure-desc');

		this.containerEl.createEl('details', { cls: 'setting-item tt-setting-structure-details' });
		this.containerEl.createEl('summary', { cls: 'tt-setting-structure-summary' });
		this.containerEl.createEl('span', {
			cls: 'tt-setting-structure-iw',
			text: 'Current window size ( width: ' + TextToolbar.iwSize.iw + ', height: ' + TextToolbar.iwSize.ih + ' )',
		});
		this.containerEl.createEl('div', { cls: 'tt-setting-structure-wrap' });
		this.containerEl.createEl('input', { cls: 'tt-setting-tab-switch', type: 'radio' });
		this.containerEl.createEl('input', { cls: 'tt-setting-tab-switch', type: 'radio' });
		this.containerEl.createEl('input', { cls: 'tt-setting-tab-switch', type: 'radio' });
		this.containerEl.createEl('label', { cls: 'tt-setting-tab-label', text: 'Large' });
		this.containerEl.createEl('label', { cls: 'tt-setting-tab-label', text: 'Middle' });
		this.containerEl.createEl('label', { cls: 'tt-setting-tab-label', text: 'Small' });
		this.containerEl.createEl('div', { cls: 'tt-setting-tab-content' });
		this.containerEl.createEl('div', { cls: 'tt-setting-tab-content' });
		this.containerEl.createEl('div', { cls: 'tt-setting-tab-content' });
		const tabDetails = document.querySelector('details.tt-setting-structure-details');
		const tabSummary = document.querySelector('summary.tt-setting-structure-summary');
		tabSummary.innerHTML = `<span style="font-size: 1.17em; font-weight: 600;">Toolbar Structure</span>`;
		const tabDesc = document.querySelector('div.tt-setting-structure-desc');
		const tabIw = document.querySelector('span.tt-setting-structure-iw');
		const tabWrap = document.querySelector('div.tt-setting-structure-wrap');
		const tabSwitch = document.getElementsByClassName('tt-setting-tab-switch');
		const tabLabel = document.getElementsByClassName('tt-setting-tab-label');
		const tabContent = document.getElementsByClassName('tt-setting-tab-content');
		const tabSwitchL = <HTMLInputElement>tabSwitch[0];
		const tabSwitchM = <HTMLInputElement>tabSwitch[1];
		const tabSwitchS = <HTMLInputElement>tabSwitch[2];
		const tabLabelL = <HTMLLabelElement>tabLabel[0];
		const tabLabelM = <HTMLLabelElement>tabLabel[1];
		const tabLabelS = <HTMLLabelElement>tabLabel[2];
		tabLabelL.htmlFor = 'tt-setting-tab-switch-L';
		tabLabelM.htmlFor = 'tt-setting-tab-switch-M';
		tabLabelS.htmlFor = 'tt-setting-tab-switch-S';
		tabSwitchL.name = 'TAB';
		tabSwitchL.id = 'tt-setting-tab-switch-L';
		tabSwitchL.checked = true;
		tabSwitchM.name = 'TAB';
		tabSwitchM.id = 'tt-setting-tab-switch-M';
		tabSwitchS.name = 'TAB';
		tabSwitchS.id = 'tt-setting-tab-switch-S';
		tabDetails.appendChild(tabSummary);
		tabDetails.appendChild(tabDesc);
		tabDetails.appendChild(tabIw);
		tabDetails.appendChild(tabWrap);
		tabWrap.appendChild(tabSwitch[0]);
		tabWrap.appendChild(tabSwitch[1]);
		tabWrap.appendChild(tabSwitch[2]);
		tabSwitch[0].after(tabLabel[0]);
		tabSwitch[1].after(tabLabel[1]);
		tabSwitch[2].after(tabLabel[2]);
		tabLabel[0].after(tabContent[0]);
		tabLabel[1].after(tabContent[1]);
		tabLabel[2].after(tabContent[2]);

		//Large Display

		const lWindowWidthThresholdsDesc = document.createDocumentFragment();
		lWindowWidthThresholdsDesc.append(
			'Obsidian windows with a width of this value or wider will be recognized as a Large size.',
			descEl.createEl('br'),
			'Default is 1000'
		);

		new Setting(this.containerEl)
			.setClass('tt-setting-large')
			.setName('Large window width threshold')
			.setDesc(lWindowWidthThresholdsDesc)
			.addText((cb) => {
				cb.setPlaceholder('1000')
					.setValue(this.plugin.settings.l_window_width_thresholds)
					.onChange(async (value) => {
						this.plugin.settings.l_window_width_thresholds = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const buttonSizeDesc = document.createDocumentFragment();
		buttonSizeDesc.append('Set the size of the button as a number.', descEl.createEl('br'), 'Default is 50');

		new Setting(this.containerEl)
			.setClass('tt-setting-large')
			.setName('Button Size')
			.setDesc(buttonSizeDesc)
			.addText((cb) => {
				cb.setPlaceholder('50')
					.setValue(this.plugin.settings.l_button_size)
					.onChange(async (value) => {
						this.plugin.settings.l_button_size = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const buttonSpacingDesc = document.createDocumentFragment();
		buttonSpacingDesc.append('Set the button spacing as a number.', descEl.createEl('br'), 'Default is 15');

		new Setting(this.containerEl)
			.setClass('tt-setting-large')
			.setName('Button spacing')
			.setDesc(buttonSpacingDesc)
			.addText((cb) => {
				cb.setPlaceholder('15')
					.setValue(this.plugin.settings.l_button_spacing)
					.onChange(async (value) => {
						this.plugin.settings.l_button_spacing = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const buttonFontSizeDesc = document.createDocumentFragment();
		buttonFontSizeDesc.append('Set the basic label font size as a number.', descEl.createEl('br'), 'Default is 30');

		new Setting(this.containerEl)
			.setClass('tt-setting-large')
			.setName('Basic label font size')
			.setDesc(buttonFontSizeDesc)
			.addText((cb) => {
				cb.setPlaceholder('30')
					.setValue(this.plugin.settings.l_button_font_size)
					.onChange(async (value) => {
						this.plugin.settings.l_button_font_size = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const toolbarMarginDesc = document.createDocumentFragment();
		toolbarMarginDesc.append('Set toolbar Margin as a number.', descEl.createEl('br'), 'Default is 15');

		new Setting(this.containerEl)
			.setClass('tt-setting-large')
			.setName('Toolbar margin')
			.setDesc(toolbarMarginDesc)
			.addText((cb) => {
				cb.setPlaceholder('15')
					.setValue(this.plugin.settings.l_toolbar_margin)
					.onChange(async (value) => {
						this.plugin.settings.l_toolbar_margin = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const numberOfButtonsPerLineDesc = document.createDocumentFragment();
		numberOfButtonsPerLineDesc.append('Set the number of buttons per line.', descEl.createEl('br'), 'Default is 8');

		new Setting(this.containerEl)
			.setClass('tt-setting-large')
			.setName('Number of buttons per line')
			.setDesc(numberOfButtonsPerLineDesc)
			.addText((cb) => {
				cb.setPlaceholder('8')
					.setValue(this.plugin.settings.l_toolbar_number_of_buttons_per_line)
					.onChange(async (value) => {
						this.plugin.settings.l_toolbar_number_of_buttons_per_line = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const numberOfRowsInTheToolbarDesc = document.createDocumentFragment();
		numberOfRowsInTheToolbarDesc.append(
			'Set the number of rows in the toolbar.',
			descEl.createEl('br'),
			'Default is 1'
		);

		new Setting(this.containerEl)
			.setClass('tt-setting-large')
			.setName('Number of rows in the toolbar')
			.setDesc(numberOfRowsInTheToolbarDesc)
			.addText((cb) => {
				cb.setPlaceholder('1')
					.setValue(this.plugin.settings.l_toolbar_number_of_rows)
					.onChange(async (value) => {
						this.plugin.settings.l_toolbar_number_of_rows = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const displayPositionDesc = document.createDocumentFragment();
		displayPositionDesc.append('Set the toolbar display position.', descEl.createEl('br'), 'Default is Bottom');

		new Setting(this.containerEl)
			.setClass('tt-setting-large')
			.setName('Display position')
			.setDesc(displayPositionDesc)
			.addDropdown((cb) => {
				cb.addOption('top', 'Top')
					.addOption('bottom', 'Bottom')
					.addOption('left', 'Left')
					.addOption('right', 'Right')
					.setValue(this.plugin.settings.l_toolbar_display_position)
					.onChange(async (value) => {
						this.plugin.settings.l_toolbar_display_position = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const verticalOffsetDesc = document.createDocumentFragment();
		verticalOffsetDesc.append(
			'Set the vertical offset as a number.',
			descEl.createEl('br'),
			'The effect of the numbers depends on the display position.',
			descEl.createEl('br'),
			'Top,Left,Right: Moves down for positive numbers, up for negative numbers.',
			descEl.createEl('br'),
			'Bottom: Moves up for positive numbers, down for negative numbers.',
			descEl.createEl('br'),
			'Default is 0'
		);

		new Setting(this.containerEl)
			.setClass('tt-setting-large')
			.setName('Vertical offset')
			.setDesc(verticalOffsetDesc)
			.addText((cb) => {
				cb.setPlaceholder('0')
					.setValue(this.plugin.settings.l_toolbar_vertical_offset)
					.onChange(async (value) => {
						this.plugin.settings.l_toolbar_vertical_offset = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const horizontalOffsetDesc = document.createDocumentFragment();
		horizontalOffsetDesc.append(
			'Set the horizontal offset as a number.',
			descEl.createEl('br'),
			'The effect of the numbers depends on the display position.',
			descEl.createEl('br'),
			'Top,Bottom,Left: Move to the right for positive numbers, to the left for negative numbers.',
			descEl.createEl('br'),
			'Right: Move to the left for positive numbers, to the right for negative numbers.',
			descEl.createEl('br'),
			'Default is 0'
		);

		new Setting(this.containerEl)
			.setClass('tt-setting-large')
			.setName('Horizontal offset')
			.setDesc(horizontalOffsetDesc)
			.addText((cb) => {
				cb.setPlaceholder('0')
					.setValue(this.plugin.settings.l_toolbar_horizontal_offset)
					.onChange(async (value) => {
						this.plugin.settings.l_toolbar_horizontal_offset = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const largeSettings = document.getElementsByClassName('tt-setting-large');
		for (let i = 0; i < largeSettings.length; i++) {
			tabContent[0].appendChild(largeSettings[i]);
		}

		//Medium Display

		const mButtonSizeDesc = document.createDocumentFragment();
		mButtonSizeDesc.append('Set the size of the button as a number.', descEl.createEl('br'), 'Default is 50');

		new Setting(this.containerEl)
			.setClass('tt-setting-medium')
			.setName('Button Size')
			.setDesc(mButtonSizeDesc)
			.addText((cb) => {
				cb.setPlaceholder('50')
					.setValue(this.plugin.settings.m_button_size)
					.onChange(async (value) => {
						this.plugin.settings.m_button_size = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const mButtonSpacingDesc = document.createDocumentFragment();
		mButtonSpacingDesc.append('Set the button spacing as a number.', descEl.createEl('br'), 'Default is 15');

		new Setting(this.containerEl)
			.setClass('tt-setting-medium')
			.setName('Button spacing')
			.setDesc(mButtonSpacingDesc)
			.addText((cb) => {
				cb.setPlaceholder('15')
					.setValue(this.plugin.settings.m_button_spacing)
					.onChange(async (value) => {
						this.plugin.settings.m_button_spacing = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const mButtonFontSizeDesc = document.createDocumentFragment();
		mButtonFontSizeDesc.append(
			'Set the basic label font size as a number.',
			descEl.createEl('br'),
			'Default is 30'
		);

		new Setting(this.containerEl)
			.setClass('tt-setting-medium')
			.setName('Basic label font size')
			.setDesc(mButtonFontSizeDesc)
			.addText((cb) => {
				cb.setPlaceholder('30')
					.setValue(this.plugin.settings.m_button_font_size)
					.onChange(async (value) => {
						this.plugin.settings.m_button_font_size = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const mToolbarMarginDesc = document.createDocumentFragment();
		mToolbarMarginDesc.append('Set toolbar Margin as a number.', descEl.createEl('br'), 'Default is 15');

		new Setting(this.containerEl)
			.setClass('tt-setting-medium')
			.setName('Toolbar margin')
			.setDesc(mToolbarMarginDesc)
			.addText((cb) => {
				cb.setPlaceholder('15')
					.setValue(this.plugin.settings.m_toolbar_margin)
					.onChange(async (value) => {
						this.plugin.settings.m_toolbar_margin = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const mNumberOfButtonsPerLineDesc = document.createDocumentFragment();
		mNumberOfButtonsPerLineDesc.append(
			'Set the number of buttons per line.',
			descEl.createEl('br'),
			'Default is 8'
		);

		new Setting(this.containerEl)
			.setClass('tt-setting-medium')
			.setName('Number of buttons per line')
			.setDesc(mNumberOfButtonsPerLineDesc)
			.addText((cb) => {
				cb.setPlaceholder('8')
					.setValue(this.plugin.settings.m_toolbar_number_of_buttons_per_line)
					.onChange(async (value) => {
						this.plugin.settings.m_toolbar_number_of_buttons_per_line = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const mNumberOfRowsInTheToolbarDesc = document.createDocumentFragment();
		mNumberOfRowsInTheToolbarDesc.append(
			'Set the number of rows in the toolbar.',
			descEl.createEl('br'),
			'Default is 1'
		);

		new Setting(this.containerEl)
			.setClass('tt-setting-medium')
			.setName('Number of rows in the toolbar')
			.setDesc(mNumberOfRowsInTheToolbarDesc)
			.addText((cb) => {
				cb.setPlaceholder('1')
					.setValue(this.plugin.settings.m_toolbar_number_of_rows)
					.onChange(async (value) => {
						this.plugin.settings.m_toolbar_number_of_rows = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const mDisplayPositionDesc = document.createDocumentFragment();
		mDisplayPositionDesc.append('Set the toolbar display position.', descEl.createEl('br'), 'Default is Bottom');

		new Setting(this.containerEl)
			.setClass('tt-setting-medium')
			.setName('Display position')
			.setDesc(mDisplayPositionDesc)
			.addDropdown((cb) => {
				cb.addOption('top', 'Top')
					.addOption('bottom', 'Bottom')
					.addOption('left', 'Left')
					.addOption('right', 'Right')
					.setValue(this.plugin.settings.m_toolbar_display_position)
					.onChange(async (value) => {
						this.plugin.settings.m_toolbar_display_position = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const mVerticalOffsetDesc = document.createDocumentFragment();
		mVerticalOffsetDesc.append(
			'Set the vertical offset as a number.',
			descEl.createEl('br'),
			'The effect of the numbers depends on the display position.',
			descEl.createEl('br'),
			'Top,Left,Right: Moves down for positive numbers, up for negative numbers.',
			descEl.createEl('br'),
			'Bottom: Moves up for positive numbers, down for negative numbers.',
			descEl.createEl('br'),
			'Default is 0'
		);

		new Setting(this.containerEl)
			.setClass('tt-setting-medium')
			.setName('Vertical offset')
			.setDesc(mVerticalOffsetDesc)
			.addText((cb) => {
				cb.setPlaceholder('0')
					.setValue(this.plugin.settings.m_toolbar_vertical_offset)
					.onChange(async (value) => {
						this.plugin.settings.m_toolbar_vertical_offset = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const mHorizontalOffsetDesc = document.createDocumentFragment();
		mHorizontalOffsetDesc.append(
			'Set the horizontal offset as a number.',
			descEl.createEl('br'),
			'The effect of the numbers depends on the display position.',
			descEl.createEl('br'),
			'Top,Bottom,Left: Move to the right for positive numbers, to the left for negative numbers.',
			descEl.createEl('br'),
			'Right: Move to the left for positive numbers, to the right for negative numbers.',
			descEl.createEl('br'),
			'Default is 0'
		);

		new Setting(this.containerEl)
			.setClass('tt-setting-medium')
			.setName('Horizontal offset')
			.setDesc(mHorizontalOffsetDesc)
			.addText((cb) => {
				cb.setPlaceholder('0')
					.setValue(this.plugin.settings.m_toolbar_horizontal_offset)
					.onChange(async (value) => {
						this.plugin.settings.m_toolbar_horizontal_offset = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const mediumSettings = document.getElementsByClassName('tt-setting-medium');
		for (let i = 0; i < mediumSettings.length; i++) {
			tabContent[1].appendChild(mediumSettings[i]);
		}

		//Small Window

		const sWindowWidthThresholdsDesc = document.createDocumentFragment();
		sWindowWidthThresholdsDesc.append(
			'Obsidian windows with a width of this value or narrower are recognized as Small size.',
			descEl.createEl('br'),
			'Default is 500'
		);

		new Setting(this.containerEl)
			.setClass('tt-setting-small')
			.setName('Small window width threshold')
			.setDesc(sWindowWidthThresholdsDesc)
			.addText((cb) => {
				cb.setPlaceholder('500')
					.setValue(this.plugin.settings.s_window_width_thresholds)
					.onChange(async (value) => {
						this.plugin.settings.s_window_width_thresholds = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const sButtonSizeDesc = document.createDocumentFragment();
		sButtonSizeDesc.append('Set the size of the button as a number.', descEl.createEl('br'), 'Default is 50');

		new Setting(this.containerEl)
			.setClass('tt-setting-small')
			.setName('Button Size')
			.setDesc(sButtonSizeDesc)
			.addText((cb) => {
				cb.setPlaceholder('50')
					.setValue(this.plugin.settings.s_button_size)
					.onChange(async (value) => {
						this.plugin.settings.s_button_size = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const sButtonSpacingDesc = document.createDocumentFragment();
		sButtonSpacingDesc.append('Set the button spacing as a number.', descEl.createEl('br'), 'Default is 15');

		new Setting(this.containerEl)
			.setClass('tt-setting-small')
			.setName('Button spacing')
			.setDesc(sButtonSpacingDesc)
			.addText((cb) => {
				cb.setPlaceholder('15')
					.setValue(this.plugin.settings.s_button_spacing)
					.onChange(async (value) => {
						this.plugin.settings.s_button_spacing = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const sButtonFontSizeDesc = document.createDocumentFragment();
		sButtonFontSizeDesc.append(
			'Set the basic label font size as a number.',
			descEl.createEl('br'),
			'Default is 30'
		);

		new Setting(this.containerEl)
			.setClass('tt-setting-small')
			.setName('Basic label font size')
			.setDesc(sButtonFontSizeDesc)
			.addText((cb) => {
				cb.setPlaceholder('30')
					.setValue(this.plugin.settings.s_button_font_size)
					.onChange(async (value) => {
						this.plugin.settings.s_button_font_size = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const sToolbarMarginDesc = document.createDocumentFragment();
		sToolbarMarginDesc.append('Set toolbar Margin as a number.', descEl.createEl('br'), 'Default is 15');

		new Setting(this.containerEl)
			.setClass('tt-setting-small')
			.setName('Toolbar margin')
			.setDesc(sToolbarMarginDesc)
			.addText((cb) => {
				cb.setPlaceholder('15')
					.setValue(this.plugin.settings.s_toolbar_margin)
					.onChange(async (value) => {
						this.plugin.settings.s_toolbar_margin = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const sNumberOfButtonsPerLineDesc = document.createDocumentFragment();
		sNumberOfButtonsPerLineDesc.append(
			'Set the number of buttons per line.',
			descEl.createEl('br'),
			'Default is 8'
		);

		new Setting(this.containerEl)
			.setClass('tt-setting-small')
			.setName('Number of buttons per line')
			.setDesc(sNumberOfButtonsPerLineDesc)
			.addText((cb) => {
				cb.setPlaceholder('8')
					.setValue(this.plugin.settings.s_toolbar_number_of_buttons_per_line)
					.onChange(async (value) => {
						this.plugin.settings.s_toolbar_number_of_buttons_per_line = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const sNumberOfRowsInTheToolbarDesc = document.createDocumentFragment();
		sNumberOfRowsInTheToolbarDesc.append(
			'Set the number of rows in the toolbar.',
			descEl.createEl('br'),
			'Default is 1'
		);

		new Setting(this.containerEl)
			.setClass('tt-setting-small')
			.setName('Number of rows in the toolbar')
			.setDesc(sNumberOfRowsInTheToolbarDesc)
			.addText((cb) => {
				cb.setPlaceholder('1')
					.setValue(this.plugin.settings.s_toolbar_number_of_rows)
					.onChange(async (value) => {
						this.plugin.settings.s_toolbar_number_of_rows = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const sDisplayPositionDesc = document.createDocumentFragment();
		sDisplayPositionDesc.append('Set the toolbar display position.', descEl.createEl('br'), 'Default is Bottom');

		new Setting(this.containerEl)
			.setClass('tt-setting-small')
			.setName('Display position')
			.setDesc(sDisplayPositionDesc)
			.addDropdown((cb) => {
				cb.addOption('top', 'Top')
					.addOption('bottom', 'Bottom')
					.addOption('left', 'Left')
					.addOption('right', 'Right')
					.setValue(this.plugin.settings.s_toolbar_display_position)
					.onChange(async (value) => {
						this.plugin.settings.s_toolbar_display_position = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const sVerticalOffsetDesc = document.createDocumentFragment();
		sVerticalOffsetDesc.append(
			'Set the vertical offset as a number.',
			descEl.createEl('br'),
			'The effect of the numbers depends on the display position.',
			descEl.createEl('br'),
			'Top,Left,Right: Moves down for positive numbers, up for negative numbers.',
			descEl.createEl('br'),
			'Bottom: Moves up for positive numbers, down for negative numbers.',
			descEl.createEl('br'),
			'Default is 0'
		);

		new Setting(this.containerEl)
			.setClass('tt-setting-small')
			.setName('Vertical offset')
			.setDesc(sVerticalOffsetDesc)
			.addText((cb) => {
				cb.setPlaceholder('0')
					.setValue(this.plugin.settings.s_toolbar_vertical_offset)
					.onChange(async (value) => {
						this.plugin.settings.s_toolbar_vertical_offset = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const sHorizontalOffsetDesc = document.createDocumentFragment();
		sHorizontalOffsetDesc.append(
			'Set the horizontal offset as a number.',
			descEl.createEl('br'),
			'The effect of the numbers depends on the display position.',
			descEl.createEl('br'),
			'Top,Bottom,Left: Move to the right for positive numbers, to the left for negative numbers.',
			descEl.createEl('br'),
			'Right: Move to the left for positive numbers, to the right for negative numbers.',
			descEl.createEl('br'),
			'Default is 0'
		);

		new Setting(this.containerEl)
			.setClass('tt-setting-small')
			.setName('Horizontal offset')
			.setDesc(sHorizontalOffsetDesc)
			.addText((cb) => {
				cb.setPlaceholder('0')
					.setValue(this.plugin.settings.s_toolbar_horizontal_offset)
					.onChange(async (value) => {
						this.plugin.settings.s_toolbar_horizontal_offset = value.trim();
						await this.plugin.saveSettings();
					});
			});

		const smallSettings = document.getElementsByClassName('tt-setting-small');
		for (let i = 0; i < smallSettings.length; i++) {
			tabContent[2].appendChild(smallSettings[i]);
		}

		//Appearance
		//Toolbar Appearance
		this.containerEl.createEl('details', { cls: 'setting-item tt-setting-appearance-tb-details' });
		this.containerEl.createEl('summary', { cls: 'tt-setting-appearance-tb-summary' });
		this.containerEl.createEl('div', { cls: 'tt-setting-appearance-tb-wrap' });
		const apTbDetails = document.querySelector('details.tt-setting-appearance-tb-details');
		const apTbSummary = document.querySelector('summary.tt-setting-appearance-tb-summary');
		apTbSummary.innerHTML = `<span style="font-size: 1.17em; font-weight: 600;">Toolbar Appearance</span>`;
		const apTbWrap = document.querySelector('div.tt-setting-appearance-tb-wrap');

		apTbDetails.appendChild(apTbSummary);
		apTbDetails.appendChild(apTbWrap);

		const toolbarBgColorDesc = document.createDocumentFragment();
		toolbarBgColorDesc.append(
			'Default value',
			descEl.createEl('br'),
			'Background color: #666666',
			descEl.createEl('br'),
			'Opacity: 75',
			descEl.createEl('br'),
			'Blur: 2',
			descEl.createEl('br'),
			'Border color: #666666',
			descEl.createEl('br'),
			'Border width: 0',
			descEl.createEl('br'),
			'Border radius: 6'
		);

		new Setting(this.containerEl)
			.setClass('text-toolbar-background-color-setting')
			.setName('Toolbar Appearance')
			.setDesc(toolbarBgColorDesc)
			.addText((cb) => {
				cb.setPlaceholder('#666666')
					.setValue(this.plugin.settings.toolbar_background_color)
					.onChange(async (value) => {
						this.plugin.settings.toolbar_background_color = value.trim();
						await this.plugin.saveSettings();
					});
			})
			.addSlider((cb) => {
				cb.setLimits(0, 100, 1)
					.setValue(this.plugin.settings.toolbar_background_opacity)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.toolbar_background_opacity = value;
						await this.plugin.saveSettings();
					});
			})
			.addSlider((cb) => {
				cb.setLimits(0, 10, 1)
					.setValue(this.plugin.settings.toolbar_background_blur)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.toolbar_background_blur = value;
						await this.plugin.saveSettings();
					});
			})
			.addText((cb) => {
				cb.setPlaceholder('#666666')
					.setValue(this.plugin.settings.toolbar_border_color)
					.onChange(async (value) => {
						this.plugin.settings.toolbar_border_color = value.trim();
						await this.plugin.saveSettings();
					});
			})
			.addSlider((cb) => {
				cb.setLimits(0, 100, 1)
					.setValue(this.plugin.settings.toolbar_border_width)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.toolbar_border_width = value;
						await this.plugin.saveSettings();
					});
			})
			.addSlider((cb) => {
				cb.setLimits(0, 100, 1)
					.setValue(this.plugin.settings.toolbar_border_radius)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.toolbar_border_radius = value;
						await this.plugin.saveSettings();
					});
			});

		const toolbarBgColor = <HTMLElement>(
			document.querySelector('div.text-toolbar-background-color-setting > div.setting-item-control')
		);
		toolbarBgColor.style.display = 'grid';
		toolbarBgColor.style.gap = '2em';
		toolbarBgColor.style.gridTemplateColumns = '20em 1fr';
		const toolbarBgColorItem1 = <HTMLInputElement>(
			document.querySelector(
				'div.text-toolbar-background-color-setting > div.setting-item-control > :nth-child(1)'
			)
		);
		const toolbarBgColorItem2 = <HTMLInputElement>(
			document.querySelector(
				'div.text-toolbar-background-color-setting > div.setting-item-control > :nth-child(2)'
			)
		);
		const toolbarBgColorItem3 = <HTMLInputElement>(
			document.querySelector(
				'div.text-toolbar-background-color-setting > div.setting-item-control > :nth-child(3)'
			)
		);
		const toolbarBgColorItem4 = <HTMLInputElement>(
			document.querySelector(
				'div.text-toolbar-background-color-setting > div.setting-item-control > :nth-child(4)'
			)
		);
		const toolbarBgColorItem5 = <HTMLInputElement>(
			document.querySelector(
				'div.text-toolbar-background-color-setting > div.setting-item-control > :nth-child(5)'
			)
		);
		const toolbarBgColorItem6 = <HTMLInputElement>(
			document.querySelector(
				'div.text-toolbar-background-color-setting > div.setting-item-control > :nth-child(6)'
			)
		);

		const bgColorLabel1 = <HTMLElement>document.createElement('label');
		const bgColorLabel2 = <HTMLElement>document.createElement('label');
		const bgColorLabel3 = <HTMLElement>document.createElement('label');
		const bgColorLabel4 = <HTMLElement>document.createElement('label');
		const bgColorLabel5 = <HTMLElement>document.createElement('label');
		const bgColorLabel6 = <HTMLElement>document.createElement('label');
		bgColorLabel1.classList.add('text-toolbar-settings-label');
		bgColorLabel1.innerText = 'Background color : ';
		toolbarBgColorItem1.before(bgColorLabel1);
		bgColorLabel2.classList.add('text-toolbar-settings-label');
		bgColorLabel2.innerText = 'Opacity : ';
		toolbarBgColorItem2.before(bgColorLabel2);
		bgColorLabel3.classList.add('text-toolbar-settings-label');
		bgColorLabel3.innerText = 'Blur :';
		toolbarBgColorItem3.before(bgColorLabel3);
		bgColorLabel4.classList.add('text-toolbar-settings-label');
		bgColorLabel4.innerText = 'Border color : ';
		toolbarBgColorItem4.before(bgColorLabel4);
		bgColorLabel5.classList.add('text-toolbar-settings-label');
		bgColorLabel5.innerText = 'Border width : ';
		toolbarBgColorItem5.before(bgColorLabel5);
		bgColorLabel6.classList.add('text-toolbar-settings-label');
		bgColorLabel6.innerText = 'Border radius : ';
		toolbarBgColorItem6.before(bgColorLabel6);

		toolbarBgColorItem1.type = 'color';
		toolbarBgColorItem4.type = 'color';

		const apTbSetting = document.querySelector('div.text-toolbar-background-color-setting');
		apTbWrap.appendChild(apTbSetting);

		//Button Appearance

		this.containerEl.createEl('details', { cls: 'setting-item tt-setting-appearance-btn-details' });
		this.containerEl.createEl('summary', { cls: 'tt-setting-appearance-btn-summary' });
		this.containerEl.createEl('div', { cls: 'tt-setting-appearance-btn-wrap' });
		const apBtnDetails = document.querySelector('details.tt-setting-appearance-btn-details');
		const apBtnSummary = document.querySelector('summary.tt-setting-appearance-btn-summary');
		apBtnSummary.innerHTML = `<span style="font-size: 1.17em; font-weight: 600;">Button Appearance</span>`;
		const apBtnWrap = document.querySelector('div.tt-setting-appearance-btn-wrap');

		apBtnDetails.appendChild(apBtnSummary);
		apBtnDetails.appendChild(apBtnWrap);

		const toolbarBtnColorDesc = document.createDocumentFragment();
		toolbarBtnColorDesc.append(
			'Default value',
			descEl.createEl('br'),
			'Default button color: #202020',
			descEl.createEl('br'),
			'Focus button color: #202020',
			descEl.createEl('br'),
			'Hover button color: #404040',
			descEl.createEl('br'),
			'Default border color: #202020',
			descEl.createEl('br'),
			'Focus border color: #7F6DF2',
			descEl.createEl('br'),
			'Hover border color: #7F6DF2',
			descEl.createEl('br'),
			'Border width: 4',
			descEl.createEl('br'),
			'Border radius: 6',
			descEl.createEl('br'),
			'Default label color: #DCDDDE'
		);

		new Setting(this.containerEl)
			.setClass('text-toolbar-button-color-setting')
			.setName('Button Appearance')
			.setDesc(toolbarBtnColorDesc)
			.addText((cb) => {
				cb.setPlaceholder('#202020')
					.setValue(this.plugin.settings.button_default_color)
					.onChange(async (value) => {
						this.plugin.settings.button_default_color = value.trim();
						await this.plugin.saveSettings();
					});
			})
			.addText((cb) => {
				cb.setPlaceholder('#202020')
					.setValue(this.plugin.settings.button_focus_color)
					.onChange(async (value) => {
						this.plugin.settings.button_focus_color = value.trim();
						await this.plugin.saveSettings();
					});
			})
			.addText((cb) => {
				cb.setPlaceholder('#404040')
					.setValue(this.plugin.settings.button_hover_color)
					.onChange(async (value) => {
						this.plugin.settings.button_hover_color = value.trim();
						await this.plugin.saveSettings();
					});
			})
			.addText((cb) => {
				cb.setPlaceholder('#202020')
					.setValue(this.plugin.settings.button_border_default_color)
					.onChange(async (value) => {
						this.plugin.settings.button_border_default_color = value.trim();
						await this.plugin.saveSettings();
					});
			})
			.addText((cb) => {
				cb.setPlaceholder('#7F6DF2')
					.setValue(this.plugin.settings.button_border_focus_color)
					.onChange(async (value) => {
						this.plugin.settings.button_border_focus_color = value.trim();
						await this.plugin.saveSettings();
					});
			})
			.addText((cb) => {
				cb.setPlaceholder('#7F6DF2')
					.setValue(this.plugin.settings.button_border_hover_color)
					.onChange(async (value) => {
						this.plugin.settings.button_border_hover_color = value.trim();
						await this.plugin.saveSettings();
					});
			})
			.addSlider((cb) => {
				cb.setLimits(0, 10, 1)
					.setValue(this.plugin.settings.button_border_width)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.button_border_width = value;
						await this.plugin.saveSettings();
					});
			})
			.addSlider((cb) => {
				cb.setLimits(0, 100, 1)
					.setValue(this.plugin.settings.button_border_radius)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.button_border_radius = value;
						await this.plugin.saveSettings();
					});
			})
			.addText((cb) => {
				cb.setPlaceholder('#DCDDDE')
					.setValue(this.plugin.settings.button_default_font_color)
					.onChange(async (value) => {
						this.plugin.settings.button_default_font_color = value.trim();
						await this.plugin.saveSettings();
					});
			});
		const toolbarBtnColor = <HTMLElement>(
			document.querySelector('div.text-toolbar-button-color-setting > div.setting-item-control')
		);
		toolbarBtnColor.style.display = 'grid';
		toolbarBtnColor.style.gap = '2em';
		toolbarBtnColor.style.gridTemplateColumns = '20em 1fr';

		const toolbarBtnColorItem1 = <HTMLInputElement>(
			document.querySelector('div.text-toolbar-button-color-setting > div.setting-item-control > :nth-child(1)')
		);
		const toolbarBtnColorItem2 = <HTMLInputElement>(
			document.querySelector('div.text-toolbar-button-color-setting > div.setting-item-control > :nth-child(2)')
		);
		const toolbarBtnColorItem3 = <HTMLInputElement>(
			document.querySelector('div.text-toolbar-button-color-setting > div.setting-item-control > :nth-child(3)')
		);
		const toolbarBtnColorItem4 = <HTMLInputElement>(
			document.querySelector('div.text-toolbar-button-color-setting > div.setting-item-control > :nth-child(4)')
		);
		const toolbarBtnColorItem5 = <HTMLInputElement>(
			document.querySelector('div.text-toolbar-button-color-setting > div.setting-item-control > :nth-child(5)')
		);
		const toolbarBtnColorItem6 = <HTMLInputElement>(
			document.querySelector('div.text-toolbar-button-color-setting > div.setting-item-control > :nth-child(6)')
		);
		const toolbarBtnColorItem7 = <HTMLInputElement>(
			document.querySelector('div.text-toolbar-button-color-setting > div.setting-item-control > :nth-child(7)')
		);
		const toolbarBtnColorItem8 = <HTMLInputElement>(
			document.querySelector('div.text-toolbar-button-color-setting > div.setting-item-control > :nth-child(8)')
		);
		const toolbarBtnColorItem9 = <HTMLInputElement>(
			document.querySelector('div.text-toolbar-button-color-setting > div.setting-item-control > :nth-child(9)')
		);
		const btnColorLabel1 = <HTMLElement>document.createElement('label');
		const btnColorLabel2 = <HTMLElement>document.createElement('label');
		const btnColorLabel3 = <HTMLElement>document.createElement('label');
		const btnColorLabel4 = <HTMLElement>document.createElement('label');
		const btnColorLabel5 = <HTMLElement>document.createElement('label');
		const btnColorLabel6 = <HTMLElement>document.createElement('label');
		const btnColorLabel7 = <HTMLElement>document.createElement('label');
		const btnColorLabel8 = <HTMLElement>document.createElement('label');
		const btnColorLabel9 = <HTMLElement>document.createElement('label');

		btnColorLabel1.classList.add('text-toolbar-settings-label');
		btnColorLabel1.innerText = 'Default button color : ';
		toolbarBtnColorItem1.before(btnColorLabel1);
		btnColorLabel2.classList.add('text-toolbar-settings-label');
		btnColorLabel2.innerText = 'Focus button color : ';
		toolbarBtnColorItem2.before(btnColorLabel2);
		btnColorLabel3.classList.add('text-toolbar-settings-label');
		btnColorLabel3.innerText = 'Hover button color : ';
		toolbarBtnColorItem3.before(btnColorLabel3);
		btnColorLabel4.classList.add('text-toolbar-settings-label');
		btnColorLabel4.innerText = 'Default border color: ';
		toolbarBtnColorItem4.before(btnColorLabel4);
		btnColorLabel5.classList.add('text-toolbar-settings-label');
		btnColorLabel5.innerText = 'Focus border color : ';
		toolbarBtnColorItem5.before(btnColorLabel5);
		btnColorLabel6.classList.add('text-toolbar-settings-label');
		btnColorLabel6.innerText = 'Hover border color : ';
		toolbarBtnColorItem6.before(btnColorLabel6);
		btnColorLabel7.classList.add('text-toolbar-settings-label');
		btnColorLabel7.innerText = 'Border width : ';
		toolbarBtnColorItem7.before(btnColorLabel7);
		btnColorLabel8.classList.add('text-toolbar-settings-label');
		btnColorLabel8.innerText = 'Border radius : ';
		toolbarBtnColorItem8.before(btnColorLabel8);
		btnColorLabel9.classList.add('text-toolbar-settings-label');
		btnColorLabel9.innerText = 'Default label color : ';
		toolbarBtnColorItem9.before(btnColorLabel9);

		toolbarBtnColorItem1.type = 'color';
		toolbarBtnColorItem2.type = 'color';
		toolbarBtnColorItem3.type = 'color';
		toolbarBtnColorItem4.type = 'color';
		toolbarBtnColorItem5.type = 'color';
		toolbarBtnColorItem6.type = 'color';
		toolbarBtnColorItem9.type = 'color';

		const apBtnSetting = document.querySelector('div.text-toolbar-button-color-setting');
		apBtnWrap.appendChild(apBtnSetting);

		//Action
		this.containerEl.createEl('h2', { text: 'Action' });
		const actionDesc = document.createDocumentFragment();
		actionDesc.append(
			descEl.createEl('br'),
			descEl.createEl('strong', { text: ' Action: ' }),
			descEl.createEl('br'),
			`There are three types of actions.`,
			descEl.createEl('br'),
			`Actions with the prefix 'TAG' add HTML tags.`,
			descEl.createEl('br'),
			`Actions with the prefix 'MD' add Markdown elements.`,
			descEl.createEl('br'),
			`Some actions add Markdown elements and HTML tags at the same time.`,
			descEl.createEl('br'),
			`Actions with the prefix 'MAC' execute Macros.`,
			descEl.createEl('br'),
			descEl.createEl('strong', { text: ' Tag Example: ' }),
			descEl.createEl('br'),
			`span: <span class="Class">selected text</span>`,
			descEl.createEl('br'),
			`div*2: <div class="Class"><div>selected text</div></div>`,
			descEl.createEl('br'),
			`div span /%s/: <div class="Class"><span></span>selected text</div>`,
			descEl.createEl('br'),
			descEl.createEl('br'),
			descEl.createEl('strong', { text: ' Label: ' }),
			descEl.createEl('br'),
			`The label that appears on the button.`,
			descEl.createEl('br'),
			`If the CSS class is set, a simplified style is applied to the label.`,
			descEl.createEl('br'),
			`Font size is reduced to fit the button, so fewer characters on the label are preferred.`,
			descEl.createEl('br'),
			`Emoji and symbols can be used.`,
			descEl.createEl('br'),
			descEl.createEl('br'),
			descEl.createEl('strong', { text: ' Class: ' }),
			descEl.createEl('br'),
			`CSS class to be applied to HTML tags.`,
			descEl.createEl('br'),
			`It must be registered in your CSS snippet.`,
			descEl.createEl('br'),
			`This is not required for Markdowns or Macros, so it can be left blank.`
		);

		this.containerEl.createEl('details', { cls: 'setting-item-description tt-setting-action-desc-details' });
		this.containerEl.createEl('summary', { cls: 'tt-setting-action-desc-summary' });
		const actionDescDetails = document.querySelector('details.tt-setting-action-desc-details');
		const actionDescSummary = document.querySelector('summary.tt-setting-action-desc-summary');
		actionDescSummary.innerHTML = `<span style="font-size: 1.17em; font-weight: 600;">Action Description</span>`;
		actionDescDetails.appendChild(actionDescSummary);
		actionDescDetails.appendChild(actionDesc);
		actionDescDetails.setAttribute;

		const addActionDesc = document.createDocumentFragment();
		addActionDesc.append(`Each action is added to the toolbar in turn as a single button.`);
		new Setting(this.containerEl)

			.setName('Add new action')
			.setDesc(addActionDesc)
			.addButton((button: ButtonComponent) => {
				button
					.setTooltip('Add new action')
					.setButtonText('+')
					.setCta()
					.onClick(async () => {
						this.plugin.settings.action_set.push({
							action: '',
							label: '',
							class: '',
						});
						await this.plugin.saveSettings();
						this.display();
					});
			});

		this.plugin.settings.action_set.forEach((action_set, index) => {
			const s = new Setting(this.containerEl)
				.addSearch((cb) => {
					new actionSuggest(this.app, cb.inputEl);
					cb.setPlaceholder('Action')
						.setValue(action_set.action)
						.onChange(async (newaction) => {
							this.plugin.settings.action_set[index].action = newaction.trim();
							await this.plugin.saveSettings();
						});
				})

				.addSearch((cb) => {
					cb.setPlaceholder('Label')
						.setValue(action_set.label)
						.onChange(async (newClass) => {
							this.plugin.settings.action_set[index].label = newClass.trim();
							await this.plugin.saveSettings();
						});
				})

				.addSearch((cb) => {
					cb.setPlaceholder('Class')
						.setValue(action_set.class)
						.onChange(async (newClass) => {
							this.plugin.settings.action_set[index].class = newClass.trim();
							await this.plugin.saveSettings();
						});
				})

				.addExtraButton((cb) => {
					cb.setIcon('up-chevron-glyph')
						.setTooltip('Move up')
						.onClick(async () => {
							arrayMove(this.plugin.settings.action_set, index, index - 1);
							await this.plugin.saveSettings();
							this.display();
						});
				})
				.addExtraButton((cb) => {
					cb.setIcon('down-chevron-glyph')
						.setTooltip('Move down')
						.onClick(async () => {
							arrayMove(this.plugin.settings.action_set, index, index + 1);
							await this.plugin.saveSettings();
							this.display();
						});
				})
				.addExtraButton((cb) => {
					cb.setIcon('cross')
						.setTooltip('Delete')
						.onClick(async () => {
							this.plugin.settings.action_set.splice(index, 1);
							await this.plugin.saveSettings();
							this.display();
						});
				});
			s.infoEl.remove();
		});
	}
}
