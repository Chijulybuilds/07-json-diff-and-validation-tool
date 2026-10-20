import Ajv, { type ErrorObject } from "ajv";
import type { ValidationIssue } from "../types";
import { parseJson } from "./compare";

export function validateJson(dataText: string, schemaText: string) {
  const data = parseJson(dataText);
  const schema = parseJson(schemaText);
  const ajv = new Ajv({ allErrors: true, strict: false });
  let validator;
  try { validator = ajv.compile(schema as object); }
  catch (error) {
    const message = error instanceof Error ? error.message : "Schema could not be compiled.";
    throw new Error(`INVALID_SCHEMA: ${message}`);
  }
  const valid = validator(data);
  const issues: ValidationIssue[] = (validator.errors ?? []).map((error: ErrorObject) => ({
    path: error.instancePath || "/",
    message: error.message ?? "Value does not match the schema.",
    keyword: error.keyword
  }));
  return { valid: Boolean(valid), issues };
}