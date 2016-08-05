/*************************************************************************
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2016 Adobe Systems Incorporated
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 **************************************************************************/

'use strict';

var logger = require('winston');

/**
 * Data Model Schema
 *
 * @constructor
 * @private
 * @this {Schema}
 */
var Schema = function () {
};

/**
 * Async factory method
 *
 * @param {Function} cb callback called with the result
 * @param {String|Error} cb.error error (non-null if an error occurred)
 * @param {Schema} cb.schema Schema instance
 */
Schema.createInstance = function (cb) {
  cb(null, new Schema());
};

Schema.prototype.classes = function () {
  return [];
};

/**
 * Class
 *
 * @constructor
 * @private
 * @this {Class}
 */
var Class = function () {
};

Class.prototype.superClasses = function () {

};

Class.prototype.declaredProperties = function (direct) {

};

module.exports.Schema = Schema;
