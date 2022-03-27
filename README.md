## Obsidian Text Toolbar Plugin
![00001](https://user-images.githubusercontent.com/33874906/160287593-ad28ef68-d8d7-410d-806f-d22d2dbce46b.gif)


## How to use

To begin, register your required actions in the toolbar.

Selecting text in the editor view will show your customized toolbar.

Click the button to apply CSS snippets, markdowns, built-in macros, etc. to the selected text.

Selecting multiple texts with the Alt and Shift keys allows you to apply the same action at once.

---
### Key and mouse operation

Tab key: Focus on toolbar or next button

Shift+Tab: Focus on previous button

Cursor key: Move button focus

Esc key: Hide toolbar

---
## Settings

### Toolbar Structure

Three different toolbar structures can be configured for different Obsidian window sizes.

The toolbar structure, such as the number of buttons, rows, etc., can be configured according to the screen, such as desktop, tablet, or cell phone.

### Toolbar Appearance

Toolbar and button colors, borders, opacity, etc. can be set.

---
## Action Setting
![Obsidian_HZWECBnz5C](https://user-images.githubusercontent.com/33874906/160280018-efa9b224-2098-4ff5-92ee-10ffea339a97.png)

Each action is added to the toolbar in turn as a single button.

### Action:

There are three types of actions.

1. Actions with the prefix 'TAG' add HTML tags.

    You can apply styles to text by combining it with your CSS snippets.
	![02](https://user-images.githubusercontent.com/33874906/160281089-9ceec2a7-235f-4280-acb4-28811faefa3c.gif)

	Tag Example:

	span: `<span class="Class">selected text</span>`

	div*2: `<div class="Class"><div>selected text</div></div>`

	div span /%s/: `<div class="Class"><span></span>selected text</div>`

2. Actions with the prefix 'MD' add Markdown elements.
 ![03](https://user-images.githubusercontent.com/33874906/160281579-b927c374-1e2e-4a91-a24e-c95226b42504.gif)


    Some actions add Markdown elements and HTML tags at the same time.

3. Actions with the prefix 'MAC' execute built-in Macros.
![04](https://user-images.githubusercontent.com/33874906/160282147-b17aae3d-8388-423e-bc97-7634843c14f5.gif)
---
### Label:

The label that appears on the button.

If the CSS class is set, a simplified style is applied to the label.

Font size is reduced to fit the button, so fewer characters on the label are preferred.

Emoji and symbols can be used.

---
### Class:

CSS class to be applied to HTML tags.

It must be registered in your CSS snippet.

This is not required for Markdowns or Macros, so it can be left blank.

---
## Attribution
suggest.ts  is the copyrighted work of Liam Cain (https://github.com/liamcain) obsidian-periodic-notes (https://github.com/liamcain/obsidian-periodic-notes).

popper.js https://popper.js.org/

Dummy text from https://www.blindtextgenerator.com/

CSS Reference:
- https://baigie.me/officialblog/2021/02/25/css-tips-1/
- https://saruwakakun.com/html-css/reference/buttons
- https://0edition.net/archives/1448
- https://jajaaan.co.jp/css/css-headline/

