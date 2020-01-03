module.exports = {
  sass: {
    src: "app/sass/**/*.scss",
    dest: "app/css"
  },

  build_views: {
    src: "app/**/*.html",
    dest: "dist"
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
