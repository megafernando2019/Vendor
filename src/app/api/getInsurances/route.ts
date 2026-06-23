import { NextResponse } from 'next/server';
import { getInsurancesCotizacion } from '@/src/services/cotizacion';
import { parseInsuranceProvidersMap } from '@/src/interfaces/seguros-cotizacion';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
 const { searchParams } = new URL(req.url);
    const mt = searchParams.get('mt');
    const days = searchParams.get('days');
    let response;
    try {    
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        
        if (!token) {
            return NextResponse.json(
                { success: false, message: 'No hay conexión' },
                { status: 401 }
            );
        }

        const res = await getInsurancesCotizacion(token, mt, days );
        switch (res.status) {
            case 200:
                response = NextResponse.json({
                    success: true,
                    data: parseInsuranceProvidersMap(res),
                }, { status: 200 });
                response.cookies.set('mt', String(mt ?? ''), {
                    httpOnly: false,
                    path: '/',
                    maxAge: 60 * 60 * 8,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                });
                break;

            case 401:
                response = NextResponse.json({
                    success: false,
                    message: 'No autorizado. Token inválido o expirado.'
                }, { status: 401 });
                break;

            case 403:
                response = NextResponse.json({
                    success: false,
                    message: 'Acceso prohibido.'
                }, { status: 403 });
                break;

            case 404:
                response = NextResponse.json({
                    success: false,
                    message: 'Recurso no encontrado.'
                }, { status: 404 });
                break;

            case 422:
                response = NextResponse.json({
                    success: false,
                    message: 'Datos inválidos en la solicitud.'
                }, { status: 422 });
                break;

            case 500:
                response = NextResponse.json({
                    success: false,
                    message: 'Error interno del servidor externo.'
                }, { status: 502 });
                break;

            default:
                response = NextResponse.json({
                    success: false,
                    message: `Error inesperado: ${res.statusText ?? 'Desconocido'}`,
                    status: res.status
                }, { status: res.status ?? 500 });
                break;
        }

    } catch {
        response =  NextResponse.json(
            { success: false, message: "Error al consultar" },
            { status: 500 }
        );
    }
    return response;
}
