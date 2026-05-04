const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/simulate', (req, res) => {
  const { layout, userPersona } = req.body;
  
  // Step 7: Monte Carlo Simulation logic in Node.js
  const simulatedActions = layout.map(element => {
    const bias = userPersona === 'impulsive' ? 1.5 : 1.0;
    const probability = (element.visualSalience * bias) / 2.0;
    
    return {
        elementId: element.id,
        probability: Math.min(probability, 1.0),
        predictedDwell: Math.random() * (userPersona === 'impulsive' ? 500 : 2000)
    };
  });

  res.json({
    persona: userPersona,
    prediction: simulatedActions.sort((a, b) => b.probability - a.probability)[0],
    fullPath: simulatedActions
  });
});

const PORT = 8001;
app.listen(PORT, () => {
  console.log(`🧪 DTHDI Simulation Engine (Node.js) running on port ${PORT}`);
});
