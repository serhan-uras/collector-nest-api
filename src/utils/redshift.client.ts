import pgp from 'pg-promise';

const connections = [];

export default class RedshiftClient {
  static async getConnection() {
    const dbName = 'collector-db';

    if (!connections[dbName]) {
      const dbUser = 'awsuser';
      const dbPassword = 'SDFwer741!';
      const dbHost =
        'redshift-cluster-1.cz84nxqwiynm.us-east-2.redshift.amazonaws.com';
      const dbPort = '5439';

      const dbc = pgp({ capSQL: true });
      console.log(`Opening connection to: ${dbName}, host is: ${dbHost}`);

      const connectionString = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
      connections[dbName] = dbc(connectionString);
    }

    return connections[dbName];
  }

  static async executeQuery(query) {
    try {
      const date1 = new Date().getTime();
      const connection = await this.getConnection();
      const result = await connection.query(query);

      const date2 = new Date().getTime();
      const durationMs = date2 - date1;
      const durationSeconds = Math.round(durationMs / 1000);
      let dataLength = 0;

      if (result && result.length) dataLength = result.length;

      console.log(
        `[Redshift] [${durationMs}ms] [${durationSeconds}s] [${dataLength.toLocaleString()} records] ${query}`,
      );

      return result;
    } catch (e) {
      console.error(`Error executing query: ${query} Error: ${e.message}`);
      throw e;
    }
  }
}
