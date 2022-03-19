const userSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['name', 'username', 'password', 'type', 'createdOn', 'lastLogin'],
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
      lastLogin: {
        bsonType: 'date',
        description: 'date and required',
      },
      token: {
        bsonType: 'string',
        description: 'string',
      },
      posts: {
        bsonType: 'array',
        items: {
          bsonType: 'objectId',
        },
      },
      comments: {
        bsonType: 'array',
        items: {
          bsonType: 'objectId',
        },
      },
    },
  },
};

module.exports = userSchema;
