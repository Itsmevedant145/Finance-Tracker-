import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut,
} from "react-icons/lu";
import { HiRefresh } from "react-icons/hi"; // added icon for Recurring

export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/dashboard",
    },
    {
        id: "02",
        label: "Income",
        icon: LuHandCoins,
        path: "/income",
    },
    {
        id: "03",
        label: "Expense",
        icon: LuWalletMinimal,
        path: "/expense",
    },
    {
        id: "04",
        label: "Recurring Transactions",
        icon: HiRefresh,  // new menu icon
        path: "/recurring-transactions", // new route
    },
    {
        id: "06",
        label: "Logout",
        icon: LuLogOut,
        path: "/logout",
    },
];
