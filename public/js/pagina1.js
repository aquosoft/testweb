bindAcciones();
function bindAcciones(){
    $('#btnpage1').click(function(){
        Pantalla.navegarPantalla('pagina2')
    });
    $('#callserver').click(function(){
        var psf = {
            gpioNumber : parseInt($('#gpioNumber').val()),
            data     : $('#gpioCommand').val()|| 'encendergpio'
        }
        var nombre = $('#gpioCommand').val() || 'encendergpio'
        Pantalla.ejecutarComando(nombre,psf,function(data){
            alert(data)
            
        })
        
        //Pantalla.navegarPantalla('pagina2')
    })
    
}