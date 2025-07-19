const config = {
  origin: [
    /^https?:\/\/(localhost|127.0.0.1|10.0.2.2)(:\d{0,4})?$/,
    /^https?:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d{1,5})?$/,
  ],
  credentials: true,
  allowedHeaders: ['content-type', 'authorization', 'origin'],
};

export default config;
