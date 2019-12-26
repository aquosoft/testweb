bindAcciones();
function bindAcciones(){
    $('#test1').click(function(){
        Pantalla.navegarPantalla('pagina1')
    })
    $('#test2').click(function(){
        Pantalla.navegarPantalla('pagina2')
    })
    $('#test3').click(function(){
        Pantalla.navegarPantalla('pagina3')
    })
    $('#test4').click(function(){
        Pantalla.navegarPantalla('pagina4')
    })    
}