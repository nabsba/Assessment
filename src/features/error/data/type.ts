
export interface ErrorConfig {
    title: string;
    message: string;
    buttonText: string;
    icon: string;
}

export interface ErrorsContent {
    errors: {
        default: ErrorConfig;
        "404": ErrorConfig;        // Changed from not_found
        network: ErrorConfig;
        "500": ErrorConfig;        // Changed from server
        "401": ErrorConfig;        // Changed from unauthorized
        "403": ErrorConfig;        // Changed from forbidden
        "429": ErrorConfig;        // Changed from rate_limit
        "400": ErrorConfig;        // Changed from validation
        github_api: ErrorConfig;
        [key: string]: ErrorConfig;
    };
}