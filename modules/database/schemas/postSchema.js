const userSchema = require('./userSchema');

const postSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['title', 'author', 'content', 'category', 'createdOn'],
    properties: {
      title: {
        bsonType: 'string',
        description: 'string and required',
      },
      author: {
        bsonType: 'string',
        description: 'string and required',
      },
      content: {
        bsonType: 'string',
        description: 'string and required',
      },
      category: {
        bsonType: 'string',
        description: 'string and required',
      },
      createdOn: {
        bsonType: 'date',
        description: 'date and required',
      },
      comments: {
        bsonType: ['array'],
        items: {
          bsonType: ['object'],
          required: ['name', 'username', 'password', 'type', 'createdOn'],
          properties: {
            name: {
              bsonType: 'string',
              description: 'string and required',
            },
            username: {
              bsonType: 'string',
              description: 'string and required',
            },
            password: {
              bsonType: 'string',
              description: 'string and required',
            },
            type: {
              bsonType: 'string',
              description: 'string and required',
            },
            createdOn: {
              bsonType: 'date',
              description: 'date and required',
            },
            token: {
              bsonType: 'string',
            },
          },
        },
      },
    },
  },
};

module.exports = postSchema;
