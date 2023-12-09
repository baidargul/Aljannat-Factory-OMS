'use client'

import axios from "axios"

const Setting_FETCH = async (name: string) => {
    const response: any = {
        status: 500,
        message: "",
        data: null
    }

    if (!name) {
        response.status = 400
        response.message = "Missing name"
        response.data = null
        return response
    }

    const data = {
        name,
        method: "READ"
    }

    let result

    await axios.post(`/api/settings/get/`, data).then(async (res) => {
        result = await res.data
        response.status = result.status
        response.message = result.message
        response.data = result.data
    }).catch((err) => {
        response.status = 500
        response.message = err.message
        response.data = null
    }).finally(() => {
        if (response.status === 200) {
            result = response.data
        }
    })

    return response
}

const Setting__WRITE = async (name: string, value1?: string, value2?: string, value3?: string) => {
    const response = {
        status: 500,
        message: "",
        data: null
    }

    if (!name) {
        response.status = 400
        response.message = "Missing name"
        response.data = null
        return response
    }

    if (!value1 && !value2 && !value3) {
        response.status = 400
        response.message = "Missing values"
        response.data = null
        return response
    }

    const data = {
        name,
        value1,
        value2,
        value3,
        method: "WRITE"
    }

    let result

    await axios.post(`/api/settings/get/`, data).then(async (res) => {
        result = await res.data
        response.status = result.status
        response.message = result.message
        response.data = result.data
    }).catch((err) => {
        response.status = 500
        response.message = err.message
        response.data = null
    })

    return response
}

export {
    Setting_FETCH,
    Setting__WRITE
}