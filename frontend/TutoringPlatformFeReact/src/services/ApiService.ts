const baseURL = "http://localhost:5192/api";

interface RequestOptions extends RequestInit{
    body?: any;
}

export async function fetchData<T>(endpoint : string, options : RequestOptions = {}): Promise<T> {
    const {body, ...customConfig} = options;

    const token = localStorage.getItem('token');

    const headers : HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...customConfig.headers,
    }

    const config: RequestInit = {
        ...customConfig,
        headers,
        ...(body ? { body: JSON.stringify(body) } : {}),
    }
    
    const response = await fetch(`${baseURL}${endpoint}`, config);

    let result = await response.json().catch(() => null);

    if (!response.ok) {
        const errorMessage = result?.message || `Błąd HTTP: ${response.status}`;
        throw new Error(errorMessage);
    }
    
    return result as T;
}