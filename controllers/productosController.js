const db = require('../database/models');
const Sequelize = require('sequelize');
const { log } = require('debug');
const op = db.Sequelize.Op;

module.exports = {
    detalle: function (req,res) {
     /*  console.log(req.session.usuarioLogueado) */ /* testeo de uss logueado */
        let id = req.params.id;
        db.Producto.findByPk(id, {
           include: [{all: true, nested: true}] //pedido asicronico a db
        })
        .then(function (unProducto) {
            res.render('detalle',{ unProducto: unProducto, title: unProducto.nombre })
        })
        .catch(error=>{
            console.log(error)
        })
    },

    porCategoria: function (req,res) {
        let categoria = req.params.laCategoria;
        db.Producto.findAll({
            where: {
                categoria_id: categoria
            },
            include: [{
                association: 'categorias'
            }]
        })  
        .then(function (resultado) {
            res.render('porCategoria', { resultado: resultado, title: resultado[0].categorias.nombre })
        })
    },

    buscar: function (req,res) {
       
      
    },

    agregarComentario: function (req,res) {
        if (req.session.usuarioLogueado == undefined) {
            res.redirect("/");
        }
        let idProducto = req.params.id;
        let idUsuario = req.session.usuarioLogueado.id;

        db.Comentario.create({
            texto_comentario: req.body.texto_comentario,
            calificacion: req.body.calificacion,
            usuario_id: idUsuario,
            producto_id: idProducto
        })
        .then(function () {
            res.redirect('/productos/detalle/'+idProducto)
        })
    },

    agregarProducto: function (req, res){
        if (req.session.usuarioLogueado == undefined) {
            res.redirect("/");
        }
        res.render('agregarProducto', { title: 'Agregar Producto'});
    },

    productoSubmit: function (req,res) {
        if (req.session.usuarioLogueado == undefined) {
            res.redirect("/");
        }
        /* punto 5 metodo CREATE - es necesario darle valor a los objetos -*/
       db.Producto.create({
           nombre: req.body.nombre,
           marca: req.body.marca,
           img_url: req.body.imagen,
           precio: req.body.precio,
           categoria_id: req.body.categoria,
           usuario_id: req.session.usuarioLogueado.id
       }
       )
       .then (()=> {
            db.Producto.findAll(
                {
                where: {usuario_id: req.session.usuarioLogueado.id},
                order: [['updatedAt', 'DESC']]
            }
            )
                .then( productos=> {
                res.render('misProductos', {productos: productos, title: 'Mis productos'})
            }) /* si sale bien, arroja resultado de todos mis productos agregados */
                .catch(error=>{console.log(error)}) /* req.send("No se pudo crear el producto") alternativa en la web */
            }
        )
        .catch(error=>{console.log(error)}) /* si algo sale mal, imprimir el error */
    },

    misProductos: function (req, res) {
        if (req.session.usuarioLogueado == undefined) {
            res.redirect("/");
        }

        db.Producto.findAll(
            {
            where: {usuario_id: req.session.usuarioLogueado.id},
            order: [['updatedAt', 'DESC']]
        }
        )
        .then(function (productos) {
            res.render('misProductos', {productos: productos, title: 'Mis productos'})
        })
    },

    editarProducto: function (req,res) {
        if (req.session.usuarioLogueado == undefined) {
            res.redirect("/");
        }
        let id = req.params.id;
        db.Producto.findByPk(id)
        .then(function (producto) {
            res.render('editarProducto', {producto: producto, title: 'Editar producto'})
        })
    },

    editarConfirm: function (req,res) {
        if (req.session.usuarioLogueado == undefined) {
            res.redirect("/");
        }

        let id = req.params.id;
        db.Producto.update(req.body,
            {
                where: {
                    id:id
                }
            })
        .then(function (output) {
            res.redirect('/productos/misProductos')
        })
    },

    borrarProducto: function (req,res) {
        if (req.session.usuarioLogueado == undefined) {
            res.redirect("/");
        }
        let id = req.params.id;
        db.Producto.findByPk(id)
            .then(function (producto) {
                res.render('borrarProducto', { producto: producto, title: 'Borrar producto' })
            })
    },

    borrarConfirm: function (req,res) {
        if (req.session.usuarioLogueado == undefined) {
            res.redirect("/");
        }
        let id = req.params.id;
        db.Producto.destroy({
            where: {
                id: id
            }
        })
        .then(function (otuput) {
            res.redirect('/productos/misProductos')
        })
    }
}