/*

Copyright (c) 2011 Uwe Jugel

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


	Hot Coffee Brewer
	=================
	
	this file is hotcoffee.js a part of the Hot Coffee Brewer
	
	- starts the "Hot Coffee Brewer"
	- is a bootstrapper CoffeeScript.compile
	- compiles and runs the actual Hot Coffee Brewer script (compile.co)
	- runs in node.js and has no other dependencies
	- does not require npm or coffee commandline tools, and therefore
	- runs on Linux AND Windows
	
	Usage: call buildAll() or test(<file>) in your build script

	https://github.com/ubunatic/Hot-Coffee-Brewer


	Attention: 'require' works differently than 'readFileSync' etc.
	           take care for correct path names if you modify anything
*/

coffee = require("./coffee.js").CoffeeScript
fs = require("fs")

//compile the build script
buildDirFound = false
try{ buildDirFound = fs.statSync("./.hotcoffee").isDirectory() }
catch (error){ console.log(
	"ERROR: In hotcoffee.js: '.hotcoffee' dir not found! Start Hot Coffee Brewer\n"+
	"from your project's root dir, which should look like this:\n"+
	"  ./build.js                        # starts the build (usage: 'node build.js')\n"+
	"  ./.hotcoffee                      # hidden dir for the build tools\n"+
	"  ./.hotcoffee/tools/hotcoffee.js   # Hot Coffee bootstrapper\n"+
	"  ./.hotcoffee/tools/coffee.js      # CoffeeScript module\n"+
	"  ./.hotcoffee/tools/compile.co     # Hot Coffee build functions\n"+
	"  ./.hotcoffee/tools/cotest.co      # Hot Coffee test functions\n"+
	"  ./src                             # source dir for your .co sources\n"+
	"  ./lib                             # target dir for compiled .js files\n\n"
);}

if (buildDirFound) {
	// build coffee build tools
	// read tools from .hotcoffee/tools
	// save js-files to .hotcoffee/.tmp
	var cofiles, cotests, len, idx, cofile, jsfile;

	cofiles = [ "compile", "cotest", "comatch", "cocheck", "convert", "errorformat", "tastecoffee" ];
	cotests = [ "test_match", "test_check", "test_test", "test_compile", "test_convert", "test" ];

	for( idx=0, len=cofiles.length; idx < len; idx += 1){
		cofile = fs.readFileSync("./.hotcoffee/tools/" + cofiles[idx] + ".co", "UTF8")
		jsfile = coffee.compile( cofile, { filename: "./.hotcoffee/tools/" + cofiles[idx] + ".co" } )
		fs.writeFileSync("./.hotcoffee/tmp_" + cofiles[idx] + ".js", jsfile )
	}
	for( idx=0, len=cotests.length; idx < len; idx += 1){
		cofile = fs.readFileSync("./.hotcoffee/test/" + cotests[idx] + ".co", "UTF8")
		jsfile = coffee.compile( cofile, { filename: "./.hotcoffee/test/" + cotests[idx] + ".co" }  )
		fs.writeFileSync("./.hotcoffee/tmp_" + cotests[idx] + ".js", jsfile )
	}
}

//export the build functions
compile = require("../tmp_compile.js")
module.exports.buildAll = function() { compile.buildAll() }
module.exports.test = function(file) { compile.test(file) }

