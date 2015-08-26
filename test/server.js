var express = require('express');
var path = require('path');

var app = express();

app.use('/bower_components', express.static(path.join(__dirname, '../bower_components')));
app.use(express.static(__dirname));

var array = [];
var config = {
  limit: 5,
  pagers: [5, 10, 15],
  rowsTotal: 64
};
while (array.length < config.rowsTotal) {
  array.push({
    key1: array.length,
    key2: array.length,
    key3: array.length,
    key4: array.length
  });
};

app.get('/test.json', function (request, response) {
  var limit = request.query.limit;
  var page = request.query.page;
  var mapped = [];

  array.forEach(function (item, index) {
    if (index >= (page - 1) * limit && index <= page + limit) {
      mapped.push(item);
    };
  });

  var object = {
    pagination: config,
    rows: mapped
  };

  response.status(mapped.length ? 200 : 404).json(object);
})

app.listen(8080, function () {
  console.log('Listening on http://localhost:8080');
});
