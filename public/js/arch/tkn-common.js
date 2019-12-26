String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.camelize = function () {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
        return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
}

function async(fn) {
    return setTimeout(fn, 0);
}

function ensurePrecondition(o) {
    if (o == null || o === 'undefined') {
        //var msg = "not ensured precondition";
        //uxCommon.raiseInternalError(Messages.translate('MSG_NOT_ENSURED_PRECONDITION'));
    }
}

function defer(f) {
    setTimeout(f, 200);
}


function forEach(o, itemDelegate, scope) {

    if (o == null || o === 'undefined') return;

    if (isArray(o)) {
        for (i = 0; i < o.length; i++) {
            itemDelegate(o[i], i, o, scope);
        }
    }
    else {

        for (var e in o) {
            itemDelegate(o[e], e, o, scope);
        }

    }
}

// backward compatibility
// or else: Array.isArray
// Ref: http://stackoverflow.com/questions/6844981/distinguish-between-array-and-hash-in-javascript-with-typeof
function isArray(a) {
    return Object.prototype.toString.apply(a) === '[object Array]';
}

function formatKeyValueArrayIntoHash(arrayOfKeyValuePairs) {
    var r = {};

    for (var i = 0; i < arrayOfKeyValuePairs.length; i++) {
        r[arrayOfKeyValuePairs[i].key] = arrayOfKeyValuePairs[i].value;
    }

    return r;
}

/*
 * String format
 */
String.prototype.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};




/*
 * String trim
 */
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
};

/*
 * String empty
 */
String.prototype.empty = function () {
    return this.length == 0;
};

/*
 * Starts with
 */
String.prototype.startsWith = function (data) {
    return this.substring(0, data.length) === data;
};

/*
 * Array first
 */
if (!Array.prototype.first) {
    Array.prototype.first = function () {
        return this[0] || this /* in case is not an Array */;
    }
}

/*
 * Array last
 */
if (!Array.prototype.last) {
    Array.prototype.last = function () {
        return this[this.length - 1];
    };
}

/*
 * Array empty
 */
if (!Array.prototype.empty) {
    Array.prototype.empty = function () {
        return this.length == 0;
    };
}

function ERROR_TECNICO() {
    window.location.href = 'ErrorTecnicoEnAplicacionNavegador.html';
}