import {
  IconLayoutDashboard,
  IconMessageDots,
  IconChartLine,
  IconClipboardText,
  IconWallet,
  IconSettings,
  IconTimeline,
  IconUserPlus,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "MAIN",
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    id: uniqueId(),
    title: "Chatbox",
    icon: IconMessageDots,
    href: "/chatbox",
  },
  {
    id: uniqueId(),
    title: "Analytics",
    icon: IconChartLine,
    href: "/analytics",
  },
  {
    id: uniqueId(),
    title: "Leads",
    icon: IconUserPlus,
    href: "/leads",
  },
  {
    navlabel: true,
    subheader: "ACCOUNT",
  },
  {
    id: uniqueId(),
    title: "Plan",
    icon: IconClipboardText,
    href: "/plan",
  },
  {
    id: uniqueId(),
    title: "Billing",
    icon: IconWallet,
    href: "/billing",
  },
  {
    id: uniqueId(),
    title: "Setting",
    icon: IconSettings,
    href: "/settings",
  },
  {
    id: uniqueId(),
    title: "Activity",
    icon: IconTimeline,
    href: "/activity",
  },
];

export default Menuitems;
