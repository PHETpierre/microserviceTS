//import config from './RabbitMqConfig';
import amqp from 'amqplib/callback_api';
const { getUserEmail, mailSender } = require('./UserProvider');

var amqpConn:any = null;

function start(){
  amqp.connect('amqps://jjixgyfe:KI1ImGKoJZs0NNByfOHEJGnV3UbyI339@rat.rmq2.cloudamqp.com/jjixgyfe', function(err:any, conn:any) {
    if (err) {
      console.error("[AMQP]", err.message);
    }
    conn.on("error", function(err:any) {
      if (err.message !== "Connection closing") {
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

function whenConnected() {
  startWorker();
}

function startWorker(){
  amqpConn.createChannel(function(err:any, ch:any) {
   if (closeOnErr(err)) return;
   ch.on("error", function(err:any) {
     console.error("[AMQP] channel error", err.message);
   });

   ch.on("close", function() {
     console.log("[AMQP] channel closed");
   });

   ch.prefetch(10);
   ch.assertQueue("notification", { durable: true }, function(err:any, _ok:any) {
     if (closeOnErr(err)) return;
     //ch.bindQueue(_ok.queue, 'deal', 'notification');
     ch.consume("notification", processMsg, { noAck: false });
     console.log("Worker is started");
   });

   function processMsg(msg:any) {
     work(msg, function(ok:any) {
       try {
         if (ok)
           ch.ack(msg);
         else
           ch.reject(msg, true);
       } catch (e) {
         closeOnErr(e);
       }
     });
   }
 });
}

function closeOnErr(err:any) {
  if (!err) return false;
  console.error("[AMQP] error", err);
  amqpConn.close();
  return true;
}

let listUser = new Array();
const work = function work(msg:any, cb:any) {
  console.log("Got msg ", msg.content);
  msg = JSON.parse(msg.content);
  msg.dealStakeholders.forEach((element:any) => {
    listUser.push(element);
  });
  console.log("Got msg ", msg);
  cb(true);
}

function getFullName(user:any){
  return user.firstName+'.'+user.lastName
}

start();

// let msg:string = '{"zone":"ASIA","dealCreator":{"firstName":"Quan","lastName":"Nguyen","role":"SENDER"},"dealStakeholders":[{"firstName":"Astrid","lastName":"Passot","role":"DEALER"},{"firstName":"Said","lastName":"Kabene","role":"DEALER"}],"code":"LHAJEZJEHZJ","name":"test","amount":200000.0,"currency":"USD"}';
// work(msg, null);
//
// listUser.forEach(async (element:any) => {
//   try {
//     let email:string = await getUserEmail(element.lastName, element.firstName);
//     mailSender(email, '', '');
//   } catch (error) {
//     console.log(error);
//   }
// });
export default { work, start };
