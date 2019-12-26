var XlsxTemplate = require('xlsx-template'); // TODO: quitar
var http = require('http');
var Stream = require('stream').Transform;
var fs = require('fs');
var path = require('path');
var zip = require('node-zip'); // TODO: quitar si usamos un reverse proxy como NGINX
var web_bundle = require('./web-bundle');
var express = require('express');
var session = require('express-session');
var expressLayouts = require('express-ejs-layouts');
//const router = express.Router();
//module.exports = router;

//require('./comandos_valores_historicos');
//require('./comandos_usuarios');





var app = module.exports = express.createServer();


require('./common');
require('ejs-var');



//var routes = require('./routes');

//const express = require('express');

/* router.get('/', (req, res) => {
    res.send('Hello');
}); */



process.on('uncaughtException', (err) => {
    console.log(`SHUTTING DOWN by unhandled exception: ${err}`);
    process.exit(0);
});



var minify = require('express-minify');

app.use(express.bodyParser());
app.use(express.cookieParser());

app.use(express.session({
    cookie: { path: '/', httpOnly: true, maxAge: null },
    secret: '79KroC12onD09uM19',
}));
// Configuration
app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');

    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(expressLayouts);
    app.use(app.router);
    app.use(express.static(__dirname + '/public', { etag: false }));
});
// Routes
// css
web_bundle.setCssRoot(path.join(__dirname, '/public/'));
web_bundle.addCss("css/main_theme.css");


// js
web_bundle.setJsRoot(path.join(__dirname, '/public/'));
web_bundle.addJs("js/arch/jquery-1.11.1.min.js");
web_bundle.addJs("js/arch/jquery-ui.min.js");
web_bundle.addJs("js/arch/tkn-common.js");
web_bundle.addJs("js/arch/toastr.min.js");
web_bundle.addJs("js/pantalla.js");




function responderView(req, res, vista, extras) {
    var options = {
        web_bundle: web_bundle,
        layout: 'empty_layout',
        session: req.session,
        //config: config,
        //literales: literales,
        renderFecha: function(fechaStr) {
            var d = new Date(fechaStr);
            var now = new Date();
            var day = ("0" + now.getDate()).slice(-2);
            var month = ("0" + (now.getMonth() + 1)).slice(-2);
            return now.getFullYear() + "-" + (month) + "-" + (day);
        }
    }
    var _options = extras ? Object.assign(options, extras) : options;
    res.render(vista, _options);
}
function responderJSON(res, data) {
    var r_json = JSON.stringify(data);

    res.writeHead(200, {
        'Content-type': 'application/json',
        'Content-Length': Buffer.byteLength(r_json),
    });
    res.write(r_json);
    res.end();
}
function getDatos(d) {
    var r;
    if (d === "undefined") {
        r = {};
    }
    else {
        r = JSON.parse(d);
    }

    return r;
}

web_bundle.generate(function(err) {
    if (err) throw err;
    //  comandos.ejecutar(identity, 'LeerConfiguracionSistema', function() {
    var srv = app.listen(4444, function() {
        console.log_info("test WEB - Escuchando en puerto: %d y en modo: %s", app.address().port, app.settings.env);
    });
    srv.timeout = 5 * 60 * 1000;
    //});
});

function enhanceConfig(widgetBoard, widgetsLayout) {
    for (var i = 0; i < widgetBoard.layout.length; i++) {
        (
            function(i, widgetsLayout) {
                if (!widgetBoard.layout[i].config) {
                    widgetBoard.layout[i].config = {};
                }

                widgetBoard.layout[i].config.ancho = function() {
                    var layout = widgetsLayout['panel_' + widgetBoard.layout[i].id];

                    if (layout) {
                        return parseInt(layout.w);
                    }
                    else {
                        return this._ancho ? this._ancho : 8;
                    }
                };

                widgetBoard.layout[i].config.alto = function() {
                    var layout = widgetsLayout['panel_' + widgetBoard.layout[i].id];

                    if (layout) {
                        return parseInt(layout.h);
                    }
                    else {
                        return this._alto ? this._alto : 3;
                    }
                };

                widgetBoard.layout[i].config.x = function() {
                    var layout = widgetsLayout['panel_' + widgetBoard.layout[i].id];

                    if (layout) {
                        return parseInt(layout.x);
                    }
                    else {
                        return this._x ? this._x : 0;
                    }
                };

                widgetBoard.layout[i].config.y = function() {
                    var layout = widgetsLayout['panel_' + widgetBoard.layout[i].id];

                    if (layout) {
                        return parseInt(layout.y);
                    }
                    else {
                        return this._y ? this._y : 0;
                    };
                };

                widgetBoard.layout[i].config.minancho = function() {
                    return this._minancho ? this._minancho : 4;
                };

                widgetBoard.layout[i].config.minalto = function() {
                    return this._minalto ? this._minalto : 4;
                };
            }
        )(i, widgetsLayout);
    }

    return widgetBoard;
}

