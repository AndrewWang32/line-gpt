module.exports = (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'LINE-GPT Bot',
    version: '1.0.0'
  });
};
