/**
 * http://usejsdoc.org/
 */

var entry = {
	profile: {
		name:"태연",
		job:"Singer"
	}
};

var jstoxml = require("jstoxml");
var xmlContent = jstoxml.toXML(entry,{header:true}); // JSON 객체 -> xml 변환
console.log(xmlContent);

var xml2json = require('node-xml2json');
var json = xml2json.parser(xmlContent); // xml -> JSON 객체
console.log(typeof json);

var jsonStr = JSON.stringify(json); //  JSON객체 -> JSON 문자열
console.log(jsonStr);

var jsonObj = JSON.parse(jsonStr); //JSON문자열 -> JSON객체
console.log(jsonObj);