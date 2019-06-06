const cluster = require('cluster');
const os = require('os');

const Email = require('./db').Email;

const queue = 'tasks';

const open = require('amqplib').connect('amqp://localhost');

open
  .then(conn => {
    return conn.createChannel();
  })
  .then(ch => {
    return ch
      .assertQueue(queue, {
        durable: true
      })
      .then(ok => {
        if (cluster.isMaster) {
          const cpus = os.cpus().length;
          for (let i = 0; i < cpus; i++) {
            cluster.fork();
          }
        } else {
          ch.prefetch(1000);
          return ch.consume(
            queue,
            msg => {
              const email = new Email();
              if (msg) {
                ch.ack(msg);
                email.deliveryStatus = 'sent';
                email
                  .save()
                  .then(() => {
                    console.log(`Email saved with status sent`);
                  })
                  .catch(err => console.log(err));
              } else {
                email.deliveryStatus = 'notSent';
                email.save().then(() => {
                  console.log(`Email saved with status notSent`);
                });
              }
            },
            { noAck: false }
          );
        }
      });
  })
  .catch(err => console.log(err));
