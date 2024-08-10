import { NextApiRequest, NextApiResponse } from 'next';

import { MOCKED_TRENDINGS } from '../../../constants';
import { withCORS } from '../../../cors';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    return;
  }

  res.status(200).json(MOCKED_TRENDINGS);
};

export default withCORS(handler);
