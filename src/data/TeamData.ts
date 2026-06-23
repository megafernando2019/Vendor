import { StaticImageData } from "next/image";


interface DataType {
   id: number;
   thum: StaticImageData;
   title: string;
   designation: string;
}

const team_data: DataType[] = [
   {
      id: 1,
      thum: "@/assets/img/galeria/nuevos.jpg",
      title: "Esther Howard",
      designation: "Consulting"
   },
   {
      id: 2,
      thum: "@/assets/img/galeria/comisiones.jpg",
      title: "Jane Cooper",
      designation: "Consulting"
   },
   {
      id: 3,
      thum: "@/assets/img/galeria/landing.png",
      title: "Kristin Watson",
      designation: "Consulting"
   },
   {
      id: 4,
      thum:  "@/assets/img/galeria/megasale.jpg",
      title: "Darrell Steward",
      designation: "Consulting"
   },
   {
      id: 5,
      thum:  "@/assets/img/galeria/asistencias.jpg",
      title: "Devon Lane",
      designation: "Consulting"
   },
   {
      id: 6,
      thum: team_6,
      title: "Theresa Web",
      designation: "Consulting"
   },
   {
      id: 7,
      thum: team_7,
      title: "Wade Warren",
      designation: "Consulting"
   },
   {
      id: 8,
      thum: team_1,
      title: "Ronald Richards",
      designation: "Consulting"
   },
]

export default team_data;