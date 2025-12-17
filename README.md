# Stacks BTC Tracker: Chainhook-Powered Deposit Notifier

This repository contains the necessary components for a real-time, event-driven notification system for Bitcoin deposits on the Stacks network. It demonstrates the integration of a Clarity smart contract with the Chainhooks infrastructure using the `@hirosystems/chainhooks-client` library.

The system is composed of two main parts:

1.  **Clarity Smart Contract:** The contract that handles deposits and emits a structured event upon successful processing.
2.  **Chainhook Listener & Webhook Server (Node.js):** An off-chain service that listens for the emitted event and executes an arbitrary action (in this example, logging a confirmation message to a console/API endpoint).

This setup is crucial for building responsive DApps that need to react instantly to the settlement layer (Bitcoin) status as reflected on the Stacks blockchain.
