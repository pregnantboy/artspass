var fs = require('fs');
var archiver = require('archiver');

// create a file to stream archive data to. 
var output = fs.createWriteStream(__dirname + '/artspass.zip');
var archive = archiver('zip', {
    zlib: {
        level: 9
    } // Sets the compression level. 
});

output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('warning', function (err) {
    console.log(err);
});

archive.pipe(output);

archive.directory('_locales');
archive.directory('fonts');
archive.directory('icons');
archive.directory('src');
archive.file('manifest.json');

archive.finalize();

