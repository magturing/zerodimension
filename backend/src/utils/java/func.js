import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const javaClassDir = path.join(__dirname, '../../../java');

const callJavaAdd = (req, res, next) => {
  const { x, y } = req.body;

  if (x == null || y == null) {
    return res.status(400).json({ success: false, message: 'Missing parameters' });
  }


  exec(`java -cp ${javaClassDir} Add ${x} ${y}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ success: false, message: stderr || error.message });
    }

    const result = Number(stdout.trim());

    res.status(200).json({
      success: true,
      msg:`Multiplication of entered number is ${result}`,
    });
  });
};


export {
    callJavaAdd
}