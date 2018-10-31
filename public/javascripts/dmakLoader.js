/*
Copyright (c) 2014 Matthieu Bilbille, http://github.com/mbilbille

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
;(function () {

	"use strict";

	// Create a safe reference to the DrawMeAKanji object for use below.
	var DmakLoader = function (uri) {
		this.uri = uri;
	};

	/**
	 * Gather SVG data information for a given set of characters.
	 * By default this action is done while instanciating the Word
	 * object, but it can be skipped, see above
	 */
	DmakLoader.prototype.load = function (text, callback) {
		var paths = [],
			nbChar = text.length,
			done = 0,
			i,
			callbacks = {
				done: function (index, data) {
					paths[index] = data;
					done++;
					if (done === nbChar) {
						callback(paths);
					}
				},
				error: function (msg) {
					console.log("Error", msg);
				}
			};

		for (i = 0; i < nbChar; i++) {
			loadSvg(this.uri, i, text.charCodeAt(i).toString(16), callbacks);
		}
	};

	/**
	 * Try to load a SVG file matching the given char code.
	 * @thanks to the incredible work made by KanjiVG
	 * @see: http://kanjivg.tagaini.net
	 */
	function loadSvg(uri, index, charCode, callbacks) {
		var xhr = new XMLHttpRequest(),
			code = ("00000" + charCode).slice(-5);

		// Skip space character
		if(code === "00020" || code === "03000") {
			callbacks.done(index, {
				paths: [],
				texts: []
			});
			return;
		}

		xhr.open("GET", uri + code + ".svg", true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					callbacks.done(index, parseResponse(xhr.response, code));
				} else {
					callbacks.error(xhr.statusText);
				}
			}
		};
		xhr.send();
	}

	/**
	 * Simple parser to extract paths and texts data.
	 */
	function parseResponse(response, code) {
		var data = [],
			dom = new DOMParser().parseFromString(response, "application/xml"),
			texts = dom.querySelectorAll("text"),
			groups = [],
			i;
		
		// Private recursive function to parse DOM content
		function __parse(element) {
            var children = element.childNodes,
                i;

            for(i = 0; i < children.length; i++) {
                if(children[i].tagName === "g") {
                    groups.push(children[i].getAttribute("id"));
                    __parse(children[i]);
                    groups.splice(groups.indexOf(children[i].getAttribute("id")), 1);
                }
                else if(children[i].tagName === "path") {
                    data.push({
                        "path" : children[i].getAttribute("d"),
                        "groups" : groups.slice(0)
                    });
                }
            }
		}

        // Start parsing
		__parse(dom.getElementById("kvg:" + code));

        // And finally add order mark information
		for (i = 0; i < texts.length; i++) {
			data[i].text = {
				"value" : texts[i].textContent,
				"x" : texts[i].getAttribute("transform").split(" ")[4],
				"y" : texts[i].getAttribute("transform").split(" ")[5].replace(")", "")
			};
		}
		
		return data;
	}

	window.DmakLoader = DmakLoader;
}());
