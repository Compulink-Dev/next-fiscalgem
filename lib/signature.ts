import crypto from 'crypto';

export function generateSHA256Hash(data: string) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

export function generateSignature(hash: string, privateKey: string): string {
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(hash);
    return sign.sign(privateKey, 'base64');
}
