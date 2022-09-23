export default function ({ $axios, redirect }) {
    $axios.onRequest(config => {
        const token = window.localStorage.getItem('token')
        if(token) {
            config.headers['authorization'] = token
        }
        return config
    })
    $axios.onResponse(response => {
        switch(response.data.code) {
            case 403 :
                redirect('/login')
            break
        }
        return response
    })  
    $axios.onError(error => {
        const code = parseInt(error.response && error.response.status)
        if(code != 200){
            console.log('服务器' + code + '错误')
         }
    })
}