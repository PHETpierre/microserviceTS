// spring:
//   rabbitmq:
//     password: KI1ImGKoJZs0NNByfOHEJGnV3UbyI339
//     username: jjixgyfe
//     addresses: amqps://jjixgyfe:KI1ImGKoJZs0NNByfOHEJGnV3UbyI339@rat.rmq2.cloudamqp.com/jjixgyfe
//     virtual-host: jjixgyfe

let config: any = {
    connection: {
        user: 'jjixgyfe',
        pass: 'KI1ImGKoJZs0NNByfOHEJGnV3UbyI339',
        host: 'amqps://jjixgyfe:KI1ImGKoJZs0NNByfOHEJGnV3UbyI339@rat.rmq2.cloudamqp.com/jjixgyfe',
        timeout: 2000,
        name: "rabbitmq"
    },
    // exchanges: [
    //     {name: "work.tasks.exchange", type: "topic", options: {publishTimeout: 1000, persistent: true, durable: false}},
    //     {name: "work.reply.exchange", type: "topic", options: {publishTimeout: 1000, persistent: true, durable: false}}
    // ],
    // queues: [
    //     {name: "work.tasks.queue", options: {limit: 1000, queueLimit: 1000}},
    //     {name: "work.reply.queue", options: {limit: 1000, queueLimit: 1000}}
    // ],
    // binding: [
    //     {exchange: "work.tasks.exchange", target: "work.tasks.queue", keys: "somekey.#"},
    //     {exchange: "work.reply.exchange", target: "work.reply.queue", keys: "otherkey.#"}
    // ],
    logging: {
        adapters: {
            stdOut: {
                level: 3,
                bailIfDebug: true
            }
        }
    }
};

export default config;
