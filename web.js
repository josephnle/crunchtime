var express = require('express');
var app = express();

app.use(express.static('www'));

app.listen(process.env.PORT || 5000);

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});