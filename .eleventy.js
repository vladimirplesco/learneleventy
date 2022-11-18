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
    `<h1>${title}</h1>
      <p>${subtitle}</p>`
  );
  eleventyConfig.addCollection("page", function(collections) {
    return collections.getFilteredByTag("page").sort(function(a, b) {
      return a.data.order - b.data.order;
    });
  });
  eleventyConfig.addShortcode(
    "headers",
    (title, subtitle) =>
      `<h1>${title}</h1>
        <p>${subtitle}</p>`
  );
  return {
    dir: {
      input: "src",
      data: "_data",
      includes: "_includes",
      layouts: "_layouts"
    }
  };
}

