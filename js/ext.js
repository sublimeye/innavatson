/**
 * Console for IE
 */
if (typeof window.console == 'undefined') {
	window.console = {};
	console.log = console.info = console.warn = console.debug = console.group = console.groupEnd = console.error = console.time = console.timeEnd = function(){};
} else if (typeof window.console == 'object' && ($.browser.msie && $.browser.version == 8)) {
	console.debug = console.group = console.groupEnd = console.time = console.timeEnd = function(){};
}

/**
 * Array object extension
 */
$A = Array.from = function(iterable) {
	if (!iterable) {
		return [];
	}
	if (iterable.toArray) {
		return iterable.toArray();
	} else {
		var results = [];
		for (var i = 0, length = iterable.length; i < length; i++) {
			results.push(iterable[i]);
		}
		return results;
	}
};

/**
 * bind method support for older browsers
 */
$.extend( Function.prototype, {
	bind: function() {
		var __method = this, args = $A(arguments), object = args.shift();
		return function() {
			return __method.apply(object, args.concat($A(arguments)));
		};
	}
});
