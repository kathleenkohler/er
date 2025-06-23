import { ER } from "../../types/parser/ER";
import { AggregationIncludesWeakEntityError } from "../../types/linter/SemanticError";

/**
 * Finds aggregations that reference relationships containing a weak entity
 * @param {ER} er - The ER object to lint
 * @return {AggregationIncludesWeakEntityError[]} An array of errors for each aggregation that references a relationship with a weak entity
 */
export const checkAggregationIncludesWeakEntity = (
  er: ER,
): AggregationIncludesWeakEntityError[] => {
  const errors: AggregationIncludesWeakEntityError[] = [];
  const weakEntityNames = new Set(
    er.entities
      .filter((entity) => entity.hasDependencies)
      .map((entity) => entity.name),
  );
  
  for (const agg of er.aggregations) {
    const relationship = er.relationships.find(
      (rel) => rel.name === agg.aggregatedRelationshipName,
    );
    if (!relationship) continue;
    for (const participant of relationship!.participantEntities) {
      if (weakEntityNames.has(participant.entityName)) {
          errors.push({
            type: "AGGREGATION_INCLUDES_WEAK_ENTITY",
            aggregationName: agg.name,
            relationshipName: relationship!.name,
            weakEntityName: participant.entityName,
            location: agg.location,
          });
        }
    }
  }
  return errors;
};
