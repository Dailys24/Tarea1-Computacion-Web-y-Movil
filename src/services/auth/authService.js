//src/services/auth/authService.js

function validarDatosRegistro(formData) {
    const errors = [];
    
    if (!formData.nombre || formData.nombre === "" || formData.nombre.length < 3) {
        errors.push("Nombre invalido");
    }
    if (!formData.email || formData.email.indexOf("@") === -1) {
        errors.push("Email invalido");
    }
    if (!formData.pass || formData.pass.length < 8) {
        errors.push("Password debe tener minimo 8 caracteres");
    }
    if (formData.pass !== formData.passConfirm) {
        errors.push("Passwords no coinciden");
    }
    if (!formData.rut || formData.rut.length < 8) {
        errors.push("RUT invalido");
    }
    if (!formData.telefono || formData.telefono.length < 9) {
        errors.push("Telefono invalido");
    }
    
    //Retornar los errores encontrados
    return errors; 
}

function procesarRegistro(formData) {
    const errores = validarDatosRegistro(formData);
    
    //Si hay errores, retornar un objeto con el estado de error y los mensajes
    if (errores.length > 0) {
        return { ok: false, errores: errores };
    }

    return { ok: true, msg: "Validación limpia y exitosa" };
}

module.exports = {
    procesarRegistro
};