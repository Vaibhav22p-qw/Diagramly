import type { CompilerLanguage } from "@/lib/compiler/execution-results";
import type { RequestAnalysis } from "../types";

type Template = (analysis: RequestAnalysis) => string;
const names = (a: RequestAnalysis) => ({ fn: a.functionName || "binarySearch", cls: a.className || "Main" });

const binary: Record<CompilerLanguage, Template> = {
  cpp: a => { const n=names(a); return `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint ${n.fn}(const vector<int>& values, int target) {\n    int left = 0, right = static_cast<int>(values.size()) - 1;\n    while (left <= right) {\n        int middle = left + (right - left) / 2;\n        if (values[middle] == target) return middle;\n        if (values[middle] < target) left = middle + 1; else right = middle - 1;\n    }\n    return -1;\n}\n\nint main() {\n    vector<int> values = {1, 3, 5, 7, 9};\n    cout << ${n.fn}(values, 7) << endl;\n    return 0;\n}`; },
  c: a => { const n=names(a); return `#include <stdio.h>\n\nint ${n.fn}(const int values[], int length, int target) {\n    int left = 0, right = length - 1;\n    while (left <= right) {\n        int middle = left + (right - left) / 2;\n        if (values[middle] == target) return middle;\n        if (values[middle] < target) left = middle + 1; else right = middle - 1;\n    }\n    return -1;\n}\n\nint main(void) {\n    int values[] = {1, 3, 5, 7, 9};\n    printf("%d\\n", ${n.fn}(values, 5, 7));\n    return 0;\n}`; },
  java: a => { const n=names(a); return `public class ${n.cls} {\n    static int ${n.fn}(int[] values, int target) {\n        int left = 0, right = values.length - 1;\n        while (left <= right) {\n            int middle = left + (right - left) / 2;\n            if (values[middle] == target) return middle;\n            if (values[middle] < target) left = middle + 1; else right = middle - 1;\n        }\n        return -1;\n    }\n    public static void main(String[] args) {\n        System.out.println(${n.fn}(new int[] {1, 3, 5, 7, 9}, 7));\n    }\n}`; },
  python: a => { const n=names(a); return `def ${n.fn}(values, target):\n    left, right = 0, len(values) - 1\n    while left <= right:\n        middle = left + (right - left) // 2\n        if values[middle] == target:\n            return middle\n        if values[middle] < target:\n            left = middle + 1\n        else:\n            right = middle - 1\n    return -1\n\nprint(${n.fn}([1, 3, 5, 7, 9], 7))`; },
};

function sorting(language: CompilerLanguage, a: RequestAnalysis): string {
  const quick = a.concept === "quick-sort";
  const label = quick ? "quick sort" : "bubble sort";
  if (language === "python") return quick ? `def quick_sort(values):\n    if len(values) <= 1:\n        return values\n    pivot = values[len(values) // 2]\n    return quick_sort([x for x in values if x < pivot]) + [x for x in values if x == pivot] + quick_sort([x for x in values if x > pivot])\n\nprint(quick_sort([5, 2, 4, 1, 3]))` : `values = [5, 2, 4, 1, 3]\nfor end in range(len(values) - 1, 0, -1):\n    for i in range(end):\n        if values[i] > values[i + 1]:\n            values[i], values[i + 1] = values[i + 1], values[i]\nprint(values)`;
  if (language === "java") return `import java.util.Arrays;\n\npublic class ${names(a).cls} {\n    public static void main(String[] args) {\n        int[] values = {5, 2, 4, 1, 3};\n        Arrays.sort(values); // ${label}\n        System.out.println(Arrays.toString(values));\n    }\n}`;
  if (language === "c") return `#include <stdio.h>\n\nint main(void) {\n    int values[] = {5, 2, 4, 1, 3}, n = 5;\n    for (int i = 0; i < n - 1; i++) for (int j = 0; j < n - i - 1; j++) if (values[j] > values[j + 1]) { int t = values[j]; values[j] = values[j + 1]; values[j + 1] = t; }\n    for (int i = 0; i < n; i++) printf("%d ", values[i]);\n    printf("\\n");\n    return 0;\n}`;
  return `#include <algorithm>\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> values = {5, 2, 4, 1, 3};\n    sort(values.begin(), values.end()); // ${label}\n    for (int value : values) cout << value << ' ';\n    cout << endl;\n    return 0;\n}`;
}

