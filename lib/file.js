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

export const fileExists = async filename => {
  try {
    let stat = await fs.stat(filename);
    return stat.isFile();
  } catch(err) {
    if(err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
};
