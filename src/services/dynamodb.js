const { dynamoDB } = require('../config/aws');
const { 
    PutCommand, 
    QueryCommand, 
    DeleteCommand 
} = require('@aws-sdk/lib-dynamodb');

class NotesService {
    constructor() {
        this.tableName = process.env.TABLE_NAME;
    }

    async getNoteByDate(userId, date) {
        const params = {
            TableName: this.tableName,
            IndexName: 'userId-date-index',
            KeyConditionExpression: 'userId = :uid AND #date = :date',
            ExpressionAttributeNames: {
                '#date': 'date'
            },
            ExpressionAttributeValues: {
                ':uid': userId,
                ':date': date
            }
        };

        try {
            const result = await dynamoDB.send(new QueryCommand(params));
            return result.Items[0];
        } catch (error) {
            console.error('DynamoDB error:', error);
            throw error;
        }
    }

    async getNotesByRank(userId, dayRank) {
        const params = {
            TableName: this.tableName,
            IndexName: 'UserRankIndex',
            KeyConditionExpression: 'userId = :uid AND dayRank = :rank',
            ExpressionAttributeValues: {
                ':uid': userId,
                ':rank': dayRank
            }
        };

        try {
            const result = await dynamoDB.send(new QueryCommand(params));
            return result.Items;
        } catch (error) {
            console.error('DynamoDB error:', error);
            throw error;
        }
    }

    async getAllUserNotes(userId) {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: 'userId = :uid',
            ExpressionAttributeValues: {
                ':uid': userId
            }
        };

        try {
            const result = await dynamoDB.send(new QueryCommand(params));
            return result.Items;
        } catch (error) {
            console.error('DynamoDB error:', error);
            throw error;
        }
    }

    async saveNote(userId, date, dayRank, notes) {
        const params = {
            TableName: this.tableName,
            Item: {
                userId,
                date,
                dayRank,
                notes,
                updatedAt: new Date().toISOString()
            }
        };

        try {
            await dynamoDB.send(new PutCommand(params));
            return params.Item;
        } catch (error) {
            console.error('DynamoDB error:', error);
            throw error;
        }
    }

    async deleteNote(userId, date) {
        const params = {
            TableName: this.tableName,
            Key: {
                userId,
                date
            }
        };

        try {
            await dynamoDB.send(new DeleteCommand(params));
            return true;
        } catch (error) {
            console.error('DynamoDB error:', error);
            throw error;
        }
    }
}

module.exports = new NotesService();