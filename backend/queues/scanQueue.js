import { Queue } from 'bullmq';

let scanQueue;

const getScanQueue = () => {
  if (!scanQueue) {
    scanQueue = new Queue('scanQueue', {
      connection: {
        host: '127.0.0.1', 
        port: 6379         
      }
    });
  }
  return scanQueue;
};

const addScanJob = async (uploadId, filePath) => {
  const queue = getScanQueue();
  await queue.add('scan', { uploadId, filePath }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 3000 }
  });
  console.log(`Scan job added for uploadId: ${uploadId}`);
};

export { getScanQueue, addScanJob };
