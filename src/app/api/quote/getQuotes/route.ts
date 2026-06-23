import { NextResponse } from 'next/server';
import { getQuotes } from '@/src/services/administracion';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
 const { searchParams } = new URL(req.url);
    const quote = searchParams.get('quote');
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json({ success: false, message: 'No hay conexión' }, { status: 401 });
    }
     if (!quote) {
            return NextResponse.json(
                { success: false, message: 'Parámetros requeridos: id_user, role' },
                { status: 400 }
            );
        }
    try {
        const res = await getQuotes(token, quote);

        switch (res.status) {
            case 200:
                return NextResponse.json({
                    success: true,
                    message: res.message,
                    page: res.page,
                    limit: res.limit,
                    total: res.total,
                    total_pages: res.total_pages,
                    from: res.from,
                    to: res.to,
                    data: res.data
                }, { status: 200 });

            case 401:
                return NextResponse.json({
                    success: false,
                    message: 'No autorizado. Token inválido o expirado.'
                }, { status: 401 });

            case 403:
                return NextResponse.json({
                    success: false,
                    message: 'Acceso prohibido.'
                }, { status: 403 });

            case 404:
                return NextResponse.json({
                    success: false,
                    message: res.message
                }, { status: 404 });

            case 422:
                return NextResponse.json({
                    success: false,
                    message: 'Datos inválidos en la solicitud.'
                }, { status: 422 });

            case 500:
                return NextResponse.json({
                    success: false,
                    message: 'Error interno del servidor externo.'
                }, { status: 502 });

            default:
                return NextResponse.json({
                    success: false,
                    message: `Error inesperado: Desconocido'}`,
                    status: res.status
                }, { status: res.status ?? 500 });
        }

    } catch {
        return NextResponse.json(
            { success: false, message: "Error al consultar" },
            { status: 500 }
        );
    }
}