"use strict";function _slicedToArray(a,b){return _arrayWithHoles(a)||_iterableToArrayLimit(a,b)||_unsupportedIterableToArray(a,b)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _iterableToArrayLimit(a,b){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a)){var c=[],d=!0,e=!1,f=void 0;try{for(var g,h=a[Symbol.iterator]();!(d=(g=h.next()).done)&&(c.push(g.value),!(b&&c.length===b));d=!0);}catch(a){e=!0,f=a}finally{try{d||null==h["return"]||h["return"]()}finally{if(e)throw f}}return c}}function _arrayWithHoles(a){if(Array.isArray(a))return a}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var R=require("ramda"),_require=require("@identity.com/uca"),definitions=_require.definitions,UserCollectableAttribute=_require.UserCollectableAttribute,_require2=require("./ValidationErrors"),BadUCAValueError=_require2.BadUCAValueError,BadValidationProcessError=_require2.BadValidationProcessError,BadValidationUCAError=_require2.BadValidationUCAError,_require3=require("../constants/ValidationConstants"),AggregatedValidationProcessStatus=_require3.AggregatedValidationProcessStatus,ValidationProcessStatus=_require3.ValidationProcessStatus,UCAStatus=_require3.UCAStatus,validIdentifiers=definitions.map(function(a){return a.identifier}),defaultUcaVersion="1",ValidationUCAValue=function(){function a(b,c,d){if(_classCallCheck(this,a),this.name=b,!this.name)throw new Error("you must provide a name for the UCA");this.ucaVersion=d,this.setValue(c)}return _createClass(a,[{key:"setValue",value:function(a){if(this.name&&validIdentifiers.includes(this.name))try{new UserCollectableAttribute(this.name,a,this.ucaVersion)}catch(b){throw new BadUCAValueError(this.name,a,b)}this.value=a}},{key:"serialize",value:function(){return{value:this.value}}}]),a}(),ValidationUCA=function(){function a(b,c){var d=2<arguments.length&&void 0!==arguments[2]?arguments[2]:defaultUcaVersion,e=3<arguments.length?arguments[3]:void 0;_classCallCheck(this,a);var f=function(a,b){var c=R.prop(b,a);if(c)return c;throw new BadValidationUCAError("".concat(b," not present in ").concat(a))};this.ucaMapId=b,this.ucaName=f(c,"name"),this.status=f(c,"status"),this.ucaVersion=d,this.dependsOnStatus=e,this.dependsOn=R.propOr([],"dependsOn",c)}return _createClass(a,[{key:"url",get:function(){return"ucas/".concat(this.ucaMapId)}},{key:"getValueObj",value:function(a){var b=new ValidationUCAValue(this.ucaName,a,this.ucaVersion);return b.serialize()}},{key:"dependsOnArray",get:function(){var b=this;return this.dependsOnValidationUcas=!this.dependsOnValidationUcas&&this.dependsOn&&0<this.dependsOn.length?this.dependsOn.map(function(c){return new a(null,c.uca,b.ucaVersion,c.status)}):[],this.dependsOnValidationUcas}}]),a}(),ValidationProcess=function(){function a(b){_classCallCheck(this,a);var c=function(a,b){var c=R.path(b,a);if(c)return c;throw new BadValidationProcessError("".concat(b," not present in ").concat(JSON.stringify(a)))};this.id=c(b,["id"]),this.credentialItem=c(b,["state","credential"]),this.processUrl=c(b,["processUrl"]),this.status=c(b,["state","status"]),this.ucaVersion=c(b,["state","ucaVersion"]),this.ucas=c(b,["state","ucas"])}return _createClass(a,[{key:"getValidationUcas",value:function(){var a=this;return this.validationUcas||(this.validationUcas=Object.entries(this.ucas).map(function(b){var c=_slicedToArray(b,2),d=c[0],e=c[1];return new ValidationUCA(d,e,a.ucaVersion)})),this.validationUcas}},{key:"getValidationUcasByStatus",value:function(a){return this.getValidationUcas().filter(R.propEq("status",a))}},{key:"getAggregatedValidationProcessStatus",value:function(){if(this.status===ValidationProcessStatus.IN_PROGRESS){var a=this.getValidationUcasByStatus(UCAStatus.AWAITING_USER_INPUT),b=this.getValidationUcasByStatus(UCAStatus.INVALID).filter(function(a){return 0!==a.retriesRemaining});return a.length||b.length?AggregatedValidationProcessStatus.IN_PROGRESS_ACTION_REQUIRED:AggregatedValidationProcessStatus.IN_PROGRESS_VALIDATING}return this.status}}]),a}();module.exports={ValidationProcess:ValidationProcess,ValidationUCA:ValidationUCA,ValidationUCAValue:ValidationUCAValue,BadUCAValueError:BadUCAValueError};