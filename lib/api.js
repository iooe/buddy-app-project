// Fetch Data utility
export async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const error = new Error(
                errorData.message || `HTTP error ${response.status}`
            );
            error.status = response.status;
            error.data = errorData;
            throw error;
        }

        return await response.json();
    } catch (error) {
        console.error(`API Error: ${url}`, error);
        throw error;
    }
}

// GET requests utility
export function get(url) {
    return fetchData(url);
}

//  POST requests utility
export function post(url, data) {
    return fetchData(url, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// Утилита для PUT запросов
export function put(url, data) {
    return fetchData(url, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

//  DELETE requests utility
export function del(url) {
    return fetchData(url, {
        method: 'DELETE',
    });
}
