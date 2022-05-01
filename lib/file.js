import fs from 'fs/promises';
import _glob from 'glob';

export const readFile = filename => fs.readFile(filename, 'utf-8');

export const glob = pattern => new Promise((resolve, reject) => {
  _glob(pattern, (err, files) => {
    if(err) {
      return reject(err);
    }
    resolve(files);
  });
});

export const fileExists = filename => new Promise((resolve, reject) => {
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
