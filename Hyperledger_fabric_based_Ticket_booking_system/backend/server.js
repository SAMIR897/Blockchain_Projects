const express = require('express');
const bodyParser = require('body-parser');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const ccpPath = path.resolve(__dirname, '..', 'fabric-network', 'config', 'connection-org1.json');
// Make sure you have Fabric network connection profile here with identities already enrolled.

async function getContract() {
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    const ccp = JSON.parse(ccpJSON);

    // Change here to your wallet path
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = 'appUser'; // Change to actual user enrolled in Fabric network

    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity, discovery: { enabled: true, asLocalhost: true } });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('ticketBooking');

    return { contract, gateway };
}

// GET /events - list all events
app.get('/events', async (req, res) => {
    try {
        const { contract, gateway } = await getContract();
        const result = await contract.evaluateTransaction('queryAllEvents');
        await gateway.disconnect();
        res.json(JSON.parse(result.toString()));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /tickets/:ownerId - list booked tickets by user
app.get('/tickets/:ownerId', async (req, res) => {
    try {
        const ownerId = req.params.ownerId;
        const { contract, gateway } = await getContract();
        const result = await contract.evaluateTransaction('queryTicketsByOwner', ownerId);
        await gateway.disconnect();
        res.json(JSON.parse(result.toString()));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /book - book a ticket { eventId, seatNo, ownerId }
app.post('/book', async (req, res) => {
    try {
        const { eventId, seatNo, ownerId } = req.body;
        if (!eventId || !seatNo || !ownerId) {
            res.status(400).json({ error: 'Missing parameters' });
            return;
        }
        const { contract, gateway } = await getContract();
        const result = await contract.submitTransaction('bookTicket', eventId, seatNo.toString(), ownerId);
        await gateway.disconnect();
        res.json(JSON.parse(result.toString()));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend API server running on port ${PORT}`);
});
