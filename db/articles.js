const db = require('./connection.js');

module.exports = (function(){

  let _all = () => {
    return db.query('SELECT * FROM articles')
    .catch(error => {
      console.error(error);
    });
  };

  let _add = (post) => {
    return db.query('INSERT INTO articles (title, body, author, url_title) VALUES (${title}, ${body}, ${author}, ${urlTitle})', post)
    .catch(error => {
      console.error(error);
    });
  };

  let _getByTitle = (title) => {
    return db.query('SELECT DISTINCT ON (title) * FROM articles WHERE title = ${title}', {title: title})
    .catch(error => {
      console.error(error);
    });
  };

  let _editByTitle = (id, changedData) => {
    changedData.old_title = id;
    changedData.urlTitle = encodeURI(changedData.title);
    let updateQuery = 'UPDATE articles SET title=${title}, body=${body}, author=${author}, url_title=${urlTitle} WHERE articles.title=${old_title}';
    return db.query(updateQuery, changedData)
    .catch(error => {
      console.error(error);
    });
  };

  let _deleteByTitle = (title) => {
    return db.query('DELETE FROM articles WHERE articles.title=${title}', {title:title})
    .catch(error => {
      console.error(error);
    });
  };

  return {
    all: _all,
    add: _add,
    getByTitle: _getByTitle,
    deleteByTitle: _deleteByTitle,
    editByTitle: _editByTitle
  };
})();