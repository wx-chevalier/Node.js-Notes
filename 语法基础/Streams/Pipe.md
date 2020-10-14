# Pipe | 管道

```js
const fs = require("fs");

const inputFile = fs.createReadStream("REALLY_BIG_FILE.x");
const outputFile = fs.createWriteStream("REALLY_BIG_FILE_DEST.x");

// 当建立管道时，才发生了流的流动
inputFile.pipe(outputFile);
```

多个管道顺序调用，即是构建了链接(Chaining):

```js
const fs = require("fs");
const zlib = require("zlib");
fs.createReadStream("input.txt.gz")
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream("output.txt"));
```

管道也常用于 Web 服务器中的文件处理，以 Egg.js 中的应用为例，我们可以从 Context 中获取到文件流并将其传入到可写文件流中：

> 📎 完整代码参考 [Backend Boilerplate/egg](https://parg.co/A24)

```js
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
...
const stream = await ctx.getFileStream();

const filename =
  md5(stream.filename) + path.extname(stream.filename).toLocaleLowerCase();
//文件生成绝对路径

const target = path.join(this.config.baseDir, 'app/public/uploads', filename);

//生成一个文件写入文件流
const writeStream = fs.createWriteStream(target);
try {
  //异步把文件流写入
  await awaitWriteStream(stream.pipe(writeStream));
} catch (err) {
  //如果出现错误，关闭管道
  await sendToWormhole(stream);
  throw err;
}
...
```

参照[分布式系统导论](https://parg.co/Uxo)，可知在典型的流处理场景中，我们不可以避免地要处理所谓的背压(Backpressure)问题。无论是 Writable Stream 还是 Readable Stream，实际上都是将数据存储在内部的 Buffer 中，可以通过 `writable.writableBuffer` 或者 `readable.readableBuffer` 来读取。当要处理的数据存储超过了 `highWaterMark` 或者当前写入流处于繁忙状态时，write 函数都会返回 `false`。`pipe` 函数即会自动地帮我们启用背压机制：

![image](https://user-images.githubusercontent.com/5803001/45255876-99c94f80-b3c0-11e8-93f2-3ae0474426fa.png)

当 Node.js 的流机制监测到 write 函数返回了 `false`，背压系统会自动介入；其会暂停当前 Readable Stream 的数据传递操作，直到消费者准备完毕。

```
+===============+
|   Your_Data   |
+=======+=======+
        |
+-------v-----------+          +-------------------+         +=================+
|  Readable Stream  |          |  Writable Stream  +--------->  .write(chunk)  |
+-------+-----------+          +---------^---------+         +=======+=========+
        |                                |                           |
        |     +======================+   |        +------------------v---------+
        +----->  .pipe(destination)  >---+        |    Is this chunk too big?  |
              +==^=======^========^==+            |    Is the queue busy?      |
                 ^       ^        ^               +----------+-------------+---+
                 |       |        |                          |             |
                 |       |        |  > if (!chunk)           |             |
                 ^       |        |      emit .end();        |             |
                 ^       ^        |  > else                  |             |
                 |       ^        |      emit .write();  +---v---+     +---v---+
                 |       |        ^----^-----------------<  No   |     |  Yes  |
                 ^       |                               +-------+     +---v---+
                 ^       |                                                 |
                 |       ^   emit .pause();        +=================+     |
                 |       ^---^---------------------+  return false;  <-----+---+
                 |                                 +=================+         |
                 |                                                             |
                 ^   when queue is empty   +============+                      |
                 ^---^-----------------^---<  Buffering |                      |
                     |                     |============|                      |
                     +> emit .drain();     |  <Buffer>  |                      |
                     +> emit .resume();    +------------+                      |
                                           |  <Buffer>  |                      |
                                           +------------+  add chunk to queue  |
                                           |            <--^-------------------<
                                           +============+
```
