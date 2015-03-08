var gulp = require('gulp');
var paths = require('./gulp.config.json');
var plug = require('gulp-load-plugins')();

var log = plug.util.log;
var colors = plug.util.colors;

/**
 * Process LESS
 * @return {Stream}
 */
gulp.task('less', function() {
	log(colors.yellow('Processing LESS'));

	return gulp.src(paths.less.file)
		.pipe(plug.less())
		.pipe(plug.autoprefixer('last 2 version', '> 5%'))
		.pipe(plug.bytediff.start())
		.pipe(plug.minifyCss({}))
		.pipe(plug.bytediff.stop(bytediffFormatter))
		.pipe(gulp.dest(paths.css));
});

gulp.task('default', ['less'], function() {
	log(colors.green('Theme Built Successfully :-)'));
	return gulp.src('').pipe(plug.notify({
        onLast: true,
        message: 'Deployed code!'
    }));
});

gulp.task('watch', function() {
	gulp
		.watch(paths.less.dir + '/**/*.less', ['less'])
		.on('change', logWatch);

	function logWatch(event) {
    log(colors.blue('*** File ' + event.path + ' was ' + event.type + ', running tasks...'));
  }
});


/**
 * Formatter for bytediff to display the size changes after processing
 * @param  {Object} data - byte data
 * @return {String}      Difference in bytes, formatted
 */
function bytediffFormatter(data) {
    var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
    return data.fileName + ' went from ' +
        (data.startSize / 1000).toFixed(2) + ' kB to ' + (data.endSize / 1000).toFixed(2) + ' kB' +
        ' and is ' + formatPercent(1 - data.percent, 2) + '%' + difference;
}

/**
 * Format a number as a percentage
 * @param  {Number} num       Number to format as a percent
 * @param  {Number} precision Precision of the decimal
 * @return {String}           Formatted percentage
 */
function formatPercent(num, precision) {
    return (num * 100).toFixed(precision);
}