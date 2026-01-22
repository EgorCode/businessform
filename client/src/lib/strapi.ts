// lib/strapi.ts
import qs from 'qs';

/**
 * Get the full Strapi URL.
 * Defaults to http://localhost:1337 if VITE_STRAPI_URL is not set.
 */
// Hardcoded URL for production reliability
export function getStrapiURL(path = ''): string {
    return `${import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'}${path}`;
}

/**
 * Helper to get the full URL of a media file.
 * Strapi returns relative paths like /uploads/image.png
 */
export function getStrapiMedia(url: string | null | undefined): string | null {
    if (url == null) {
        return null;
    }

    // If it's already an absolute URL, return it
    if (url.startsWith('http') || url.startsWith('//')) {
        return url;
    }

    // Otherwise prepend Strapi URL
    return getStrapiURL(url);
}

/**
 * Helper to make API calls to Strapi.
 * Automatically handles errors and logs responses for debugging.
 */
export async function fetchAPI<T>(
    path: string,
    urlParamsObject: Record<string, any> = {},
    options: RequestInit = {}
): Promise<T> {
    try {
        // Merge default params with custom ones
        const mergedParams = {
            populate: '*', // Always populate in v5 to avoid missing data surprises
            ...urlParamsObject,
        };

        // Build request URL
        const queryString = qs.stringify(mergedParams);
        const requestUrl = getStrapiURL(
            `/api${path}${queryString ? `?${queryString}` : ''}`
        );

        console.log(`🔄 [Strapi] Fetching: ${requestUrl}`);

        // Trigger API call
        const response = await fetch(requestUrl, {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options,
        });

        // Handle failed response
        if (!response.ok) {
            console.error(`❌ [Strapi] Error ${response.status}: ${response.statusText}`);
            throw new Error(`An error occurred please try again`);
        }

        const data = await response.json();

        console.log(`✅ [Strapi] Raw Response for ${path}:`, data);

        // In Strapi v5, we might want to return data.data directly if it exists,
        // or just the whole object if we need meta pagination.
        // For now returning the raw JSON.
        return data;

    } catch (error) {
        console.error(`❌ [Strapi] Fetch error:`, error);
        throw error;
    }
}
