"use client"

import { useEffect, useState, useRef, useCallback } from "react";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import {Notification} from "@/types/notification";

export interface NotificationMessage {
    content: string;
    timestamp: string;
    createdAt: string;
    from?: string;
    fromConnectionId?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useNotificationHub(doctorId: string | null | undefined) {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const connectionRef = useRef<HubConnection | null>(null);
    const isConnectingRef = useRef(false);

    // Hàm dọn dẹp connection
    const cleanupConnection = useCallback(async () => {
        if (connectionRef.current) {
            try {
                await connectionRef.current.stop();
            } catch (error) {
                console.error("Error stopping SignalR connection:", error);
            }
            connectionRef.current = null;
            setConnection(null);
            setIsConnected(false);
        }
    }, []);

    // Kết nối SignalR
    const connectToHub = useCallback(async () => {
        if (!doctorId || isConnectingRef.current || connectionRef.current) {
            return;
        }

        isConnectingRef.current = true;

        try {
            const url = `${BASE_URL}/notificationhub?doctorId=${doctorId}`;
            console.log(url);
            const newConnection = new HubConnectionBuilder()
                .withUrl(url)
                .withAutomaticReconnect({
                    nextRetryDelayInMilliseconds: (retryContext) => {
                        // Retry after 0, 2, 10, 30 seconds, then every 30 seconds
                        if (retryContext.previousRetryCount === 0) return 0;
                        if (retryContext.previousRetryCount === 1) return 2000;
                        if (retryContext.previousRetryCount === 2) return 10000;
                        return 30000;
                    }
                })
                .configureLogging(LogLevel.Information)
                .build();

            // Event handlers
            newConnection.on("ReceiveNotification", (payload: any) => {
                console.log("Received notification:", payload);
                const msg: Notification = {
                    content: payload.Content || payload.content,
                    createdAt: payload.CreatedAt || payload.createdAt,
                    recipient: payload.Recipient || payload.recipient,
                    notificationType: payload.NotificationType || payload.notificationType,
                    id: payload.Id || payload.id,
                };
                setNotifications(prev => [msg, ...prev]);
            });

            newConnection.onclose((error) => {
                console.log("SignalR connection closed:", error);
                setIsConnected(false);
            });

            newConnection.onreconnecting((error) => {
                console.log("SignalR reconnecting:", error);
                setIsConnected(false);
            });

            newConnection.onreconnected((connectionId) => {
                console.log("SignalR reconnected:", connectionId);
                setIsConnected(true);
            });

            // Bắt đầu kết nối
            await newConnection.start();
            console.log("SignalR connected successfully");

            connectionRef.current = newConnection;
            setConnection(newConnection);
            setIsConnected(true);

        } catch (error) {
            console.error("SignalR Connection Error:", error);
        } finally {
            isConnectingRef.current = false;
        }
    }, [doctorId]);

    // Effect để quản lý kết nối
    useEffect(() => {
        if (doctorId) {
            connectToHub();
        } else {
            cleanupConnection();
        }

        // Cleanup khi component unmount hoặc doctorId thay đổi
        return () => {
            cleanupConnection();
        };
    }, [doctorId, connectToHub, cleanupConnection]);

    // Hàm gửi notification
    const sendNotification = useCallback(async (targetSessionIds: string[], type: string, content: string) => {
        if (!connectionRef.current || !isConnected) {
            console.warn("SignalR connection not available");
            return false;
        }

        try {
            // Convert string array to Guid array if needed
            const sessionGuids = targetSessionIds.map(id => id);
            await connectionRef.current.invoke("SendNotificationAsync", sessionGuids, type, content);
            console.log("Notification sent successfully");
            return true;
        } catch (error) {
            console.error("SendNotification error:", error);
            return false;
        }
    }, [isConnected]);

    // Hàm xóa thông báo
    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    // Hàm xóa một thông báo cụ thể
    const removeNotification = useCallback((index: number) => {
        setNotifications(prev => prev.filter((_, i) => i !== index));
    }, []);

    return {
        connection: connectionRef.current,
        notifications,
        isConnected,
        sendNotification,
        clearNotifications,
        removeNotification
    };
}