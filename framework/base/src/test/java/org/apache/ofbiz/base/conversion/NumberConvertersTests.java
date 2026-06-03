/*******************************************************************************
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
 *******************************************************************************/
package org.apache.ofbiz.base.conversion;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import java.util.Locale;

import org.junit.jupiter.api.Test;

public class NumberConvertersTests {

    @Test
    public void testScientificNotation() throws Exception {
        NumberConverters.StringToBigDecimal converter = new NumberConverters.StringToBigDecimal();

        // US locale
        BigDecimal resultUS = converter.convert("1.23E5", Locale.US, null);
        assertEquals(new BigDecimal("123000"), resultUS);

        BigDecimal resultUSMinus = converter.convert("-1.23E-5", Locale.US, null);
        assertEquals(new BigDecimal("-0.0000123"), resultUSMinus);

        // French locale (uses comma as decimal separator)
        BigDecimal resultFR = converter.convert("1,23E5", Locale.FRANCE, null);
        assertEquals(new BigDecimal("123000"), resultFR);

        BigDecimal resultFRMinus = converter.convert("-1,23E-5", Locale.FRANCE, null);
        assertEquals(new BigDecimal("-0.0000123"), resultFRMinus);
        
        // Large precision test
        BigDecimal resultLarge = converter.convert("1.234567890123456789E10", Locale.US, null);
        assertEquals(new BigDecimal("12345678901.23456789"), resultLarge);
    }
}
