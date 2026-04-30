import { expect } from "chai";
import { buscarProductos } from "../src/utils/buscarProducto.js";

describe("buscarProductos", () => {
  it("filtra por texto en el nombre (case insensitive)", () => {
    const r = buscarProductos({ query: "laptop" });
    expect(r.length).to.be.at.least(1);
    expect(r.every((p) => p.nom.toLowerCase().includes("laptop"))).to.equal(
      true
    );
  });

  it("filtra por categoría exacta", () => {
    const r = buscarProductos({ category: "accesorios" });
    expect(r.length).to.be.at.least(1);
    expect(r.every((p) => p.cat.toLowerCase() === "accesorios")).to.equal(true);
  });

  it("filtra por rango de precio", () => {
    const r = buscarProductos({ priceMin: 20000, priceMax: 50000 });
    expect(r.length).to.be.at.least(1);
    expect(r.every((p) => p.prec >= 20000 && p.prec <= 50000)).to.equal(true);
  });

  it("ordena por precio ascendente cuando sortBy es prec", () => {
    const r = buscarProductos({
      category: "accesorios",
      sortBy: "prec",
      sortOrder: "asc",
    });
    for (let i = 1; i < r.length; i++) {
      expect(r[i].prec).to.be.at.least(r[i - 1].prec);
    }
  });
});
