const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.size = 0;
    this.isObjectMode = !!options.readableObjectMode;
  }

  _transform(chunk, encoding, callback) {
    this.size += this.isObjectMode ? 1 : chunk.length;
    const cbArgs = this.size > this.limit ? [new LimitExceededError()] : [null, chunk];

    callback(...cbArgs);
  }
}

module.exports = LimitSizeStream;
