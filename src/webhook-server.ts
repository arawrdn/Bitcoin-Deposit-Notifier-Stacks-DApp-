// src/webhook-server.ts

import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// The webhook endpoint configured in the Chainhook client
app.post('/api/chainhook-event', (req, res) => {
    console.log('--- Chainhook Event Received ---');
    
    const eventData = req.body;

    // The event payload is an array of chainhook matches
    if (eventData && Array.isArray(eventData.chainhook_matches) && eventData.chainhook_matches.length > 0) {
        
        // Extracting the relevant event details from the first match
        const match = eventData.chainhook_matches[0];
        
        if (match.stacks_events && match.stacks_events.length > 0) {
            const stacksEvent = match.stacks_events[0];
            
            console.log(`Event ID: ${stacksEvent.tx_id}`);
            console.log(`Contract: ${stacksEvent.contract_id}`);
            console.log(`Data Type: ${stacksEvent.type}`);
            
            // The hex data contains the structured Clarity tuple event
            // In a real application, you would decode this hex payload
            console.log(`Raw Payload (Hex): ${stacksEvent.data}`);

            // Example of a decoded log message (assuming simple decoding logic)
            console.log('*** DEPOSIT CONFIRMED FOR USER ***');
            
        } else {
            console.log('No Stacks events found in the payload.');
        }
    } else {
        console.log('Received payload without chainhook matches.', eventData);
    }
    
    // Respond quickly to the Chainhook server to prevent timeouts
    res.status(200).send('Event received and processed.');
});

app.listen(PORT, () => {
    console.log(`Webhook server listening on http://localhost:${PORT}`);
    console.log(`Waiting for Chainhook events on /api/chainhook-event...`);
});
