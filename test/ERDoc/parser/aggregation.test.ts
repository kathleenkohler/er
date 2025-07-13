import { ER } from "../../../src/ERDoc/types/parser/ER";
import { Aggregation } from "../../../src/ERDoc/types/parser/Aggregation";
import { parse } from "../../../src/ERDoc/parser";

const regularAggregation = `aggregation Cliente_compra_producto(Compra)`;
const explicitCurlyAggregation = `aggregation Cliente_compra_producto(Compra) {}`;
const multilineAggregation = `aggregation Cliente_compra_producto(
Compra
)`;

const badAggregations = [
  `aggregation Cliente_compra_producto(Compra`,
  `aggregation (Compra)`,
  `aggregation Cliente_compra_producto()`,
  `aggregation Cliente_compra_producto`,
  `aggregation Cliente_compra_producto{}`,
];

describe("Parses Aggregations", () => {
  it("parses a regular aggregation", () => {
    const er: ER = parse(regularAggregation);
    expect(er.aggregations).toStrictEqual<Aggregation[]>([
      {
        type: "aggregation",
        name: "Cliente_compra_producto",
        aggregatedRelationshipName: "Compra",
        location: {
          start: {
            offset: 0,
            line: 1,
            column: 1,
          },
          end: {
            offset: 43,
            line: 1,
            column: 44,
          },
        },
      },
    ]);
  });

  it("parses a multiline aggregation with line breaks", () => {
    const er: ER = parse(multilineAggregation);
    expect(er.aggregations).toStrictEqual<Aggregation[]>([
      {
        type: "aggregation",
        name: "Cliente_compra_producto",
        aggregatedRelationshipName: "Compra",
        location: {
          start: {
            offset: 0,
            line: 1,
            column: 1,
          },
          end: {
            offset: multilineAggregation.length,
            line: 3,
            column: 2,
          },
        },
      },
    ]);
  });

  it("parses an aggregation with explicit curly braces", () => {
    const er: ER = parse(explicitCurlyAggregation);
    expect(er.aggregations).toStrictEqual<Aggregation[]>([
      {
        type: "aggregation",
        name: "Cliente_compra_producto",
        aggregatedRelationshipName: "Compra",
        location: {
          start: {
            offset: 0,
            line: 1,
            column: 1,
          },
          end: {
            offset: 46,
            line: 1,
            column: 47,
          },
        },
      },
    ]);
  });

  it("throws an error when parsing bad aggregations", () => {
    badAggregations.forEach((badAggregation) => {
      expect(() => parse(badAggregation)).toThrow();
    });
  });
});
