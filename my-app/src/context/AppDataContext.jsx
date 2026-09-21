import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useLocation,
} from "react-router-dom";

import {
  activities as initialActivities,
  participants as initialParticipants,
  sessions as initialSessions,
} from "../data/mockData";

import {
  api,
  createSessionSocket,
} from "../api/client";


const STORAGE_KEY =
  "live-session-toolkit-data-v1";


const initialResources = [
  {
    id: "resource-1",
    name: "Cybersecurity Presentation",
    type: "PDF",
    url: "https://example.com/cybersecurity.pdf",
    description:
      "Slides used for the cybersecurity workshop.",
  },
  {
    id: "resource-2",
    name: "Workshop Introduction Video",
    type: "Video",
    url: "https://example.com/workshop-video",
    description:
      "Short introduction video for participants.",
  },
  {
    id: "resource-3",
    name: "Useful Security Resources",
    type: "Link",
    url: "https://www.cisa.gov/",
    description:
      "Reference material for online security.",
  },
];


const initialProfile = {
  name: "Momina",
  email: "momina@example.com",
  role: "Host",
  notifications: true,
  emailNotifications: true,
  privacy: "Workspace members",
};


function loadLocalState() {

  try {

    const stored =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (stored) {
      return JSON.parse(
        stored
      );
    }

  } catch (error) {

    console.warn(
      "Unable to load saved app data",
      error
    );

  }

  return {
    sessions:
      initialSessions,

    activities:
      initialActivities,

    participants:
      initialParticipants,

    resources:
      initialResources,

    profile:
      initialProfile,
  };
}


function mapSession(
  item
) {

  return {
    ...item,

    id:
      item.id,

    joinCode:
      item.joinCode ??
      item.join_code ??
      "",

    activities:
      Array.isArray(
        item.activities
      )
        ? item.activities
        : [],

    responses:
      item.responses ?? 0,
  };
}


function mapActivity(
  item,
  sessions = []
) {

  const attachedSession =
    sessions.find(
      (session) =>
        Array.isArray(
          session.activities
        ) &&
        session.activities.some(
          (activityId) =>
            String(
              activityId
            ) ===
            String(
              item.id
            )
        )
    );


  return {
    ...item,

    id:
      item.id,

    responses:
      item.responses ??
      item.responses_count ??
      0,

    correctAnswer:
      item.correctAnswer ??
      item.correct_answer ??
      "",

    sessionId:
      attachedSession?.id ??
      null,
  };
}


function mapResource(
  item
) {

  return {
    ...item,
  };
}


function mapParticipant(
  item
) {

  return {
    ...item,
  };
}


const AppDataContext =
  createContext(null);


