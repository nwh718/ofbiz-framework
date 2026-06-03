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
import java.math.BigInteger;

import org.junit.jupiter.api.Test;

public class NumberConvertersTests {

    private static <S, T> void assertConversion(String label, Converter<S, T> converter, S source, T target)
            throws Exception {
        assertTrue(converter.canConvert(source.getClass(), target.getClass()), label + " can convert");
        assertEquals(target, converter.convert(source), label + " converted");
    }

    @Test
    public void testNumberConverters() throws Exception {
        ConverterLoader loader = new NumberConverters();
        loader.loadConverters();

        // Test normal number conversions
        assertConversion("StringToInteger", new NumberConverters.StringToInteger(), "123", 123);
        assertConversion("StringToLong", new NumberConverters.StringToLong(), "123456", 123456L);
        assertConversion("StringToDouble", new NumberConverters.StringToDouble(), "123.45", 123.45);
        assertConversion("StringToFloat", new NumberConverters.StringToFloat(), "123.45", 123.45f);
        assertConversion("StringToBigDecimal", new NumberConverters.StringToBigDecimal(), "123.456", new BigDecimal("123.456"));
        assertConversion("StringToBigInteger", new NumberConverters.StringToBigInteger(), "123456789", new BigInteger("123456789"));

        // Test scientific notation conversions (the main fix we want to verify)
        assertConversion("StringToDoubleScientificNotation1", new NumberConverters.StringToDouble(), "1.23E5", 1.23E5);
        assertConversion("StringToDoubleScientificNotation2", new NumberConverters.StringToDouble(), "1.23e-5", 1.23e-5);
        assertConversion("StringToFloatScientificNotation", new NumberConverters.StringToFloat(), "9.81E2", 9.81E2f);
        assertConversion("StringToBigDecimalScientificNotation1", new NumberConverters.StringToBigDecimal(), "1.23E10", new BigDecimal("1.23E10"));
        assertConversion("StringToBigDecimalScientificNotation2", new NumberConverters.StringToBigDecimal(), "6.022E23", new BigDecimal("6.022E23"));
        assertConversion("StringToBigDecimalScientificNotation3", new NumberConverters.StringToBigDecimal(), "1.602176634E-19", new BigDecimal("1.602176634E-19"));

        // Test conversions through AbstractStringToNumberConverter (uses fromString method)
        Converter<String, Double> stringToDouble = Converters.getConverter(String.class, Double.class);
        assertTrue(stringToDouble.canConvert(String.class, Double.class), "StringToDouble registered");
        assertEquals(1.23E5, stringToDouble.convert("1.23E5"), "Scientific notation to Double");
        assertEquals(1.23e-5, stringToDouble.convert("1.23e-5"), "Scientific notation with lowercase e to Double");

        Converter<String, BigDecimal> stringToBigDecimal = Converters.getConverter(String.class, BigDecimal.class);
        assertTrue(stringToBigDecimal.canConvert(String.class, BigDecimal.class), "StringToBigDecimal registered");
        assertEquals(new BigDecimal("1.23E10"), stringToBigDecimal.convert("1.23E10"), "Scientific notation to BigDecimal");
        assertEquals(new BigDecimal("6.022E23"), stringToBigDecimal.convert("6.022E23"), "Scientific notation large number to BigDecimal");
    }
}
