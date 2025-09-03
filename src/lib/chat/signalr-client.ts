// SignalR Connection - Real-time messaging implementasyonu

import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { type ChatMessage } from './types';

// SignalR Hub URL
const SIGNALR_HUB_URL = 'https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net/chatHub';

// SignalR bağlantı durumları
export enum ConnectionState {
  Disconnected = 'Disconnected',
  Connecting = 'Connecting', 
  Connected = 'Connected',
  Disconnecting = 'Disconnecting',
  Reconnecting = 'Reconnecting'
}

// SignalR event callbacks
export interface SignalRCallbacks {
  onMessageReceived?: (message: ChatMessage) => void;
  onUserConnected?: (userId: string) => void;
  onUserDisconnected?: (userId: string) => void;
  onConnectionStateChanged?: (state: ConnectionState) => void;
  onError?: (error: string) => void;
}

// SignalR Connection interface
export interface ChatConnection {
  state: ConnectionState;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  connect: (userId: string) => Promise<void>; // Backend'deki Connect metodu
  sendMessage: (toUserId: string, message: string) => Promise<void>;
}

/**
 * SignalR Chat Connection Factory
 * Gerçek SignalR implementasyonu
 */
export const createChatConnection = (
  accessToken: string,
  callbacks: SignalRCallbacks = {}
): ChatConnection => {
  
  let connection: HubConnection | null = null;
  let connectionState = ConnectionState.Disconnected;

  const updateConnectionState = (newState: ConnectionState) => {
    connectionState = newState;
    callbacks.onConnectionStateChanged?.(newState);
  };

  return {
    get state() {
      return connectionState;
    },

    async start() {
      try {
        updateConnectionState(ConnectionState.Connecting);

        // SignalR bağlantısını kur
        connection = new HubConnectionBuilder()
          .withUrl(SIGNALR_HUB_URL, {
            accessTokenFactory: () => accessToken
          })
          .withAutomaticReconnect()
          .configureLogging(LogLevel.Information)
          .build();

        // Event listeners

        // Message receive events - Backend'de "Messages" eventi kullanılıyor
        connection.on('Messages', (res: ChatMessage) => {
          console.log('Received message via Messages event:', res);
          callbacks.onMessageReceived?.(res);
        });

        // Fallback olarak diğer event isimlerini de dinle
        const otherMessageEvents = ['ReceiveMessage', 'MessageReceived', 'OnMessageReceived', 'NewMessage'];
        otherMessageEvents.forEach(eventName => {
          connection!.on(eventName, (message: ChatMessage) => {
            console.log(`Received message via ${eventName} event:`, message);
            callbacks.onMessageReceived?.(message);
          });
        });

        // Connection state events
        connection.onreconnecting(() => {
          updateConnectionState(ConnectionState.Reconnecting);
        });

        connection.onreconnected(() => {
          updateConnectionState(ConnectionState.Connected);
        });

        connection.onclose((error) => {
          updateConnectionState(ConnectionState.Disconnected);
          if (error) {
            callbacks.onError?.(`Connection closed with error: ${error.message}`);
          }
        });
        
        // Bağlantıyı başlat
        await connection.start();
        updateConnectionState(ConnectionState.Connected);
        console.log('SignalR connection started successfully');

      } catch (error) {
        updateConnectionState(ConnectionState.Disconnected);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        callbacks.onError?.(`Connection failed: ${errorMessage}`);
        console.error('SignalR connection failed:', error);
        throw error;
      }
    },

    async stop() {
      try {
        if (!connection) return;

        updateConnectionState(ConnectionState.Disconnecting);
        await connection.stop();
        connection = null;
        updateConnectionState(ConnectionState.Disconnected);
        console.log('SignalR connection stopped');

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        callbacks.onError?.(`Disconnection failed: ${errorMessage}`);
        console.error('SignalR disconnection failed:', error);
        throw error;
      }
    },

    async sendMessage(toUserId: string, message: string) {
      if (!connection || connectionState !== ConnectionState.Connected) {
        throw new Error('SignalR connection is not active');
      }

      try {
        // Backend'de farklı method isimleri olabilir, önce SendMessage dene
        try {
          await connection.invoke('SendMessage', toUserId, message);
          console.log(`SignalR message sent to ${toUserId}: ${message} via SendMessage`);
        } catch (error) {
          // SendMessage yoksa alternatif method isimleri dene
          const errorMessage = error instanceof Error ? error.message : '';
          
          if (errorMessage.includes('Method does not exist')) {
            console.log('SendMessage method not found, trying alternatives...');
            
            // Alternatif method isimleri dene
            const alternatives = ['Send', 'SendChatMessage', 'BroadcastMessage'];
            let success = false;
            
            for (const method of alternatives) {
              try {
                await connection.invoke(method, toUserId, message);
                console.log(`SignalR message sent to ${toUserId}: ${message} via ${method}`);
                success = true;
                break;
              } catch {
                console.log(`Method ${method} also failed`);
              }
            }
            
            if (!success) {
              console.warn(`All send methods failed, message sent only via REST API`);
              return;
            }
          } else {
            throw error;
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`SignalR send message failed: ${errorMessage}`);
        
        // SignalR send başarısız olsa da REST API ile gönderildi, warning ver
        if (!errorMessage.includes('Method does not exist')) {
          callbacks.onError?.(`Send message failed: ${errorMessage}`);
        }
      }
    },

    // Backend'deki Connect metodu - kullanıcıyı bağlar
    async connect(userId: string) {
      if (!connection || connectionState !== ConnectionState.Connected) {
        throw new Error('SignalR connection is not active');
      }

      try {
        await connection.invoke('Connect', userId);
        console.log(`Connected user ${userId} via Connect method`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`Connect failed for user ${userId}: ${errorMessage}`);
        
        // Connect başarısız olsa da warning ver, critical error değil
        if (!errorMessage.includes('Method does not exist')) {
          callbacks.onError?.(`Connect failed: ${errorMessage}`);
        }
      }
    }
  };
};

// React Hook for SignalR Chat
import { useState, useEffect, useCallback, useRef } from 'react';

export const useSignalRChat = (accessToken: string | null) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.Disconnected);
  const [lastMessage, setLastMessage] = useState<ChatMessage | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const connectionRef = useRef<ChatConnection | null>(null);

  // Connect function
  const connect = useCallback(async () => {
    if (!accessToken || connectionRef.current?.state === ConnectionState.Connected) {
      return;
    }

    try {
      setError(null);
      const connectionCallbacks: SignalRCallbacks = {
        onConnectionStateChanged: setConnectionState,
        onMessageReceived: setLastMessage,
        onError: setError
      };
      connectionRef.current = createChatConnection(accessToken, connectionCallbacks);
      await connectionRef.current.start();
    } catch (error) {
      console.error('Failed to connect to SignalR:', error);
    }
  }, [accessToken]);

  // Disconnect function
  const disconnect = useCallback(async () => {
    if (connectionRef.current && connectionRef.current.state !== ConnectionState.Disconnected) {
      try {
        await connectionRef.current.stop();
        connectionRef.current = null;
      } catch (error) {
        console.error('Failed to disconnect from SignalR:', error);
      }
    }
  }, []);

  // Send message function
  const sendMessage = useCallback(async (toUserId: string, message: string) => {
    if (!connectionRef.current || connectionRef.current.state !== ConnectionState.Connected) {
      throw new Error('SignalR connection is not active');
    }

    await connectionRef.current.sendMessage(toUserId, message);
  }, []);

  // Connect user function
  const connectUser = useCallback(async (userId: string) => {
    if (!connectionRef.current || connectionRef.current.state !== ConnectionState.Connected) {
      throw new Error('SignalR connection is not active');
    }

    await connectionRef.current.connect(userId);
  }, []);

  // Auto-connect when token is available
  useEffect(() => {
    if (accessToken && connectionState === ConnectionState.Disconnected) {
      connect();
    }
  }, [accessToken, connectionState, connect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connectionState,
    lastMessage,
    error,
    connect,
    disconnect,
    sendMessage,
    connectUser,
    isConnected: connectionState === ConnectionState.Connected
  };
};