var listaComandos = []


app.get('/', function(req, res) {
    //var session = req.session;;
    res.redirect('/home');
//  responderView(req, res, 'main', { config: config });
});

app.get('/home', function(req, res) {
    responderView(req, res, 'home');

});

app.get('/cargar_Pantalla', function(req, res) {
    responderView(req, res, '{0}'.format(req.query.Pantalla));
});
app.get('/inject_pantalla', function(req, res) {
    var params = getDatos(req.query.Datos);
    responderView(req, res, '{0}'.format(req.query.Entidad), {
        datos: params
    });
});

// app.options('/wsSelectum', cors());
// app.get('/wsSelectum', cors(), function(req, res) {
//     //app.get('/wsSelectum', function(req, res) {  

//     var token = 'C1E098E6-B1DA-4439-B2B7-BB9FF5591C1C';
//     var msg = ''
//     var convertir = false;
//     switch (req.query.ws) {
//         case 'Cartilla':
//             //console.log(JSON.stringify(req.query))
//             //debugger;
//             var psf = {
//                 _Fields: "NombreDomicilio,StrNombreCodigoProveedor,Especialidad,StrDomicilio,NombrePlan,NombreCanal,MostrarEnCartillaPrivada," +
//                     "StrLocalidad,StrProvincia,StrContactos,DisplayTextoCopago,IdProveedor,IdDomicilio,RN,RT",
//                 // _AliasTablas: "NombreDomicilio|StrNombreCodigoProveedor|Especialidad|StrDomicilio|NombrePlan|NombreCanal|MostrarEnCartillaPrivada|" +
//                 //     "StrLocalidad|StrProvincia|Telefonos|DisplayTextoCopago|IdProveedor|IdDomicilio",
//                 ModoQry: 1, //siempre 3.. el resto no anda mas
//                 _Pag: (req.query.Pag) ? parseInt(req.query.Pag) : 1, //ok
//                 _RegPag: (req.query.RegPag) ? parseInt(req.query.RegPag) : 500, //ok
//                 IdProveedor: (req.query.IdPrestador) ? parseInt(req.query.IdPrestador) : 0, //ok
//                 IdDomicilio: (req.query.IdSede) ? parseInt(req.query.IdSede) : 0, //ok
//                 CUIT: (req.query.CUITPrestador) ? parseFloat(req.query.CUITPrestador) : 0, //ok
//                 Activo: (req.query.Activo) ? parseInt(req.query.Activo) : 127, //ok
//                 Nombre: (req.query.NombreSede) ? req.query.NombreSede + '%' : '', //ok
//                 NombrePrestador: (req.query.NombrePrestador) ? req.query.NombrePrestador + '%' : '', //ok
//                 Codigo: (req.query.CodigoPrestador) ? req.query.CodigoPrestador : '', //ok
//                 IdPlan: (req.query.IdPlan) ? parseInt(req.query.IdPlan) : 0, //ok
//                 ConjPlanes: (req.query.ConjPlanes) ? req.query.ConjPlanes : '', //ok
//                 IdLocalidad: (req.query.IdLocalidad) ? parseInt(req.query.IdLocalidad) : 0, //ok
//                 IdProvincia: (req.query.IdProvincia) ? parseInt(req.query.IdProvincia) : 0, //ok
//                 IdZona: (req.query.IdZona) ? parseInt(req.query.IdZona) : 0, //ok
//                 IdClase: (req.query.IdClaseEspecialidad) ? parseInt(req.query.IdClaseEspecialidad) : 0, //ok
//                 ConjClases: (req.query.ConjClasesEspecialidad) ? req.query.ConjClasesEspecialidad : '', //ok               
//                 IdEspecialidad: (req.query.IdEspecialidad) ? parseInt(req.query.IdEspecialidad) : 0, //ok
//                 ConjEspecialidades: (req.query.ConjEspecialidades) ? req.query.ConjEspecialidades : '', //ok
//                 ModoFiltroContactos: (req.query.ModoFiltroContactos) ? req.query.ModoFiltroContactos : 1, //ok                
//             }

