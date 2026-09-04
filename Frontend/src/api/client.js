import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
})

export const getEmails = (folder = 'inbox', page = 1) =>
  client.get('/emails', { params: { folder, page } }).then((r) => r.data)

export const getEmail = (id) => client.get(`/emails/${id}`).then((r) => r.data)

export const sendEmail = (payload) => client.post('/emails/send', payload).then((r) => r.data)

export const replyEmail = (payload) => client.post('/emails/reply', payload).then((r) => r.data)

export const forwardEmail = (payload) => client.post('/emails/forward', payload).then((r) => r.data)

export const getFolders = () => client.get('/folders').then((r) => r.data)

export const markRead = (id, read = true) =>
  client.post(`/emails/${id}/read`, { read }).then((r) => r.data)

export const markStar = (id, starred = true) =>
  client.post(`/emails/${id}/star`, { starred }).then((r) => r.data)

export const searchEmails = (q) => client.get('/emails/search', { params: { q } }).then((r) => r.data)

export default client
