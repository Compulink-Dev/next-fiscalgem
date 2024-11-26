import crypto from "crypto";

export const generateSignature = (data: string): { hash: string; signature: string } => {
    try {
        // Compute MD5 hash
        const md5Hash = crypto.createHash("md5").update(data).digest("hex");

        // Extract the first 16 characters
        const first16Chars = md5Hash.substring(0, 16);

        console.log("Full environment variables:", process.env);

        // Load the private key (ensure you store it securely)
        const privateKey = process.env.PRIVATE_KEY; // Ensure this is properly configured
        console.log('Private Key :', privateKey);

        if (!privateKey) {
            throw new Error("Private key is not configured properly.");
        }

        // Sign the hash
        const signature = crypto.privateEncrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            Buffer.from(first16Chars, "utf-8")
        );

        return {
            hash: first16Chars,
            signature: signature.toString("base64"),
        };
    } catch (error) {
        console.error("Error generating signature:", error);
        throw error;
    }
};
