'use strict';

module.exports = function(app) {
	var bookList = require('../controllers/bookListController'),
	userHandlers = require('../controllers/userController.js');

	// bookList Routes
	app.route('/books')
		.get(bookList.list_all_books)
		.post(userHandlers.loginRequired, bookList.create_a_book);

	app.route('/books/:bookId')
		.get(bookList.read_a_book)
		.put(userHandlers.loginRequired, bookList.update_a_book)
		.delete(userHandlers.loginRequired, bookList.delete_a_book);

	app.route('/auth/users')
		.get(userHandlers.list_all_users);

	app.route('/auth/register')
		.post(userHandlers.register);

	app.route('/auth/sign_in')
		.post(userHandlers.sign_in);
};
