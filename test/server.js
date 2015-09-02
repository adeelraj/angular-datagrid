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
    key2: new Date,
    key3: array.length,
    key4: Math.floor(Math.random() * ((4 - 1) + 1))
  });
};

app.get('/test.json', function (request, response) {
  var limit = request.query.limit;
  var page = request.query.page;
  var mapped = [];

  if (!limit || !page) return response.status(400).json([]);

  var min = (page - 1) * limit;
  var max = min + parseInt(limit);

  array.forEach(function (item, index) {
    if (index >= min && index < max) {
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
