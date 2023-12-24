// next config
// minimize the bundle size
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  devIndicators: {
    autoPrerender: false,
  },
  basePath: "/lireddit",
};
