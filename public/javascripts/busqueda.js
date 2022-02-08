window.onload = function () {
//console.log("Busqueda"); /* comprobar vinculacion */

var formularioBusqueda= document.querySelector("#busqueda")  /* captura formulario de busqueda - seleccionar - */
var barraDeBusqueda= document.querySelector("#barraDeBusqueda")  /* captura input de busqueda - seleccionar - */

formularioBusqueda.addEventListener("submit" , evento=>{
    if (barraDeBusqueda.value===" " || barraDeBusqueda.value=== "") { /* si la barra esta vacia o si tiene un espacio; la barra no funciona */
        evento.preventDefault()    
    }
})
   
    

} 