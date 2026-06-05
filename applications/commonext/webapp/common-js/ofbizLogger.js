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

var ofbizLogger = (function() {
    var _warnedKeys = {};

    function warnOnce(key, message) {
        if (_warnedKeys[key]) {
            return;
        }
        _warnedKeys[key] = true;
        if (typeof console !== 'undefined' && typeof console.warn === 'function') {
            console.warn('[' + key + '] ' + message);
        }
    }

    function warn(message) {
        if (typeof console !== 'undefined' && typeof console.warn === 'function') {
            console.warn(message);
        }
    }

    function error(message) {
        if (typeof console !== 'undefined' && typeof console.error === 'function') {
            console.error(message);
        }
    }

    function info(message) {
        if (typeof console !== 'undefined' && typeof console.info === 'function') {
            console.info(message);
        }
    }

    function clearWarnedKeys() {
        _warnedKeys = {};
    }

    return {
        warnOnce: warnOnce,
        warn: warn,
        error: error,
        info: info,
        clearWarnedKeys: clearWarnedKeys
    };
})();
