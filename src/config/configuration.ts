export default () => ({
  port: parseInt(process.env.PORT, 10) || 8000,
  saltRounds: parseInt(process.env.SALT_ROUNDS, 10) || 10,
  jwt: {
    secret: process.env.JWT_SECRET || 'verysecretcode123#@$%GHT',
    expiry: process.env.JWT_EXPIRY || '15d',
  },
});
