import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ofbiz.entity.Delegator;
import org.apache.ofbiz.entity.DelegatorFactory;
import org.apache.ofbiz.entity.GenericEntityException;
import org.apache.ofbiz.entity.GenericPK;

public class RemoveByAndDryRunExample {

    public static void main(String[] args) {
        try {
            Delegator delegator = DelegatorFactory.getDelegator("default");
            
            // 示例 1: 使用 Map 参数进行 dry run
            Map<String, Object> fields = new HashMap<>();
            fields.put("statusId", "STATUS_INACTIVE");
            
            System.out.println("=== 示例 1: 使用 Map 参数进行 dry run ===");
            Map<String, Object> result1 = delegator.removeByAnd("Party", fields, true);
            printDryRunResult(result1);
            
            // 示例 2: 使用可变参数进行 dry run
            System.out.println("\n=== 示例 2: 使用可变参数进行 dry run ===");
            Object[] varArgs = new Object[]{"statusId", "STATUS_INACTIVE"};
            Map<String, Object> result2 = delegator.removeByAnd("Party", varArgs, true);
            printDryRunResult(result2);
            
            // 示例 3: 实际执行删除 (dryRun = false)
            System.out.println("\n=== 示例 3: 实际执行删除 ===");
            Map<String, Object> result3 = delegator.removeByAnd("Party", fields, false);
            System.out.println("删除操作已完成，结果为 null (因为 dryRun = false)");
            
        } catch (GenericEntityException e) {
            e.printStackTrace();
        }
    }
    
    private static void printDryRunResult(Map<String, Object> result) {
        if (result == null) {
            System.out.println("结果为 null (不是 dry run 模式)");
            return;
        }
        
        Integer count = (Integer) result.get("count");
        @SuppressWarnings("unchecked")
        List<GenericPK> primaryKeys = (List<GenericPK>) result.get("primaryKeys");
        
        System.out.println("预计将删除 " + count + " 条记录");
        System.out.println("主键列表:");
        for (GenericPK pk : primaryKeys) {
            System.out.println("  - " + pk);
        }
    }
}
