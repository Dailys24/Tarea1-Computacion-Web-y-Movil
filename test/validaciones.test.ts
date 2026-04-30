import { expect } from "chai";
import {
  validarCredito,
  validarEmail,
  validarPassword,
  validarRut,
  validarNombre,
  validarTelefono,
} from "../src/utils/validaciones.js";

describe("validaciones", () => {
  describe("validarEmail", () => {
    it("acepta email con formato básico", () => {
      expect(validarEmail("a@b.co")).to.equal(true);
      expect(validarEmail("  juan@mail.com  ")).to.equal(true);
    });

    it("rechaza valores no string o formato inválido", () => {
      expect(validarEmail(null)).to.equal(false);
      expect(validarEmail("sin-arroba")).to.equal(false);
      expect(validarEmail("@nodominio.com")).to.equal(false);
    });
  });

  describe("validarPassword", () => {
    it("acepta contraseña de 8 o más caracteres", () => {
      expect(validarPassword("12345678")).to.equal(true);
    });

    it("rechaza cortas o no string", () => {
      expect(validarPassword("1234567")).to.equal(false);
      expect(validarPassword(12345678 as unknown as string)).to.equal(false);
    });
  });

  describe("validarRut", () => {
    it("acepta RUT con dígito verificador correcto", () => {
      expect(validarRut("11111111-1")).to.equal(true);
      expect(validarRut("12.345.678-5")).to.equal(true);
    });

    it("rechaza RUT mal formado o DV incorrecto", () => {
      expect(validarRut("abc")).to.equal(false);
      expect(validarRut("11111111-9")).to.equal(false);
    });
  });

  describe("validarNombre", () => {
    it("acepta nombre con letras y espacio entre palabras", () => {
      expect(validarNombre("Pedro Soto")).to.equal(true);
    });

    it("rechaza muy corto o con números", () => {
      expect(validarNombre("Ab")).to.equal(false);
      expect(validarNombre("Juan2")).to.equal(false);
    });
  });

  describe("validarTelefono", () => {
    it("acepta solo dígitos y longitud >= 9", () => {
      expect(validarTelefono("912345678")).to.equal(true);
    });

    it("rechaza cortos o con letras", () => {
      expect(validarTelefono("12345")).to.equal(false);
      expect(validarTelefono("91234a678")).to.equal(false);
    });
  });

  describe("validarCredito", () => {
    it("acepta número de 16 dígitos y CVV de 3", () => {
      const r = validarCredito("4111111111111111", "123");
      expect(r.ok).to.equal(true);
      expect(r.msg).to.equal("Tarjeta válida");
    });

    it("rechaza número o CVV inválidos", () => {
      expect(validarCredito("411111111111111", "123").ok).to.equal(false);
      expect(validarCredito("4111111111111111", "12").ok).to.equal(false);
    });
  });
});
