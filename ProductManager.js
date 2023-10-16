const fs = require('fs'); //Definimos modulo de file system
const archivo = './src/new_file.txt'; //definimos nombre y ruta del archivo

class ProductManager {
  //declaramos propiedades de la clase 
  title;
  description;
  price;
  thumbnail;
  code;
  stock;
  static id = 0; //variable estatica id del producto


  constructor() { //constructor con elemento product arreglo vacio
    this.products = []; //definimos arreglo vacio que guardara productos
    this.path = archivo; //definimos variable en constructor con ruta del archivo
  }

  //Funcion para agregar productos
  async addProduct2(title, description, price, thumbnail, code, stock) {

    const newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      id: ProductManager.id++
    }; //instanciamos objeto con propiedades que recibira del nuevo producto

    try {
      if (!fs.existsSync(archivo)) { //verifica que el archivo exista
        const listaVacia = []; //crea lista vacia para agregar nuevo producto
        listaVacia.push(newProduct); //agrega nuevo producto a objeto newproduct

        await fs.promises.writeFile( //crea el archivo
          archivo,
          JSON.stringify(listaVacia, null, '\t') //agrega con un string lista de nuevo producto
        );
      } else {
        const contenidoObj = await this.consultarProducto(); //si existe el archivo llama función consultarProducto que trae contenido del archivo

        const existingProduct = contenidoObj.find(prod => prod.code === code); //valida que el codigo del producto nuevo no exista 
        if (existingProduct) { //Valida que no existe previamente el mismo codigo
          console.log("Codigo de objeto ingresado ya existe");
          return;
        }

        for (const [key, value] of Object.entries(newProduct)) { //valida que los campos no sean vacios
          if (key !== 'id' && !value) {
            console.log(`La propiedad '${key}' del objeto ingresado está vacía, verifique que todos los campos estén completados`);
            return;
          }
        }

        contenidoObj.push(newProduct); //agrega newProduct a contenidoObj
        await fs.promises.writeFile(
          archivo,
          JSON.stringify(contenidoObj, null, '\t') //escribe en el archivo nuevo producto tipo string
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async consultarProducto() { //funcion que extrae contenido del archiva cada vez que se requiera
    const contenido = await fs.promises.readFile(archivo, 'utf-8');
    const contenidoObj = JSON.parse(contenido);
    return contenidoObj;
  }

  async readProducts() { //funcion para leer arreglo de productos desde el archivo
    const answer = await fs.promises.readFile(this.path, "utf-8");
    const ObjectAnswer = answer == '' ? [] : JSON.parse(answer); 
    return ObjectAnswer;
  }

  async writeFile(allProducts) { //funcion que escribe contenido en archivo
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(allProducts, null, '\t'))

  }

  async getProducts() { //funcion que obtiene arreglo de productos en archivo
    try {
      if (!fs.existsSync(this.path)) { //verifica que el archivo exista
        await this.writeFile(this.products); //crea el archivo con contenido vacio
      }
      const arrayProducts = await this.readProducts(); //lee contenido del archivo

      return arrayProducts //devuelve contenido del archivo

    } catch (error) {
      /*Manejo de errores */
      throw new Error(error);
    }
  }

  async getproductByID(idfind) { //busqueda de productos por ID

    try {
      if (!fs.existsSync(archivo)) { //valida que exista el archivo
        return console.log("El archivo no existe");
      } else {
        const contenidoObj = await this.consultarProducto(); //se trae contenido del archivo

        if (contenidoObj.find((produ) => produ.id === idfind)) { //busca el ID del producto en el contenido
          return contenidoObj.find((produ) => produ.id === idfind);
        } else {
          return "Not found"; //mensaje si no consigue el producto
        }

      }
    } catch (error) {
      console.log(error);
    }

  }

  async updateproductByID(idfind, title, description, price, thumbnail, code, stock) { //update de productos por ID

    const dateProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    }; //definimos nuevo objeto vacio con propiedades del producto que posiblemente se modifiquen


    try {
      if (!fs.existsSync(archivo)) { //se valida que exista el archivo
        return console.log("El archivo no existe");
      } else {
        const contenidoObj = await this.consultarProducto(); //se trae contenido del archivo si existe

        if (contenidoObj.find((produ) => produ.id === idfind)) { //se busca el Id del producto ingresado

          const updatedprod = contenidoObj.find((produ) => produ.id === idfind); //se trae objeto del producto buscado

          for (const [key, value] of Object.entries(dateProduct)) { //valida que los campos ingresado no sean vacios
            if (value) { //si no es vacio significa que el usuario envio un valor que desea modificar de una propiedad del producto
              updatedprod[key] = value;
            }
          }

          contenidoObj.idfind = updatedprod; //el producto del ID ingresado se cambio por el producto modificado en el contenidoObj

          let contenidoObjstring = JSON.stringify(contenidoObj, null, '\t'); //se convierte contenidoObj a string

          fs.writeFileSync(archivo, contenidoObjstring, function (err) { //se agrega al archivo
            if (err) throw err;
            console.log('Producto modificado!');
          });


        } else {
          return "No consegui producto con ese ID"; //error se ID de producto ingresado no existe
        }

      }
    } catch (error) {
      console.log(error);
    }

  }

  async deleteproductByID(idfind) { //metodo para eliminar productos por ID
    const product = await this.consultarProducto(); //trae contenido del archivo
    const productSinId = product.filter((prod) => prod.id != idfind); //filtra producto con el ID ingresado
    await fs.promises.writeFile(
      archivo,
      JSON.stringify(productSinId, null, '\t') //escribe objeto sin producto del ID ingresado en el archivo en formato string
    );

  }

}

module.exports = ProductManager;



