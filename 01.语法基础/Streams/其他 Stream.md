# Duplex Stream

Duplex Stream 可以看做读写流的聚合体，其包含了相互独立、拥有独立内部缓存的两个读写流，读取与写入操作也可以异步进行：

```
                             Duplex Stream
                          ------------------|
                    Read  <-----               External Source
            You           ------------------|
                    Write ----->               External Sink
                          ------------------|
```

我们可以使用 Duplex 模拟简单的套接字操作：

```js
const { Duplex } = require("stream");

class Duplexer extends Duplex {
  constructor(props) {
    super(props);
    this.data = [];
  }

  _read(size) {
    const chunk = this.data.shift();
    if (chunk == "stop") {
      this.push(null);
    } else {
      if (chunk) {
        this.push(chunk);
      }
    }
  }

  _write(chunk, encoding, cb) {
    this.data.push(chunk);
    cb();
  }
}

const d = new Duplexer({ allowHalfOpen: true });
d.on("data", function (chunk) {
  console.log("read: ", chunk.toString());
});
d.on("readable", function () {
  console.log("readable");
});
d.on("end", function () {
  console.log("Message Complete");
});
d.write("....");
```

在开发中我们也经常需要直接将某个可读流输出到可写流中，此时也可以在其中引入 PassThrough，以方便进行额外地监听：

```js
const { PassThrough } = require("stream");
const fs = require("fs");

const duplexStream = new PassThrough();

// can be piped from reaable stream
fs.createReadStream("tmp.md").pipe(duplexStream);

// can pipe to writable stream
duplexStream.pipe(process.stdout);

// 监听数据，这里直接输出的是 Buffer<Buffer 60 60  ... >
duplexStream.on("data", console.log);
```

# Transform Stream

Transform Stream 则是实现了 `_transform` 方法的 Duplex Stream，其在兼具读写功能的同时，还可以对流进行转换:

```
                                 Transform Stream
                           --------------|--------------
            You     Write  ---->                   ---->  Read  You
                           --------------|--------------
```

这里我们实现简单的 Base64 编码器:

```js
const util = require("util");
const Transform = require("stream").Transform;

function Base64Encoder(options) {
  Transform.call(this, options);
}

util.inherits(Base64Encoder, Transform);

Base64Encoder.prototype._transform = function (data, encoding, callback) {
  callback(null, data.toString("base64"));
};

process.stdin.pipe(new Base64Encoder()).pipe(process.stdout);
```
