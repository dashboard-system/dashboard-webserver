const SERVER_URL = 'http://0.0.0.0:3000'

interface FetchPostProps {
  url: string
  data: object
}

const fetchPost = ({ url, data }: FetchPostProps) => {
  return fetch(`${SERVER_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

export { fetchPost }
