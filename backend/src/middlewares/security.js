import helmet from 'helmet';
import xss from 'xss-clean';


// protetions for header attacks
export const securityMiddleware = [
    helmet(),
    xss()
]