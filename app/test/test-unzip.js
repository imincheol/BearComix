/**
 * Created by imincheol on 2017. 11. 11..
 */
var unzip = require('unzip');
var fs = require('fs'); // File System

var filePath = __dirname + "/../comix/아카이브.zip";



// try {
//     fs.createReadStream(filePath) // read file
//         .pipe(unzip.Extract({ path: 'output/path' })) // extract
//     ;
// } catch(e) {
//     console.log('error extract');
// }finally {
//
// }

try {
    fs.createReadStream(filePath)
        .pipe(unzip.Parse())
        .on('entry', function(entry) {
            // console.log(entry);

            var fileName = entry.path;
            var type = entry.type;
            var size = entry.size;

            if ( type == "File" ) {
                console.log('FileName('+(fileName)+'), type('+type+'), size('+size+')')
            }
            else {
                entry.autodrain();
            }
        })
    ;
}catch(e) {
    console.log('error parsing');
}finally {

}
