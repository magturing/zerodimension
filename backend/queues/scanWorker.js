// scanWorker.js
import { Worker } from 'bullmq';
import fs from 'fs';
import { Upload } from '../src/models/users/upload.model.js';

function extractCodeSnippet(filePath, line, context = 2) {
  try {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    const start = Math.max(0, line - context - 1);
    const end = Math.min(lines.length, line + context);
    return lines.slice(start, end).join('\n');
  } catch (err) {
    return 'Could not retrieve code snippet';
  }
}

function fakeScan(filePath) {
  return [
    {
      name: 'SQL Injection',
      description: 'Unsanitized input used in SQL query, allowing attackers to modify database queries.',
      file: filePath,
      line: 45,
      severity: 'HIGH',
      codeSnippet: extractCodeSnippet(filePath, 45),
      remediation: 'Use parameterized queries or ORM to avoid direct SQL string concatenation.'
    },
    {
      name: 'Cross-Site Scripting (XSS)',
      description: 'Unescaped user input rendered directly in HTML, allowing script injection.',
      file: filePath,
      line: 88,
      severity: 'MEDIUM',
      codeSnippet: extractCodeSnippet(filePath, 88),
      remediation: 'Use output encoding libraries or frameworks to escape HTML.'
    }
  ];
}

const startScanWorker = () => {
  console.log('[Worker] Scan worker starting...');

  const worker = new Worker(
    'scanQueue',
    async (job) => {
      const { uploadId, filePath } = job.data;
      console.log(`[Worker] Processing job ${job.id} for uploadId: ${uploadId}`);

      try {
        await new Promise((resolve) => setTimeout(resolve, 2000)); 

        const vulnerabilities = fakeScan(filePath);

        const scanSummary = vulnerabilities.length > 0
          ? `${vulnerabilities.length} vulnerabilities found.`
          : `No threats found.`;

        await Upload.findOneAndUpdate(
          { uploadId },
          {
            scanStatus: 'COMPLETED',
            scanSummary,
            scanResults: { vulnerabilities },
            scanCompletedAt: new Date()
          },
          { new: true }
        );

        console.log(`[Worker] Scan completed for uploadId: ${uploadId}`);
        return { success: true, summary: scanSummary, vulnerabilities };
      } catch (err) {
        console.error(`[Worker] Scan failed for uploadId: ${uploadId}`, err);

        await Upload.findOneAndUpdate(
          { uploadId },
          {
            scanStatus: 'FAILED',
            errorLog: err.message
          }
        );

        throw err;
      }
    },
    {
      connection: {
        host: '127.0.0.1',
        port: 6379
      }
    }
  );

  worker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job.id} failed:`, err.message);
  });
};

export { startScanWorker };
