import { NextApiRequest, NextApiResponse } from 'next';

import { MOCKED_QUESTION_DETAILS } from '../../../../constants';
import { withCORS } from '../../../../cors';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    return;
  }

  const questionId = req.query.id as string;
  if (typeof questionId !== 'string') {
    res.status(400).json({ error: 'Invalid Query Type' });
    return;
  }
  res
    .status(200)
    .json(MOCKED_QUESTION_DETAILS.find((v) => v.id === questionId) || null);
};

export default withCORS(handler);
