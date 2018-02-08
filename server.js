require('dotenv').config()

const http = require('http');
const httpProxy = require('http-proxy');

var pool;
if(process.argv.length > 2) {
  pool = process.argv[2].split(',');
} else if (process.env.POOL) {
  pool = process.env.POOL.split(',');
} else {
  console.error('### No pool supplied, please pass environment var (POOL) or arguments');
  console.error('### Pool should be a comma separated list (no spaces) of host:port pairs');
  process.exit(1);
}

var proxy = httpProxy.createProxyServer({autoRewrite: true, changeOrigin: true, protocolRewrite: false});
 
var i = -1;
var server = http.createServer(function(req, res) {
  i = (i + 1) % pool.length;
  let host = pool[i].split(':')[0];
  let port = pool[i].split(':')[1];
  let targ = `http://${host}:${port}`;
  console.log(`### Proxy request to ${targ}`);

  proxy.web(req, res, { target: targ });
});

let port = process.env.PORT || 8080;
console.log(`### Proxy staring on ${port}, with pool; ${pool}`);
server.listen(port);