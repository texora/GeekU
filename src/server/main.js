'use strict';


import              '../shared/util/polyfill';
import express from 'express';
import path    from 'path';

const app = express();

// KJB TODO :
// - unsure if this is kosher
// - my index.html resources are absolute (i.e. starting with /) 
//   ... so as to  allow react-router URL serve resources correctly
//   ... ex: http://localhost:8080/route1/route2 would re-direct to index.html, 
//           but it's referenced resources (img/GeekULogo.png) would reference:
//           http://localhost:8080/route1/route2/img/GeekULogo.png ??? does this change with alt sendfile()
//           ... fix is to reference absolute resources in index.html: /img/GeekULogo.png
// - following references apply (TODO finalize this when stable):
//   * http://localhost:8080/ ................. serviced from NON-app code (like some default index.html heuristic of express.js)
//   * http://localhost:8080/api/ ............. serviced from app.get('/api') registeration
//   * http://localhost:8080/route1/route2/ ... serviced from app.get('*') registration

// serve our static assets
const rootPath = path.join(__dirname, "../../public"); // KJB: rootPath: 'public' (sidebar: main.js __dirname: 'src\server')
app.use(express.static(rootPath));
console.log(`INFO: service main.js: static resources serverd from rootPath: '${rootPath}' (sidebar: main.js __dirname: '${__dirname}')`);

// ??? very early starting point
app.get('/api', function (req, res) {
  console.log('??? KJB: API request!');
//res.sendFile(path.join(rootPath, 'index.html')); // TRY 1 ... TypeError: path must be absolute or specify root to res.sendFile
  res.sendFile('index.html', {root: rootPath});    // TRY 2 ... works with absolute resources (in index.html)
})

// send all other requests to index.html (so browserHistory in React Router works)
app.get('*', function (req, res) {
  console.log('INFO: service main.js: servicing all other requests!');
//res.sendFile(path.join(rootPath, 'index.html')); // TRY 1 ... TypeError: path must be absolute or specify root to res.sendFile
  res.sendFile('index.html', {root: rootPath});    // TRY 2 ... works with absolute resources (in index.html)

})

const PORT = process.env.PORT || 8080;
app.listen(PORT, function() {
  console.log('INFO: service main.js: Express server running at localhost:' + PORT);
});


// ??? ORIGINAL (from Part I) ??? TRASH THIS
// ? import express from 'express';
// ? import index   from './index';
// ? import page    from './page';

// ? index.js: 
// ? import t from 'transducers.js';
// ? 
// ? export default function(req, res) {
// ?   var arr = JSON.parse(req.query.arr || '[]');
// ?   res.send(t.map(arr, function(x) { return x + 1; }));
// ? };

// ? page.js
// ? export default function(req, res) {
// ?   res.send('page');
// ? };

// ? main.js
// ? var app = express();
// ? app.get('/', index);
// ? app.get('/page', page);
// ? 
// ? console.log("Listening on port 4000...");
// ? app.listen(4000);


