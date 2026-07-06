interface DataType {
   id: number;
   thum: string;
   title: string;
   designation: string;
}

const team_data: DataType[] = [
   {
      id: 1,
      thum: "/assets/img/galeria/nuevos.webp",
      title: "Esther Howard",
      designation: "Consulting"
   },
   {
      id: 2,
      thum: "/assets/img/galeria/comisiones.webp",
      title: "Jane Cooper",
      designation: "Consulting"
   },
   {
      id: 3,
      thum: "/assets/img/galeria/landing.webp",
      title: "Kristin Watson",
      designation: "Consulting"
   },
   {
      id: 4,
      thum:  "/assets/img/galeria/megasale.webp",
      title: "Darrell Steward",
      designation: "Consulting"
   },
   {
      id: 5,
      thum:  "/assets/img/galeria/asistencias.webp",
      title: "Devon Lane",
      designation: "Consulting"
   }
]

export default team_data;