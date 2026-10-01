import { type EventItem } from "../types/event";
import { formatIsoDate, formatPrice, parsePrice, toIsoDate } from "../data/EventFormat";


const API_URL = "http://localhost:3000";
const PLACEHOLDER_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="160"><rect width="100%" height="100%" fill="#e5e7eb"/></svg>',
)}`;


export type MyEvent = EventItem & {
  userId?: string;
  categoryId?: string | null;
};

interface ApiEvent {
  id: string;
  title?: string;
  description?: string;
  date: string;
  address: string;
  price: number;
  capacity: number;
  image?: string | null;
  userId?: string;
  categoryId?: string | null;
  category?: { id: string; name: string } | null;
}



interface ApiRegistration {
  id: string;
  userId?: string;
  eventId?: string;
  event?: ApiEvent;
}

function toMyEvent(e: ApiEvent): MyEvent {
  return {
    id: e.id,
    title: e.title || "Без названия",

    category: (e.category?.name ?? "") as EventItem["category"],
    date: formatIsoDate(e.date),
    location: e.address,
    price: formatPrice(e.price),
    seatsLeft: e.capacity,
    imageUrl: e.image || PLACEHOLDER_IMAGE,
    userId: e.userId,
    categoryId: e.categoryId,
  };
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {

  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      response.status === 401 ? "Ошибка 401: нужно войти в аккаунт" : `Ошибка ${response.status}`,
    );
  }

  return response.status === 204 ? (undefined as T) : response.json();
}


export function getCurrentUserId(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return String(payload.id ?? payload.sub ?? "") || null;
  } catch {
    return null;
  }
}


export async function getEvents(): Promise<MyEvent[]> {
  const data = await request<ApiEvent[]>("/events");
  return data.map(toMyEvent);
}


export async function getMyRegistrations(): Promise<MyEvent[]> {
  const data = await request<ApiRegistration[]>("/registrations/my");
  return data.flatMap((r) => (r.event ? [toMyEvent(r.event)] : []));
}


export async function updateEvent(event: MyEvent): Promise<void> {
  await request(`/events/${event.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      title: event.title,
      date: toIsoDate(event.date),
      address: event.location,
      price: parsePrice(event.price),
      capacity: event.seatsLeft,
    }),
  });
}


export async function deleteEvent(id: string): Promise<void> {
  await request(`/events/${id}`, { method: "DELETE" });
}