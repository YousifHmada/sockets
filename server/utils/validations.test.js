var {isRealString} = require('./validations');
var expect = require('expect');

describe('isRealString',()=>{
	it('should reject numbers',()=>{
		var str = 15;
		expect(isRealString(str)).toBe(false);
	});
	it('should reject an empty string',()=>{
		var str = " ";
		expect(isRealString(str)).toBe(false);
	});
});