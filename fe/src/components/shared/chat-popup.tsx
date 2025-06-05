"use client"

import { useState, useRef, useEffect } from "react"
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    MessageCircle,
    X,
    Send,
    Bot,
    UserCheck,
    ArrowLeft,
    Minimize2,
    Maximize2,
} from "lucide-react"
import { cn } from "@/lib/utils"

//
// ─── KIỂU DỮ LIỆU ─────────────────────────────────────────────────────────────────
//

interface Message {
    id: string
    content: string
    sender: "user" | "bot" | "doctor"
    timestamp: Date
    senderName?: string
}

type ChatMode = "selection" | "ai" | "doctor"

export function ChatPopup() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [chatMode, setChatMode] = useState<ChatMode>("selection")
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [hubConnection, setHubConnection] = useState<HubConnection | null>(null)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Khi unmount, cho dừng connection
    useEffect(() => {
        return () => {
            if (hubConnection) {
                hubConnection.stop()
            }
        }
    }, [hubConnection])

    const initializeSession = async (mode: "ai" | "doctor") => {
        // 1) Nếu đã có kết nối cũ, dừng nó và reset state
        if (hubConnection) {
            await hubConnection.stop()
            setHubConnection(null)
        }
        setMessages([])
        setSessionId(null)

        // 2) Tạo sessionId mới từ backend
        let apiPath = process.env.NEXT_PUBLIC_API_URL
        if (mode === "ai") apiPath = apiPath + "/api/Chat/create-ai-session"
        else apiPath = apiPath + "/api/Chat/assign-doctor"

        try {
            const res = await fetch(apiPath, { method: "POST" })
            if (!res.ok) throw new Error("Không thể tạo session mới")
            const data = await res.json()
            const newSessionId = data.sessionId as string
            setSessionId(newSessionId)

            // 3) Build HubConnection (chưa start)
            const connection = new HubConnectionBuilder()
                .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/chathub?sessionId=${newSessionId}`)
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Warning)
                .build()

            // 4) Đăng ký handler trước khi start
            connection.on("ReceiveMessage", (payload: any) => {
                const incoming: Message = {
                    id: payload.id,
                    content: payload.content,
                    sender:
                        payload.senderType.toLowerCase() === "user"
                            ? "user"
                            : mode === "ai"
                                ? "bot"
                                : "doctor",
                    senderName:
                        payload.senderType.toLowerCase() === "user"
                            ? "Bạn"
                            : mode === "ai"
                                ? "AI Assistant"
                                : "Bác sĩ",
                    timestamp: new Date(payload.createdAt),
                }
                setMessages((prev) => [...prev, incoming])
                setIsTyping(false)
            })

            connection.on("SessionEvent", (payload: any) => {
                if (payload.type === "DoctorJoined") {
                    const sysMsg: Message = {
                        id: Date.now().toString() + "-sys",
                        content: `Bác sĩ ${payload.doctorName} đã sẵn sàng trò chuyện với bạn.`,
                        sender: "doctor",
                        timestamp: new Date(),
                        senderName: payload.doctorName,
                    }
                    setMessages((prev) => [...prev, sysMsg])
                }
            })

            // 5) Chỉ start một lần
            await connection.start()
            setHubConnection(connection)

            // 6) Hiển thị welcome message
            const welcomeMsg: Message = {
                id: Date.now().toString(),
                content:
                    mode === "ai"
                        ? "Xin chào! Tôi là trợ lý AI. Hãy mô tả triệu chứng hoặc vấn đề sức khỏe của bạn."
                        : "Xin chào! Đang tìm bác sĩ trực tuyến... Vui lòng chờ trong giây lát.",
                sender: mode === "ai" ? "bot" : "doctor",
                timestamp: new Date(),
                senderName: mode === "ai" ? "AI Assistant" : "Hệ thống",
            }
            setMessages([welcomeMsg])
        } catch (error) {
            console.error("initializeSession lỗi:", error)
        }
    }

    const handleModeSelect = (mode: "ai" | "doctor") => {
        setChatMode(mode)
        initializeSession(mode)
    }

    const resetChat = async () => {
        if (hubConnection) {
            await hubConnection.stop()
            setHubConnection(null)
        }
        setChatMode("selection")
        setMessages([])
        setSessionId(null)
    }

    const handleSendMessage = async () => {
        if (!inputValue.trim() || !sessionId) return

        const newMessage: Message = {
            id: Date.now().toString(),
            content: inputValue,
            sender: "user",
            timestamp: new Date(),
            senderName: "Bạn",
        }
        setMessages((prev) => [...prev, newMessage])
        setInputValue("")

        if (hubConnection && hubConnection.state === "Connected") {
            setIsTyping(true)
            try {
                console.log("invoke SendMessageAsync with", {
                    sessionId,
                    senderType: "User",
                    content: newMessage.content
                });

                await hubConnection.invoke(
                    "SendMessageAsync",
                    sessionId,
                    "User",
                    newMessage.content
                )
            } catch (err) {
                console.error("Gọi SendMessageAsync lỗi:", err)
                setIsTyping(false)
            }
        } else {
            console.warn("Hub chưa kết nối hoặc đã bị ngắt!")
        }
    }

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
                >
                    <MessageCircle className="h-6 w-6 text-white" />
                </Button>
                <div className="absolute -top-12 right-0 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                    Cần hỗ trợ? Chat ngay!
                </div>
            </div>
        )
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Card
                className={cn(
                    "w-80 shadow-2xl border-0 overflow-hidden transition-all duration-300",
                    isMinimized ? "h-16" : "h-96"
                )}
            >
                {/* Header */}
                <CardHeader className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {chatMode !== "selection" && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={resetChat}
                                    className="text-white hover:bg-white/20 p-1 h-auto"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            )}
                            <div className="flex items-center space-x-2">
                                {chatMode === "ai" && <Bot className="h-5 w-5" />}
                                {chatMode === "doctor" && <UserCheck className="h-5 w-5" />}
                                {chatMode === "selection" && <MessageCircle className="h-5 w-5" />}
                                <div>
                                    <h3 className="font-semibold text-sm">
                                        {chatMode === "selection" && "Hỗ trợ trực tuyến"}
                                        {chatMode === "ai" && "AI Assistant"}
                                        {chatMode === "doctor" && "Bác sĩ trực tuyến"}
                                    </h3>
                                    {chatMode === "doctor" && (
                                        <div className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs opacity-90">Đang tìm bác sĩ trực tuyến...</span>
                                        </div>
                                    )}
                                    {chatMode === "ai" && <span className="text-xs opacity-90">Luôn sẵn sàng hỗ trợ</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="text-white hover:bg-white/20 p-1 h-auto"
                            >
                                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:bg-white/20 p-1 h-auto"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                {!isMinimized && (
                    <CardContent className="p-0 flex flex-col h-80">
                        {/* Mode Selection */}
                        {chatMode === "selection" && (
                            <div className="flex-1 p-6 space-y-4">
                                <div className="text-center mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-2">Chào mừng bạn đến với MediSchedule!</h4>
                                    <p className="text-sm text-gray-600">Bạn muốn được hỗ trợ như thế nào?</p>
                                </div>
                                <Button
                                    onClick={() => handleModeSelect("ai")}
                                    className="w-full justify-start h-auto p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 text-blue-700"
                                    variant="outline"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-500 rounded-full">
                                            <Bot className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold">Chat với AI</div>
                                            <div className="text-xs opacity-75">Tư vấn triệu chứng & chẩn đoán sơ bộ</div>
                                        </div>
                                    </div>
                                </Button>

                                <Button
                                    onClick={() => handleModeSelect("doctor")}
                                    className="w-full justify-start h-auto p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 border border-emerald-200 text-emerald-700"
                                    variant="outline"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-emerald-500 rounded-full">
                                            <UserCheck className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold">Chat với Bác sĩ</div>
                                            <div className="text-xs opacity-75">Tư vấn trực tuyến cùng bác sĩ</div>
                                        </div>
                                    </div>
                                </Button>

                                <div className="text-center pt-4">
                                    <Badge variant="outline" className="text-xs">
                                        Miễn phí tư vấn cơ bản
                                    </Badge>
                                </div>
                            </div>
                        )}

                        {/* Chat Interface */}
                        {chatMode !== "selection" && (
                            <>
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
                                        >
                                            <div
                                                className={cn(
                                                    "max-w-[80%] rounded-lg p-3 text-sm",
                                                    message.sender === "user" ? "bg-teal-500 text-white" : "bg-white border shadow-sm"
                                                )}
                                            >
                                                {message.sender !== "user" && (
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarFallback className="text-xs bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
                                                                {message.sender === "bot" ? "AI" : "BS"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-xs font-medium text-gray-600">
                              {message.senderName}
                            </span>
                                                    </div>
                                                )}
                                                <div className="whitespace-pre-line">{message.content}</div>
                                                <div
                                                    className={cn(
                                                        "text-xs mt-1",
                                                        message.sender === "user" ? "text-teal-100" : "text-gray-400"
                                                    )}
                                                >
                                                    {message.timestamp.toLocaleTimeString("vi-VN", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-white border shadow-sm rounded-lg p-3 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarFallback className="text-xs bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
                                                            {chatMode === "ai" ? "AI" : "BS"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex space-x-1">
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                        <div
                                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                            style={{ animationDelay: "0.1s" }}
                                                        ></div>
                                                        <div
                                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                            style={{ animationDelay: "0.2s" }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-4 border-t bg-white">
                                    <div className="flex space-x-2">
                                        <Input
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder={
                                                chatMode === "ai"
                                                    ? `Mô tả triệu chứng (ví dụ: "Tôi sốt 38.5°C, ho, đau đầu, mệt mỏi")`
                                                    : `Nhập tin nhắn cho bác sĩ...`
                                            }
                                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                            className="flex-1"
                                        />
                                        <Button
                                            onClick={handleSendMessage}
                                            disabled={!inputValue.trim()}
                                            className="bg-teal-500 hover:bg-teal-600"
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                )}
            </Card>
        </div>
    )
}