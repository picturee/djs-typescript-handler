declare global {
    namespace NodeJS {
        interface ProcessEnv {
            token: string;
            environment: 'dev' | 'prod' | 'debug';
        }
    }
}

export {};