/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

jQuery(document).ready(function() {
    jQuery('#returnHeaderTypeId').change(function() {
        changeStatusCorrespondingToHeaderType();
    });
});

function logReturnWarning(key, message) {
    if (window.ofbizLogger && typeof window.ofbizLogger.warnOnce === 'function') {
        window.ofbizLogger.warnOnce(key, message);
    }
}

function changeStatusCorrespondingToHeaderType() {
    var returnHeaderTypeId = jQuery('#returnHeaderTypeId').val();
    if (!returnHeaderTypeId) {
        logReturnWarning('return-header-type-empty', 'Return header type is empty while loading status items.');
        return;
    }
    jQuery.ajax({
        url: '/ordermgr/control/getStatusItemsForReturn',
        type: 'POST',
        data: {returnHeaderTypeId: returnHeaderTypeId},
        success: function(data) {
            var statusItems = data && data.statusItems ? data.statusItems : [];
            var status = jQuery('#statusId');
            status.find('option').remove();
            if (!statusItems.length) {
                logReturnWarning('return-status-items-empty', 'No status items were returned for the selected return header type.');
                return;
            }
            jQuery.each(statusItems, function() {
                var statusItem = this;
                if (!statusItem || !statusItem.statusId) {
                    return;
                }
                status.append(jQuery('<option value=' + statusItem.statusId + '>' + statusItem.description + '</option>'));
            });
        },
        error: function() {
            logReturnWarning('return-status-items-request-failed', 'Unable to load status items for the selected return header type.');
        }
    });
}
