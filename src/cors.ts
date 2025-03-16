const config = {
  origin: [/^https?:\/\/(localhost|127.0.0.1|10.0.2.2)(:\d{0,4})?$/],
  credentials: true,
  allowedHeaders: ['content-type', 'authorization', 'origin'],
};

export default config;
