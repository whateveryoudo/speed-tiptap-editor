/*
 * @Author: ykx
 * @Date: 2022-11-22 11:11:51
 * @LastEditTime: 2022-11-25 14:28:12
 * @LastEditors: your name
 * @Description:
 * @FilePath: \we-knowledge-base\src\tiptap\core\hooks\useWebsocket.ts
 */
import { ref, reactive } from 'vue'
import { useUserStore } from '@/store'
interface TransformData {
  socketType: number | string
  data: any
}
const userStore = useUserStore()
export const useWebsocket = (url: string, docId: string) => {
  const wsUrl =
    (url || import.meta.env.VITE_APP_WS_URL) +
    '/wss/' +
    docId +
    '?userId=' +
    userStore?.userInfo?.id
  const ws = ref()
  const isConnected = ref(false)
  //   const retryConnectCount = ref(0);
  const callBackMapping = reactive<Record<string, any>>({})
  const connect = () => {
    if (!window.WebSocket) {
      return console.log('您的浏览器不支持WebSocket')
    }
    ws.value = new WebSocket(wsUrl)
    ws.value.onopen = () => {
      console.log('连接成功')
      isConnected.value = true
    }
    ws.value.onclose = () => {
      isConnected.value = false
      //   retryConnectCount.value++;
      setTimeout(() => {
        connect()
      }, 500)
    }
    ws.value.onmessage = (msg: any) => {
      const recvData: TransformData = JSON.parse(msg.data)
      const socketType = String(recvData.socketType)
      if (socketType && callBackMapping[socketType]) {
        callBackMapping[socketType](recvData)
      }
    }
  }
  const subscribe = (event: string | number, cb: any) => {
    typeof cb === 'function' && (callBackMapping[event] = cb)
  }
  const send = (data: TransformData) => {
    if (isConnected.value) {
      try {
        ws.value.send(JSON.stringify(data))
      } catch (error: unknown) {
        throw new Error(error as string)
      }
    } else {
      setTimeout(() => {
        ws.value.send(JSON.stringify(data))
      }, 500)
    }
  }
  const close = () => {
    isConnected.value = false
    ws.value.close()
  }
  const unsubscribe = (event: string | number) => {
    callBackMapping[event] = null
  }
  connect()
  return {
    send,
    subscribe,
    close,
    unsubscribe,
  }
}
