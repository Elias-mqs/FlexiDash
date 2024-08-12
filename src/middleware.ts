import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const currentUser = request.cookies.get('ssnAuth');
    console.log(currentUser)
    console.log(request)
    console.log(request.url)
    try{
        if(!currentUser){
            return NextResponse.redirect(new URL('/accounts/login', request.url))
        }
        if( request.nextUrl.pathname === '/accounts/:path*' ) {
            return NextResponse.redirect(new URL('/', request.url));
        }



    }catch(error){
        console.error(error)
    }
}

export const config = {
    matcher: [
        '/',
        '/modules/:path*',
        // '/accounts/:path*'
    ]
}