import helmet from 'helmet';
import xss from 'xss-clean';



export const securityMiddleware = [
    helmet(),
    xss()
]