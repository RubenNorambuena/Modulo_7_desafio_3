export const handleError = (code) => {
    switch (code) {
        case "400":
            return {
                status: 400,
                message: "Error 400 Bad Request",
            };
        case "404":
            return {
                status: 404,
                message: "404 Page Not Found",
            };
        case "22P02":
            return {
                status: 400,
                message: "Error 22P02 Invalid Input Syntax for Integer",
            };
        case "23505":
            return {
                status: 409,
                message: "Error 23505 Unique Violation",
            };
        default:
            // Si el código es desconocido o no se proporciona un mensaje específico
            if (typeof code === 'object' && code.message) {
                return {
                    status: 500,
                    message: code.message,
                };
            }
            return {
                status: 500,
                message: "500 Internal Server Error",
            };
    }
};
