"use client";

import { ChartBar, Logs,} from "lucide-react";
import AdminPageNavBar from "./PageNavBar";

const links = [
     {name: "Stats", href: "/admin/monitoring", icon: ChartBar},
     {name: "Logs", href: "/admin/monitoring/logs", icon: Logs},
]

export default function AdminMonitoringNavBar () {
     return(
          <AdminPageNavBar links={links} />
     )
}