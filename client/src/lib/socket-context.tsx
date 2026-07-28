import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import { authApi, getAccessToken } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL as string;

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const instance = io(SOCKET_URL, {
      auth: { token: getAccessToken() },
      withCredentials: true,
      autoConnect: true,
    });

    instance.on('connect', () => setSocket(instance));

    instance.on('connect_error', async () => {
      const session = await authApi.refresh();
      if (session) {
        instance.auth = { token: session.accessToken };
        instance.connect();
      }
    });

    return () => {
      instance.disconnect();
      setSocket(null);
    };
  }, [status]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  return useContext(SocketContext);
}

export function useSocketEvent<T>(event: string, handler: (payload: T) => void) {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [socket, event, handler]);
}
