import { Sequelize } from 'sequelize';

declare const sequelize: Sequelize;
export default sequelize;

export declare const config: {
    development: {
        host: string;
        port: string;
        database: string;
        username: string;
        password: string;
    };
    test: {
        host: string;
        port: string;
        database: string;
        username: string;
        password: string;
    };
};

export declare function connectDatabase(): Promise<void>;