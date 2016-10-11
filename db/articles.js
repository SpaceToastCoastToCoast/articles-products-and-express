module.exports = (function(){

  let allPosts = [];

  function _all() {
    return allPosts;
  }

  function _add(post) {
    if(post.body === undefined) {
      return false;
    }
    allPosts.push(post);
    return true;
  }

  function _getByTitle(title) {
    let [foundPost] = allPosts.filter((post) => {
      return post.title === title;
    });
    return foundPost;
  }

  function _editByTitle(title, changedData) {
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
  }

  function _deleteByTitle(title) {
    let postIndex = allPosts.indexOf(_getByTitle(title));
    if(postIndex > -1) {
      allPosts.splice(postIndex, 1);
      return true;
    } else {
      return false;
    }
  }

  return {
    all: _all,
    add: _add,
    getByTitle: _getByTitle,
    deleteByTitle: _deleteByTitle,
    editByTitle: _editByTitle
  };
})();