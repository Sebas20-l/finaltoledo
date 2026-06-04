const cloudinary = require('../../cloudinary');
const db = require('../../database/db');
const bcrypt = require('bcryptjs');
const { generarToken, requerirAuth, requerirAdmin } = require('../../auth');

const resolvers = {
    Query: {
        getFamilies: async () => await db.select().table('Family'),
        getEvents:   async () => await db.select().table('Event'),
        getPersons:  async () => await db.select().table('Person'),

        getUsers: async (_, __, context) => {
            requerirAuth(context);
            return await db.select().table('User');
        },
        getPhotos: async (_, __, context) => {
            requerirAuth(context);
            return await db.select().table('Photo');
        },
        getAlbums: async (_, __, context) => {
            requerirAuth(context);
            return await db.select().table('Album');
        },
        getReactions: async (_, __, context) => {
            requerirAuth(context);
            return await db.select().table('Reaction');
        },
        getReminders: async (_, __, context) => {
            requerirAuth(context);
            return await db.select().table('Reminder');
        },
        getMe: async (_, __, context) => {
            const usuario = requerirAuth(context);
            const [user] = await db('User').where({ user_id: usuario.user_id });
            return user;
        },
    },

    Mutation: {
        register: async (_, { first_name, last_name, email, password, role, family_id }) => {
            const existe = await db('User').where({ email }).first();
            if (existe) throw new Error('El correo ya esta registrado.');

            const hash = await bcrypt.hash(password, 10);
            const [user_id] = await db('User').insert({
                first_name, last_name, email,
                password: hash,
                role, family_id
            });

            const usuario = { user_id, first_name, last_name, email, role, family_id };
            const token = generarToken(usuario);
            return { token, user_id, first_name, last_name, email, role, family_id };
        },

        login: async (_, { email, password }) => {
            const usuario = await db('User').where({ email }).first();
            if (!usuario) throw new Error('Usuario no encontrado.');

            const valido = await bcrypt.compare(password, usuario.password);
            if (!valido) throw new Error('Contrasena incorrecta.');

            const token = generarToken(usuario);
            return {
                token,
                user_id:    usuario.user_id,
                first_name: usuario.first_name,
                last_name:  usuario.last_name,
                email:      usuario.email,
                role:       usuario.role,
                family_id:  usuario.family_id
            };
        },

        createFamily: async (_, { family_name }, context) => {
            requerirAuth(context);
            await db('Family').insert({ family_name });
            return { success: true, message: 'Familia creada correctamente' };
        },
        createUser: async (_, { first_name, last_name, email, role, family_id }, context) => {
            requerirAdmin(context);
            await db('User').insert({ first_name, last_name, email, role, family_id });
            return { success: true, message: 'Usuario creado correctamente' };
        },
        createPhoto: async (_, { url, description, date_taken, user_id, album_id, event_id }, context) => {
            requerirAuth(context);
            await db('Photo').insert({ url, description, date_taken, user_id, album_id, event_id });
            return { success: true, message: 'Foto creada correctamente' };
        },
        createAlbum: async (_, { album_name, description, family_id }, context) => {
            requerirAuth(context);
            await db('Album').insert({ album_name, description, family_id });
            return { success: true, message: 'Album creado correctamente' };
        },
        createEvent: async (_, { event_name, event_date, family_id }, context) => {
            requerirAuth(context);
            await db('Event').insert({ event_name, event_date, family_id });
            return { success: true, message: 'Evento creado correctamente' };
        },
        createPerson: async (_, { person_name, family_id }, context) => {
            requerirAuth(context);
            await db('Person').insert({ person_name, family_id });
            return { success: true, message: 'Persona creada correctamente' };
        },
        createReaction: async (_, { emoji, user_id, photo_id }, context) => {
            requerirAuth(context);
            await db('Reaction').insert({ emoji, user_id, photo_id });
            return { success: true, message: 'Reaccion creada correctamente' };
        },
        updateUser: async (_, { user_id, first_name, last_name, email, role }, context) => {
            requerirAuth(context);
            await db('User').where({ user_id }).update({ first_name, last_name, email, role });
            return { success: true, message: 'Usuario actualizado correctamente' };
        },
        updateAlbum: async (_, { album_id, album_name, description }, context) => {
            requerirAuth(context);
            await db('Album').where({ album_id }).update({ album_name, description });
            return { success: true, message: 'Album actualizado correctamente' };
        },
        deleteReaction: async (_, { reaction_id }, context) => {
            requerirAuth(context);
            await db('Reaction').where({ reaction_id }).del();
            return { success: true, message: 'Reaccion eliminada correctamente' };
        },
        deletePhoto: async (_, { photo_id }, context) => {
            requerirAuth(context);
            await db('Photo').where({ photo_id }).del();
            return { success: true, message: 'Foto eliminada correctamente' };
        },
        uploadPhoto: async (_, { url, description, date_taken, user_id, album_id, event_id }, context) => {
            requerirAuth(context);
            const result = await cloudinary.uploader.upload(url, { folder: 'momento' });
            await db('Photo').insert({
                url: result.secure_url,
                description, date_taken,
                user_id, album_id, event_id
            });
            return { success: true, message: 'Foto subida correctamente' };
        },
    },
};

module.exports = resolvers;