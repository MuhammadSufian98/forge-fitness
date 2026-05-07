import axios from "axios";

const apiClient = axios.create({
  baseURL: "/",
  timeout: 15000, // 15 seconds time limit
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for rate/double-call limiting
const pendingRequests = new Map();

apiClient.interceptors.request.use(
  (config) => {
    // Only limit duplicate POST/PATCH/PUT/DELETE requests or sensitive GETs
    // For now, let's limit all based on key
    const requestKey = `${config.method}:${config.url}:${JSON.stringify(config.params || {})}:${JSON.stringify(config.data || {})}`;
    
    if (pendingRequests.has(requestKey)) {
      const source = axios.CancelToken.source();
      config.cancelToken = source.token;
      source.cancel("Duplicate request detected and cancelled");
      return config;
    }
    
    pendingRequests.set(requestKey, true);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to clean up pending requests
apiClient.interceptors.response.use(
  (response) => {
    const config = response.config;
    const requestKey = `${config.method}:${config.url}:${JSON.stringify(config.params || {})}:${JSON.stringify(config.data || {})}`;
    pendingRequests.delete(requestKey);
    return response;
  },
  (error) => {
    if (error.config) {
      const config = error.config;
      const requestKey = `${config.method}:${config.url}:${JSON.stringify(config.params || {})}:${JSON.stringify(config.data || {})}`;
      pendingRequests.delete(requestKey);
    }
    
    if (axios.isCancel(error)) {
      console.warn("Request cancelled:", error.message);
      // Return a pending promise that never resolves to "swallow" the cancelled request error in components
      // or just reject it normally. Rejecting normally is better for debugging.
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
