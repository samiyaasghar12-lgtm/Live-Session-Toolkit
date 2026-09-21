const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api";


async function request(
  endpoint,
  options = {}
) {
  const token =
    localStorage.getItem(
      "access_token"
    );

  const headers = {
    "Content-Type":
      "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  const response =
    await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );

  if (!response.ok) {
    let errorMessage =
      "Something went wrong.";

    try {
      const errorData =
        await response.json();

      if (
        Array.isArray(
          errorData.detail
        )
      ) {
        errorMessage =
          errorData.detail
            .map(
              (item) =>
                item.msg
            )
            .join("; ");
      } else if (
        errorData.detail
      ) {
        errorMessage =
          errorData.detail;
      }
    } catch {
      // Keep default error.
    }

    throw new Error(
      errorMessage
    );
  }

  if (
    response.status === 204
  ) {
    return null;
  }

  return response.json();
}


export const api = {

  health: () =>
    request("/health"),


  signup: (data) =>
    request(
      "/auth/signup",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),


  login: (data) =>
    request(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),


  getCurrentUser: () =>
    request("/auth/me"),


  updateProfile: (data) =>
    request(
      "/auth/me",
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    ),


  getSessions: () =>
    request("/sessions"),


  getSession: (id) =>
    request(
      `/sessions/${id}`
    ),


  getSessionByCode: (code) =>
    request(
      `/sessions/join/${encodeURIComponent(
        code
      )}`
    ),


  createSession: (data) =>
    request(
      "/sessions",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),


  updateSession: (
    id,
    data
  ) =>
    request(
      `/sessions/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    ),


  deleteSession: (id) =>
    request(
      `/sessions/${id}`,
      {
        method: "DELETE",
      }
    ),


  addActivityToSession: (
    sessionId,
    activityId
  ) =>
    request(
      `/sessions/${sessionId}/activities/${activityId}`,
      {
        method: "POST",
      }
    ),


  getActivities: () =>
    request("/activities"),


  getActivity: (id) =>
    request(
      `/activities/${id}`
    ),


  getPublicSessionActivities: (
    sessionId
  ) =>
    request(
      `/activities/public/session/${sessionId}`
    ),


  createActivity: (data) =>
    request(
      "/activities",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),


  updateActivity: (
    id,
    data
  ) =>
    request(
      `/activities/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    ),


  deleteActivity: (id) =>
    request(
      `/activities/${id}`,
      {
        method: "DELETE",
      }
    ),


  getResources: () =>
    request("/resources"),


  getResource: (id) =>
    request(
      `/resources/${id}`
    ),


  createResource: (data) =>
    request(
      "/resources",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),


  updateResource: (
    id,
    data
  ) =>
    request(
      `/resources/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    ),


  deleteResource: (id) =>
    request(
      `/resources/${id}`,
      {
        method: "DELETE",
      }
    ),


  joinSession: (
    sessionId,
    name
  ) =>
    request(
      `/participants/join/${sessionId}`,
      {
        method: "POST",
        body: JSON.stringify({
          name,
        }),
      }
    ),


  getParticipants: (
    sessionId
  ) =>
    sessionId
      ? request(
          `/participants/session/${sessionId}`
        )
      : request(
          "/participants"
        ),


  submitResponse: (
    sessionId,
    participantId,
    data
  ) =>
    request(
      `/responses/${sessionId}/${participantId}`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),


  getResponses: (
    sessionId
  ) =>
    request(
      `/responses/session/${sessionId}`
    ),


  getAnalytics: (
    sessionId
  ) =>
    request(
      `/analytics/sessions/${sessionId}`
    ),


  getAnalyticsOverview: () =>
    request(
      "/analytics/overview"
    ),


  generateActivity: (
    data
  ) =>
    request(
      "/ai/generate-activity",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),


  askAI: (
    message
  ) =>
    request(
      "/ai/assistant",
      {
        method: "POST",
        body: JSON.stringify({
          message,
        }),
      }
    ),
};


export function createSessionSocket(
  sessionId,
  handlers = {}
) {

  const protocol =
    window.location.protocol ===
    "https:"
      ? "wss"
      : "ws";

  const host =
    import.meta.env
      .VITE_WS_BASE_URL ||
    `${protocol}://${window.location.hostname}:8000`;

  const socket =
    new WebSocket(
      `${host}/ws/sessions/${sessionId}`
    );

  socket.onopen =
    handlers.onOpen;

  socket.onmessage =
    (event) => {
      try {
        handlers.onMessage?.(
          JSON.parse(
            event.data
          )
        );
      } catch {
        // Ignore malformed messages.
      }
    };

  socket.onerror =
    handlers.onError;

  socket.onclose =
    handlers.onClose;

  return socket;
}