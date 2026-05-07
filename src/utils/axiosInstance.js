import axios from "axios";

const apiClient = axios.create({
  baseURL: "/",
  timeout: 15000, // 15 seconds time limit
  headers: {
    "Content-Type": "application/json",
  },
});

const pendingRequests = new Map();
const DUPLICATE_GET_GRACE_MS = 100;
const HEAVY_GET_ROUTES = new Set([]);
const METHODS_TO_DEBOUNCE = new Set(["post", "put", "patch", "delete"]);

const getRequestKey = (config) => {
  const method = (config.method || "get").toLowerCase();
  return `${method}:${config.url}:${JSON.stringify(config.params || {})}:${JSON.stringify(config.data || {})}`;
};

const shouldDebounceRequest = (config, pendingRequest) => {
  const method = (config.method || "get").toLowerCase();

  if (method === "get") {
    const elapsed = Date.now() - pendingRequest.startedAt;

    if (elapsed < DUPLICATE_GET_GRACE_MS) {
      return false;
    }

    return HEAVY_GET_ROUTES.has(config.url);
  }

  return METHODS_TO_DEBOUNCE.has(method);
};

apiClient.interceptors.request.use(
  (config) => {
    const requestKey = getRequestKey(config);
    const pendingRequest = pendingRequests.get(requestKey);

    if (pendingRequest && shouldDebounceRequest(config, pendingRequest)) {
      const source = axios.CancelToken.source();
      config.isDuplicateRequest = true;
      config.cancelToken = source.token;
      source.cancel("Duplicate request cancelled");
      return config;
    }

    pendingRequests.set(requestKey, {
      count: (pendingRequest?.count || 0) + 1,
      startedAt: pendingRequest?.startedAt || Date.now(),
    });

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
    const requestKey = getRequestKey(config);
    const pendingRequest = pendingRequests.get(requestKey);

    if (pendingRequest?.count > 1) {
      pendingRequests.set(requestKey, {
        ...pendingRequest,
        count: pendingRequest.count - 1,
      });
    } else {
      pendingRequests.delete(requestKey);
    }

    return response;
  },
  (error) => {
    if (error.config) {
      const config = error.config;
      const requestKey = getRequestKey(config);
      const pendingRequest = pendingRequests.get(requestKey);

      if (axios.isCancel(error) && config.isDuplicateRequest) {
        return Promise.reject(error);
      }

      if (pendingRequest?.count > 1) {
        pendingRequests.set(requestKey, {
          ...pendingRequest,
          count: pendingRequest.count - 1,
        });
      } else {
        pendingRequests.delete(requestKey);
      }
    }

    return Promise.reject(error);
  }
);

export const isRequestCanceled = axios.isCancel;
export default apiClient;
