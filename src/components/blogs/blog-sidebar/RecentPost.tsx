import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import img_1 from "@/assets/img/blog/sidebar/post-2.webp"
import img_2 from "@/assets/img/blog/sidebar/post-3.webp"
import img_3 from "@/assets/img/blog/sidebar/post-4.webp"
import img_4 from "@/assets/img/blog/sidebar/post.webp"

interface DataType {
   id: number;
   img: StaticImageData;
   title: string;
   date: string;
}

const recent_data: DataType[] = [
   {
      id: 1,
      img: img_1,
      title: "Europe’s finest and most scenic",
      date: " 26th Sep, 2024"
   },
   {
      id: 2,
      img: img_2,
      title: "The 5 best hikes around the world",
      date: " 26th Sep, 2024"
   },
   {
      id: 3,
      img: img_3,
      title: "The Surfing Man Will Blow Your Mind",
      date: " 26th Sep, 2024"
   },
   {
      id: 4,
      img: img_4,
      title: "Girlfriend Getaway at Rosewood",
      date: " 26th Sep, 2024"
   },
];

const RecentPost = () => {
   return (
      <div className="tg-blog-post tg-blog-sidebar-box mb-40">
         <h5 className="tg-blog-sidebar-title mb-25">Recent Posts</h5>
         {recent_data.map((item) => (
            <div key={item.id} className="tg-blog-post-item d-flex align-items-center">
               <div className="tg-blog-post-thumb mr-15">
                  <Image src={item.img} alt="post" />
               </div>
               <div className="tg-blog-post-content w-100">
                  <h4 className="tg-blog-post-title mb-5"><Link href="/blog-details">{item.title}</Link></h4>
                  <span className="tg-blog-post-date">
                     <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.77 0.78V3.27M4.23 0.78V3.27M0.78 5.76H13.22M2.16 2.02H11.84C12.60 2.02 13.22 2.58 13.22 3.27V11.98C13.22 12.67 12.60 13.22 11.84 13.22H2.16C1.40 13.22 0.78 12.67 0.78 11.98V3.27C0.78 2.58 1.40 2.02 2.16 2.02Z" stroke="#560CE3" strokeWidth="0.977778" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                     {item.date}
                  </span>
               </div>
            </div>
         ))}
      </div>
   )
}

export default RecentPost
