var myconsole = require('./myconsole');
console.log_debug('loading web-bundle module...');

var path = require('path');
var exec = require('child_process').exec, child;
var myconsole = require('./myconsole');
var async = require('async');
var jsFiles = [];
var cssFiles = [];
var jsRootPath =  __dirname;
var cssRootPath = __dirname;
var debug = false;
exports.setCssRoot = function(path) {
    
    cssRootPath = path;    
};
        
exports.addCss = function(relativePath) {
    cssFiles.push(relativePath);
};
        
exports.setJsRoot = function(path) {
    jsRootPath = path;
};
        
exports.addJs = function(relativePath) {
    jsFiles.push(relativePath);
};

exports.setDebug = function() {
    debug = true;
};

exports.setProduction = function() {
    debug = false;
};

exports.generate = function(_fn) {

    if(debug) {
        _fn();    
    }
    else {
        var a = [generateCss, generateJs];
        
        async.each(a, function(e, cb) {
            e(cb);    
        }, function(results) {
            _fn();                    
        });
    }
        
};


exports.renderJs = function() {
    debugger;
    var str = '';
    if(debug) {
        jsFiles.map(function(e) {
                str = str + '<script src="' + e + '"></script>';
            }, this);
            
        return str;    
    }
    else {
        return '<script src="js/__bundle-js.js"></script>';
    }
};
        
exports.renderCss = function() {
    var str = '';
    if(debug) {
        cssFiles.map(function(e) {
            str = str + '<link rel="stylesheet" href="' +  e + '">';
        }, this);
        
        return str;
    }
    else {
        return '<link rel="stylesheet" href="css/__bundle-css.css">';
    }
};


function generateCss(cb) {
    var args = '';
    var cmdline;
    
    cssFiles.map(function(c, i, a) {
       var fullPath = path.join(cssRootPath, c);
       
       args = args + ' ' + fullPath;
       
       cmdline = 'cat ' + args + ' > ' + path.join(cssRootPath, 'css/__bundle-css.css');
       
       
    }, this);    
    
    child = exec(cmdline, function (err, stdout, stderr) {
           if(err) { cb(err); throw err; }
           console.log_debug('asset css bundle file generated OK!');
           if(cb) cb();
    });    
};


function generateJs(cb) {
    var args = '';
    var cmdline;
    
    jsFiles.map(function(c, i, a) {
       var fullPath = path.join(jsRootPath, c);
       
       args = args + ' ' + fullPath;
       
       cmdline = 'cat ' + args + ' > ' + path.join(jsRootPath, 'js/__bundle-js.js');
       
       
    }, this);    
    
    child = exec(cmdline, function (err, stdout, stderr) {
           if(err) { cb(err); throw err; }
           console.log_debug('asset js bundle file generated OK!');
           if(cb) cb();
    });    
};

console.log_debug('web-bundle module loaded!');