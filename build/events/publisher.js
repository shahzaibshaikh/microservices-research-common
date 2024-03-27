"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_nats_streaming_1 = __importDefault(require("node-nats-streaming"));
var publisher = function (clientId, topic, eventData, clusterId) {
    if (clusterId === void 0) { clusterId = "microservices-research"; }
    var stan = node_nats_streaming_1.default.connect(clusterId, clientId, {
        url: "nats://nats-srv:4222"
    });
    stan.on("connect", function () {
        console.log("".concat(clientId, " connected to NATS Streaming"));
        // Publish event
        stan.publish(topic, JSON.stringify(eventData), function () {
            console.log("Event Published!");
            // Close the connection after publishing the event
            stan.close();
        });
    });
    // Handle error events
    stan.on("error", function (err) {
        console.error("".concat(clientId, " encountered an error:"), err);
    });
    // Handle close events
    stan.on("close", function () {
        console.log("".concat(clientId, " connection closed"));
    });
};
exports.default = publisher;
