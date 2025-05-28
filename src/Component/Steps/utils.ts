import axios from "axios"

export const getMasterData = (): Promise<any> => {
    return axios.get(`${process.env.REACT_APP_API_URL}/http/zehsw/getMasterData`, {
        headers: {
            'Authorization': `Basic ${process.env.REACT_APP_AUTH_BASE64}`,
        }
    }).then((response) => response.data)
}