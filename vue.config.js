module.exports = {
  filenameHashing: false,
  configureWebpack: {
    output: {
      filename: 'picture-annotation.min.js',
      chunkFilename: 'picture-annotation-[id].min.js'
    }
  }
};
