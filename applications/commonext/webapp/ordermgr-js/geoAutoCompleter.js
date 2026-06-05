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

var countryTargetField = null;
var countryHiddenTarget = null;
var stateTargetField = null;
var stateHiddenTarget = null;

function logGeoAutoCompleterWarning(key, message) {
    if (window.ofbizLogger && typeof window.ofbizLogger.warnOnce === 'function') {
        window.ofbizLogger.warnOnce(key, message);
    }
}

function getAutocompleteItemValue(ui) {
    if (!ui || ui.item == null) {
        return '';
    }
    if (typeof ui.item === 'string') {
        return ui.item;
    }
    return ui.item.value || ui.item.label || ui.item.id || '';
}

function bindStateBlurValidation(selector, errorSelector) {
    jQuery(selector).off('blur.geoStateValidation').on('blur.geoStateValidation', function() {
        if (jQuery(selector).val() == '') {
            jQuery(errorSelector).fadeIn('fast');
        }
    });
}

function getCountryList() {
    countryTargetField = jQuery('#shipToCountryGeo');
    countryHiddenTarget = jQuery('#shipToCountryGeoId');
    jQuery.ajax({
        url: 'getCountryList',
        type: 'POST',
        success: callCountryAutocompleter,
        error: function() {
            logGeoAutoCompleterWarning('geo-country-list-request-failed', 'Unable to load country list for shipping autocomplete.');
        }
    });
}

function callCountryAutocompleter(data) {
    var countryList = data && data.countryList ? data.countryList : [];
    if (!countryList.length) {
        logGeoAutoCompleterWarning('geo-country-list-empty', 'No country list returned for shipping autocomplete.');
        return;
    }
    countryTargetField.autocomplete({
        source: countryList,
        select: function() {
            countryHiddenTarget.val(getAutocompleteItemValue(arguments[1]));
            getAssociatedStateListForAutoComplete();
        }
    });
}

function getAssociatedStateListForAutoComplete() {
    stateTargetField = jQuery('#shipToStateProvinceGeo');
    stateHiddenTarget = jQuery('#shipToStateProvinceGeoId');
    jQuery.ajax({
        url: 'getAssociatedStateList',
        type: 'POST',
        data: jQuery('#shippingForm').serialize(),
        success: callStateAutocompleter,
        error: function() {
            logGeoAutoCompleterWarning('geo-associated-state-request-failed', 'Unable to load state or province list for shipping autocomplete.');
        }
    });
}

function callStateAutocompleter(data) {
    var stateList = data && data.stateList ? data.stateList : [];
    if (!stateList.length) {
        logGeoAutoCompleterWarning('geo-associated-state-empty', 'No state or province list returned for shipping autocomplete.');
    }
    if (stateList.length <= 1) {
        jQuery('#shipToStateProvinceGeo').val('No States/Provinces exists');
        jQuery('#shipToStateProvinceGeoId').val('_NA_');
        jQuery('#shipStates').fadeOut('fast');
        jQuery('#advice-required-shipToStateProvinceGeo').fadeOut('fast');
        jQuery('#shipToStateProvinceGeo').off('blur.geoStateValidation');
    } else {
        jQuery('#shipToStateProvinceGeo').val('');
        jQuery('#shipToStateProvinceGeoId').val('');
        jQuery('#shipStates').fadeIn('fast');
        bindStateBlurValidation('#shipToStateProvinceGeo', '#advice-required-shipToStateProvinceGeo');
    }
    stateTargetField.autocomplete({
        source: stateList,
        select: function() {
            stateHiddenTarget.val(getAutocompleteItemValue(arguments[1]));
        }
    });
}

function getAssociatedStateList(countryId, stateId, errorId, divId) {
    var countryGeoId = jQuery('#' + countryId).val();
    var stateSelector = '#' + stateId;
    var errorSelector = '#' + errorId;
    var divSelector = '#' + divId;
    jQuery.ajax({
        url: '/common-js/control/getAssociatedStateList',
        type: 'POST',
        data: {countryGeoId: countryGeoId},
        success: function(data) {
            if (data && data._ERROR_MESSAGE_) {
                logGeoAutoCompleterWarning('geo-generic-associated-state-error', data._ERROR_MESSAGE_);
                return;
            }
            var stateList = data && data.stateList ? data.stateList : [];
            if (!stateList.length) {
                logGeoAutoCompleterWarning('geo-generic-associated-state-empty', 'No associated states were returned for the selected country.');
            }
            var stateSelect = jQuery(stateSelector);
            stateSelect.find('option').remove();
            jQuery.each(stateList, function() {
                var geoValues = String(this).split(': ');
                if (geoValues.length > 1) {
                    stateSelect.append(jQuery('<option value=' + geoValues[1] + '>' + geoValues[0] + '</option>'));
                }
            });

            if (stateList.length <= 1) {
                if (jQuery(divSelector).is(':visible') || jQuery(errorSelector).is(':visible')) {
                    jQuery(divSelector).fadeOut('fast');
                    jQuery(errorSelector).fadeOut('fast');
                    jQuery(stateSelector).off('blur.geoStateValidation');
                }
            } else {
                jQuery(divSelector).fadeIn('fast');
                bindStateBlurValidation(stateSelector, errorSelector);
            }
        },
        error: function() {
            logGeoAutoCompleterWarning('geo-generic-associated-state-request-failed', 'Unable to load associated states for the selected country.');
        }
    });
}
