import { expect } from "chai"
import ConnectionPool from "./pool"


describe("Get connection from pool", () => {
  it("Should return a connection instance", async () => {
    let max = 3
    let min = 1
    let connectionPool = new ConnectionPool({ name: "rabbitPool", url: "amqp://127.0.0.1", poolOptions: { max, min } })

    let con1 = await connectionPool.getConnection()
    let con2 = await connectionPool.getConnection()
    let con3 = await connectionPool.getConnection()

    expect(connectionPool.status().size).to.equal(3)
    expect(connectionPool.status().available).to.equal(0)

    await connectionPool.release(con1)
    expect(connectionPool.status().available).to.equal(1)

    await con1.close()
    await con2.close()
    await con3.close()
  })
})