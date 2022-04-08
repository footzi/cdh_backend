// todo почему тут функция?
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  useCors: !!process.env.USE_CORS,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  database: {
    type: 'postgres',
    synchronize: true,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  mail: {
    transport: {
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    },
    from: process.env.MAIL_FROM,
    admin: process.env.MAIL_ADMIN,
  },
});
