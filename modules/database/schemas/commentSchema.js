const commentSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['author', 'content', 'createdOn'],
    properties: {
      author: {
        bsonType: 'string',
        description: 'string and required',
      },
      content: {
        bsonType: 'string',
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

module.exports = commentSchema;
