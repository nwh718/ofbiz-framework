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
package org.apache.ofbiz.base.conversion;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import java.util.Locale;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class NumberConvertersTest {

    @BeforeEach
    public void setUp() {
        System.setProperty("testBigDecimal", "bypassLocaleChange");
        new NumberConverters().loadConverters();
    }

    @AfterEach
    public void tearDown() {
        System.clearProperty("testBigDecimal");
    }

    @Test
    public void testStringToBigDecimalSupportsScientificNotation() throws Exception {
        LocalizedConverter<String, BigDecimal> converter = new NumberConverters.StringToBigDecimal();

        BigDecimal result = converter.convert("1.23E5", Locale.US, null);

        assertEquals(new BigDecimal("1.23E5"), result);
    }

    @Test
    public void testStringToBigDecimalSupportsLocalizedScientificNotation() throws Exception {
        LocalizedConverter<String, BigDecimal> converter = new NumberConverters.StringToBigDecimal();

        BigDecimal result = converter.convert("1,23E5", Locale.GERMANY, null);

        assertEquals(new BigDecimal("1.23E5"), result);
    }

    @Test
    public void testStringToLongSupportsScientificNotation() throws Exception {
        LocalizedConverter<String, Long> converter = new NumberConverters.StringToLong();

        Long result = converter.convert("1.23E5", Locale.US, null);

        assertEquals(Long.valueOf(123000L), result);
    }
}