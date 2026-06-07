export default () => ({
    port: parseInt(process.env.PORT || "3005",10),
    database: {
        type: "mysql",
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || "3306", 10),
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'Hahaha<3',
        name: process.env.DB_NAME || 'auth'
    }
})