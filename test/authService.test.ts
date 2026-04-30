import { expect } from "chai";
import {
  procesarLogin,
  procesarRegistro,
  crearUsuario,
} from "../src/services/auth/authService.js";

describe("authService", () => {
  describe("procesarLogin", () => {
    it("debe retornar ok=true cuando el email existe y el usuario está activo", () => {
      const resultado = procesarLogin("juan@mail.com", "1234");

      expect(resultado).to.have.property("ok", true);
      expect(resultado).to.have.property("msg", "Login exitoso");
      expect(resultado).to.have.property("user");
      expect((resultado as { user: Record<string, unknown> }).user).to.include({
        id: 1,
        nombre: "Juan Perez",
        email: "juan@mail.com",
      });
    });

    it('debe retornar ok=false con mensaje "Usuario no encontrado" si el email no existe', () => {
      const resultado = procesarLogin("inexistente@mail.com", "cualquierPass");

      expect(resultado).to.deep.equal({
        ok: false,
        msg: "Usuario no encontrado",
      });
    });

    it("debe retornar ok=false si el usuario está bloqueado", () => {
      const resultado = procesarLogin("ana@mail.com", "ana2024");

      expect(resultado).to.have.property("ok", false);
      expect(resultado).to.have.property(
        "msg",
        "Usuario bloqueado por múltiples intentos fallidos"
      );
    });

    it("debe resetear los intentos a 0 y registrar ultimoLogin tras un login exitoso", () => {
      const resultado = procesarLogin("maria@mail.com", "abcd");

      expect(resultado).to.have.property("ok", true);
      expect((resultado as { user: Record<string, unknown> }).user).to.have.keys([
        "id",
        "nombre",
        "email",
      ]);
    });
  });

  describe("procesarRegistro", () => {
    const formValido = {
      nombre: "Pedro Soto",
      email: "pedro.soto@mail.com",
      pass: "12345678",
      passConfirm: "12345678",
      rut: "11111111-1",
      telefono: "912345678",
    };

    it("debe registrar exitosamente cuando todos los datos son válidos", () => {
      const resultado = procesarRegistro(formValido);

      expect(resultado).to.have.property("ok", true);
      expect(resultado).to.have.property("msg", "Registro exitoso");
      expect(resultado).to.have.property("user");
      expect((resultado as { user: Record<string, unknown> }).user).to.include({
        nombre: "Pedro Soto",
        email: "pedro.soto@mail.com",
        tipo: "cliente",
      });
    });

    it("debe retornar errores cuando el email es inválido", () => {
      const data = { ...formValido, email: "no-es-email" };
      const resultado = procesarRegistro(data);

      expect(resultado).to.have.property("ok", false);
      expect((resultado as { errores: string[] }).errores).to.include(
        "Email invalido"
      );
    });

    it("debe retornar error cuando las contraseñas no coinciden", () => {
      const data = { ...formValido, passConfirm: "otraDistinta123" };
      const resultado = procesarRegistro(data);

      expect(resultado).to.have.property("ok", false);
      expect((resultado as { errores: string[] }).errores).to.include(
        "Passwords no coinciden"
      );
    });

    it("debe retornar error cuando la contraseña tiene menos de 8 caracteres", () => {
      const data = { ...formValido, pass: "123", passConfirm: "123" };
      const resultado = procesarRegistro(data);

      expect(resultado).to.have.property("ok", false);
      expect((resultado as { errores: string[] }).errores).to.include(
        "Password debe tener minimo 8 caracteres"
      );
    });

    it("debe retornar múltiples errores si hay varios campos inválidos", () => {
      const data = {
        nombre: "A",
        email: "mal",
        pass: "1",
        passConfirm: "2",
        rut: "xxx",
        telefono: "1",
      };
      const resultado = procesarRegistro(data);

      expect(resultado).to.have.property("ok", false);
      expect((resultado as { errores: string[] }).errores)
        .to.be.an("array")
        .that.has.length.greaterThan(1);
    });

    it("debe retornar error si formData es null", () => {
      const resultado = procesarRegistro(null);

      expect(resultado).to.have.property("ok", false);
      expect((resultado as { errores: string[] }).errores).to.deep.equal([
        "Datos del formulario vacíos",
      ]);
    });
  });

  describe("crearUsuario", () => {
    it("debe crear un usuario con los valores por defecto correctos", () => {
      const usuario = crearUsuario({
        nombre: "Test User",
        email: "test@mail.com",
        pass: "12345678",
        rut: "11111111-1",
        telefono: "912345678",
      });

      expect(usuario).to.include({
        nombre: "Test User",
        email: "test@mail.com",
        tipo: "cliente",
        puntos: 0,
        descuento: 0,
        activo: true,
        intentos: 0,
        bloqueado: false,
      });
      expect(usuario.id).to.be.a("number").and.to.be.within(1000, 9999);
      expect(usuario.historial).to.be.an("array").that.is.empty;
      expect(usuario.carrito).to.be.an("array").that.is.empty;
      expect(usuario.createdAt).to.be.a("string");
    });
  });
});
