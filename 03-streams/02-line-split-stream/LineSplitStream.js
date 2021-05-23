const stream = require('stream');
const os = require('os');
const { error } = require('console');

class LineSplitStream extends stream.Transform {
  buf = '';
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    const dataString = chunk.toString();
    const strArr = dataString.split(os.EOL);
    const len = strArr.length;

    if(len > 1) {
      this.push(this.buf+strArr[0]);
      this.buf = strArr[len-1];

      strArr.pop();
      strArr.shift();
      for (let i=0; i< strArr.length; i++){
        this.push(strArr[i]);
      }

    } else {
      this.buf += dataString;
    }
    callback();
  }

  _flush(callback) {
    callback(null, this.buf);
  }
}

module.exports = LineSplitStream;
