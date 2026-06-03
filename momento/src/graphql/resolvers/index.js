const cloudinary = require('../../cloudinary');
const db = require('../../database/db');

const resolvers = {
    Query: {
        getFamilies: async () => await db.select().table('Family'),
        getUsers: async () => await db.select().table('User'),
        getPhotos: async () => await db.select().table('Photo'),
        getAlbums: async () => await db.select().table('Album'),
        getEvents: async () => await db.select().table('Event'),
        getPersons: async () => await db.select().table('Person'),
        getReactions: async () => await db.select().table('Reaction'),
        getReminders: async () => await db.select().table('Reminder'),
    },

    Mutation: {
        createFamily: async (_, { family_name }) => {
            await db('Family').insert({ family_name });
            return { success: true, message: 'Familia creada correctamente' };
        },
        createUser: async (_, { first_name, last_name, email, role, family_id }) => {
            await db('User').insert({ first_name, last_name, email, role, family_id });
            return { success: true, message: 'Usuario creado correctamente' };
        },
        createPhoto: async (_, { url, description, date_taken, user_id, album_id, event_id }) => {
            await db('Photo').insert({ url, description, date_taken, user_id, album_id, event_id });
            return { success: true, message: 'Foto creada correctamente' };
        },
        createAlbum: async (_, { album_name, description, family_id }) => {
            await db('Album').insert({ album_name, description, family_id });
            return { success: true, message: 'Album creado correctamente' };
        },
        createEvent: async (_, { event_name, event_date, family_id }) => {
            await db('Event').insert({ event_name, event_date, family_id });
            return { success: true, message: 'Evento creado correctamente' };
        },
        createPerson: async (_, { person_name, family_id }) => {
            await db('Person').insert({ person_name, family_id });
            return { success: true, message: 'Persona creada correctamente' };
        },
        createReaction: async (_, { emoji, user_id, photo_id }) => {
            await db('Reaction').insert({ emoji, user_id, photo_id });
            return { success: true, message: 'Reacción creada correctamente' };
        },
        updateUser: async (_, { user_id, first_name, last_name, email, role }) => {
            await db('User').where({ user_id }).update({ first_name, last_name, email, role });
            return { success: true, message: 'Usuario actualizado correctamente' };
        },
        updateAlbum: async (_, { album_id, album_name, description }) => {
            await db('Album').where({ album_id }).update({ album_name, description });
            return { success: true, message: 'Album actualizado correctamente' };
        },
        deleteReaction: async (_, { reaction_id }) => {
            await db('Reaction').where({ reaction_id }).del();
            return { success: true, message: 'Reacción eliminada correctamente' };
        },
        deletePhoto: async (_, { photo_id }) => {
            await db('Photo').where({ photo_id }).del();
            return { success: true, message: 'Foto eliminada correctamente' };
        },
        uploadPhoto: async (_, { url, description, date_taken, user_id, album_id, event_id }) => {
    const result = await cloudinary.uploader.upload(url, {
        folder: 'momento'
    });
    await db('Photo').insert({ 
        url: result.secure_url, 
        description, 
        date_taken, 
        user_id, 
        album_id, 
        event_id 
    });
    return { success: true, message: 'Foto subida correctamente' };
},
    },
};

module.exports = resolvers;