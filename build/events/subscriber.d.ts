import { Message } from "node-nats-streaming";
declare const subscriber: (clientId: string, topic: string, processEvent: (msg: Message) => void, queueGroup?: string, clusterId?: string) => void;
export default subscriber;
