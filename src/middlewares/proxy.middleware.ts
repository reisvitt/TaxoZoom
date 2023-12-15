import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  use(req, res, next) {
    const itisProxy = createProxyMiddleware({
      target: 'https://www.itis.gov/ITISWebService/jsonservice', // URL do Web Service do ITIS
      changeOrigin: true,
      pathRewrite: {
        '^/itis': '', // Remova o prefixo '/itis' na requisição
      },
    });

    console.log('req teste');

    itisProxy(req, res, next);
  }
}
