const gulp = require("gulp");
const gutil = require("gutil");
const sass = require("gulp-sass");

gulp.task("setup", () => {
    gulp.src("src/styles/index.scss")
        .pipe(sass({style: "condensed"}))
        .on("error", gutil.log)
        .pipe(gulp.dest("./src/styles"));
});

gulp.task("setup:watch", () => {
    gulp.watch("./src/styles/*.scss", ["setup"]);
});
