import { NextResponse } from 'next/server';
import { getSearch } from '@/src/services/disponibilidad';
import { prepareItemSearch } from '@/src/lib/searchValidation';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    const { destination, passengers, startRange, endRange, search, page, limit } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json({ success: false, message: 'No hay conexión' }, { status: 401 });
    }

    const prepared = prepareItemSearch({
        destination: Number(destination),
        passengers: Number(passengers),
        startRange: startRange ?? '',
        endRange: endRange ?? '',
        search: search ?? '',
        page: Number(page) || 1,
        limit: Number(limit) || 12,
    });
    if (!prepared.ok) {
        return NextResponse.json({ success: false, message: prepared.error }, { status: 400 });
    }

    const {
        destination: normalizedDestination,
        passengers: normalizedPassengers,
        startRange: normalizedStartRange,
        endRange: normalizedEndRange,
        search: normalizedSearch,
        page: normalizedPage,
        limit: normalizedLimit,
    } = prepared.params;

    try {
        const res = await getSearch(
            token,
            normalizedDestination,
            normalizedPassengers,
            normalizedStartRange,
            normalizedEndRange,
            normalizedPage,
            normalizedLimit,
            normalizedSearch
        );

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