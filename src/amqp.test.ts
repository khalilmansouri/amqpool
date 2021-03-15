import { expect } from "chai"
import { connect } from "./amqp"

let connection: any;

before(async () => {
  connection = await connect("amqp://127.0.0.1");
  console.log("Conneced to AMQP")
});

after(async () => {
  connection.close()
});

describe("Check test", () => {
  it("Should make test", () => {
    const result = 1
    expect(result).to.equal(1)
  })
})