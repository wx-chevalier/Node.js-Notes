# Writable Stream

```js
readableStream.on("data", function (chunk) {
  writableStream.write(chunk);
});

writableStream.end();
```

当 `end()` 被调用时，所有数据会被写入，然后流会触发一个 `finish` 事件。注意在调用 `end()` 之后，你就不能再往可写流中写入数据了。

```js
const { Writable } = require("stream");

const outStream = new Writable({
  write(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback();
  },
});

process.stdin.pipe(outStream);
```

Writable Stream 中同样包含一些与 Readable Stream 相关的重要事件：

- error: 在写入或链接发生错误时触发
- pipe: 当可读流链接到可写流时，这个事件会触发
- unpipe: 在可读流调用 unpipe 时会触发
