import crypto from 'crypto';
import SignatureLink from '../models/signatureLink.js';

const generateSignatureLink = async (req, res) => {
    const { documentId } = req.body;
    const token = crypto.randomBytes(16).toString('hex');
    try {
        const newLink = await SignatureLink.create({
            token,
            documentId
        });
        res.status(200).send({ link: `/access/${token}` });
    } catch (err) {
        res.status(500).send({ message: 'Server error', error: err.message });
    }
};

export default {
    generateSignatureLink
};