export function AppDataProvider({
  children,
}) {

  const [data, setData] =
    useState(
      loadLocalState
    );

  const [
    backendConnected,
    setBackendConnected,
  ] = useState(
    Boolean(
      localStorage.getItem(
        "access_token"
      )
    )
  );

  const [loading, setLoading] =
    useState(false);

  const location =
    useLocation();

  const socketRef =
    useRef(null);


  const refreshData =
    async () => {

      const token =
        localStorage.getItem(
          "access_token"
        );

      if (!token) {

        setBackendConnected(
          false
        );

        return;
      }


      setLoading(true);

      try {

        const [
          sessionData,
          activityData,
          resourceData,
          participantData,
          userData,
        ] =
          await Promise.all([
            api.getSessions(),
            api.getActivities(),
            api.getResources(),
            api.getParticipants(),
            api.getCurrentUser(),
          ]);


        const sessions =
          sessionData.map(
            mapSession
          );


        const activities =
          activityData.map(
            (item) =>
              mapActivity(
                item,
                sessions
              )
          );


        setData(
          (current) => ({
            ...current,

            sessions,

            activities,

            resources:
              resourceData.map(
                mapResource
              ),

            participants:
              participantData.map(
                mapParticipant
              ),

            profile:
              userData,
          })
        );


        setBackendConnected(
          true
        );

      } catch (error) {

        console.error(
          "Unable to load backend data",
          error
        );

        localStorage.removeItem(
          "access_token"
        );

        setBackendConnected(
          false
        );

      } finally {

        setLoading(false);

      }
    };


  useEffect(() => {

    void refreshData();

    const handleAuthChanged =
      () => {
        void refreshData();
      };


    window.addEventListener(
      "auth-changed",
      handleAuthChanged
    );


    return () =>
      window.removeEventListener(
        "auth-changed",
        handleAuthChanged
      );

  }, []);


  useEffect(() => {

    if (!backendConnected) {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );

    }

  }, [
    data,
    backendConnected,
  ]);


  /*
   * WebSocket connection for
   * the host live-session route.
   */

  useEffect(() => {

    const match =
      location.pathname.match(
        /^\/sessions\/(\d+)\/live$/
      );


    if (
      !match ||
      !localStorage.getItem(
        "access_token"
      )
    ) {

      socketRef.current?.close();

      socketRef.current =
        null;

      return undefined;
    }


    const sessionId =
      match[1];


    const socket =
      createSessionSocket(
        sessionId,
        {
          onOpen: () => {

            socket.send(
              JSON.stringify({
                event:
                  "host_connected",

                data: {
                  sessionId,
                },
              })
            );

          },

          onMessage: (
            message
          ) => {

            window.dispatchEvent(
              new CustomEvent(
                "live-session-event",
                {
                  detail:
                    message,
                }
              )
            );

          },
        }
      );


    socketRef.current =
      socket;


    return () => {

      socket.close();

      if (
        socketRef.current ===
        socket
      ) {
        socketRef.current =
          null;
      }

    };

  }, [
    location.pathname,
  ]);


  const createSession =
    async (
      payload
    ) => {

      if (
        backendConnected ||
        localStorage.getItem(
          "access_token"
        )
      ) {

        const created =
          await api.createSession({
            title:
              payload.title.trim(),

            description:
              payload.description
                ?.trim() || "",

            date:
              payload.date ||
              "Not scheduled",

            time:
              payload.time ||
              "Not scheduled",

            duration:
              payload.duration ||
              "60 minutes",

            audience:
              payload.audience ||
              "University Students",

            type:
              payload.type ||
              "Workshop",

            visibility:
              payload.visibility ||
              "Public",

            status:
              payload.status ||
              "Upcoming",
          });


        const session =
          mapSession(
            created
          );


        setData(
          (current) => ({
            ...current,

            sessions: [
              session,
              ...current.sessions,
            ],
          })
        );


        setBackendConnected(
          true
        );


        return session;
      }


      const session = {
        id:
          `session-${Date.now()}`,

        title:
          payload.title.trim(),

        description:
          payload.description
            ?.trim() || "",

        date:
          payload.date ||
          "Not scheduled",

        time:
          payload.time ||
          "Not scheduled",

        duration:
          payload.duration ||
          "60 minutes",

        audience:
          payload.audience,

        type:
          payload.type,

        visibility:
          payload.visibility,

        status:
          payload.status ||
          "Upcoming",

        participants: 0,

        engagement: 0,

        joinCode:
          String(
            Math.floor(
              100000 +
              Math.random() *
              900000
            )
          ),

        activities: [],

        responses: 0,
      };


      setData(
        (current) => ({
          ...current,

          sessions: [
            session,
            ...current.sessions,
          ],
        })
      );


      return session;
    };


  const updateSession =
    async (
      id,
      updates
    ) => {

      if (
        backendConnected ||
        localStorage.getItem(
          "access_token"
        )
      ) {

        const updated =
          await api.updateSession(
            id,
            updates
          );


        const session =
          mapSession(
            updated
          );


        setData(
          (current) => ({
            ...current,

            sessions:
              current.sessions.map(
                (item) =>
                  String(
                    item.id
                  ) ===
                  String(id)
                    ? session
                    : item
              ),
          })
        );


        return session;
      }


      setData(
        (current) => ({
          ...current,

          sessions:
            current.sessions.map(
              (session) =>
                String(
                  session.id
                ) ===
                String(id)
                  ? {
                      ...session,
                      ...updates,
                    }
                  : session
            ),
        })
      );
    };


  const deleteSession =
    async (
      id
    ) => {

      if (
        backendConnected ||
        localStorage.getItem(
          "access_token"
        )
      ) {

        await api.deleteSession(
          id
        );

      }


      setData(
        (current) => ({
          ...current,

          sessions:
            current.sessions.filter(
              (session) =>
                String(
                  session.id
                ) !==
                String(id)
            ),
        })
      );
    };


  const createActivity =
    async (
      payload
    ) => {

      if (
        backendConnected ||
        localStorage.getItem(
          "access_token"
        )
      ) {

        const created =
          await api.createActivity({
            title:
              payload.title.trim(),

            type:
              payload.type ||
              "Multiple Choice",

            status:
              payload.status ||
              "Draft",

            options:
              payload.options ||
              [],

            correct_answer:
              payload.correctAnswer ||
              payload.correct_answer ||
              "",

            audience:
              payload.audience ||
              "",

            responses_count:
              0,
          });


        const activity =
          mapActivity(
            created,
            data.sessions
          );


        setData(
          (current) => ({
            ...current,

            activities: [
              activity,
              ...current.activities,
            ],
          })
        );


        return activity;
      }


      const activity = {

        id:
          `activity-${Date.now()}-${Math.random()
            .toString(16)
            .slice(2)}`,

        title:
          payload.title.trim(),

        type:
          payload.type ||
          "Multiple Choice",

        responses: 0,

        status:
          payload.status ||
          "Draft",

        options:
          payload.options ||
          [],

        correctAnswer:
          payload.correctAnswer ||
          "",

        sessionId:
          payload.sessionId ||
          null,
      };


      setData(
        (current) => ({
          ...current,

          activities: [
            activity,
            ...current.activities,
          ],
        })
      );


      return activity;
    };


  const updateActivity =
    async (
      id,
      updates
    ) => {

      if (
        backendConnected ||
        localStorage.getItem(
          "access_token"
        )
      ) {

        const updated =
          await api.updateActivity(
            id,
            {
              title:
                updates.title,

              type:
                updates.type,

              status:
                updates.status,

              options:
                updates.options,

              correct_answer:
                updates.correctAnswer ??
                updates.correct_answer,

              audience:
                updates.audience,
            }
          );


        const activity =
          mapActivity(
            updated,
            data.sessions
          );


        setData(
          (current) => ({
            ...current,

            activities:
              current.activities.map(
                (item) =>
                  String(
                    item.id
                  ) ===
                  String(id)
                    ? activity
                    : item
              ),
          })
        );


        return activity;
      }


      setData(
        (current) => ({
          ...current,

          activities:
            current.activities.map(
              (activity) =>
                String(
                  activity.id
                ) ===
                String(id)
                  ? {
                      ...activity,
                      ...updates,
                    }
                  : activity
            ),
        })
      );
    };


  const deleteActivity =
    async (
      id
    ) => {

      if (
        backendConnected ||
        localStorage.getItem(
          "access_token"
        )
      ) {

        await api.deleteActivity(
          id
        );

      }


      setData(
        (current) => ({
          ...current,

          activities:
            current.activities.filter(
              (activity) =>
                String(
                  activity.id
                ) !==
                String(id)
            ),
        })
      );
    };


  const addActivityToSession =
    async (
      activityId,
      sessionId
    ) => {

      if (
        backendConnected ||
        localStorage.getItem(
          "access_token"
        )
      ) {

        const updated =
          await api.addActivityToSession(
            sessionId,
            activityId
          );


        const session =
          mapSession(
            updated
          );


        setData(
          (current) => ({
            ...current,

            sessions:
              current.sessions.map(
                (item) =>
                  String(
                    item.id
                  ) ===
                  String(sessionId)
                    ? session
                    : item
              ),

            activities:
              current.activities.map(
                (activity) =>
                  String(
                    activity.id
                  ) ===
                  String(activityId)
                    ? {
                        ...activity,
                        sessionId,
                      }
                    : activity
              ),
          })
        );


        return session;
      }


      setData(
        (current) => ({

          ...current,

          activities:
            current.activities.map(
              (activity) =>
                String(
                  activity.id
                ) ===
                String(activityId)
                  ? {
                      ...activity,
                      sessionId,
                      status:
                        "Published",
                    }
                  : activity
            ),

          sessions:
            current.sessions.map(
              (session) => {

                if (
                  String(
                    session.id
                  ) !==
                  String(sessionId)
                ) {
                  return session;
                }


                const ids =
                  Array.isArray(
                    session.activities
                  )
                    ? session.activities
                    : [];


                return ids.includes(
                  activityId
                )
                  ? session
                  : {
                      ...session,

                      activities:
                        [
                          ...ids,
                          activityId,
                        ],
                    };
              }
            ),
        })
      );
    };


  const addResource =
    async (
      payload
    ) => {

      if (
        backendConnected ||
        localStorage.getItem(
          "access_token"
        )
      ) {

        const created =
          await api.createResource({
            name:
              payload.name.trim(),

            type:
              payload.type,

            url:
              payload.url?.trim() ||
              "",

            description:
              payload.description
                ?.trim() ||
              "",
          });


        const resource =
          mapResource(
            created
          );


        setData(
          (current) => ({
            ...current,

            resources: [
              resource,
              ...current.resources,
            ],
          })
        );


        return resource;
      }


      const resource = {

        id:
          `resource-${Date.now()}`,

        name:
          payload.name.trim(),

        type:
          payload.type,

        url:
          payload.url.trim(),

        description:
          payload.description
            ?.trim() ||
          "",
      };


      setData(
        (current) => ({
          ...current,

          resources: [
            resource,
            ...current.resources,
          ],
        })
      );


      return resource;
    };


  const deleteResource =
    async (
      id
    ) => {

      if (
        backendConnected ||
        localStorage.getItem(
          "access_token"
        )
      ) {

        await api.deleteResource(
          id
        );

      }


      setData(
        (current) => ({
          ...current,

          resources:
            current.resources.filter(
              (resource) =>
                String(
                  resource.id
                ) !==
                String(id)
            ),
        })
      );
    };


  const updateProfile =
    async (
      updates
    ) => {

      if (
        backendConnected ||
        localStorage.getItem(
          "access_token"
        )
      ) {

        const updated =
          await api.updateProfile(
            updates
          );


        setData(
          (current) => ({
            ...current,

            profile:
              updated,
          })
        );


        return updated;
      }


      setData(
        (current) => ({
          ...current,

          profile: {
            ...current.profile,
            ...updates,
          },
        })
      );
    };


  const resetDemoData =
    () => {

      setData({
        sessions:
          initialSessions,

        activities:
          initialActivities,

        participants:
          initialParticipants,

        resources:
          initialResources,

        profile:
          initialProfile,
      });
    };


  const sendLiveEvent =
    (
      event,
      payload = {}
    ) => {

      if (
        socketRef.current?.readyState ===
        WebSocket.OPEN
      ) {

        socketRef.current.send(
          JSON.stringify({
            event,

            data:
              payload,
          })
        );
      }
    };


  const value = useMemo(
    () => ({
      ...data,

      backendConnected,

      loading,

      refreshData,

      createSession,

      updateSession,

      deleteSession,

      createActivity,

      updateActivity,

      deleteActivity,

      addActivityToSession,

      addResource,

      deleteResource,

      updateProfile,

      resetDemoData,

      sendLiveEvent,
    }),
    [
      data,
      backendConnected,
      loading,
    ]
  );


  return (
    <AppDataContext.Provider
      value={value}
    >
      {children}
    </AppDataContext.Provider>
  );
}


export function useAppData() {

  const context =
    useContext(
      AppDataContext
    );

  if (!context) {

    throw new Error(
      "useAppData must be used inside AppDataProvider"
    );
  }

  return context;
}