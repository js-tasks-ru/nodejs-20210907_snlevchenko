const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.str = '';
  }

  _transform(chunk, encoding, callback) {

    this.str += chunk;

    if (chunk.includes(os.EOL)) {
      const chunks = this.str.toString().split(os.EOL);
      if (chunks.length === 1) {
        this.push(chunk);
        this.str = '';
      } else {
        chunks.forEach((subchunk, idx) => {
          if (idx !== chunks.length - 1) {
            this.push(subchunk);
          } else {
            this.str = subchunk;
          }
        });
      }
    }

    callback();
  }

  _flush(callback) {
    this.push(this.str);
    callback();
  }
}

module.exports = LineSplitStream;
