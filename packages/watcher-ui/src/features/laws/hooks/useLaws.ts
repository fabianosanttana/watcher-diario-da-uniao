import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import {
  LawResponse,
  LawResponseParams
} from '../interfaces/law-response.interface'

const useLaws = () => {
  const [currentLawId, setCurrentLawId] = useState<string>('')
  const baseAPIUrl = import.meta.env.VITE_BASE_API_URL

  const { isLoading, data, refetch } = useQuery<LawResponse[]>(
    'lawsData',
    () => {
      return fetch(baseAPIUrl).then((res) => res.json())
    }
  )

  const { isLoading: isLoadingLaw, data: law } = useQuery<LawResponse>(
    ['lawData', currentLawId],
    (fn) => {
      return fetch(baseAPIUrl + '/' + fn.queryKey[1]).then((res) => res.json())
    },
    { refetchOnWindowFocus: false, refetchOnReconnect: false }
  )

  const deleteLaw = (id: string) => {
    return fetch(baseAPIUrl + '/' + id, {
      method: 'DELETE'
    }).finally(() => {
      refetch()
    })
  }

  const addLaw = async (
    title: string,
    url: string,
    params?: LawResponseParams | null
  ) => {
    return await fetch(baseAPIUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        url,
        ...(params ?? {})
      })
    })
  }

  const subscribeToLaw = async (id: string, email: string) => {
    return await fetch(baseAPIUrl + '/' + id + '/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email
      })
    })
  }

  const { isLoading: isSubscribing, mutateAsync: subscribeToLawAsync } =
    useMutation({
      mutationFn: (data: { id: string; email: string }) => {
        return subscribeToLaw(data.id, data.email)
      },
      onSuccess: () => {
        refetch()
      }
    })

  const { isLoading: isAdding, mutateAsync } = useMutation({
    mutationFn: (data: {
      title: string
      url: string
      params?: LawResponseParams | null
    }) => {
      return addLaw(data.title, data.url, data.params)
    },
    onSuccess: () => {
      refetch()
    }
  })

  const { isLoading: isDeleting, mutateAsync: deleteLawAsync } = useMutation({
    mutationFn: (id: string) => {
      return deleteLaw(id)
    },
    onSuccess: () => {
      refetch()
    }
  })

  return {
    laws: data,
    load: refetch,
    isLoading,
    addLaw: mutateAsync,
    isAdding,
    deleteLaw: deleteLawAsync,
    isDeleting,
    isLoadingLaw,
    law,
    loadLaw: setCurrentLawId,
    currentLawId,
    subscribeToLaw: subscribeToLawAsync,
    isSubscribing
  }
}

export default useLaws
