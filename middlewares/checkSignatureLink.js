// ../middlewares/checkSignatureLink.js
import SignatureLink from '../models/signatureLink.js';
import Document from '../models/document.js';

const checkSignatureLink = async (req, res, next) => {
    const { token } = req.params;
    try {
        const link = await SignatureLink.findOne({ where: { token } });
        if (!link) {
            return res.status(404).send({ message: 'Invalid link' });
        }
        if (link.used) {
            return res.status(400).send({ message: 'Link already used' });
        }
        const id = link.documentId;
        const document = await Document.findOne({where:{ id }});
        console.log(document)
        if (!document) {
            return res.status(404).send({ message: 'Document not found' });
        }
        req.document = document;
        req.link = link;
        next();
    } catch (err) {
        res.status(500).send({ message: 'Server error', error: err.message });
    }
};

export default checkSignatureLink;
