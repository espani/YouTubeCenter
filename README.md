YouTube Center
==============
A very, very alpha version of a remake of YouTube Center.


Build
-----
YouTube Center uses [Grunt](http://gruntjs.com/) as the build system.

### Requirements
 * [npm](https://npmjs.org/) ([Node.js](http://nodejs.org/) package manager)
 * [Grunt](http://gruntjs.com/)

### Dependencies
 * [RequireJS](https://github.com/gruntjs/grunt-contrib-requirejs) `npm install grunt-contrib-requirejs --save-dev`
 * [Uglify](https://github.com/gruntjs/grunt-contrib-uglify) `npm install grunt-contrib-uglify --save-dev`
 * [Concat](https://github.com/gruntjs/grunt-contrib-concat) `npm install grunt-contrib-concat --save-dev`
 * [Copy](https://github.com/gruntjs/grunt-contrib-copy) `npm install grunt-contrib-copy --save-dev`
 * [Watch](https://github.com/gruntjs/grunt-contrib-watch) `npm install grunt-contrib-watch --save-dev`
 * [Clean](https://github.com/gruntjs/grunt-contrib-clean) `npm install grunt-contrib-clean --save-dev`
 * [Replace](https://github.com/outaTiME/grunt-replace) `npm install grunt-replace --save-dev`
 
### Building
`grunt dev`

`grunt`

### output
./ytcenter.js

TODO
----
 * Implement every YouTube Center feature using requirejs (it's great, okay).
 * Add extension builder for Chrome, Firefox, Safari, Maxthon, Opera (and IE)
 * Add userscript support
 * Add method to download the translations into a JSON file.
 * Add styles.
 * Add API keys.
 * Add developer version.
 * Add configuration file for YouTube Center (downloadURL, firefoxTargetID, ...).
 * Add exclusive settings window for the extensions. To remove the need to visit YouTube to change settings.

License
-------
The MIT License (MIT)

Copyright (c) 2014 Jeppe Rune Mortensen

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 