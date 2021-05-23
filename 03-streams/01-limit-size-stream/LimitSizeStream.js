const { error } = require('console');
const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  maxLength=0;
  length=0;

  constructor(options) {
    super(options);
    this.maxlength = options.limit;
  }

  _transform(chunk, encoding, callback) {
    let error;
    this.length+= chunk.length;
    if (this.length > this.maxlength) {
      error = new LimitExceededError();
    }
    callback(error, chunk);
  }

  _flush(callback) {
    callback();
  }
}


module.exports = LimitSizeStream;
