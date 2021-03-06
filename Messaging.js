//import config from './RabbitMqConfig';
//import amqp from 'amqplib/callback_api';
const amqp = require('amqplib/callback_api')
const { getUserEmail, mailSender } = require('./UserProvider');

var amqpConn = null;

function start()
{
  amqp.connect('amqps://jjixgyfe:KI1ImGKoJZs0NNByfOHEJGnV3UbyI339@rat.rmq2.cloudamqp.com/jjixgyfe', function(err, conn) 
  {
    if (err) 
    {
      console.error("[AMQP]", err.message);
    }

    conn.on("error", function(err) {
      if (err.message !== "Connection closing") 
      {
        console.error("[AMQP] conn error", err.message);
      }
    });

    conn.on("close", function() {
      console.error("[AMQP] reconnecting");
      return setTimeout(start, 1000);
    });

    console.log("[AMQP] connected");
    amqpConn = conn;
    whenConnected();
  });
}

function whenConnected() 
{
  startWorker();
}

function startWorker()
{
  amqpConn.createChannel(function(err, ch) 
  {
   if (closeOnErr(err)) return;
   
   ch.on("error", function(err) {
    console.error("[AMQP] channel error", err.message);
   });

   ch.on("close", function() {
     console.log("[AMQP] channel closed");
   });

   //ch.assertExchange('', 'direct');

   ch.prefetch(10);
   ch.assertQueue("notification", { durable: true }, function(err, _ok) 
   {
     if (closeOnErr(err)) return;
     //ch.bindQueue(_ok.queue, 'deal', 'notification');
     ch.consume("notification", processMsg, { noAck: false });
     console.log("Worker is started");
   });

   function processMsg(msg) 
   {
     work(msg, function(ok) 
     {
       try 
       {
         if (ok)
           ch.ack(msg);
         else
           ch.reject(msg, true);
       } 
       catch (e) 
       {
         closeOnErr(e);
       }
     });
   }
 });
}

function closeOnErr(err) 
{
  if (!err) return false;
  console.error("[AMQP] error", err);
  amqpConn.close();
  return true;
}

function work(msg, cb) 
{
  let listUser = new Array();
  let subject = '';
  let content = '';

  msg = JSON.parse(msg.content);
  console.log("Got msg ", msg);
  msg.users.forEach((element) => {
    listUser.push(element);
  });
  subject = msg.subject;
  content = msg.content;

  listUser.forEach(async (element) => 
  {
    //console.log(element.lastName, element.firstName, subject, content);
    try {
      let email = await getUserEmail(element.lastName, element.firstName);
      mailSender(email, subject, content);
    } 
    catch (error) 
    {
      console.log(error);
    }
  });

  cb(true);
}

// let msg = {
//   content: "A new deal has been initialized with deal's code: 081e910d-f43c-4fc0-9710-435dc154070b",
//   subject: 'A new deal has been initialized',
//   users: [
//     { firstName: 'Astrid', lastName: 'Passot', role: 'DEALER' },
//     { firstName: 'Said', lastName: 'Kabene', role: 'DEALER' }
//   ]
// };
//work(msg, null);

module.exports = { 
  start
};
