export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, rating, message } = req.body || {};

  if (!name) {
    return res.status(400).json({
      message: 'Name is required'
    });
  }

  if (rating === undefined || rating === null || rating === '' || Number(rating) === 0) {
    return res.status(400).json({
      message: 'Rating is required'
    });
  }

  const numericRating = Number(rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({
      message: 'Rating is required'
    });
  }

  if (!message) {
    return res.status(400).json({
      message: 'Message is required'
    });
  }

  const doc = {
    _type: 'review',
    name,
    rating: numericRating,
    message,
    status: 'approved'
  };

  const response = await fetch(
    `https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/v2023-10-01/data/mutate/${process.env.SANITY_DATASET}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SANITY_TOKEN}`
      },
      body: JSON.stringify({
        mutations: [{ create: doc }]
      })
    }
  );

  if (!response.ok) {
    return res.status(500).json({ message: 'Failed to submit review' });
  }

  return res.status(200).json({ message: 'Review submitted for approval' });
}
