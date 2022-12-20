const { DateTime } = require("luxon");
const Image = require("@11ty/eleventy-img")
module.exports = function(eleventyConfig){
  eleventyConfig.addPassthroughCopy("src/assets/css/style.css")
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "/robots.txt" });
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });
  eleventyConfig.addShortcode("currentDate", (date = DateTime.now()) => {
    return date;
  });
  eleventyConfig.addShortcode(
    "headers",
    (title,subtitle) =>
    `<H1>${title}</H1>
      <p>${subtitle}</p>`
  );
  eleventyConfig.addCollection("page", function(collections) {
    return collections.getFilteredByTag("page").sort(function(a, b) {
      return a.data.order - b.data.order;
    });
  });
  return {
    dir: {
      input: "src",
      data: "_data",
      includes: "_includes",
      layouts: "_layouts"
    }
  };
  eleventyConfig.addCollection("articles", async () => {
    const endpoint = `https://api.hashnode.com/`;
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

    const articles = await client.request(query);

    return articles.user.publication.posts;
  });
  elevntyConfig.addFilter("nextArticle", (articles, page, modifier = 1) => {
    const parts = page.outputPath.split("/");
    parts.pop(); // get rid of `index.html`
    const slug = parts.pop();
    for (const [index, article] of articles.entries()) {
      const target = index + modifier;
      if (article.slug === slug && target >= 0 && target < articles.length) {
        return articles[target];
      }
    }
  });


}

