import 'dotenv/config';
declare const config: {
    development: {
        username: string | undefined;
        password: string | undefined;
        database: string | undefined;
        host: string | undefined;
        port: number;
        dialect: "postgres";
    };
    test: {
        username: string | undefined;
        password: string | undefined;
        database: string | undefined;
        host: string | undefined;
        port: number;
        dialect: "postgres";
    };
    production: {
        username: string | undefined;
        password: string | undefined;
        database: string | undefined;
        host: string | undefined;
        port: number;
        dialect: "postgres";
    };
};
export default config;
//# sourceMappingURL=sequelize.config.d.ts.map