import { expect } from "chai";
import { ordenarArray, paginarArray } from "../src/utils/genericos.js";

type Item = { id: number; nom: string };

describe("genericos", () => {
  describe("ordenarArray", () => {
    const items: Item[] = [
      { id: 3, nom: "c" },
      { id: 1, nom: "a" },
      { id: 2, nom: "b" },
    ];

    it("ordena numéricamente ascendente por campo", () => {
      const r = ordenarArray(items, "id", "asc");
      expect(r.map((x) => x.id)).to.deep.equal([1, 2, 3]);
    });

    it("ordena numéricamente descendente", () => {
      const r = ordenarArray(items, "id", "desc");
      expect(r.map((x) => x.id)).to.deep.equal([3, 2, 1]);
    });
  });

  describe("paginarArray", () => {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    it("lista vacía devuelve metadatos coherentes", () => {
      const r = paginarArray([], 1, 5);
      expect(r.data).to.deep.equal([]);
      expect(r.totalElementos).to.equal(0);
      expect(r.totalPaginas).to.equal(1);
      expect(r.paginaActual).to.equal(1);
    });

    it("pagina y recorta correctamente", () => {
      const r = paginarArray(nums, 2, 3);
      expect(r.data).to.deep.equal([4, 5, 6]);
      expect(r.totalPaginas).to.equal(4);
      expect(r.paginaActual).to.equal(2);
      expect(r.totalElementos).to.equal(10);
    });

    it("no excede la última página", () => {
      const r = paginarArray(nums, 99, 4);
      expect(r.paginaActual).to.equal(3);
      expect(r.data).to.deep.equal([9, 10]);
    });
  });
});
