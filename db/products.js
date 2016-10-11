module.exports = (function(){

  let allProducts = [];

  function _all() {
    return allProducts;
  }

  function _add(product) {
    if(product.name === undefined) {
      return false;
    }
    allProducts.push(product);
    return true;
  }

  function _getById(id) {
    let [foundProduct] = allProducts.filter((product) => {
      return product.id === id;
    });
    return foundProduct;
  }

  function _editById(id, changedData) {
    let productToEdit = _getById(id);
    let productIndex = allProducts.indexOf(productToEdit);
    if(productIndex > -1) {
      if(changedData.hasOwnProperty('name')) {
        productToEdit.name = changedData.name;
      }
      if(changedData.hasOwnProperty('price')) {
        productToEdit.price = changedData.price;
      }
      if(changedData.hasOwnProperty('inventory')) {
        productToEdit.inventory = changedData.inventory;
      }
      return true;
    } else {
      return false;
    }
  }

  function _deleteById(id) {
    let productIndex = allProducts.indexOf(_getById(id));
    if(productIndex > -1) {
      allProducts.splice(productIndex, 1);
      return true;
    } else {
      return false;
    }
  }

  return {
    all: _all,
    add: _add,
    getById: _getById,
    deleteById: _deleteById,
    editById: _editById
  };
})();