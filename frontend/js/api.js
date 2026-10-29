const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(payload?.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.details = payload?.error;
    throw error;
  }

  return payload;
};

export const request = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    credentials: 'same-origin',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  return parseResponse(response);
};

export const formatError = (error) => {
  if (Array.isArray(error.details)) {
    return `${error.message}: ${error.details.join(', ')}`;
  }
  return error.message;
};
