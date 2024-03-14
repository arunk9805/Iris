class ApiResponse {
    constructor(status, data, message="Success") {
        this.statusCode = status
        this.data = data
        this.message = message
        this.success = status < 400
    }
}

export { ApiResponse }