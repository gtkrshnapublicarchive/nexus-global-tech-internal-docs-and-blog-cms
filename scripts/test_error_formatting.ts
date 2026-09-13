import { parseErrorMessage } from "../src/shared/lib/format_error";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log("==================================================");
console.log(" Testing Error Formatting & Zod Issue Parsing");
console.log("==================================================");

// Test 1: Stringified Zod error array (matching user's screenshot)
const zodJson = JSON.stringify([
  {
    origin: "string",
    code: "too_small",
    minimum: 3,
    inclusive: true,
    path: ["title"],
    message: "Title must be at least 3 characters",
  },
  {
    origin: "string",
    code: "too_small",
    minimum: 5,
    inclusive: true,
    path: ["excerpt"],
    message: "Excerpt summary must be at least 5 characters",
  },
]);

const parsed1 = parseErrorMessage(zodJson);
assert(parsed1.issues.length === 2, "Expected 2 parsed issues");
assert(parsed1.issues[0].field === "title", "Expected first issue field to be title");
assert(parsed1.issues[0].message === "Title must be at least 3 characters", "Expected title message match");
assert(parsed1.issues[1].field === "excerpt", "Expected second issue field to be excerpt");
assert(parsed1.issues[1].message === "Excerpt summary must be at least 5 characters", "Expected excerpt message match");
console.log("[OK] Zod JSON string parsing verified.");

// Test 2: Standard Error instance
const errorObj = new Error("Unauthorized: Authoring privileges required.");
const parsed2 = parseErrorMessage(errorObj);
assert(parsed2.summary === "Unauthorized: Authoring privileges required.", "Expected summary match for Error object");
assert(parsed2.issues.length === 0, "Expected 0 field issues for plain error");
console.log("[OK] Standard Error instance handling verified.");

// Test 3: Null or undefined fallback
const parsed3 = parseErrorMessage(null);
assert(parsed3.summary === "An unexpected error occurred.", "Expected fallback for null error");
console.log("[OK] Null / empty fallback handling verified.");

console.log("==================================================");
console.log("[OK] All error formatting tests PASSED!");
console.log("==================================================");
