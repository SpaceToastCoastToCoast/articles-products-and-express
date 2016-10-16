const db = require('./connection.js');

module.exports = (function(){

  let _all = () => {
    return db.query('SELECT * FROM products')
    .catch(error => {
      console.error(error);
    });
  };

  let _add = (product) => {
    return db.query('INSERT INTO products (name, price, inventory) VALUES (${name}, ${price}, ${inventory})', product)
    .catch(error => {
      console.error(error);
    });
  };

  let _getById = (id) => {
    return db.query('SELECT * FROM products WHERE id = ${id}', {id: id})
    .catch(error => {
      console.error(error);
    });
  };

  let _editById = (id, changedData) => {
    changedData.price = parseFloat(changedData.price.replace(/[^0-9-.]/g, ''));
    changedData.inventory = parseInt(changedData.inventory);
    changedData.id = id;
    let updateQuery = 'UPDATE products SET name=${name}, price=${price}, inventory=${inventory} WHERE products.id=${id}';
    return db.query(updateQuery, changedData)
    .catch(error => {
      console.error(error);
    });
  };

  let _deleteById = (id) => {
    return db.query('DELETE FROM products WHERE products.id=${title}', {id:id})
    .catch(error => {
      console.error(error);
    });
  };

  return {
    all: _all,
    add: _add,
    getById: _getById,
    deleteById: _deleteById,
    editById: _editById
  };
})();