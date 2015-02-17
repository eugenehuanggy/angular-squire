# angular-squire
angularjs directive for the [squire rich text editor](https://github.com/neilj/Squire). 

Check out the [DEMO](http://hourlynerd.github.io/angular-squire/)

# install

```bash
bower install angular-squire --save
```

or include the following in your code:

```bash
/dist/css/angular-squire.css
/dist/scripts/angular-squire.js
```

# usage

add an angular module dependency: `angular-squire`

basic usage of the directive looks like this:  
```html
<squire editor-class="foo" height="150px"
    ng-model="myModel" body="initialValue"
    placeholder="Type in here!">
</squire>
```

*Attributes:*  
`editor-class` - class given to the editor container (optional)  
`height` - css height for the editor (optional)  
`body` - binding that contains the initial html contents of the editor, if different from `ng-model` (optional)  
`ng-model` - where does the html go? **required**  
`placeholder` - placeholder text (optional) 

For advanced usage see demo. 

# depends on

```js
"angular": "~1.3.8",
"underscore": "~1.7.0",
"jquery": ">= 1.9.0",
"font-awesome": "~4.3.0",
"squire-rte": "~1.0.1"
```

# building

```bash
npm install bower -g
npm install gulp -g
npm install
bower install
gulp build
```
