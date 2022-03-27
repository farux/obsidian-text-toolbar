import { MarkdownView, Plugin } from 'obsidian';
import { TextToolbarSettings } from 'settings/settings';
import { detachToolBar } from './Utils';

export class ttAction extends Plugin {
	replace(ev: MouseEvent, settings: TextToolbarSettings, toolBar: HTMLDivElement) {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		const btnNum = parseInt((<HTMLButtonElement>ev.currentTarget).name);
		const action = settings.action_set[btnNum].action;
		const cssCls = settings.action_set[btnNum].class;

		let selectionList = view.editor.listSelections();
		let curPos;
		let curCh;
		let curLineOffset = 0;
		let curChOffset = 0;
		for (let i = 0; i < selectionList.length; i++) {
			const selectionRange = (() => {
				//If backward selection, re-select forward.
				if (
					selectionList[i].anchor.line > selectionList[i].head.line ||
					(selectionList[i].anchor.line === selectionList[i].head.line &&
						selectionList[i].anchor.ch > selectionList[i].head.ch)
				) {
					const tmp = selectionList[i];
					const tmpAnchor = selectionList[i].head;
					const tmpHead = selectionList[i].anchor;
					tmp.anchor = tmpAnchor;
					tmp.head = tmpHead;
					view.editor.setSelection(tmp.anchor, tmp.head);
					return tmp;
					//forward selection
				} else {
					return selectionList[i];
				}
			})();

			const lineBreak = (() => {
				if (selectionRange.anchor.ch !== 0) {
					return '\n';
				} else {
					return '';
				}
			})();

			const selectionTxt = view.editor.getRange(selectionRange.anchor, selectionRange.head);

			const bolReg = /^/gim;
			const urlReg = /:\/\//gim;
			const spaceReg = /\s/gim;
			let actionTxt;
			switch (action) {
				case 'TAG:span':
					actionTxt = `<span class="${cssCls}">${selectionTxt}</span>`;
					break;
				case 'TAG:span*2':
					actionTxt = `<span class="${cssCls}"><span>${selectionTxt}</span></span>`;
					break;
				case 'TAG:span*2 /%s/':
					actionTxt = `<span class="${cssCls}"><span></span>${selectionTxt}</span>`;
					curPos = 'bol';
					curChOffset = 21 + cssCls.length;
					break;
				case 'TAG:div':
					actionTxt = `<div class="${cssCls}">${selectionTxt}</div>`;
					break;
				case 'TAG:div span':
					actionTxt = `<div class="${cssCls}"><span>${selectionTxt}</span></div>`;
					break;
				case 'TAG:div span /%s/':
					actionTxt = `<div class="${cssCls}"><span></span>${selectionTxt}</div>`;
					curPos = 'bol';
					curChOffset = 20 + cssCls.length;
					break;
				case 'TAG:div*2':
					actionTxt = `<div class="${cssCls}"><div>${selectionTxt}</div></div>`;
					break;
				case 'TAG:div*2 /%s/':
					actionTxt = `<div class="${cssCls}"><div></div>\n${selectionTxt}</div>`;
					curPos = 'bol';
					curChOffset = 19 + cssCls.length;
					break;
				case 'TAG:p':
					actionTxt = `<p class="${cssCls}">${selectionTxt}</p>`;
					break;
				case 'TAG:p span':
					actionTxt = `<p class="${cssCls}"><span>${selectionTxt}</span></p>`;
					break;
				case 'TAG:p span /%s/':
					actionTxt = `<p class="${cssCls}"><span></span>${selectionTxt}</p>`;
					curPos = 'bol';
					curChOffset = 18 + cssCls.length;
					break;
				case 'TAG:mark':
					actionTxt = `<mark class="${cssCls}">${selectionTxt}</mark>`;
					break;
				case 'TAG:mark span':
					actionTxt = `<mark class="${cssCls}"><span>${selectionTxt}</span></mark>`;
					break;
				case 'TAG:mark span /%s/':
					actionTxt = `<mark class="${cssCls}"><span></span>${selectionTxt}</mark>`;
					curPos = 'bol';
					curChOffset = 21 + cssCls.length;
					break;
				case 'TAG:details':
					actionTxt = `${lineBreak}<details class="${cssCls}">\n  <summary>${selectionTxt}</summary>\n  \n</details>`;
					curLineOffset = -1;
					curCh = 2;
					break;
				case 'TAG:details open':
					actionTxt = `${lineBreak}<details open class="${cssCls}">\n  <summary>${selectionTxt}</summary>\n  \n</details>`;
					curLineOffset = -1;
					curCh = 2;
					break;
				case 'MD:Internal link':
					actionTxt = `[[${selectionTxt}]]`;
					break;
				case 'MD:Embeds':
					actionTxt = `![[${selectionTxt}]]`;
					break;
				case 'MD:h1':
					actionTxt = `${lineBreak}# ${selectionTxt}`;
					break;
				case 'MD:h1 TAG:span':
					actionTxt = `${lineBreak}# <span class="${cssCls}">${selectionTxt}</span>`;
					break;
				case 'MD:h1 TAG:span*2':
					actionTxt = `${lineBreak}# <span class="${cssCls}"><span>${selectionTxt}</span></span>`;
					break;
				case 'MD:h1 TAG:span*2 /%s/':
					actionTxt = `${lineBreak}# <span class="${cssCls}"><span></span>${selectionTxt}</span>`;
					curPos = 'bol';
					curChOffset = (() => {
						if (lineBreak) {
							return 24 + cssCls.length;
						} else {
							return 23 + cssCls.length;
						}
					})();
					break;
				case 'MD:h2':
					actionTxt = `${lineBreak}## ${selectionTxt}`;
					break;
				case 'MD:h2 TAG:span':
					actionTxt = `${lineBreak}## <span class="${cssCls}">${selectionTxt}</span>`;
					break;
				case 'MD:h2 TAG:span*2':
					actionTxt = `${lineBreak}## <span class="${cssCls}"><span>${selectionTxt}</span></span>`;
					break;
				case 'MD:h2 TAG:span*2 /%s/':
					actionTxt = `${lineBreak}## <span class="${cssCls}"><span></span>${selectionTxt}</span>`;
					curPos = 'bol';
					curChOffset = (() => {
						if (lineBreak) {
							return 25 + cssCls.length;
						} else {
							return 24 + cssCls.length;
						}
					})();
					break;
				case 'MD:h3':
					actionTxt = `${lineBreak}### ${selectionTxt}`;
					break;
				case 'MD:h3 TAG:span':
					actionTxt = `${lineBreak}### <span class="${cssCls}">${selectionTxt}</span>`;
					break;
				case 'MD:h3 TAG:span*2':
					actionTxt = `${lineBreak}### <span class="${cssCls}"><span>${selectionTxt}</span></span>`;
					break;
				case 'MD:h3 TAG:span*2 /%s/':
					actionTxt = `${lineBreak}### <span class="${cssCls}"><span></span>${selectionTxt}</span>`;
					curPos = 'bol';
					curChOffset = (() => {
						if (lineBreak) {
							return 26 + cssCls.length;
						} else {
							return 25 + cssCls.length;
						}
					})();
					break;
				case 'MD:h4':
					actionTxt = `${lineBreak}#### ${selectionTxt}`;
					break;
				case 'MD:h4 TAG:span':
					actionTxt = `${lineBreak}#### <span class="${cssCls}">${selectionTxt}</span>`;
					break;
				case 'MD:h4 TAG:span*2':
					actionTxt = `${lineBreak}#### <span class="${cssCls}"><span>${selectionTxt}</span></span>`;
					break;
				case 'MD:h4 TAG:span*2 /%s/':
					actionTxt = `${lineBreak}#### <span class="${cssCls}"><span></span>${selectionTxt}</span>`;
					curPos = 'bol';
					curChOffset = (() => {
						if (lineBreak) {
							return 27 + cssCls.length;
						} else {
							return 26 + cssCls.length;
						}
					})();
					break;
				case 'MD:h5':
					actionTxt = `${lineBreak}##### ${selectionTxt}`;
					break;
				case 'MD:h5 TAG:span':
					actionTxt = `${lineBreak}##### <span class="${cssCls}">${selectionTxt}</span>`;
					break;
				case 'MD:h5 TAG:span*2':
					actionTxt = `${lineBreak}##### <span class="${cssCls}"><span>${selectionTxt}</span></span>`;
					break;
				case 'MD:h5 TAG:span*2 /%s/':
					actionTxt = `${lineBreak}##### <span class="${cssCls}"><span></span>${selectionTxt}</span>`;
					curPos = 'bol';
					curChOffset = (() => {
						if (lineBreak) {
							return 28 + cssCls.length;
						} else {
							return 27 + cssCls.length;
						}
					})();
					break;
				case 'MD:h6':
					actionTxt = `${lineBreak}###### ${selectionTxt}`;
					break;
				case 'MD:h6 TAG:span':
					actionTxt = `${lineBreak}###### <span class="${cssCls}">${selectionTxt}</span>`;
					break;
				case 'MD:h6 TAG:span*2':
					actionTxt = `${lineBreak}###### <span class="${cssCls}"><span>${selectionTxt}</span></span>`;
					break;
				case 'MD:h6 TAG:span*2 /%s/':
					actionTxt = `${lineBreak}###### <span class="${cssCls}"><span></span>${selectionTxt}</span>`;
					curPos = 'bol';
					curChOffset = (() => {
						if (lineBreak) {
							return 29 + cssCls.length;
						} else {
							return 28 + cssCls.length;
						}
					})();
					break;
				case 'MD:*Italic*':
					actionTxt = `*${selectionTxt}*`;
					break;
				case 'MD:_Italic_':
					actionTxt = `_${selectionTxt}_`;
					break;
				case 'MD:**Bold**':
					actionTxt = `**${selectionTxt}**`;
					break;
				case 'MD:__Bold__':
					actionTxt = `__${selectionTxt}__`;
					break;
				case 'MD:Bulleted list':
					actionTxt = lineBreak + selectionTxt.replace(bolReg, '- ');
					break;
				case 'MD:Numbered list':
					actionTxt = lineBreak + selectionTxt.replace(bolReg, '1. ');
					break;
				case 'MD:Image':
					if (urlReg.test(selectionTxt)) {
						const linkTxt = selectionTxt.replace(spaceReg, '%20');
						actionTxt = `![|100](${linkTxt})`;
						curPos = 'bol';
						curChOffset = 2;
					} else {
						actionTxt = `![${selectionTxt}|100]()`;
						curChOffset = -1;
					}
					break;
				case 'MD:Link':
					if (urlReg.test(selectionTxt)) {
						const linkTxt = selectionTxt.replace(spaceReg, '%20');
						actionTxt = `[](${linkTxt})`;
						curPos = 'bol';
						curChOffset = 1;
					} else {
						actionTxt = `[${selectionTxt}]()`;
						curChOffset = -1;
					}
					break;
				case 'MD:Blockquotes':
					actionTxt = `${lineBreak}> ${selectionTxt}\n\n\\- `;
					break;
				case 'MD:Inline code':
					actionTxt = `\`${selectionTxt}\``;
					break;
				case 'MD:Code blocks':
					actionTxt = `${lineBreak}\`\`\`\n${selectionTxt}\n\`\`\``;
					curPos = 'bol';
					curChOffset = (() => {
						if (lineBreak) {
							return 4;
						} else {
							return 3;
						}
					})();
					break;
				case 'MD:Task list':
					actionTxt = lineBreak + selectionTxt.replace(bolReg, '- [ ] ');
					break;
				case 'MD:Strikethrough':
					actionTxt = `~~${selectionTxt}~~`;
					break;
				case 'MD:Highlight':
					actionTxt = `==${selectionTxt}==`;
					break;
				case 'MD:Footnotes':
					const txt = view.editor.getValue();
					const foots = txt.match(/\[\^\d+\]/gim);
					const footNumArr = foots.map((value) => {
						return parseInt(value.replace(/\[\^|\]/gim, ''));
					});
					const existsNum = Array.from(new Set(footNumArr));
					existsNum.sort((a, b) => a - b);
					let footNum = 1;
					//First unused number
					for (let i = 0; i < existsNum.length; i++) {
						if (existsNum[i] == footNum) footNum++;
					}
					actionTxt = `${selectionTxt}[^${footNum}]`;
					const footLine = view.editor.lastLine() + 1;
					view.editor.setLine(footLine, `\n\n[^${footNum}]:`);
					curLineOffset = footLine;
					break;
				case 'MD:Inline footnotes':
					actionTxt = `${selectionTxt}^[]`;
					curChOffset = -1;
					break;
				case 'MD:Math':
					actionTxt = `$$\\begin{vmatrix}${selectionTxt}\\end{vmatrix}$$`;
					break;
				case 'MD:Comments':
					actionTxt = `%%${selectionTxt}%%`;
					break;
				case 'MD:Mermaid':
					actionTxt = `${lineBreak}\`\`\`mermaid\n${selectionTxt}\n\`\`\``;
					break;
				case 'MAC:UpperCase':
					actionTxt = selectionTxt.toLocaleUpperCase();
					break;
				case 'MAC:LowerCase':
					actionTxt = selectionTxt.toLocaleLowerCase();
					break;
				case 'MAC:Ascending order':
					actionTxt = selectionTxt
						.split(/\r|\r\n|\n/gim)
						.sort((a, b) => {
							const sa = String(a).replace(/(\d+)/g, (m) => m.padStart(30, '0'));
							const sb = String(b).replace(/(\d+)/g, (m) => m.padStart(30, '0'));
							return sa < sb ? -1 : sa > sb ? 1 : 0;
						})
						.join('\n');
					break;
				case 'MAC:Descending order':
					actionTxt = selectionTxt
						.split(/\r|\r\n|\n/gim)
						.sort((a, b) => {
							const sa = String(a).replace(/(\d+)/g, (m) => m.padStart(30, '0'));
							const sb = String(b).replace(/(\d+)/g, (m) => m.padStart(30, '0'));
							return sa > sb ? -1 : sa < sb ? 1 : 0;
						})
						.join('\n');
					break;
				case 'MAC:Upper Camel Case':
					actionTxt = selectionTxt
						.split(/\s|-|_/gim)
						.map((value) => {
							return value.charAt(0).toLocaleUpperCase() + value.slice(1).toLocaleLowerCase();
						})
						.join('');
					break;
				case 'MAC:Lower Camel Case':
					actionTxt = selectionTxt
						.split(/\s|-|_/gim)
						.map((value, index) => {
							if (index === 0) {
								return value.toLocaleLowerCase();
							} else {
								return value.charAt(0).toLocaleUpperCase() + value.slice(1).toLocaleLowerCase();
							}
						})
						.join('');
					break;
				case 'MAC:Snake case':
					actionTxt = selectionTxt
						.replace(/([a-z])([A-Z])/g, '$1_$2')
						.split(/\s|-/gim)
						.map((value, index, row) => {
							const txt = value.toLocaleLowerCase();
							if (index + 1 === row.length) {
								return txt;
							} else {
								return `${txt}_`;
							}
						})
						.join('');
					break;
				case 'MAC:Kebab case':
					actionTxt = selectionTxt
						.replace(/([a-z])([A-Z])/g, '$1-$2')
						.split(/\s|_/gim)
						.map((value, index, row) => {
							const txt = value.toLocaleLowerCase();
							if (index + 1 === row.length) {
								return txt;
							} else {
								return `${txt}-`;
							}
						})
						.join('');
					break;
				case 'MAC:Space separated':
					actionTxt = selectionTxt
						.replace(/([a-z])([A-Z])/g, '$1 $2')
						.split(/-|_/gim)
						.map((value, index, row) => {
							if (index + 1 === row.length) {
								return value;
							} else {
								return `${value} `;
							}
						})
						.join('');
					break;
				case 'MAC:Remove blank lines':
					actionTxt = selectionTxt.replace(/^$(\r|\r\n|\n)/gim, '');
					break;
				case 'MAC:Merge Multiple spaces to single space':
					actionTxt = selectionTxt.replace(/ +/gim, ' ');
					break;
				case 'MAC:Remove HTML tags':
					actionTxt = selectionTxt.replace(/<(".*?"|'.*?'|[^'"])*?>/gim, '');
					break;
				default:
					// actionTxt = `<${action} class="${cssCls}">${selectionTxt}</${action}>`;
					actionTxt = selectionTxt;
					break;
			}

			view.editor.replaceRange(actionTxt, selectionRange.anchor, selectionRange.head, selectionTxt);
			selectionList = view.editor.listSelections();
		}

		const lastCursor = selectionList[selectionList.length - 1];
		view.editor.blur();
		view.editor.focus();
		detachToolBar(toolBar);

		//Set cursor
		//bol
		if (curPos === 'bol') {
			const lastCursorCh = (() => {
				if (curCh) {
					return curCh;
				} else {
					return lastCursor.anchor.ch;
				}
			})();
			view.editor.setCursor(lastCursor.anchor.line + curLineOffset, lastCursorCh + curChOffset);
			//eol
		} else {
			const lastCursorCh = (() => {
				if (curCh) {
					return curCh;
				} else {
					return lastCursor.head.ch;
				}
			})();
			view.editor.setCursor(lastCursor.head.line + curLineOffset, lastCursorCh + curChOffset);
		}
	}
}
