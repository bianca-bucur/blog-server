const postSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['title', 'author', 'category', 'content', 'createdOn'],
    properties: {
      title: {
        bsonType: 'string',
        description: 'string and required',
      },
      author: {
        bsonType: 'string',
        description: 'string and required',
      },
      category: {
        bsonType: 'string',
        description: 'string and required',
      },
      content: {
        bsonType: 'string',
        minLength: 500,
        description: 'string and required',
      },
      createdOn: {
        bsonType: 'date',
        description: 'date and required',
      },
      edited: {
        bsonType: 'bool',
        description: 'bool',
      },
    },
  },
};

module.exports = postSchema;
