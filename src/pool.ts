import {
  createPool,
  Pool,
  Options as PoolOptions,
  Factory
} from 'generic-pool'

import { connect as amqpConnect, Options as AmqpOptions, Connection } from "amqplib"


class ConnectionPool {

  name: string;
  poolOptions: PoolOptions;
  url: string | AmqpOptions.Connect;
  pool: Pool<Connection>;

  constructor({ name, url, poolOptions }: { name?: string, url: string | AmqpOptions.Connect, poolOptions: PoolOptions }) {

    this.name = name || "some name";
    this.poolOptions = poolOptions;
    this.url = url;

    // Pool factory
    const factory: Factory<any> = {
      create: (): Promise<Connection> => {
        return amqpConnect(url)
      },

      destroy: (connection: Connection): Promise<void> => {
        return connection.close()
      },
    }

    this.pool = createPool(factory, this.poolOptions)
  }

  // get a connection
  async getConnection(): Promise<Connection> {
    return await this.pool.acquire(1)
  }


  /**
 * Release a connection to the pool.
 * @async
 * @param connection - connection
 * @returns void
 */
  async release(connection: Connection): Promise<void> {
    await this.pool.release(connection)
  }

  /**
 * Destroy a connection.
 * @async
 * @param connection - connection
 * @returns void
 */
  async destroy(connection: Connection): Promise<void> {
    await this.pool.destroy(connection)
  }

  /**
 * Drains the connection pool and call the callback id provided.
 * @async
 * @returns Promise
 */
  async drain(): Promise<void> {
    await this.pool.drain()
    await this.pool.clear()
  }


  /**
 * Returns pool status and stats
 *
 * @returns pool status and stats
 */
  status(): any {
    return {
      name: this.name,
      size: this.pool.size,
      available: this.pool.available,
      pending: this.pool.pending
    }
  }
}


export default ConnectionPool
