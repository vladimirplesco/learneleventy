/* src/_data/post.js*/

const endpoint =  `https://api.hashnode.com/`;

module.exports = async () => {
  const { GraphQLClient, gql } = require("graphql-request");

  const client = new GraphQLClient(endpoint);

  const query = gql`
    {
      user(username: "Psypher1") {
        publication {
          posts {
            title
            coverImage
            brief
            slug
            dateAdded
            contentMarkdown
          }
        }
      }
    }
  `;

  const posts = await client.request(query);

  return posts.user.publication.posts;
}