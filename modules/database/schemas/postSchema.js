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
          required: ['name', 'username', 'type', 'createdOn', 'title', 'content'],
          properties: {
            name: {
              bsonType: 'string',
              description: 'string and required',
            },
            author: {
              bsonType: 'string',
              description: 'string and required',
            },
            type: {
              bsonType: 'string',
              description: 'string and required',
            },
            title: {
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
            lastEditTime: {
              bsonType: 'date',
            },
          },
        },
      },
    },
  },
};

module.exports = postSchema;
