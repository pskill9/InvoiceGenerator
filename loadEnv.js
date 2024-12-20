async function loadEnv() {
    try {
        const decoder = new TextDecoder('utf-8');
        const response = await fetch('.env', {
            headers: {
                'Content-Type': 'text/plain'
            }
        });
        if (!response.ok) throw new Error('Failed to load .env file');
        
        const buffer = await response.arrayBuffer();
        const text = decoder.decode(buffer);
        const env = {};
        
        text.split('\n').forEach(line => {
            line = line.trim();
            if (line && !line.startsWith('#')) {
                const [key, value] = line.split('=');
                if (key && value) {
                    env[key.trim()] = value.trim();
                }
            }
        });
        
        return env;
    } catch (error) {
        console.error('Error loading .env file:', error);
        return {};
    }
}

export default loadEnv;
