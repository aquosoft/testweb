const VERSION_ACTUAL = 'v1.109.155';

var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    //encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},
    decode: function(e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9+/=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) { t = t + String.fromCharCode(r) }
            if (a != 64) { t = t + String.fromCharCode(i) }
        }
        t = Base64._utf8_decode(t);
        return t
    },
    //_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},
    _utf8_decode: function(e) {
        var t = "";
        var n = 0;
        var r = c1 = c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            }
            else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            }
            else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    }

}
var Pantalla = {
    timestamp: 0,
    dicCambiosDeImagen: {},
    toHex: function(tmp) {;
        var str = "";
        for (var i = 0; i < tmp.length; i++)
            str += ("00" + (tmp.charCodeAt(i)).toString(16)).substr(-2);
        return (str);
    },
    fromHex: function(tmp) {;
        var str = "";
        for (var i = 0; i < tmp.length; i += 2)
            str += String.fromCharCode(parseInt(tmp.substr(i, 2), 16));
        return (str);
    },
    _leerPagina: function(url, cb) {
        Pantalla.showProgress('Pantalla._leerPagina:' + url);
        var jqxhr = $.get(url, function(html) {
            Pantalla.stopShowingProgress('Pantalla._leerPagina:' + url);
            cb(html);
        });

        jqxhr.fail(function() {
            alert('error de session?');
        });
    },
    _apilarPantalla: function(html) {
        var d = $('<div class="pantalla_agregada"></div>').appendTo($('#contenido-sidebar'));
        var j = $('<div class="bordes_anchos"></div>').appendTo(d);
        j.html(html);
        setInterval(function() {
            j.show();
        }, 10);
    },
    _ocultarCargando: function() {
        $('#contenido-sidebar .cargando').hide();
        //$('.fondo_inicial').hide();
    },
    _mostrarCargando: function() {
        $('#contenido-sidebar .cargando').show();

    },
    _quitarFondoInicial: function() {
        $('.fondo_inicial').hide();
    },
    _actualizarUbicacion: function(s) {
        $('#nombre_pantalla').html(s);
    },
    _ocultarPantallaActiva: function() {
        // OJO CON ESTO 34624334
        $('#contenido-sidebar .pantalla_agregada').remove();
        //$('#contenido-sidebar .pantalla_agregada').hide();
    },
    _mostrarPantalla: function(url, titulo, onShow, nombrePantalla) {
        var self = this;
        debugger;

        $('.fondo_inicial').show();
        var me = this;
        Pantalla._actualizarUbicacion(titulo);
        Pantalla._ocultarPantallaActiva();
        Pantalla._mostrarCargando();
        //var popupProgreso = Mensajes.popupMensajeAccionEnProgreso(100);
        self._leerPagina(url, function(html) {

            if (nombrePantalla) {
                //VER QUE PASA CUANDO TENGO NOMBRE DE PANTALLA, PERO NADA ASINCRONICO ADENTRO... COMO RESOLVERLO. POR AHORA NO ANDAN LOS EDITORES QUE NO SEAN EL DE AFILIADOS.
                var _asyncTemp = Tekno.AsyncOrquestaModule.createAsynOrquesta(nombrePantalla);

                var d = $('<div class="pantalla_agregada"></div>').appendTo($('#contenido-sidebar'));
                var j = $('<div class="bordes_anchos"></div>').appendTo(d);
                j.hide();
                j.html(html);

                setTimeout(function() {
                    if (!_asyncTemp.esFinalizado()) {
                        _asyncTemp.addPromise(Promise.resolve());
                        _asyncTemp.FinalizarCargaPromesas();

                    }

                    $('body').removeClass('modal-open');

                }, 0);

                _asyncTemp.CuandoTermine(function() {

                    popupProgreso.cancelar();
                    Pantalla._ocultarCargando();
                    j.show();

                    $(".pantalla_agregada").off("remove")
                    $(".pantalla_agregada").on("remove", function() {
                        if (onCommandHandle)
                            onCommandHandle();

                    })

                    if (onShow) onShow();

                });
            }
            else {
                var d = $('<div class="pantalla_agregada"></div>').appendTo($('#contenido-sidebar'));
                var j = $('<div class="bordes_anchos"></div>').appendTo(d);
                j.hide();
                j.html(html);


                //popupProgreso.cancelar();
                Pantalla._ocultarCargando();
                j.show();

                $(".pantalla_agregada").off("remove")
                $(".pantalla_agregada").on("remove", function() {
                    if (onCommandHandle)
                        onCommandHandle();
                })

                if (onShow) onShow();
            }


            //Pantalla._apilarPantalla(html);




        });


    },
    _showProgress: 0,
    _lstProcesosCorriendo: [],
    showProgress: function(identificador) {
        identificador = identificador || 'sin_datos';
        var unComando = {
            nombre: identificador
        }
        this._lstProcesosCorriendo.push(unComando);

        this._showProgress++;
        $('#estado-transaccion').removeClass('invisible');

        //$body = $("body");        
        //$body.addClass("pwait");
        //$body.addClass("pleacewait");



    },
    stopShowingProgress: function(identificador) {
        identificador = identificador || 'sin_datos';
        for (i = 0; i <= this._lstProcesosCorriendo.length - 1; i++) {
            if (this._lstProcesosCorriendo[i].nombre === identificador) this._lstProcesosCorriendo.splice(i, 1);
        }

        this._showProgress--;
        if (this._showProgress <= 0) {
            this._showProgress = 0;
            $('#estado-transaccion').addClass('invisible');

            //  $body = $("body");  
            //  $body.removeClass("pwait");
            //  $body.removeClass("pleacewait");
            //$('#estado-transaccion-modal').modal('hide');
        }
    },

    navegarExplorador: function(explorerName, titulo) {
        Pantalla._actualizarUbicacion(titulo);
        Pantalla._mostrarPantalla("/explorador?Tablero={0}".format(explorerName));
        this._quitarFondoInicial()
    },
    navegarPantalla: function(nombrePantalla, titulo) {
        Pantalla._actualizarUbicacion(titulo);
        Pantalla._mostrarPantalla("/cargar_Pantalla?Pantalla={0}".format(nombrePantalla));
        this._quitarFondoInicial()
    },    
    renderFecha: function(fechaStr, modo) {
        if (fechaStr) {
            modo || (modo = 1);
            var defaultDate = new Date(fechaStr);
            var d = new Date(defaultDate.getTime());

            var dini = new Date('01/01/1900');
            if (d > dini) {
                if ((modo < 4) || (modo == 6) || (modo == 7) || (modo == 10) || (modo == 12)) {
                    var day = ("0" + d.getDate()).slice(-2);
                    var month = ("0" + (d.getMonth() + 1)).slice(-2);
                    var hour = ("0" + d.getHours()).slice(-2);
                    var min = ("0" + d.getMinutes()).slice(-2);
                    var segun = ("0" + d.getSeconds()).slice(-2);
                    var ms = ("00" + d.getMilliseconds()).slice(-3);
                }

                if (modo === 1) {
                    return d.getFullYear() + "-" + (month) + "-" + (day);
                }
                else if (modo === 2) {

                    return (day) + "-" + (month) + "-" + d.getFullYear();
                }
                else if (modo === 3) {
                    return (day) + "-" + (month) + "-" + d.getFullYear() + " " + (hour) + ":" + (min);
                }
                else if (modo === 4) {
                    var unafechaStr = new Date(fechaStr).toISOString();
                    var unaFecha = unafechaStr.substring(0, unafechaStr.length - 5);
                    return unaFecha;
                }
                else if (modo === 5) {
                    var options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }; // OJO: El UTC es para no agregar el offset por Timezone
                    unafechaStr = new Date(fechaStr).toLocaleDateString("es-ES", options);
                    unaFecha = unafechaStr;
                    return unaFecha;
                }
                else if (modo === 6) { // Toma fecha ajustando diferencia horaria y fuerza hora cero
                    var defaultDate = new Date(fechaStr);
                    var defaultisoDate = new Date(defaultDate.getTime() + defaultDate.getTimezoneOffset() * 60000).toISOString();
                    return defaultisoDate.substring(0, 10) + 'T00:00:00.000';
                }
                else if (modo === 7) {
                    return (day) + "-" + (month) + "-" + d.getFullYear() + " " + (hour) + ":" + (min) + ":" + (segun) + "." + (ms);
                }
                else if (modo === 8) { // DD/MM/YYYY
                    return fechaStr.substring(8) + '/' + fechaStr.substring(5, 7) + '/' + fechaStr.substring(0, 4);
                }
                else if (modo === 9) { // ej. Jueves 12 de Octubre de 2017
                    var dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
                    var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

                    var date = new Date(fechaStr.substr(0, 10));
                    date = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

                    var fechaNum = date.getDate();
                    var mes_name = date.getMonth();

                    return dias[date.getDay() - 1] + " " + fechaNum + " de " + meses[mes_name] + " de " + date.getFullYear();
                }
                else if (modo === 10) {
                    return d.getFullYear() + "-" + (month) + "-" + (day) + "T" + (hour) + ":" + (min) + ":" + (segun) + "." + (ms);
                }
                else if (modo === 11) {
                    return d.getFullYear() + "-" + (month) + "-" + (day) + "T" + (hour) + ":" + (min) + ":" + (segun);
                }
                else if (modo === 12) {
                    return (month) + " " + d.getFullYear();
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    },
  
    _formularios: {}
};

function resetNavegacion() {
    $('#contenido-sidebar .pantalla_agregada').remove();
}

function IncDecFecha(unaFecha, cantDias) { //la fecha se pasa en formato yyyy-MM-dd y devuelve el objeto date de js
    var fecha = new Date(unaFecha);
    var fechaModif = new Date(fecha.getTime() + ((24 * 60 * 60 * 1000) * cantDias));
    return fechaModif
}
function IncDecMeses(unaFecha, CantMeses) {
    var fecha = new Date(unaFecha);
    var fechaModif = fecha.setMonth(fecha.getMonth() + CantMeses);
    return fechaModif
}
function IncDecAnios(unaFecha, CantAnios) {
    var fecha = new Date(unaFecha);
    var fechaModif = fecha.setYear(fecha.getFullYear() + CantAnios);
    return fechaModif
}
function DecPeriodo(unPeriodo, Cantidad) {
    var AuxPeriodo = String(unPeriodo).replace("-", "")
    var perAnio = AuxPeriodo.substring(0, 4)
    var perMes = AuxPeriodo.substring(4, 6)

    for (var i = 1; i <= Cantidad; i++) {
        perMes = perMes - 1
        if (perMes < 1) {
            perAnio = perAnio - 1
            perMes = 12;
        }
    }
    perMes = ("0" + (perMes)).slice(-2);
    return String(perAnio) + String(perMes);

}
function number_format(amount, decimals) {
    amount += ''; // por si pasan un numero en vez de un string
    amount = parseFloat(amount.replace(/[^0-9\.\-]/g, '')); // elimino cualquier cosa que no sea numero o punto
    decimals = decimals || 0; // por si la variable no fue fue pasada
    // si no es un numero o es igual a cero retorno el mismo cero
    if (isNaN(amount) || amount === 0)
        return parseFloat(0).toFixed(decimals);
    // si es mayor o menor que cero retorno el valor formateado como numero
    amount = '' + amount.toFixed(decimals);
    var amount_parts = amount.split('.'),
        regexp = /(\d+)(\d{3})/;
    // while (regexp.test(amount_parts[0]))
    //     amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');
    return amount_parts.join('.');
};
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        }
        else
            //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
            if (i == key && obj[i] == val || i == key && val == '') { //
                objects.push(obj);
            }
        else if (obj[i] == val && key == '') {
            //only add if the object is not already in the array
            if (objects.lastIndexOf(obj) == -1) {
                objects.push(obj);
            }
        }
    }
    return objects;
}
function obtenerValorXClave(arrObj, tagClave, tagBusq, clave) { //
    // var TIPOS_MOVIMIENTO_INTERNACION = [ 
    //         { Nombre: 'Ingreso', ID: 1 },
    //         { Nombre: 'Derivación', ID: 2 }, 
    //         { Nombre: 'Egreso', ID: 3 },
    //     ];   
    // var unStr = obtenerValorXClave(TIPOS_MOVIMIENTO_INTERNACION,'ID','Nombre',1); = Ingreso
    // var unStr = obtenerValorXClave(TIPOS_MOVIMIENTO_INTERNACION,'ID','Nombre',3); = Egreso
    var resultado = '';
    for (var i = 0; i < arrObj.length; i++) {
        var obj = arrObj[i];
        if ((obj[tagClave]) && (obj[tagClave] == clave)) {
            resultado = obj[tagBusq];
            return resultado
        }
    }
    return resultado;
}
function obtenerObjetoXClave(arrObj, tagClave, clave) { //
    // var TIPOS_MOVIMIENTO_INTERNACION = [ 
    //         { Nombre: 'Ingreso', ID: 1 },
    //         { Nombre: 'Derivación', ID: 2 }, 
    //         { Nombre: 'Egreso', ID: 3 },
    //     ];   
    // var unStr = obtenerValorXClave(TIPOS_MOVIMIENTO_INTERNACION,'ID','Nombre',1); = Ingreso
    // var unStr = obtenerValorXClave(TIPOS_MOVIMIENTO_INTERNACION,'ID','Nombre',3); = Egreso
    ;
    var resultado = {};
    for (var i = 0; i < arrObj.length; i++) {
        var obj = arrObj[i];
        if ((obj[tagClave]) && (obj[tagClave] == clave)) {
            return obj;
        }
    }
    return resultado;
}
function obtenerIndiceObjXClave(arrObj, tagClave, clave) { //
    // var TIPOS_MOVIMIENTO_INTERNACION = [ 
    //         { Nombre: 'Ingreso', ID: 1 },
    //         { Nombre: 'Derivación', ID: 2 }, 
    //         { Nombre: 'Egreso', ID: 3 },
    //     ];   
    // var unStr = obtenerValorXClave(TIPOS_MOVIMIENTO_INTERNACION,'ID','Nombre',1); = Ingreso
    // var unStr = obtenerValorXClave(TIPOS_MOVIMIENTO_INTERNACION,'ID','Nombre',3); = Egreso
    ;
    var resultado = -1;
    for (var i = 0; i < arrObj.length; i++) {
        var obj = arrObj[i];
        if ((obj[tagClave]) && (obj[tagClave] == clave)) {
            return i;
        }
    }
    return resultado;
}
function pasarAMayuscula(str, tipo) {
    if (tipo == 1) { //primer letra mayuscula
        str = str.toLowerCase();
        return (str + '')
            .replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1) {
                return $1.toUpperCase();
            });
    }
    else if (tipo == 2) { //todo a mayuscula
        return str.toUpperCase();
    }
    else if (tipo == 3) { //todo a minuscula
        return str.toLowerCase();
    }

}

function abrirEnNewTab(unArchivo, idpopup) {
    var form = document.createElement("form");
    form.method = "GET";
    form.action = unArchivo;
    form.target = "_blank";
    document.body.appendChild(form);
    form.submit();

    if (idpopup != undefined) {
        $('#{0}'.format(idpopup)).modal('hide');
    }
}
