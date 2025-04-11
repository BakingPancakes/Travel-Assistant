class Base64Converter {
    constructor() {
        // Nothing at the moment
    }

    async convertFileToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                // Remove prefix from base64 string
                const base64 = reader.result.split(",")[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    convertBase64ToFile(base64, mimetype, filename = "unknown-name") {
        try {
            const byteString = atob(base64);

            const buffer = new ArrayBuffer(byteString.length);
            const uint8Array = new Uint8Array(buffer);

            // Iterate through each char in byte string and add to Uint8array, creates a blob
            for (let i = 0; i < byteString.length; i++) {
                uint8Array[i] = byteString.charCodeAt(i);
            }

            // Create blob
            const blob = new Blob([uint8Array], { type: mimetype });

            // Create file from blob
            const file = new File([blob], filename, { type: mimetype });

            // Resolve the promise with the file
            return file;
        } catch (error) {
            throw error;
        }
    }
}

// Export a singleton instance of the class
const Base64 = new Base64Converter();
export default Base64;