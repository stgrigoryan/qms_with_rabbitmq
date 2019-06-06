const queue = 'tasks';

const open = require('amqplib').connect('amqp://localhost');

open
  .then(function(conn) {
    return conn.createChannel();
  })
  .then(function(ch) {
    return ch
      .assertQueue(queue, {
        durable: true
      })
      .then(function(ok) {
        for (let i = 1; i <= 5e5; i++) {
          setTimeout(() => {
            ch.sendToQueue(queue, Buffer.from(`mailTo${i}`), {
              persistent: true
            });
            setTimeout(() => {
              ch.sendToQueue(queue, Buffer.from(`mailTo${i}`), {
                persistent: true
              });
            }, 5000);
          }, 5000);
        }
      });
  })
  .catch(err => console.log(err));
  
