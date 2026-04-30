import { expect } from "chai";
import { formatearPrecio } from "../src/utils/formatearPrecio.js";

describe("formatearPrecio", () => {
  it("devuelve string con símbolo de euro", () => {
    const resultado = formatearPrecio(1234.56);
    expect(resultado).to.be.a("string");
    expect(resultado).to.include("€");
  });

  it("incluye separadores de miles para valores grandes", () => {
    const resultado = formatearPrecio(1_000_000);
    expect(resultado).to.match(/\d/);
    expect(resultado).to.include("€");
  });
});
