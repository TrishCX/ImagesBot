require("dotenv").config();
import { ExtendedClient } from "./structures/Client";
import http from "http";

export const client = new ExtendedClient();

client.start();

http
  .createServer(function (req, res) {
    res.write("Alive");
    res.end();
  })
  .listen(3000);

process.on("unhandledRejection", (reason, p) => {
  console.log(" [antiCrash] :: Unhandled Rejection/Catch");
  // console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
  console.log(" [antiCrash] :: Uncaught Exception/Catch");
  // console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
  // console.log(err, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
  console.log(" [antiCrash] :: Multiple Resolves");
  // console.log(type, promise, reason);
});
