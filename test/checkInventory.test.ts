import { expect } from "chai";
import { checkInventory } from "../src/services/checkInventory.js";

describe("checkInventory", () => {
  it("retorna ok=false cuando el producto no existe", () => {
    const r = checkInventory(99999);
    expect(r.ok).to.equal(false);
    expect(r.prodId).to.equal(99999);
    expect(r.data).to.equal(undefined);
  });

  it("clasifica stock crítico (ej. Laptop stock 5)", () => {
    const r = checkInventory(101);
    expect(r.ok).to.equal(true);
    expect(r.prodId).to.equal(101);
    expect(r.data).to.exist;
    expect(r.data!.status).to.equal("Crítico");
    expect(r.data!.alerta).to.equal(true);
  });

  it("clasifica stock alto (ej. Mouse stock 50)", () => {
    const r = checkInventory(102);
    expect(r.ok).to.equal(true);
    expect(r.data!.status).to.equal("Alto");
    expect(r.data!.alerta).to.equal(false);
  });
});
