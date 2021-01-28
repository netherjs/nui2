# Nether UI 2

Work in progress.

## Requirements

* jQuery 3.5
* Bootstrap 4.5
* Font Awesome 5

## Testing

$ composer install
$ php -S localhost:80 -t www .

## Example Use

```js
import Dialog from "./nui/element/dialog.js";
import Button from "./nui/element/button.js";

new Dialog({
	'Modal': true,
	'Title': 'Do you?',
	'Icon': 'fas fa-question-circle',
	'Content': 'Well?',
	'Buttons': [
		new Button({
			'Text':'Probably',
			'Class': 'NUI-Action-Accept'
		})
	]
})
.Register(
	'Accept', 'AppOnAccept',
	function(){ this.Close(); return; }
)
```
