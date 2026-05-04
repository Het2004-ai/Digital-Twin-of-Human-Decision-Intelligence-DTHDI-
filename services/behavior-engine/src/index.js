const express = require('express');
const brain = require('brain.js');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Step 4: LSTM Model Configuration
// Brain.js LSTM is great for sequential pattern recognition in user behavior
const net = new brain.recurrent.LSTMTimeStep({
  inputSize: 4,  // [type_idx, x_norm, y_norm, dwell_time]
  hiddenLayers: [20, 20],
  outputSize: 4
});

// Mock Training Data (Representing common user patterns)
// Sequence: [type, x, y, dwell]
const trainingData = [
  [
    [0, 0.1, 0.1, 100], [1, 0.2, 0.2, 200], [0, 0.5, 0.5, 500]
  ],
  [
    [1, 0.9, 0.9, 50], [1, 0.8, 0.8, 100], [2, 0.1, 0.1, 50]
  ]
];

console.log('[Behavior Engine] Training LSTM Model...');
// net.train(trainingData, { iterations: 100, log: true });

app.post('/predict', (req, res) => {
  const { sequence } = req.body; // Array of [type, x, y, dwell]
  
  try {
    // Generate Prediction
    const nextAction = net.run(sequence);
    
    // Generate Behavioral Fingerprint (Mocking the hidden state)
    const fingerprint = nextAction.map(v => Math.tanh(v)); 

    res.json({
      sessionId: req.body.sessionId,
      fingerprint: fingerprint,
      nextAction: {
        typeIdx: Math.round(nextAction[0]),
        confidence: Math.min(Math.max(nextAction[3] / 1000, 0.1), 0.99)
      },
      intent: nextAction[0] > 0.5 ? 'PURCHASE' : 'EXPLORE'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`🧠 DTHDI Behavior Engine (Node.js) running on port ${PORT}`);
});
