require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const notesRoutes = require('./routes/notes');

// Initialize DynamoDB client with v3 SDK
const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-west-2'
});

// Create the DynamoDB Document client
const dynamoDB = DynamoDBDocumentClient.from(client, {
    marshallOptions: {
        removeUndefinedValues: true,
    }
});

const app = express();
const port = process.env.PORT || 3001;

// Make dynamoDB client available to routes
app.locals.dynamoDB = dynamoDB;

app.use(cors());
app.use(express.json());

app.use('/notes', notesRoutes);
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});