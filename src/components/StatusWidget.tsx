"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./StatusWidget.module.css";
import clsx from "clsx";

interface ComponentStatus {
  id: string;
  name: string;
  group_name?: string;
  current_status: "operational" | "degraded_performance" | "partial_outage" | "full_outage";
}

interface Incident {
  id: string;
  name: string;
  status: string;
  url: string;
  current_worst_impact: string;
  affected_components: ComponentStatus[];
}

interface StatusSummary {
  page_title: string;
  page_url: string;
  ongoing_incidents: Incident[];
  in_progress_maintenances: any[];
  scheduled_maintenances: any[];
}

export default function StatusWidget() {
  const [summary, setSummary] = useState<StatusSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("https://status.platevault.es/api/v1/summary");
        const data = await res.json();
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch status:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.dotWrapper}>
          <div className={clsx(styles.dot, styles.dotLoading)}></div>
        </div>
        <span className={styles.label}>Cargando estado...</span>
      </div>
    );
  }

  const hasIncidents = summary?.ongoing_incidents && summary.ongoing_incidents.length > 0;
  const hasMaintenance = summary?.in_progress_maintenances && summary.in_progress_maintenances.length > 0;

  let statusText = "Sistemas Operativos";
  let statusClass = "operational";

  if (hasIncidents) {
    const worstImpact = summary.ongoing_incidents[0].current_worst_impact;
    if (worstImpact === "full_outage") {
      statusText = "Interrupción Total";
      statusClass = "critical";
    } else {
      statusText = "Incidencia Detectada";
      statusClass = "degraded";
    }
  } else if (hasMaintenance) {
    statusText = "Mantenimiento en Curso";
    statusClass = "maintenance";
  }

  return (
    <Link
      href={summary?.page_url || "https://status.platevault.es/"}
      target="_blank"
      className={clsx(styles.container, styles[statusClass])}
    >
      <div className={styles.dotWrapper}>
        <div className={styles.dot}>
          <div className={styles.pulse}></div>
        </div>
      </div>
      <span className={styles.label}>{statusText}</span>
    </Link>
  );
}
