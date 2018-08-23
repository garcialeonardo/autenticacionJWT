'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
  nombre: {
    type: String,
    Required: 'El nombre del libro es requerido'
  },
  fecha_publicacion: {
    type: Date,
    default: Date.now
  },
  stock: {
    type: Number,
    default: 0
  }
});


module.exports = mongoose.model('Books', BookSchema);