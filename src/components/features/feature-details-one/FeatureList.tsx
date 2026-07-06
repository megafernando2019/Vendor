import { JSX } from "react"

interface DataType {
   id: number;
   icon: JSX.Element;
   sub_title: string;
   title: string;
}

const list_data: DataType[] = [
   {
      id: 1,
      icon: (<><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M9 4.20V9L12.2 10.60M17 9C17 13.42 13.42 17 9 17C4.58 17 1 13.42 1 9C1 4.58 4.58 1 9 1C13.42 1 17 4.58 17 9Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg></>),
      sub_title: "Duration",
      title: "4 days",
   },
   {
      id: 2,
      icon: (<><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M16 8.5C16 12.64 12.64 16 8.5 16M16 8.5C16 4.36 12.64 1 8.5 1M16 8.5H1M8.5 16C4.36 16 1 12.64 1 8.5M8.5 16C10.376 13.95 11.44 11.281 11.5 8.5C11.44 5.72 10.376 3.05 8.5 1M8.5 16C6.62 13.95 5.56 11.281 5.5 8.5C5.56 5.72 6.62 3.05 8.5 1M1 8.5C1 4.36 4.36 1 8.5 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg></>),
      sub_title: "Type",
      title: "Adventure",
   },
   {
      id: 3,
      icon: (<><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M1.7 17.2C1.5 17.2 1.3 17.1 1.2 17C1.1 16.8 1 16.7 1 16.5C1 15.1 1.4 13.7 2.1 12.4C2.8 11.2 3.9 10.1 5.1 9.4C4.6 8.8 4.2 8 4 7.2C3.9 6.4 3.9 5.5 4.1 4.8C4.3 4 4.8 3.2 5.3 2.6C5.9 2 6.6 1.5 7.3 1.3C7.9 1.1 8.5 1 9.1 1C9.3 1 9.6 1 9.8 1C10.6 1.1 11.4 1.4 12.1 1.9C12.8 2.4 13.3 3 13.7 3.7C14.1 4.4 14.3 5.2 14.3 6.1C14.3 7.3 13.9 8.5 13.1 9.4C13.7 9.8 14.3 10.2 14.9 10.7C15.7 11.5 16.2 12.3 16.7 13.3C17.1 14.3 17.3 15.3 17.3 16.4C17.3 16.6 17.2 16.8 17.1 16.9C17 17 16.8 17.1 16.6 17.1C16.5 17.1 16.4 17.1 16.3 17C16.2 17 16.1 16.9 16.1 16.8C16 16.7 16 16.7 15.9 16.6C15.9 16.5 15.8 16.4 15.8 16.3C15.8 15.4 15.6 14.6 15.3 13.8C15 13 14.5 12.3 13.8 11.7C13.2 11.2 12.6 10.7 11.9 10.4C11.1 10.9 10.2 11.2 9.1 11.2C8.1 11.2 7.1 10.9 6.3 10.4C5.2 10.9 4.2 11.7 3.5 12.8C2.8 13.9 2.4 15.1 2.4 16.4C2.4 16.6 2.3 16.8 2.2 16.9C2.1 17.1 1.9 17.2 1.7 17.2ZM9.1 2.5C8.4 2.5 7.7 2.7 7.1 3.1C6.4 3.5 6 4.1 5.7 4.7C5.4 5.4 5.3 6.1 5.5 6.9C5.6 7.6 6 8.3 6.5 8.8C7 9.3 7.7 9.7 8.4 9.8C8.6 9.8 8.9 9.9 9.1 9.9C9.6 9.9 10.1 9.8 10.5 9.6C11.2 9.3 11.7 8.9 12.2 8.2C12.6 7.6 12.8 6.9 12.8 6.2C12.8 5.2 12.4 4.3 11.7 3.6C11 2.8 10.1 2.5 9.1 2.5Z" fill="currentColor" />
      </svg></>),
      sub_title: "Group Size",
      title: "50 People",
   },
   {
      id: 4,
      icon: (<><svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M11.5 6.53L4.5 2.65M1.21 4.70L8 8.48L14.79 4.70M8 16V8.47M15 11.46V5.48C15 5.22 14.93 4.96 14.79 4.73C14.65 4.51 14.46 4.32 14.22 4.19L8.78 1.20C8.54 1.07 8.27 1 8 1C7.73 1 7.46 1.07 7.22 1.20L1.78 4.19C1.54 4.32 1.35 4.51 1.21 4.73C1.07 4.96 1 5.22 1 5.48V11.46C1 11.72 1.07 11.98 1.21 12.204C1.35 12.43 1.54 12.62 1.78 12.75L7.22 15.74C7.46 15.87 7.73 15.94 8 15.94C8.27 15.94 8.54 15.87 8.78 15.74L14.22 12.75C14.46 12.62 14.65 12.43 14.79 12.204C14.93 11.98 15 11.72 15 11.46Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </svg></>),
      sub_title: "Languages",
      title: "English",
   },
];

const FeatureList = () => {
   return (
      <ul>
         {list_data.map((item) => (
            <li key={item.id}>
               <span className="icon">{item.icon}</span>
               <div>
                  <span className="title">{item.sub_title}</span>
                  <span className="duration">{item.title}</span>
               </div>
            </li>
         ))}
      </ul>
   )
}

export default FeatureList
