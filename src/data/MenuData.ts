
interface MenuItem {
    id: number;
    title: string;
    link: string;
    has_dropdown: boolean;
    sub_menus?: {
        link: string;
        title: string;
    }[];
}

const menu_data: MenuItem[] = [
    {
        id: 1,
        title: "Home",
        link: "#",
        has_dropdown: false,
        sub_menus: [
            { link: "/", title: "Home" },
            { link: "/home-two", title: "Home Two" },
            { link: "/home-three", title: "Home Three" },
            { link: "/home-four", title: "Home Four" },
            { link: "/home-five", title: "Home Five" },
            { link: "/home-six", title: "Home Six" },
            { link: "/home-seven", title: "Home Seven" },
        ],
    },
    {
        id: 2,
        title: "Recomendaciones",
        link: "#",
        has_dropdown: false,
    },
    {
        id: 3,
        title: "Tus Listas",
        link: "/tus-listas",
        has_dropdown: false,
    }, 
    {
        id: 4,
        has_dropdown: false,
        title: "Administración",
        link: "/administracion",
    },
    {
        id: 5,
        title: "Regresa a Café",
        link: "#",
        has_dropdown: false,
        sub_menus: [],
    },

];

export default menu_data;