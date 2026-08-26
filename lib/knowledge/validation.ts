export type KnowledgeValidation = {
  compiled: boolean;
  executed: boolean;
  testsPassed: boolean;
  accepted: boolean;
};

/** Learning remains a deliberate user-confirmed action after a successful run. */
export function isLearnableValidation(validation: KnowledgeValidation): boolean {
  return validation.compiled && validation.executed && validation.accepted;
}
