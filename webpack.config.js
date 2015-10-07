 module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: 'bundle.js'  
  },

  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      }  
    ]
  },

  externals: {
    'react': 'React'
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  }
 
 } 
