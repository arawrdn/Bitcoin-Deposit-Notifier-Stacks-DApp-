// src/chainhook-client.ts

import { ChainhookClient, Blockchains, Networks, StacksChainhook } from '@hirosystems/chainhooks-client';

// IMPORTANT: Replace these placeholders with actual values
const CONTRACT_ADDRESS = 'ST1PQHQKV0RJQDZGR7Y12K8SHTGYQYJPQ55N1082D.btc-tracker'; 
const CHAINHOOK_API_URL = 'http://localhost:8000'; // URL for your running Chainhook Node
const WEBHOOK_URL = 'http://host.docker.internal:3000/api/chainhook-event'; // Adjust for your environment (e.g., host.docker.internal if running in Docker)

// Define the predicate (the condition that triggers the hook)
const btcDepositPredicate: StacksChainhook = {
    chain: Blockchains.Stacks,
    network: Networks.Testnet, // Change to Networks.Mainnet for production
    name: 'btc-deposit-confirmed-hook',
    version: 1,
    // The target endpoint that receives the POST request when the event matches
    webhook: {
        url: WEBHOOK_URL,
        authorization: 'Bearer YOUR_SECRET_TOKEN', // Recommended for securing the webhook
    },
    // The specific condition to look for on the Stacks blockchain
    trigger: {
        // Listen from the block where your contract was deployed
        start_block: 100000, 
        
        // Listen for a specific transaction event
        events: [
            {
                // Target the specific contract and event tuple
                contract_id: CONTRACT_ADDRESS,
                topic: 'print', // All Clarity `print` calls are indexed under 'print' topic
                
                // Optional: You can add an optional value condition here 
                // to filter the event content if needed.
                // value: '...'
            }
        ],
    },
};

async function registerChainhook() {
    try {
        const client = new ChainhookClient(CHAINHOOK_API_URL);

        console.log(`Attempting to register Chainhook at ${CHAINHOOK_API_URL}...`);

        // Check if the hook is already registered and delete it to prevent conflicts
        try {
            await client.deleteChainhook(btcDepositPredicate.name);
            console.log(`Existing hook '${btcDepositPredicate.name}' deleted.`);
        } catch (e) {
            console.log(`No existing hook found to delete. Proceeding with registration.`);
        }

        // Register the new Chainhook
        const response = await client.registerChainhook(btcDepositPredicate);
        
        console.log('Chainhook Registration Successful!');
        console.log('Response Status:', response.status);

        // Confirmation of the registered hook definition
        console.log(`\nChainhook Name: ${btcDepositPredicate.name}`);
        console.log(`Monitoring contract: ${CONTRACT_ADDRESS}`);
        console.log(`Sending alerts to: ${WEBHOOK_URL}`);
        
    } catch (error) {
        console.error('Error during Chainhook registration:', error);
    }
}

registerChainhook();
