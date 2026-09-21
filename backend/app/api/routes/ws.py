from collections import defaultdict

from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect,
)


router = APIRouter(
    tags=["WebSocket"],
)


class ConnectionManager:

    def __init__(self):
        self.connections = defaultdict(list)

    async def connect(
        self,
        session_id: int,
        websocket: WebSocket,
    ):
        await websocket.accept()

        self.connections[
            session_id
        ].append(websocket)

    def disconnect(
        self,
        session_id: int,
        websocket: WebSocket,
    ):
        if websocket in self.connections[
            session_id
        ]:
            self.connections[
                session_id
            ].remove(websocket)

    async def broadcast(
        self,
        session_id: int,
        message: dict,
    ):
        disconnected = []

        for connection in self.connections[
            session_id
        ]:

            try:
                await connection.send_json(
                    message
                )

            except Exception:
                disconnected.append(
                    connection
                )

        for connection in disconnected:
            self.disconnect(
                session_id,
                connection,
            )


manager = ConnectionManager()


@router.websocket(
    "/ws/sessions/{session_id}"
)
async def session_websocket(
    websocket: WebSocket,
    session_id: int,
):

    await manager.connect(
        session_id,
        websocket,
    )

    await manager.broadcast(
        session_id,
        {
            "event": "participant_connected",
            "session_id": session_id,
        },
    )

    try:

        while True:

            data = await websocket.receive_json()

            event_type = data.get(
                "event",
                "unknown",
            )

            await manager.broadcast(
                session_id,
                {
                    "event": event_type,
                    "session_id": session_id,
                    "data": data.get(
                        "data",
                        {},
                    ),
                },
            )

    except WebSocketDisconnect:

        manager.disconnect(
            session_id,
            websocket,
        )

        await manager.broadcast(
            session_id,
            {
                "event": "participant_disconnected",
                "session_id": session_id,
            },
        )