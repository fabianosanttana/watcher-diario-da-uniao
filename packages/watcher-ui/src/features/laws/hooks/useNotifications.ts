import { useCallback, useEffect, useState } from 'react'

// This function was replaced by email notifications
// This is here just for consultation
const useBrowserNotifications = () => {
  const [enabled, setEnabled] = useState(false)
  const [permission, setPermission] =
    useState<NotificationPermission>('default') // eslint-disable-line

  const requestPermission = useCallback(() => {
    console.log('request permission')
    if (permission === 'granted') {
      return
    }

    Notification.requestPermission().then((result) => {
      setPermission(result)
      setEnabled(result === 'granted')
    })
  }, [permission])

  useEffect(() => {
    if (permission === 'granted') {
      setEnabled(true)
    }
  }, [permission])

  const showNotification = useCallback(
    // eslint-disable-next-line
    (title: string, options?: NotificationOptions) => {
      if (!enabled) {
        return
      }

      new Notification(title, options)
    },
    [enabled]
  )

  return { enabled, requestPermission, showNotification }
}

export default useBrowserNotifications
