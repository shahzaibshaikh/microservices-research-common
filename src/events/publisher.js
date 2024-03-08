const { Stan } = require("node-nats-streaming");

/**
 * Create a publisher function.
 * @param {Stan} client - NATS Streaming client instance
 * @param {string} subject - The subject to which events will be published
 * @param {string} queueGroup - Optional queue group name
 * @returns {Function} - The publish function
 */
function createPublisher(client, subject, queueGroup = undefined) {
  /**
   * Publish an event.
   * @param {any} data - The data payload of the event
   * @returns {Promise<void>} - A promise that resolves when the event is published successfully
   */
  async function publish(data) {
    return new Promise((resolve, reject) => {
      // Need to convert JSON into a string before sending to NATS streaming
      client.publish(subject, JSON.stringify(data), { queue: queueGroup }, err => {
        if (err) {
          return reject(err);
        }
        // If no error occurred, resolve the promise
        console.log(`Event published to subject ${subject}`);
        resolve();
      });
    });
  }

  return publish;
}

module.exports = createPublisher;
