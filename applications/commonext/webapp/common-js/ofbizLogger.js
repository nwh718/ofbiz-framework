/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

(function(window) {
    var logger = window.ofbizLogger || {};
    var warnedMessages = logger.warnedMessages || {};

    function _hasConsoleMethod(method) {
        return window.console && typeof window.console[method] === 'function';
    }

    function warn(message) {
        if (!message || !_hasConsoleMethod('warn')) {
            return false;
        }
        window.console.warn(message);
        return true;
    }

    function warnOnce(key, message) {
        var warningKey = key || message;
        if (!warningKey || warnedMessages[warningKey]) {
            return false;
        }
        warnedMessages[warningKey] = true;
        return warn(message);
    }

    function error(message) {
        if (!message || !_hasConsoleMethod('error')) {
            return false;
        }
        window.console.error(message);
        return true;
    }

    function errorOnce(key, message) {
        var errorKey = key || message;
        if (!errorKey || warnedMessages[errorKey]) {
            return false;
        }
        warnedMessages[errorKey] = true;
        return error(message);
    }

    function clearWarned(key) {
        if (key) {
            delete warnedMessages[key];
        } else {
            warnedMessages = {};
            logger.warnedMessages = warnedMessages;
        }
    }

    logger.warnedMessages = warnedMessages;
    logger.warn = warn;
    logger.warnOnce = warnOnce;
    logger.error = error;
    logger.errorOnce = errorOnce;
    logger.clearWarned = clearWarned;
    window.ofbizLogger = logger;
})(window);