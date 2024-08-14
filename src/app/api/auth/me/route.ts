import { JwtService } from "@/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (token === '') {
        return NextResponse.json({ error: 'Token não disponivel', valid: false }, { status: 401 });
    }

    try {
        const decoded = JwtService.verify(token!);

        if(decoded !== "JWT_SECRET_NOT_FOUND" && decoded !== "INVALID_TOKEN"){
            return NextResponse.json({ valid: true, user: decoded });
        }
        if(decoded === 'INVALID_TOKEN'){
            return NextResponse.json({ valid: false, message: 'Token invalido ou expirado' });
        }

        throw new Error('Erro ao verificar token');

    } catch (error) {
        console.error('Error verifying token:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
