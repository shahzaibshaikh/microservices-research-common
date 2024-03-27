import nats, { Stan, Message } from "node-nats-streaming";

const subscriber = (
  clientId: string,
  topic: string,
  processEvent: (msg: Message) => void,
  queueGroup?: string,
  clusterId: string = "microservices-research"
): void => {
  const stan: Stan = nats.connect(clusterId, clientId, {
    url: "nats://nats-srv:4222" // Replace with your NATS server URL
  });

  stan.on("connect", () => {
    console.log(`${clientId} connected to NATS Streaming`);

    let subscription;
    if (queueGroup) {
      subscription = stan.subscribe(topic, queueGroup);
    } else {
      subscription = stan.subscribe(topic);
    }

    subscription.on("message", (msg: Message) => {
      // Process the message using the provided function
      processEvent(msg);
    });
  });

  // Handle error events
  stan.on("error", err => {
    console.error(`${clientId} encountered an error:`, err);
  });

  // Handle close events
  stan.on("close", () => {
    console.log(`${clientId} connection closed`);
  });
};

export default subscriber;