//             var msg = '21 {"MD_IN":1,"MD_OUT":5,"OBJ":8,"OP":4,"Token_Int":"{0}"}~'.format(token) + JSON.stringify(psf) + '\r\n';
//             break;
//         case 'ClasesProveedor':
//             var psf = {
//                 Modo: 5,
//                 IdTabla: 1,
//                 ConstFiltro: 9,
//             }
//             var msg = '7 {"MD_IN":1,"MD_OUT":4,"OBJ":2,"OP":2,"Token_Int":"{0}"}~'.format(token) + JSON.stringify(psf) + '\r\n';
//             break;
//         case 'Planes':
//             var psf = {
//                 _Fields: "ID,IdCanalAcc,NumPlan,Nombre,IdCobertura,CodigoSwiss,IdCptoFacturar,CodigoEnvioSS,TipoEntidad,StrCobertura,StrConcepto,ImprimeCoseguro,StrCanalAcc,MostrarEnCartillaPrivada,NoMostrarEnCartilla",
//                 IdCanalAcc: 0,
//                 ListaIds: '',
//                 TipoEntidad: 2,
//                 NoMostrarEnCartilla: 0
//             }
//             var msg = '21 {"MD_IN":1,"MD_OUT":4,"OBJ":4,"OP":4,"Token_Int":"{0}"}~'.format(token) + JSON.stringify(psf) + '\r\n';
//             break;
//         case 'Provincias':
//             var psf = {
//                 Activo: 1
//             }
//             var msg = '17 {"MD_IN":1,"MD_OUT":4,"OBJ":1,"OP":5,"Token_Int":"{0}"}~'.format(token) + JSON.stringify(psf) + '\r\n';
//             break;
//         case 'Zonas':
//             var idprovincia = (req.query.IdProvincia) ? parseInt(req.query.IdProvincia) : 0
//             if (idprovincia > 0) {
//                 var psf = {
//                     IdProvincia: idprovincia
//                 }
//                 //convertir = true;
//                 var msg = '17 {"MD_IN":1,"MD_OUT":4,"OBJ":4,"OP":5,"Token_Int":"{0}"}~'.format(token) + JSON.stringify(psf) + '\r\n';
//             }
//             else {
//                 var psf = {
//                     _Fields: "Nombre,ID",
//                     IdTabla: 31,
//                     Adic1: null,
//                     Adic2: null,
//                     Activo: 1,
//                 }
//                 convertir = true;
//                 var msg = '7 {"OP":4,"MD_IN":1,"MD_OUT":5,"OBJ":1,"Token_Int":"{0}"}~'.format(token) + JSON.stringify(psf) + '\r\n';
//             }
//             break;
//         case 'Localidades':
//             var psf = {
//                 Activo: 1,
//                 IdProvincia: (req.query.IdProvincia) ? parseInt(req.query.IdProvincia) : 0,
//                 IdZona: (req.query.IdZona) ? parseInt(req.query.IdZona) : 0,
//             }
//             var msg = '17 {"MD_IN":1,"MD_OUT":4,"OBJ":2,"OP":5,"Token_Int":"{0}"}~'.format(token) + JSON.stringify(psf) + '\r\n';
//             break;
//         case 'Especialidades':
//             var psf = {
//                 _Fields: "ID,Nombre",
//                 Adic1: (req.query.IdClaseEspecialidad) ? parseInt(req.query.IdClaseEspecialidad) : 2, //por defecto tenia 2 antes.
//                 IdTabla: 16,
//                 //Adic1: 2,
//                 Activo: 1,
//             }
//             convertir = true;
//             var msg = '7 {"MD_IN":1,"MD_OUT":5,"OBJ":1,"OP":4,"Token_Int":"{0}"}~'.format(token) + JSON.stringify(psf) + '\r\n';
//             break;

//         case 'ClasesEspecialidad':
//             var psf = {
//                 Modo: 5,
//                 IdTabla: 2,
//                 Excluir: [1] //esto excluye generales!
//             }
//             var msg = '7 {"MD_IN":1,"MD_OUT":4,"OBJ":2,"OP":2,"Token_Int":"{0}"}~'.format(token) + JSON.stringify(psf) + '\r\n';
//             break;

     
//         case 'Logueo':
//             if (!(req.query.Usuario)){
//                 throw 'No se ingreso el Nombre de Usuario';
//             }
//             if (!(req.query.Password)){
//                 throw 'No se ingreso el Password';
//             }            
//             var psf = {
//                 UsrID: req.query.Usuario, 
//                 PasswordActual: req.query.Password, 
//             }

//             var msg = '78 {"MD_IN":1,"MD_OUT":4,"OBJ":1,"OP":106}~' + JSON.stringify(psf) + '\r\n';
//             break;

