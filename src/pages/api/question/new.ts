import { NextApiRequest, NextApiResponse } from 'next';

import { MOCKED_QUESTION_DETAILS } from '../../../constants';
import { withCORS } from '../../../cors';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    return;
  }

  const { query } = req.body;
  if (typeof query !== 'string') {
    res.status(400).json({ error: 'Invalid Query Type' });
    return;
  }
  res.status(200).json(MOCKED_QUESTION_DETAILS[0]);
};

export default withCORS(handler);
