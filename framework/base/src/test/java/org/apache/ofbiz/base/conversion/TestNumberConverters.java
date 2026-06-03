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
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.util.Locale;

import org.junit.jupiter.api.Test;

public class TestNumberConverters {

    @Test
    public void testScientificNotationParsing() throws Exception {
        System.setProperty("testBigDecimal", "true");
        try {
            ConverterLoader loader = new NumberConverters();
            loader.loadConverters();

            StringToBigDecimal converter = new StringToBigDecimal();

            BigDecimal result1 = converter.convert("1.23E5", Locale.US, null);
            assertEquals(new BigDecimal("123000"), result1, "Scientific notation 1.23E5");

            BigDecimal result2 = converter.convert("1.23E+5", Locale.US, null);
            assertEquals(new BigDecimal("123000"), result2, "Scientific notation 1.23E+5");

            BigDecimal result3 = converter.convert("1.23E-2", Locale.US, null);
            assertEquals(new BigDecimal("0.0123"), result3, "Scientific notation 1.23E-2");

            BigDecimal result4 = converter.convert("9.87654321E8", Locale.US, null);
            assertEquals(new BigDecimal("987654321"), result4, "Scientific notation with precision");

            BigDecimal result5 = converter.convert("1E10", Locale.US, null);
            assertEquals(new BigDecimal("10000000000"), result5, "Scientific notation 1E10");
        } finally {
            System.clearProperty("testBigDecimal");
        }
    }

    @Test
    public void testNormalNumberParsing() throws Exception {
        System.setProperty("testBigDecimal", "true");
        try {
            StringToBigDecimal converter = new StringToBigDecimal();

            BigDecimal result1 = converter.convert("123.45", Locale.US, null);
            assertEquals(new BigDecimal("123.45"), result1, "Normal decimal number");

            BigDecimal result2 = converter.convert("1000", Locale.US, null);
            assertEquals(new BigDecimal("1000"), result2, "Integer number");

            BigDecimal result3 = converter.convert("-456.789", Locale.US, null);
            assertEquals(new BigDecimal("-456.789"), result3, "Negative decimal number");
        } finally {
            System.clearProperty("testBigDecimal");
        }
    }

    @Test
    public void testStringToDoubleScientificNotation() throws Exception {
        System.setProperty("testBigDecimal", "true");
        try {
            StringToDouble converter = new StringToDouble();

            Double result1 = converter.convert("1.23E5", Locale.US, null);
            assertEquals(123000.0, result1, 0.001, "String to Double with scientific notation");

            Double result2 = converter.convert("1.23E-2", Locale.US, null);
            assertEquals(0.0123, result2, 0.0001, "String to Double with negative exponent");
        } finally {
            System.clearProperty("testBigDecimal");
        }
    }

    @Test
    public void testStringToFloatScientificNotation() throws Exception {
        System.setProperty("testBigDecimal", "true");
        try {
            StringToFloat converter = new StringToFloat();

            Float result1 = converter.convert("1.23E5", Locale.US, null);
            assertEquals(123000.0f, result1, 0.001f, "String to Float with scientific notation");
        } finally {
            System.clearProperty("testBigDecimal");
        }
    }

    @Test
    public void testStringToBigDecimalDirectConstructor() throws Exception {
        StringToBigDecimal converter = new StringToBigDecimal();

        BigDecimal result1 = converter.convert("1.23E5");
        assertEquals(new BigDecimal("1.23E+5"), result1, "Direct BigDecimal constructor with scientific notation");

        BigDecimal result2 = converter.convert("123.456");
        assertEquals(new BigDecimal("123.456"), result2, "Direct BigDecimal constructor normal number");
    }

    @Test
    public void testStringToBigIntegerScientificNotation() throws Exception {
        StringToBigInteger converter = new StringToBigInteger();

        java.math.BigInteger result1 = converter.convert("1.23E5", Locale.US, null);
        assertEquals(new java.math.BigInteger("123000"), result1, "String to BigInteger with scientific notation");
    }
}
