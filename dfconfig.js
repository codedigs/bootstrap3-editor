module.exports = {
  pug: {
    src: "app/src/pug/**/*.pug",
    dest: "app"
  },

  sass: {
    src: "app/src/sass/**/*.scss",
    dest: "app/css"
  },

  js: {
    src: [
      "app/src/js/**/*.js",

      "!app/src/js/Bs3Editor/**/*.js",
    ],
    dest: "app/js"
  },

  build_views: {
    src: "app/**/*.html",
    dest: "dist",
  },

  build_images: {
    src: [
      "app/img/**/*.jpg",
      "app/img/**/*.png",
      "app/img/**/*.gif",
    ],
    dest: "dist/img"
  },

  build_fonts: {
    src: [
      "app/**/*.eot",
      "app/**/*.svg",
      "app/**/*.ttf",
      "app/**/*.woff",
      "app/**/*.woff2",
      "app/**/*.otf"
    ],
    dest: "dist/fonts",
  },
};
