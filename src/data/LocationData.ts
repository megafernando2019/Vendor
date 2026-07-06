import { StaticImageData } from "next/image"

import location_1 from "@/assets/img/destination/tu/des-1.webp"
import location_2 from "@/assets/img/destination/tu/des-2.webp"
import location_3 from "@/assets/img/destination/tu/des-3.webp"
import location_4 from "@/assets/img/destination/tu/des-4.webp"

import location2_1 from "@/assets/img/location/su/destination.webp"
import location2_2 from "@/assets/img/location/su/destination-2.webp"
import location2_3 from "@/assets/img/location/su/destination-3.webp"
import location2_4 from "@/assets/img/location/su/destination-4.webp"
import location2_5 from "@/assets/img/location/su/destination-5.webp"
import location2_6 from "@/assets/img/location/su/destination-6.webp"

import location3_1 from "@/assets/img/location/location.webp"
import location3_2 from "@/assets/img/location/location-2.webp"
import location3_3 from "@/assets/img/location/location-3.webp"
import location3_4 from "@/assets/img/location/location-4.webp"

import location5_1 from "@/assets/img/location/location-2/thumb.webp"
import location5_2 from "@/assets/img/location/location-2/thumb-2.webp"
import location5_3 from "@/assets/img/location/location-2/thumb-3.webp"
import location5_4 from "@/assets/img/location/location-2/thumb-4.webp"

import location7_1 from "@/assets/img/location/location-5/location.webp"
import location7_2 from "@/assets/img/location/location-5/location-2.webp"
import location7_3 from "@/assets/img/location/location-5/location-3.webp"
import location7_4 from "@/assets/img/location/location-5/location-4.webp"

import food_img1 from "@/assets/img/foods/food-1.webp"
import food_img2 from "@/assets/img/foods/food-2.webp"
import food_img3 from "@/assets/img/foods/food-3.webp"
import food_img4 from "@/assets/img/foods/food-4.webp"
import food_img5 from "@/assets/img/foods/food-5.webp"

interface DataType {
   id: number;
   page: string;
   thumb: StaticImageData;
   title: string;
   total?: string;
   class?: string;
}

const location_data: DataType[] = [
   {
      id: 1,
      page: "home_1",
      thumb: location_1,
      title: "Paris",
      total: "05 ",
   },
   {
      id: 2,
      page: "home_1",
      thumb: location_2,
      title: "Australia",
      total: "08",
   },
   {
      id: 3,
      page: "home_1",
      thumb: location_3,
      title: "New York",
      total: "06",
   },
   {
      id: 4,
      page: "home_1",
      thumb: location_4,
      title: "Spain City",
      total: "07",
   },
   {
      id: 5,
      page: "home_1",
      thumb: location_2,
      title: "Australia",
      total: "08",
   },

   // home_2

   {
      id: 1,
      page: "home_2",
      thumb: location2_1,
      title: "New York City",
      class: "col-xl-3"
   },
   {
      id: 2,
      page: "home_2",
      thumb: location2_2,
      title: "Australia",
      class: "col-xl-3"
   },
   {
      id: 3,
      page: "home_2",
      thumb: location2_3,
      title: "California City",
      class: "col-xl-6"
   },
   {
      id: 4,
      page: "home_2",
      thumb: location2_4,
      title: "Japan",
      class: "col-xl-6"
   },
   {
      id: 5,
      page: "home_2",
      thumb: location2_5,
      title: "Spain City",
      class: "col-xl-3"
   },
   {
      id: 6,
      page: "home_2",
      thumb: location2_6,
      title: "Paris",
      class: "col-xl-3"
   },

   // home_3

   {
      id: 1,
      page: "home_3",
      thumb: location3_1,
      title: "Paris",
      total: "05 ",
   },
   {
      id: 2,
      page: "home_3",
      thumb: location3_2,
      title: "Australia",
      total: "08",
   },
   {
      id: 3,
      page: "home_3",
      thumb: location3_3,
      title: "New York",
      total: "06",
   },
   {
      id: 4,
      page: "home_3",
      thumb: location3_4,
      title: "Spain City",
      total: "07",
   },

   // home_5

   {
      id: 1,
      page: "home_5",
      thumb: location5_1,
      title: "Paris",
      total: "05 ",
   },
   {
      id: 2,
      page: "home_5",
      thumb: location5_2,
      title: "Australia",
      total: "08",
   },
   {
      id: 3,
      page: "home_5",
      thumb: location5_3,
      title: "New York",
      total: "06",
   },
   {
      id: 4,
      page: "home_5",
      thumb: location5_4,
      title: "Spain City",
      total: "07",
   },

   // home_6

   {
      id: 1,
      page: "home_6",
      thumb: location3_1,
      title: "Paris",
      total: "05 ",
   },
   {
      id: 2,
      page: "home_6",
      thumb: location3_2,
      title: "Australia",
      total: "08",
   },
   {
      id: 3,
      page: "home_6",
      thumb: location3_3,
      title: "New York",
      total: "06",
   },
   {
      id: 4,
      page: "home_6",
      thumb: location3_4,
      title: "Spain City",
      total: "07",
   },

   // home_7

   {
      id: 1,
      page: "home_7",
      thumb: food_img1,
      title: "American",
      total: "05",
   },
   {
      id: 2,
      page: "home_7",
      thumb: food_img2,
      title: "Mexican",
      total: "12",
   },
   {
      id: 3,
      page: "home_7",
      thumb: food_img3,
      title: "Italian",
      total: "11",
   },
   {
      id: 4,
      page: "home_7",
      thumb: food_img4,
      title: "Vegetarians",
      total: "04",
   },
   {
      id: 5,
      page: "home_7",
      thumb: food_img5,
      title: "Japanese",
      total: "13",
   },

   // home_7_2
   {
      id: 1,
      page: "home_7_2",
      thumb: location7_1,
      title: "New york City",
      total: "05",
   },
   {
      id: 2,
      page: "home_7_2",
      thumb: location7_2,
      title: "Australia",
      total: "07",
   },
   {
      id: 3,
      page: "home_7_2",
      thumb: location7_3,
      title: "Switzerland",
      total: "12",
   },
   {
      id: 4,
      page: "home_7_2",
      thumb: location7_4,
      title: "Japan City",
      total: "03",
   },
   {
      id: 5,
      page: "home_7_2",
      thumb: location7_2,
      title: "Australia",
      total: "07",
   },
   {
      id: 6,
      page: "home_7_2",
      thumb: location7_3,
      title: "Switzerland",
      total: "12",
   },
];

export default location_data;