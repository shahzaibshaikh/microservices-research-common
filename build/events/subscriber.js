"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_nats_streaming_1 = __importDefault(require("node-nats-streaming"));
var subscriber = function (clientId, topic, processEvent, queueGroup, clusterId) {
    if (clusterId === void 0) { clusterId = "microservices-research"; }
    var stan = node_nats_streaming_1.default.connect(clusterId, clientId, {
        url: "nats://nats-srv:4222" // Replace with your NATS server URL
    });
    stan.on("connect", function () {
        console.log("".concat(clientId, " connected to NATS Streaming"));
        var subscription = stan.subscribe(topic, queueGroup);
        subscription.on("message", function (msg) {
            // Process the message using the provided function
            processEvent(msg);
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
exports.default = subscriber;
