import { ER } from "../../../src/ERDoc/types/parser/ER";
import { checkAggregationIncludesWeakEntity } from "../../../src/ERDoc/linter/aggregation/checkAggregationIncludesWeakEntity";
import { parse } from "../../../src/ERDoc/parser";

describe("Linter detects when an aggregation includes a relationship with a weak entity", () => {
  it("returns an error when an aggregation includes a weak entity", () => {
    const errors = checkAggregationIncludesWeakEntity(
      AggregationWithWeakEntityER,
    );
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("AGGREGATION_INCLUDES_WEAK_ENTITY");
    expect(errors[0].aggregationName).toBe("inscripcion_detallada");
    expect(errors[0].relationshipName).toBe("inscripcion");
    expect(errors[0].weakEntityName).toBe("detalle");
  });
  it("returns no errors when all entities are strong", () => {
    const errors = checkAggregationIncludesWeakEntity(
      AggregationNoWeakEntitiesER,
    );
    expect(errors.length).toBe(0);
  });
});

const AggregationWithWeakEntityER: ER = parse(`
entity curso {
  id key
  name
}

entity detalle depends on inscripcion {
  horario pkey
}

relation inscripcion (curso, detalle)

aggregation inscripcion_detallada(inscripcion)
`);

const AggregationNoWeakEntitiesER: ER = parse(`
entity curso {
  id key
}

entity estudiante {
  id key
}

relation inscripcion (curso, estudiante)

aggregation inscripcion_detallada(inscripcion)
`);
