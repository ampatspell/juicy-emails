module.exports = function() {

  const fs = require('fs');
  const _glob = require('glob');

  const readFile = filename => new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf-8', (err, content) => {
      if(err) {
        return reject(err);
      }
      resolve(content);
    });
  });

  const glob = pattern => new Promise((resolve, reject) => {
    _glob(pattern, (err, files) => {
      if(err) {
        return reject(err);
      }
      resolve(files);
    });
  });

  const fileExists = filename => new Promise((resolve, reject) => {
    fs.stat(filename, (err, stats) => {
      if(err) {
        if(err.code === 'ENOENT') {
          return resolve(false);
        }
        reject(err);
      }
      resolve(stats.isFile());
    });
  });

  return {
    readFile,
    glob,
    fileExists
  };

}();
