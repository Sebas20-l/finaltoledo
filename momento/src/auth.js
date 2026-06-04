const jwt = require('jsonwebtoken');
 
const SECRET = process.env.JWT_SECRET || 'momento_secret_key';
 
// Generar token con datos del usuario
const generarToken = (usuario) => {
    return jwt.sign(
        {
            user_id:  usuario.user_id,
            email:    usuario.email,
            role:     usuario.role,
            family_id: usuario.family_id
        },
        SECRET,
        { expiresIn: '24h' }
    );
};
 
// Verificar y decodificar token
const verificarToken = (token) => {
    return jwt.verify(token, SECRET);
};
 
// Middleware para proteger resolvers — lanza error si no hay sesión
const requerirAuth = (context) => {
    if (!context.usuario) {
        throw new Error('No autorizado. Debes iniciar sesión.');
    }
    return context.usuario;
};
 
// Middleware para rutas solo de administrador
const requerirAdmin = (context) => {
    const usuario = requerirAuth(context);
    if (usuario.role !== 'admin') {
        throw new Error('Acceso denegado. Se requiere rol de administrador.');
    }
    return usuario;
};
 
module.exports = { generarToken, verificarToken, requerirAuth, requerirAdmin };