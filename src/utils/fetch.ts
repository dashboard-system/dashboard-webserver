interface FetchPostProps {
  url: string
  data: object
}

const fetchPost = ({ url, data }: FetchPostProps) => {
  return fetch(`${import.meta.env.VITE_APP_WEB_SERVER}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

export { fetchPost }
