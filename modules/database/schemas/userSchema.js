const postSchema = {
  $jsonSchema: {
    bsonType: 'object',
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
};

module.exports = postSchema;
