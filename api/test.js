// api/test.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Serverless API is working!' });
}