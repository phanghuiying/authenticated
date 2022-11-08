import knex, { Knex } from 'knex';

var instance: Knex | null = null;

const getInstance = async (): Promise<Knex> => {
    if (instance === null) {
        instance = knex({
            client: 'mysql2',
            connection: {
                host: '18.141.230.17',
                port: 3006,
                user: 'authenticated',
                password: 'rXscpJPUyxC3xXKVE5',
                database: 'authenticated'
            }
        })

        // ping database to confirm connection
        await instance.raw('select 1+1 as result').catch(err => {
            console.log(err);
            process.exit(1);
        });
    }

    return instance
}

export default getInstance
