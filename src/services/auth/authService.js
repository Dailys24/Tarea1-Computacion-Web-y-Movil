//src/services/auth/authService.js

//Función con Responsabilidad Única: Solo valida y no hace nada más.
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
    
    return errors;
}

//Función principal que orquesta todo el proceso
function procesarRegistro(formData) {
    const errores = validarDatosRegistro(formData);
    
    if (errores.length > 0) {
        return { ok: false, errores: errores };
    }

    //Crear el usuario de verdad
    return { ok: true, msg: "Validación limpia y exitosa" };
}

//Exportamos la función principal para que el resto del sistema la use
module.exports = {
    procesarRegistro
};
