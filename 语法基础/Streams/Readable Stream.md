# Readable Stream

```js
const stream = require("stream");
const fs = require("fs");

const readableStream = fs.createReadStream(process.argv[2], {
  encoding: "utf8",
});

// 手动设置流数据编码
// readableStream.setEncoding('utf8');

let wordCount = 0;

readableStream.on("data", function (data) {
  wordCount += data.split(/\s{1,}/).length;
});

readableStream.on("end", function () {
  // Don't count the end of the file.
  console.log("%d %s", --wordCount, process.argv[2]);
});
```

当我们创建某个可读流时，其还并未开始进行数据流动；添加了 data 的事件监听器，它才会变成流动态的。在这之后，它就会读取一小块数据，然后传到我们的回调函数里面。`data` 事件的触发频次同样是由实现者决定，譬如在进行文件读取时，可能每行都会触发一次；而在 HTTP 请求处理时，可能数 KB 的数据才会触发一次。可以参考 [`nodejs/readable-stream/_stream_readable`](https://github.com/nodejs/readable-stream/blob/master/lib/_stream_readable.js) 中的相关实现，发现 on 函数会触发 resume 方法，该方法又会调用 flow 函数进行流读取：

```js
// function on
if (ev === 'data') {
  // Start flowing on next tick if stream isn't explicitly paused
  if (this._readableState.flowing !== false) this.resume();
}
...
// function flow
while (state.flowing && stream.read() !== null) {}
```

我们还可以监听 `readable` 事件，然后手动地进行数据读取：

```js
let data = "";
let chunk;
readableStream.on("readable", function () {
  while ((chunk = readableStream.read()) != null) {
    data += chunk;
  }
});
readableStream.on("end", function () {
  console.log(data);
});
```

Readable Stream 还包括如下常用的方法：

- Readable.pause(): 这个方法会暂停流的流动。换句话说就是它不会再触发 data 事件。
- Readable.resume(): 这个方法和上面的相反，会让暂停流恢复流动。
- Readable.unpipe(): 这个方法会把目的地移除。如果有参数传入，它会让可读流停止流向某个特定的目的地，否则，它会移除所有目的地。

在日常开发中，我们可以用 [stream-wormhole](https://github.com/node-modules/stream-wormhole) 来模拟消耗可读流：

```js
sendToWormhole(readStream, true);
```
