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
* */

/**
 *
 */
var uiLabelJsonObject = null;
jQuery(document).ready(function() {
    var labelObject = ['CommonUpload', 'CommonSave', 'CommonCompleted', 'PartyNoContent'];
    getJSONuiLabels(labelObject, function(result) {
        uiLabelJsonObject = result.responseJSON || {};
    });
    jQuery('#progress_bar').progressbar({value: 0});
});

function logPartyProfileWarning(key, message) {
    if (window.ofbizLogger && typeof window.ofbizLogger.warnOnce === 'function') {
        window.ofbizLogger.warnOnce(key, message);
    }
}

function getPartyProfileLabel(labelKey, fallbackValue) {
    if (uiLabelJsonObject && uiLabelJsonObject[labelKey]) {
        return uiLabelJsonObject[labelKey];
    }
    return fallbackValue;
}

function uploadPartyContent() {
    jQuery('#progress_bar').progressbar('option', 'value', 0);
    var targetFrame = jQuery('#target_upload');
    var infodiv = jQuery('#content-messages');
    if (infodiv.length < 1) {
        jQuery('<div id="content-messages"></div>').insertAfter(jQuery('#partyContentList'));
    }
    if (targetFrame.length < 1) {
        jQuery('#partyContent').append("<iframe id='target_upload' name='target_upload' style='display: none' src=''> </iframe>");
    }
    jQuery('#uploadPartyContent').attr('target', 'target_upload');

    var labelField = jQuery('#progressBarSavingMsg');
    if (labelField.length) {
        labelField.remove();
    }
}

function uploadCompleted() {
    var iframePartyContentList = jQuery('#target_upload').contents().find('#partyContentList').html();
    if (iframePartyContentList == null) {
        logPartyProfileWarning('party-profile-upload-content-missing', 'Uploaded party content response did not include the expected content list.');
        return;
    }

    jQuery('#partyContentList').html(iframePartyContentList);
    jQuery('#progressBarSavingMsg').html("If you don't see your file in Party Content list above, it has been rejected for security reason. Check the log.");
    setTimeout(function() {
        jQuery('#progressBarSavingMsg').hide();
    }, 7000);
    jQuery('#progress_bar').progressbar('option', 'value', 0);
    jQuery('#target_upload').remove();
}

function checkIframeStatus() {
    var iframePartyContentList = null;
    jQuery.fjTimer({
        interval: 500,
        repeat: true,
        tick: function() {
            var timerId = arguments[1];
            iframePartyContentList = jQuery('#target_upload').contents().find('#partyContentList');
            if (iframePartyContentList != null && iframePartyContentList.length > 0) {
                timerId.stop();
                uploadCompleted();
            }
        }
    });
}

function getUploadProgressStatus() {
    importLibrary(['/common/js/jquery/plugins/fjTimer/jquerytimer-min.js'], function() {
        jQuery('#uploadPartyContent').append('<span id="progressBarSavingMsg" class="label">' + getPartyProfileLabel('CommonUpload', 'Upload') + '...</span>');
        jQuery.fjTimer({
            interval: 1000,
            repeat: true,
            tick: function() {
                var timerId = arguments[1];
                jQuery.ajax({
                    url: '/common-js/control/getFileUploadProgressStatus',
                    dataType: 'json',
                    success: function(data) {
                        if (data._ERROR_MESSAGE_LIST_ != undefined) {
                            jQuery('#content-messages').html(data._ERROR_MESSAGE_LIST_);
                            logPartyProfileWarning('party-profile-upload-message-list', 'Party content upload returned an error message list.');
                            timerId.stop();
                        } else if (data._ERROR_MESSAGE_ != undefined) {
                            jQuery('#content-messages').html(data._ERROR_MESSAGE_);
                            logPartyProfileWarning('party-profile-upload-message', 'Party content upload returned an error message.');
                            timerId.stop();
                        } else {
                            var readPercent = data.readPercent;
                            jQuery('#progress_bar').progressbar('option', 'value', readPercent);
                            jQuery('#progressBarSavingMsg').html(getPartyProfileLabel('CommonUpload', 'Upload') + '... (' + readPercent + '%)');
                            if (readPercent > 99) {
                                jQuery('#progressBarSavingMsg').html(getPartyProfileLabel('CommonSave', 'Save') + '...');
                                timerId.stop();
                                checkIframeStatus();
                            }
                        }
                    },
                    error: function() {
                        logPartyProfileWarning('party-profile-upload-status-request-failed', 'Unable to retrieve party content upload progress.');
                        timerId.stop();
                    }
                });
            }
        });
    });
}
