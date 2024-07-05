// ../middlewares/checkSignatureLink.js
import SignatureLink from '../models/signatureLink.js';
import Document from '../models/document.js';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

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
        const filePath = path.join(document.path);
        const iv = Buffer.from(document.iv, 'hex');
  
        const encryptedContent = fs.readFileSync(filePath);
        const decipher = crypto.createDecipheriv('aes-256-cbc', process.env.ENCRYPTION_KEY, iv);
  
        let decryptedContent = Buffer.concat([
          decipher.update(encryptedContent),
        ]);
        req.document = document;
        req.decryptedContent = decryptedContent;

        req.link = link;
 
        // // Send the decrypted content as a base64 string

        next();
    } catch (err) {
        res.status(500).send({ message: 'Server error', error: err.message });
    }
};

export default checkSignatureLink;
