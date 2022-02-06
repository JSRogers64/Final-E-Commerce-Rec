module.exports = (sequelize, DataTypes) => {

    let cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            
        },
        nombre: {
          type: DataTypes.STRING


        }
       
    };

    let config = {
        timestamps: false,
        tableName: "categorias",

    };

    const Categoria = sequelize.define("Categoria", cols, config);

    Categoria.associate=function(modelos){
        Categoria.hasMany(modelos.Producto, {
            as: 'categorias',
            foreignKey: "categoria_id"

        
    }
        )
      //relaciones  
    }

    return Categoria;

}