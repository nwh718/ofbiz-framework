public class TestNumberFormat {
    public static void main(String[] args) throws Exception {
        java.text.NumberFormat nf = java.text.NumberFormat.getNumberInstance(java.util.Locale.US);
        if (nf instanceof java.text.DecimalFormat) {
            ((java.text.DecimalFormat) nf).setParseBigDecimal(true);
        }
        java.text.ParsePosition pos = new java.text.ParsePosition(0);
        Number num = nf.parse("1.23E5", pos);
        System.out.println("Parsed: " + num + ", Index: " + pos.getIndex() + ", ErrorIndex: " + pos.getErrorIndex());
        
        try {
            System.out.println("Normal parse: " + nf.parse("1.23E5"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}