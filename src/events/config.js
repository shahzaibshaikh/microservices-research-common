const { Kafka } = require('kafkajs');

const RETRY_ATTEMPTS = 3; // Consider moving this to a config file
const RETRY_DELAY = 1000; // Consider moving this to a config file

class KafkaConfig {
  constructor() {
    this.kafka = new Kafka({
      clientId: 'research-bookstore',
      brokers: ['kafka-service:9092'],
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'test-group' });
  }

  async produce(topic, messages) {
    let attempts = 0;
    while (attempts < RETRY_ATTEMPTS) {
      try {
        await this.producer.connect();
        await this.producer.send({
          topic,
          messages,
        });
        console.log(`Message sent to topic: ${topic}`);
        return; // Exit loop on successful send
      } catch (error) {
        attempts++;
        console.warn(`Retrying message sending (attempt ${attempts}/${RETRY_ATTEMPTS})`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      } finally {
        await this.producer.disconnect();
      }
    }
    console.error('Failed to send message after retries');
  }

  async consume(topic, callback) {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic, fromBeginning: true });
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = message.value.toString();
          callback(value);
        },
      });
    } catch (error) {
      console.error('Error consuming message:', error);
    } finally {
      await this.consumer.disconnect();
    }
  }
}

module.exports = KafkaConfig;