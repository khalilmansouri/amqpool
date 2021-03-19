import { expect } from "chai"
import ConnectionPool from "./pool"



describe("One connection", () => {
  it("Should return a connection 1 instance", async () => {
    let max = 3
    let min = 1
    let connectionPool = new ConnectionPool({ name: "rabbitPool", url: "amqp://127.0.0.1", poolOptions: { max, min } })

    let con = await connectionPool.getConnection()

    expect(connectionPool.status().size).to.equal(1)
    expect(connectionPool.status().available).to.equal(0)
    expect(connectionPool.status().name).to.equal("rabbitPool")
    expect(connectionPool.status().pending).to.equal(0)

    await con.close()
  })
})

describe("Multipe connection", () => {
  it("Should return a multiple connection instance", async () => {
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


describe("Channels", () => {
  it("Should create a channnel per connection", async () => {
    let max = 2
    let min = 1
    let channnel = "pipe"
    let connectionPool = new ConnectionPool({ name: "rabbitPool", url: "amqp://127.0.0.1", poolOptions: { max, min } })

    let sender = await connectionPool.getConnection()
    let receiver = await connectionPool.getConnection()

    let rch = await receiver.createChannel()
    await rch.assertQueue(channnel)
    rch.consume(channnel, (msg) => {
      console.log(msg?.content.toString())
    })

    let sch = await sender.createChannel()
    await sch.assertQueue(channnel)
    await sch.sendToQueue(channnel, Buffer.from("What's up slupper's"))

  })
})