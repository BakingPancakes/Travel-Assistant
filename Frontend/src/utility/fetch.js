/**
 * Simulates network request to the specified URL and returns a Promise
 * that resolves to a mock response object
 * 
 * @function fetch
 * @param {string} url The URL to request
 * @param {object} [options] An options object
 * @param {number} [options.delay = 1000] the delay (in ms) before 
 * resolving the promise
 * @returns {Promise} A Promise that resolves to a mock response object
 */
export function fetch(url, options = {}) {
    return new Promise((resolve, reject) => {
        // Define a delay to simulate network latency (e.g., 1 second)
        const delay = 1000;
        const mockChat1 = {
            id: 1,
            name: 'Chat #1 ',
            trip: 'trip name',
            members: ['JoonID', 'JasperID'],
            messages: [{
                sender: 'from',
                timestamp: '1:00PM, April 25',
                text: 'Heyooo',
                name: 'Jasper',
            },
            {
                sender: 'to',
                timestamp: '1:02PM, April 25',
                text: 'Hey!',
                name: 'Joon',
            }]
        }
        const mockChat2 = {
            id: 2,
            name: 'Super cool chat!',
            trip: 'trip name',
            members: ['JoonID', 'JasperID'],
            messages: [{
                sender: 'from',
                timestamp: '1:00PM, April 25',
                text: 'Heyooo',
                name: 'Jasper',
            },
            {
                sender: 'to',
                timestamp: '1:02PM, April 25',
                text: 'Hey!',
                name: 'Joon',
            }]
        }
        const mockChat3 = {
            id: 3,
            name: 'mysterious chat #3',
            trip: 'trip name',
            members: ['JoonID', 'JasperID'],
            messages: [{
                sender: 'from',
                timestamp: '1:00PM, April 25',
                text: 'Heyooo',
                name: 'Jasper',
            },
            {
                sender: 'to',
                timestamp: '1:02PM, April 25',
                text: 'Hey!',
                name: 'Joon',
            }]
        }
        const mockUser = { 
            id: 1,
            name: 'Zav',
            trip_perms: [1],
            chat_perms: [1, 3],
        }

        setTimeout(() => {
            // Define a mock response object
            let mockResponse;
            if (!options) {
                mockResponse = {
                    ok: true,
                    status: 200,
                    statusText: "OK",
                    url,
                    json: async () => ({ message: "This is a mock response", url }),
                    text: async () => "This is a mock response",
                };
            } else if (Object.hasOwn(options,"chat_ids")) {
                mockResponse = {
                    ok: true,
                    status: 200,
                    statusText: "OK",
                    url,
                    json: async () => ({chatDataList: [mockChat1, mockChat2, mockChat3], url})
                }
            } else if (Object.hasOwn(options, "user_id")) {
                mockResponse = {
                    ok: true,
                    status: 200,
                    statusText: "OK",
                    url,
                    json: async () => ({userData: mockUser, url})
                }
            }

            // Use the URL to simulate failure or success
            if (url.includes("error")) {
                reject(new Error("Network error"));
            } else {
                resolve(mockResponse);
            }
        }, delay);
    });
}