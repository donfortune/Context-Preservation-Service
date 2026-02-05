const Draft = require('/Users/i/Draft-Saver-Service/src/models/draft.js');

exports.saveDraft = async (req, res) => {
    try {
        const { userId, resourceId, payload, clientTimestamp } = req.body;
        if (!userId || !resourceId || !payload || !clientTimestamp) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
            // 1. Try to Update an Existing Draft if it's Older
        const updateResult = await Draft.updateOne(
            { 
                userId, 
                resourceId, 
                clientTimestamp: { $lt: clientTimestamp } 
            },
            // 2. Attempt to Update an Existing Draft if it's Older
            {
                $set: {
                    payload,
                    clientTimestamp,
                    serverUpdatedAt: new Date(),
                    expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
                }
            }
        );

        // 3. Handle the Result
        if (updateResult.matchedCount > 0) {
            // Success: We found an older draft and updated it.
            return res.status(200).json({ status: 'synced', message: 'Draft updated' });
        }

        // 4. The Edge Cases:
        // If we didn't update, it's either because:
        // A) The draft didn't exist (First time saving) -> INSERT IT.
        // B) The draft exists but is NEWER (Conflict) -> IGNORE IT.

        // Let's check if a document exists at all for this user/resource
        const existingDraft = await Draft.findOne({ userId, resourceId });

        if (!existingDraft) {
            // Case A: It's a brand new draft. Create it.
            await Draft.create({
                userId,
                resourceId,
                payload,
                clientTimestamp,
                serverUpdatedAt: new Date(),
                expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            });
            return res.status(201).json({ status: 'created', message: 'New draft created' });
        } else {
            // Case B: The DB version was newer. We ignore this request.
            // This protects the user's latest work from being overwritten by a lagging device.
            return res.status(200).json({ status: 'ignored', message: 'Server has newer version' });
        }

    } catch (error) {
        console.error('Error saving draft:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


exports.getDrafts = async (req, res) => {
    try {
        const { userId, resourceId } = req.query;

        // SCENARIO 1: Specific Lookup (Production use)
        if (userId && resourceId) {
            const specificDraft = await Draft.findOne({ userId, resourceId });
            
            if (!specificDraft) {
                return res.status(404).json({ message: 'No draft found for this user/resource' });
            }
            return res.status(200).json(specificDraft);
        }


        const allDrafts = await Draft.find({}); 
        res.status(200).json(allDrafts);

    } catch (error) {
        console.error('Error fetching drafts:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}