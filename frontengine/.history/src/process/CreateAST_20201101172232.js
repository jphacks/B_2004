var esprima = require('esprima');

var code_src = `
	// Default parameters (es6)
	function multiply(a, b = 1) {
		return a*b;
	}

	multiply(5);
`;

var ast = esprima.parse(code_src);
console.log(JSON.stringify(ast));

var tokens = esprima.tokenize(code_src);
console.log(JSON.stringify(tokens));