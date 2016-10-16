const db = require('./connection.js');

module.exports = (function(){

  let allPosts = [];

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
    return db.query('SELECT * FROM articles WHERE title = ${title}', {title: title})
    .catch(error => {
      console.error(error);
    });
  };

  let _editByTitle = (title, changedData) => {
    let postToEdit = _getByTitle(title);
    let postIndex = allPosts.indexOf(postToEdit);
    if(postIndex > -1) {
      if(changedData.hasOwnProperty('title')) {
        postToEdit.title = changedData.title;
        postToEdit.urlTitle = encodeURI(changedData.title);
      }
      if(changedData.hasOwnProperty('body')) {
        postToEdit.body = changedData.body;
      }
      if(changedData.hasOwnProperty('author')) {
        postToEdit.author = changedData.author;
      }
    }
  };

  let _deleteByTitle = (title) => {
    let postIndex = allPosts.indexOf(_getByTitle(title));
    if(postIndex > -1) {
      allPosts.splice(postIndex, 1);
      return true;
    } else {
      return false;
    }
  };

  return {
    all: _all,
    add: _add,
    getByTitle: _getByTitle,
    deleteByTitle: _deleteByTitle,
    editByTitle: _editByTitle
  };
})();