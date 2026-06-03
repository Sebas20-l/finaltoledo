const { gql } = require('apollo-server');

const typeDefs = gql`

    type Family {
        family_id: ID
        family_name: String
        created_at: String
    }

    type User {
        user_id: ID
        first_name: String
        last_name: String
        email: String
        role: String
        family_id: ID
    }

    type Photo {
        photo_id: ID
        url: String
        description: String
        date_taken: String
        user_id: ID
        album_id: ID
        event_id: ID
    }

    type Album {
        album_id: ID
        album_name: String
        description: String
        family_id: ID
    }

    type Event {
        event_id: ID
        event_name: String
        event_date: String
        family_id: ID
    }

    type Person {
        person_id: ID
        person_name: String
        family_id: ID
    }

    type Reaction {
        reaction_id: ID
        emoji: String
        user_id: ID
        photo_id: ID
    }

    type Reminder {
        reminder_id: ID
        message: String
        reminder_date: String
        photo_id: ID
    }

    type MutationResponse {
        success: Boolean
        message: String
    }

    type Query {
        getFamilies: [Family]
        getUsers: [User]
        getPhotos: [Photo]
        getAlbums: [Album]
        getEvents: [Event]
        getPersons: [Person]
        getReactions: [Reaction]
        getReminders: [Reminder]
    }

    type Mutation {
        createFamily(family_name: String!): MutationResponse
        createUser(first_name: String!, last_name: String!, email: String!, role: String!, family_id: Int!): MutationResponse
        createPhoto(url: String!, description: String, date_taken: String, user_id: Int!, album_id: Int, event_id: Int): MutationResponse
        createAlbum(album_name: String!, description: String, family_id: Int!): MutationResponse
        createEvent(event_name: String!, event_date: String, family_id: Int!): MutationResponse
        createPerson(person_name: String!, family_id: Int!): MutationResponse
        createReaction(emoji: String!, user_id: Int!, photo_id: Int!): MutationResponse
        updateUser(user_id: ID!, first_name: String, last_name: String, email: String, role: String): MutationResponse
        updateAlbum(album_id: ID!, album_name: String, description: String): MutationResponse
        deleteReaction(reaction_id: ID!): MutationResponse
        deletePhoto(photo_id: ID!): MutationResponse
        uploadPhoto(url: String!, description: String, date_taken: String, user_id: Int!, album_id: Int, event_id: Int): MutationResponse
    }
`;

module.exports = typeDefs;