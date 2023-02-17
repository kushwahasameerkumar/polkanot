import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3100'

export const calls = {
    auth: async (address, signature) => {
        const response = {
            isError: false,
            message: 'Successful!'
        }

        try {
            await axios({
                withCredentials: true,
                method: "post",
                url: "/auth",
                data: {
                    address,
                    signature,
                    token: Math.random().toString(36).slice(2)
                }
            })
        } catch(err) {
            response.isError = true
            response.message = err.message
        }

        return response
    },

    getChannels: async () => {
        const response = {
            isError: false,
            message: 'Successful!',
            channels: []
        }

        try {
            const res = await axios({
                withCredentials: true,
                method: "get",
                url: "/get-channels"
            })
            response.channels = res?.data?.channels
        } catch(err) {
            response.isError = true
            response.message = err.message
        }

        return response
    },

    getSubscriberInfo: async () => {
        const response = {
            isError: false,
            message: 'Successful!',
            info: undefined
        }

        try {
            const res = await axios({
                withCredentials: true,
                method: "get",
                url: "/get-subscriber-info"
            })
            response.info = res.data
        } catch(err) {
            response.isError = true
            response.message = err.message
        }

        return response
    },

    subscribeChannel: async (channelId) => {
        let response = {
            isError: false,
            message: 'Successful!',
        }

        try {
            const res = await axios({
                withCredentials: true,
                method: "post",
                url: "/subscribe-channel",
                data: {
                    channelId
                }
            })
            response = res.data
        } catch(err) {
            response.isError = true
            response.message = err.message
        }

        return response
    },

    addWebhook: async (channelId, endpoint) => {
        let response = {
            isError: false,
            message: 'Successful!',
        }

        try {
            const res = await axios({
                withCredentials: true,
                method: "post",
                url: "/add-webhook",
                data: {
                    channelId,
                    endpoint
                }
            })
            response = res.data
        } catch(err) {
            response.isError = true
            response.message = err.message
        }

        return response
    }
}