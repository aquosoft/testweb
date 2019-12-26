
var currentLogLevel = 0;

console.log('default log level is %d', currentLogLevel);

exports.setLogLevel = function(level) {
    console.log('current log level changed to %d, previous was %d', level, currentLogLevel);
    currentLogLevel = level;
}; 

function agregarFecha(unLog){
    //var Fecha = new Date();
    // var Fecha = new Date().toLocaleString("es-AR", {timeZone: "America/Buenos_Aires"})
    var Fecha = new Date().toLocaleString("es-AR", {timeZone: "America/Buenos_Aires"})
    //unLog = Fecha.toLocaleDateString() + ' '+ Fecha.toLocaleTimeString() + ' || ' + unLog; 
    unLog = Fecha + ' || ' + unLog; 
    return unLog;
}

console.log_info = function(s) {
    s = agregarFecha(s);
    if(currentLogLevel >= 1) console.log.apply(this, arguments);
}

console.log_warning = function(s, args) {
    s = agregarFecha(s);
    if(currentLogLevel >= 2) console.log.apply(this, arguments);
}

console.log_error = function(s, args) {
    s = agregarFecha(s);
    if(currentLogLevel >= 3) console.log.apply(this, arguments);
}

console.log_debug = function(s, args) {
    s = agregarFecha(s);
    if(currentLogLevel >= 4) console.log.apply(this, arguments);
}

