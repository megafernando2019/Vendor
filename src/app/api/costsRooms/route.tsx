import { NextResponse } from 'next/server';
import { getCostsRooms } from '@/src/services/cotizacion';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    const { destination_id, passengers, room_type, blockade_uid } = await req.json();
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

        const res = await getCostsRooms(token, destination_id, passengers, room_type, blockade_uid);

       console.log(res.data.status)
        switch (res.status || res.data.status) {
            case 200:
                response = NextResponse.json({
                    success: true,
                    data: res,
                }, { status: 200 });
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
                    message: res.message,
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
