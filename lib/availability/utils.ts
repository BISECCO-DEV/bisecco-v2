// Helpers purs (pas de "use server" — exportent constantes + fonction sync).

export type AvailabilitySlot = {
  id: number;
  day_of_week: number; // 0..6 (dimanche..samedi)
  start_time: string;  // 'HH:MM'
  end_time: string;    // 'HH:MM'
};

export const DAY_LABELS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"] as const;
export const DAY_SHORT = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"] as const;

export type AvailabilityStatus = {
  isOpenNow: boolean;
  currentSlotEnd: string | null;  // 'HH:MM' — heure de fin du créneau en cours
  nextSlot: { day: string; start: string; end: string } | null;
};

/**
 * Calcule si un pro est disponible à un instant donné (default: maintenant).
 * Renvoie aussi le prochain créneau d'ouverture si pas dispo actuellement.
 */
export function computeAvailabilityStatus(slots: AvailabilitySlot[], now = new Date()): AvailabilityStatus {
  if (slots.length === 0) {
    return { isOpenNow: false, currentSlotEnd: null, nextSlot: null };
  }

  const day = now.getDay();
  const hours = String(now.getHours()).padStart(2, "0");
  const mins = String(now.getMinutes()).padStart(2, "0");
  const currentTime = `${hours}:${mins}`;

  // Cherche un slot ACTUEL
  for (const s of slots) {
    if (s.day_of_week === day && s.start_time <= currentTime && currentTime < s.end_time) {
      return { isOpenNow: true, currentSlotEnd: s.end_time, nextSlot: null };
    }
  }

  // Sinon : prochain slot dans les 7 prochains jours
  const sorted = [...slots].sort((a, b) => {
    const dA = (a.day_of_week - day + 7) % 7;
    const dB = (b.day_of_week - day + 7) % 7;
    if (dA !== dB) return dA - dB;
    return a.start_time.localeCompare(b.start_time);
  });

  for (const s of sorted) {
    const daysAhead = (s.day_of_week - day + 7) % 7;
    // Aujourd'hui mais après l'heure courante
    if (daysAhead === 0 && s.start_time <= currentTime) continue;
    const label = daysAhead === 0 ? "Aujourd'hui"
      : daysAhead === 1 ? "Demain"
      : DAY_LABELS[s.day_of_week]!;
    return {
      isOpenNow: false,
      currentSlotEnd: null,
      nextSlot: { day: label, start: s.start_time, end: s.end_time },
    };
  }

  return { isOpenNow: false, currentSlotEnd: null, nextSlot: null };
}
