import type { FAQData, FAQQuestions } from "@/src/interfaces/ui";

const DEFAULT_FAQ_DATA: FAQData = {
  Iconos: {
    General: "/icons/General.svg",
    Disponibilidad: "/icons/Disponibilidad.svg",
    Cotizaciones: "/icons/cotizaciones.svg",
    Reservaciones: "/icons/Reservaciones.svg",
  },
  General: {
    "Necesito contactar a un ejecutivo de ventas?":
      "Sí. Puedes comunicarte con tu ejecutivo asignado por teléfono o correo desde la sección de contacto. Si aún no tienes uno, nuestro equipo de ventas te asignará un agente según tu región para apoyarte con bloqueos, tarifas y seguimiento de reservas.",
    "Cuál es el horario de soporte?":
      "El soporte de Vendor está disponible de lunes a viernes de 9:00 a 18:00 (hora del centro de México). Fuera de ese horario puedes enviar tu solicitud por correo y te responderemos el siguiente día hábil.",
    "Necesito conocimiento técnico?":
      "No es necesario. Vendor está pensado para agencias de viajes: puedes consultar disponibilidad, cotizar y reservar desde una interfaz sencilla. Si necesitas capacitación, tu ejecutivo puede orientarte en una sesión breve de uso de la plataforma.",
    "Como me ayuda vendor a vender más?":
      "Vendor centraliza mega bloqueos, salidas confirmadas y precios actualizados en un solo lugar. Así cotizas más rápido, comparas opciones por destino y fechas, y entregas propuestas a tus clientes sin depender de múltiples correos o llamadas.",
  },
  Disponibilidad: {
    "Información sobre horarios y fechas.":
      "En Disponibilidad puedes filtrar por destino, número de pasajeros y rango de fechas. Verás programas con salidas reales, noches, precios desde y cantidad de bloques activos para armar tu propuesta con información vigente.",
    "Disponibilidad en fines de semana.":
      "La consulta en línea está disponible los 7 días. La confirmación de espacios y ajustes de bloqueo dependen del horario de operaciones (lunes a viernes); las solicitudes del fin de semana se procesan al iniciar la siguiente semana hábil.",
    "Reservas con anticipación.":
      "Recomendamos reservar con la mayor anticipación posible, especialmente en temporada alta y fechas festivas. Algunos destinos requieren depósito o pago parcial para garantizar el cupo según las políticas de cada bloqueo.",
  },
  Cotizaciones: {
    "Cómo solicitar una cotización.":
      "Selecciona el programa que te interese en Disponibilidad, indica pasajeros y fechas, y haz clic en el tour para generar la cotización. El sistema arma el detalle con tarifas y condiciones para que lo compartas con tu cliente o lo uses como base de reserva.",
    "Tiempo de respuesta de cotizaciones.":
      "Las cotizaciones generadas en la plataforma son inmediatas cuando hay disponibilidad en línea. Si el bloqueo requiere validación manual, tu ejecutivo te confirmará en un plazo máximo de 24 a 48 horas hábiles.",
    "Si tienen costo o no.":
      "Consultar y generar cotizaciones en Vendor no tiene costo adicional para agencias registradas. Solo aplican los pagos y cargos propios del paquete o bloqueo al confirmar la reservación según las condiciones del proveedor.",
  },
  Reservaciones: {
    "Cómo confirmar una reservación":
      "Una vez que tu cliente apruebe la propuesta, confirma desde la cotización indicando pasajeros, habitación y salida seleccionada. Recibirás el folio de reserva y las instrucciones de pago para liberar o garantizar los espacios.",
    "Políticas de cancelación.":
      "Cada bloqueo tiene sus propias políticas de cancelación, reembolso y penalidades según el proveedor y la anticipación. Revisa siempre los términos en la cotización antes de confirmar; tu ejecutivo puede aclarar casos especiales.",
    "Métodos de pago aceptados.":
      "Aceptamos transferencia bancaria y depósito en las cuentas autorizadas de Mega Travel. Para algunos productos también está disponible pago con tarjeta corporativa previa autorización. Los comprobantes deben enviarse dentro del plazo indicado en tu confirmación.",
  },
};

export interface FaqAccordionItem {
  id: number;
  title: string;
  desc: string;
}

export function flattenFaqData(data: FAQData): FaqAccordionItem[] {
  const categories = Object.keys(data).filter((key) => key !== "Iconos");
  let id = 1;
  const items: FaqAccordionItem[] = [];

  for (const category of categories) {
    const questions = data[category] as FAQQuestions;
    for (const [question, answer] of Object.entries(questions)) {
      items.push({
        id: id++,
        title: question,
        desc: answer,
      });
    }
  }

  return items;
}

export default DEFAULT_FAQ_DATA;