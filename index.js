'use strict';

var fs = require('fs');
var path = require('path');

var read = exports.read = function(dir, cb){

	var arr = [];

	if(typeof(cb) !== 'function' ) return console.log('[dirreader] - No callback defined');

	fs.exists(dir, function(exists){

		if( !exists) return cb(null, arr);

		fs.readdir(dir, function(err, files){

			if(err) return cb(err); 

			var filesCount = files.length;
			if(!filesCount) return cb(null, arr);

			files.forEach(function(file){

				file = path.join(dir, file);

				fs.stat(file, function(err, stat) {
					if(err) return cb(err);

					if( stat && stat.isDirectory() ){
						read(file, function(err, res){
							arr = arr.concat( res );
							if(!--filesCount) cb(null, arr);
						});
						
					}else{
						arr.push( _setFileProp( path.basename(file), stat.size, dir) );
						if(!--filesCount) cb(null, arr);
					}

				});

			});

		});

	});

}

function _setFileProp(file, size, path){
	var obj = {};
	obj.file = file || '';
	obj.size = size || 0;
	obj.path = path || '';
	return obj;
}
