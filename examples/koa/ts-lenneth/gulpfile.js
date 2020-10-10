/**
 * gulp处理ws-ts生成后的lib文件夹
 * 1. 将src里的所有文件全部复制出来
 * 2. 将package.json 和 README.MD两个文件复制至lib
 */
const path = require("path");
const gulp = require("gulp");
const addSrc = require("gulp-add-src");
const fs = require("fs");

// 操作目录
const destination = "./lib";

gulp.task("copy", () => {
  return gulp
    .src("./lib/src/**/*.*")
    .pipe(gulp.dest(destination))
    .pipe(addSrc(["./package.json", "./README.MD"]))
    .pipe(gulp.dest(destination));
});