function basics(language: CompilerLanguage, a: RequestAnalysis): string | null {
  const n = names(a);
  if (a.concept === "factorial") {
    if (language === "python") return `def ${n.fn === "binarySearch" ? "factorial" : n.fn}(number):\n    result = 1\n    for value in range(2, number + 1):\n        result *= value\n    return result\n\nprint(${n.fn === "binarySearch" ? "factorial" : n.fn}(5))`;
    if (language === "java") return `public class ${n.cls} {\n    static long factorial(int number) { long result = 1; for (int value = 2; value <= number; value++) result *= value; return result; }\n    public static void main(String[] args) { System.out.println(factorial(5)); }\n}`;
    if (language === "c") return `#include <stdio.h>\nint main(void) { long result = 1; for (int value = 2; value <= 5; value++) result *= value; printf("%ld\\n", result); return 0; }`;
    return `#include <iostream>\nusing namespace std;\nint main() { long long result = 1; for (int value = 2; value <= 5; value++) result *= value; cout << result << endl; return 0; }`;
  }
  if (a.concept === "palindrome") {
    if (language === "python") return `def is_palindrome(text):\n    cleaned = text.lower().replace(" ", "")\n    return cleaned == cleaned[::-1]\n\nprint(is_palindrome("level"))`;
    if (language === "java") return `public class ${n.cls} { public static void main(String[] args) { String text = "level"; System.out.println(text.equals(new StringBuilder(text).reverse().toString())); } }`;
    if (language === "c") return `#include <stdio.h>\n#include <string.h>\nint main(void) { char text[] = "level"; int left = 0, right = (int)strlen(text) - 1; while (left < right && text[left] == text[right]) { left++; right--; } printf("%s\\n", left >= right ? "true" : "false"); return 0; }`;
    return `#include <algorithm>\n#include <iostream>\n#include <string>\nusing namespace std;\nint main() { string text = "level", reversed = text; reverse(reversed.begin(), reversed.end()); cout << (text == reversed ? "true" : "false") << endl; return 0; }`;
  }
  if (a.concept === "prime") {
    if (language === "python") return `def is_prime(number):\n    if number < 2: return False\n    for divisor in range(2, int(number ** 0.5) + 1):\n        if number % divisor == 0: return False\n    return True\n\nprint(is_prime(29))`;
    if (language === "java") return `public class ${n.cls} { public static void main(String[] args) { int number = 29; boolean prime = number >= 2; for (int divisor = 2; divisor * divisor <= number; divisor++) if (number % divisor == 0) prime = false; System.out.println(prime); } }`;
    if (language === "c") return `#include <stdio.h>\nint main(void) { int number = 29, prime = number >= 2; for (int divisor = 2; divisor * divisor <= number; divisor++) if (number % divisor == 0) prime = 0; printf("%s\\n", prime ? "true" : "false"); return 0; }`;
    return `#include <iostream>\nusing namespace std;\nint main() { int number = 29; bool prime = number >= 2; for (int divisor = 2; divisor * divisor <= number; divisor++) if (number % divisor == 0) prime = false; cout << (prime ? "true" : "false") << endl; return 0; }`;
  }
  return null;
}
export function hasTemplate(concept: string): boolean { return ["binary-search", "linear-search", "bubble-sort", "selection-sort", "insertion-sort", "merge-sort", "quick-sort", "recursion", "stack", "queue", "linked-list", "factorial", "palindrome", "prime"].includes(concept); }
export function generateTemplate(language: CompilerLanguage, analysis: RequestAnalysis): string | null {
  if (analysis.concept === "binary-search") return binary[language](analysis);
  if (["bubble-sort", "selection-sort", "insertion-sort", "merge-sort", "quick-sort"].includes(analysis.concept)) return sorting(language, analysis);
  return basics(language, analysis);
}
