import { Channel, Connection, connect as amqpConnect, Options } from "amqplib"


export const connect = (url: string | Options.Connect, socketOptions?: any) => {
  return amqpConnect(url, socketOptions)
}