export const baseURL = "http://localhost:8000/api"

export const secretPassphrase = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3Q6ODAwMFwvYXBpXC9pbmNvbWluZ3MiLCJpYXQiOjE2NzkzNzY5NjUsImV4cCI6MTY3OTM4MDU2NiwibmJmIjoxNjc5Mzc2OTY2LCJqdGkiOiJ0aTlZaEZSdlpWNlV5cTQxIiwic3ViIjoxLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.wbayeY3F-1MWRPdyiYVawmWn79UdjLPZ30siNXCkmK0"

// change the naming of data in session storage 
export const accessToken = "acdHRwOlwvXC9"
export const expiresIn = "exkzNzY5NjUsImV4"

// refresh the token everytime we call the endpoint
export const sessionStorageAccessToken = (access_token) => {
    sessionStorage.setItem(accessToken, access_token)
}

// headers for the endpoint
export const headersAuthorization = () => {
    const access_token = sessionStorage.getItem(accessToken)
    const headers = {
        'Authorization' : `Bearer ${access_token}` 
    }
    return headers
}

// notification message after form submit 
export const openToastMessage = (vstoast, position, variant, message) => {
    vstoast.show({
        title: `${message}`,
        variant,
        position,
    });
}

