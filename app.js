const express = require('express'); //importamos libreria de express
const pm = require("./ProductManager.js"); //importamos clase productos

const app = express(); //instanciamos servidor express

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const productos = new pm(); //intanciamos clase productos

app.get('/products', async (req, res) => { //endpoint que recibe un request y devuelve lista de productos con parametro de limite

    var limit = req.query.limit; //defiminos request query limit
    parseInt(limit); //parseamos limit
    const response = await productos.getProducts(); //llamamos clase que obtiene productos

    if (limit === undefined) {
        return res.send(response) //si usuario no envia limit se devuelve toda la lista de productos
    }

    const slicedArray = response.slice(0, limit); //si envia limit se limita lista de productos a la cantidad que haya enviado el usuario con limit

    res.send(slicedArray)
})

app.get('/products/:pid', async (req, res) => { //endpoint que muestra un producto segun ID enviado

    var pid = parseInt(req.params.pid); //parseamos parametro ID

    const response = await productos.getproductByID(pid); //llamamos metodo que busca prodcutos por ID

    res.send(response)
})



app.get('/bienvenido', (req, res) => { //endpoint de bienvenida
    res.send("Hola todos a la tienda de lista de productos")
})

app.listen(8080, () => console.log("Servidor corriendo!!")) //servidor escucha en puerto 8080 localhost
