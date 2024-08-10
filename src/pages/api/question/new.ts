import { NextApiRequest, NextApiResponse } from 'next';

import { answerQuestion } from '@/ai/answer';
import { withCORS } from '@/cors';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    return;
  }

  const question = req.body.query as string;
  if (typeof question !== 'string') {
    res.status(400).json({ error: 'Invalid Query Type' });
    return;
  }
  const answer = await answerQuestion(question);
  res.status(200).json(answer);
};

export default withCORS(handler);