//         case 'CarnetProvisorio':
//             if (!(req.query.Token)){
//                 throw 'No se envio el Token para realizar la consulta';
//             }
//             if (!(req.query.Cuil)){
//                 throw 'No se ingreso el Cuil para realizar la consulta';
//             }          
//             if (!(req.query.Usuario)){
//                 throw 'No se ingreso el Nombre de Usuario';
//             }          
//             if (!(req.query.IdAdmSys)){
//                 throw 'No se ingreso el Id de AdmSys';
//             }                
//             var unaFechaEmision = (req.query.FechaEmision) ? req.query.FechaEmision : new Date();
            
//             var unafechaStr = new Date(unaFechaEmision).toISOString();
//             var unaFecha = unafechaStr.substring(0, unafechaStr.length - 5);

//             var psf = {
//                 CUIL: parseFloat(req.query.Cuil),
//                 FechaEmision : unaFecha,
//                 TipoEntidad  : 1,
//                 TipoSalida   : 2,
//                 IdAdmSys     : parseInt(req.query.IdAdmSys),
//                 Str1      : req.query.Usuario
//             }

//             var msg = '67 {"MD_IN":1,"MD_OUT":4,"OBJ":5,"OP":100,"token":"{0}"}~'.format(req.query.Token) + JSON.stringify(psf) + '\r\n';            
//             break;

//         default:
//             throw 'WS invalido';
//     }

//     //res.json(rs)
//     //return;
//     if (msg != '') {
//         if (req.query.ws == 'Logueo'){
//             proxy3.sendCommand(proxy3.makeMessage("noidentity", msg), function(result) {
//                 if (null == result.header) {
//                     var rta = {
//                         Codigo : 150,
//                         Texto : 'Credenciales invalidas para usuario: {0}'.format(req.query.Usuario),
//                         Token : ''
//                     }

//                 }
        
//                 if (result.header.Cod == 10) { //LOGIN OK
//                     var rta = {
//                         Codigo : 10,
//                         Texto : 'Login OK',
//                         Token : result.header.RtaString
//                     }
//                 }
//                 else if (result.header.Cod == 105) { //SIN CONEXION
//                     var rta = {
//                         Codigo : 105,
//                         Texto : 'Usuario:{1}. Info: {0}.'.format('Sin conexión con el servidor. Contactese con el administrador', req.query.Usuario),
//                         Token : ''
//                     }
          
//                 } else {
//                     var rta = {
//                         Codigo : result.header.Cod,
//                         Texto : 'Usuario:{1}. Info: {0}.'.format(result.header.Info, req.query.Usuario),
//                     }
//                 }
//                 res.json(rta);
//                 return;                
//             });           

//         } else {
//             proxy3.sendQueryWithStatus(msg, function(result) {
//                 if (null == result.header) {
//                     var rta = {
//                         Codigo : 150,
//                         Texto : 'Comando invalido',
//                     }
//                     res.json(rta);
//                     return;  

//                 }
//                 if (result.header.Cod == 52) { //token invalido
//                     var rta = {
//                         Codigo : result.header.Cod,
//                         Texto : result.header.Info,
//                     }
//                     res.json(rta);                    
//                     return;
//                 }                
//                 if (result.header.Cod == 50) {
//                     var rta = {
//                         Codigo : result.header.Cod,
//                         Texto : result.header.Info,
//                     }
//                     res.json(rta);                    
//                     return;
//                 }
//                 if (result.data) {
//                     if (result.data.LstID) {
    
//                         res.json(result.data.LstID)
//                         return;
//                     }
//                     else {
//                         if (!convertir) {
//                             //entra por aca
//                             //RESPUESTAS ESTANDARIZADAS PASAN POR EL ELSE.. CASOS PARTICULARES SE TRATAN APARTE
//                             if (req.query.ws == 'CarnetProvisorio'){
//                                 if ((result.data) && (result.data.ArchivoPDF)){
//                                     var archivo = result.data.ArchivoPDF_PathCliente.trim();                                    
//                                 }
//                                 var rta = {
//                                     Codigo : 10,
//                                     Texto : 'Archivo Carnet Provisorio',
//                                     Link : archivo
//                                 }   
//                                 res.json(rta);
//                                 return;
//                             } else{
//                                 res.json(result.data);    
//                                 return;
//                             }
//                         }
//                         else {
//                             var unResultado = []
//                             var unObj = {};
//                             for (var i = 0; i < result.data.length; i++) {
//                                 unObj = {
//                                     T: result.data[i].Nombre || result.data[i].nombre || result.data[i].Descripcion,
//                                     I: result.data[i].ID || result.data[i].Id || result.data[i].id
//                                 }
//                                 unResultado.push(unObj);
//                             }
    
//                             res.json(unResultado);
//                             return;
//                         }
//                     }
//                 }
//                 else {
//                     res.json([{}]);
//                     return;
//                 }
//                 res.end();
//             });
            
//         }
//     }
//     else {
//         res.end();
//     }
// });


