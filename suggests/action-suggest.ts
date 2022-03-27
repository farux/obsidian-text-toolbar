import { App, Plugin, PluginManifest } from 'obsidian';

import { TextInputSuggest } from './suggest';

export class GetAction extends Plugin {
	actionList: string[];

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);
		this.actionList = [
			'TAG:span',
			'TAG:span*2',
			'TAG:span*2 /%s/',
			'TAG:div',
			'TAG:div span',
			'TAG:div span /%s/',
			'TAG:div*2',
			'TAG:div*2 /%s/',
			'TAG:p',
			'TAG:p span',
			'TAG:p span /%s/',
			'TAG:mark',
			'TAG:mark span',
			'TAG:mark span /%s/',
			'TAG:details',
			'TAG:details open',
			'MD:Internal link',
			'MD:Embeds',
			'MD:h1',
			'MD:h1 TAG:span',
			'MD:h1 TAG:span*2',
			'MD:h1 TAG:span*2 /%s/',
			'MD:h2',
			'MD:h2 TAG:span',
			'MD:h2 TAG:span*2',
			'MD:h2 TAG:span*2 /%s/',
			'MD:h3',
			'MD:h3 TAG:span',
			'MD:h3 TAG:span*2',
			'MD:h3 TAG:span*2 /%s/',
			'MD:h4',
			'MD:h4 TAG:span',
			'MD:h4 TAG:span*2',
			'MD:h4 TAG:span*2 /%s/',
			'MD:h5',
			'MD:h5 TAG:span',
			'MD:h5 TAG:span*2',
			'MD:h5 TAG:span*2 /%s/',
			'MD:h6',
			'MD:h6 TAG:span',
			'MD:h6 TAG:span*2',
			'MD:h6 TAG:span*2 /%s/',
			'MD:*Italic*',
			'MD:_Italic_',
			'MD:**Bold**',
			'MD:__Bold__',
			'MD:Bulleted list',
			'MD:Numbered list',
			'MD:Image',
			'MD:Link',
			'MD:Blockquotes',
			'MD:Inline code',
			'MD:Code blocks',
			'MD:Task list',
			'MD:Strikethrough',
			'MD:Highlight',
			'MD:Footnotes',
			'MD:Inline footnotes',
			'MD:Math',
			'MD:Comments',
			'MD:Mermaid',
			'MAC:UpperCase',
			'MAC:LowerCase',
			'MAC:Ascending order',
			'MAC:Descending order',
			'MAC:Upper Camel Case',
			'MAC:Lower Camel Case',
			'MAC:Snake case',
			'MAC:Kebab case',
			'MAC:Space separated',
			'MAC:Remove blank lines',
			'MAC:Merge Multiple spaces to single space',
			'MAC:Remove HTML tags',
		];
	}

	pull(): string[] {
		return this.actionList;
	}
}

export class actionSuggest extends TextInputSuggest<string> {
	manifest: PluginManifest;
	actionList: GetAction;
	actionMatch: string[];
	lowerCaseInputStr: string;

	getSuggestions(inputStr: string): string[] {
		this.actionList = new GetAction(this.app, this.manifest);
		this.actionMatch = [];
		this.lowerCaseInputStr = inputStr.toLowerCase();

		this.actionList.pull().forEach((action: string) => {
			if (action.toLowerCase().contains(this.lowerCaseInputStr)) {
				this.actionMatch.push(action);
			}
		});

		return this.actionMatch;
	}

	renderSuggestion(action: string, el: HTMLElement): void {
		el.setText(action);
	}

	selectSuggestion(action: string): void {
		this.inputEl.value = action;
		this.inputEl.trigger('input');
		this.close();
	}
}
