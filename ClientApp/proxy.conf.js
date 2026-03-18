const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:29544';

const PROXY_CONFIG = [
  {
    context: [
      "/api/user/signup",
      "/api/user/signin",

      "/api/invoice/get/",
      "/api/invoice/add",
      "/api/invoice/all",
      "/api/invoice/delete/",
      "/api/invoice/update",

      "/api/customer/get/",
      "/api/customer/add",
      "/api/customer/all",
      "/api/customer/delete/",
      "/api/customer/update",
   ],
    proxyTimeout: 10000,
    target: target,
    secure: false,
    headers: {
      Connection: 'Keep-Alive'
    }
  }
]

module.exports = PROXY_CONFIG;
