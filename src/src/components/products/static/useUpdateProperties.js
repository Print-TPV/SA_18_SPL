import { useEffect, useRef, useState } from 'react'

const useUpdateProperties = () => {
  const [promises, setPromises] = useState([])
  const [loading, setLoading] = useState(false)
  const lastPromise = useRef(null)
  const lastCallback = useRef(null)

  const addPromise = (promise, callback) => {
    setPromises((prev) => [...prev, promise])
    lastPromise.current = promise
    lastCallback.current = callback
  }

  useEffect(() => {
    const resolvePromises = async () => {
      setLoading(true)
      try {
        const promiseToResolve = await promises[0]
        if (promises[0] === lastPromise.current) {
          await lastCallback.current(promiseToResolve)
        }
        setPromises((prev) => prev.slice(1))
      } catch (e) {
        console.error(e)
        await lastCallback.current(null, e)
      }
      setLoading(false)
    }

    if (promises.length > 0) {
      resolvePromises()
    }
  }, [promises])

  return {
    addPromise,
    loading
  }
}

export default useUpdateProperties
