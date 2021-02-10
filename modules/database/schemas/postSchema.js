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
    },
  },
};

module.exports = postSchema;
