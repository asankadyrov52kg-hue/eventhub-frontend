import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { deleteEvent, updateEvent, type MyEvent } from "../api/events";
import { type EventItem } from "../types/event";
import EventCard from "../components/EventCard";
import ConfirmModal from "../components/ConfirmModal";
import EditEventModal from "../components/EditEventModal";

type Tab = "created" | "registered";
type PendingAction = { kind: "delete" | "unregister"; event: MyEvent } | null;

interface MyEventsPageProps {
  onCreateEvent?: () => void;
  onBrowseEvents?: () => void;
}

const outlineButton = "flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium py-2 rounded-lg transition-colors";
const dangerButton = "flex-1 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium py-2 rounded-lg transition-colors";

export default function MyEventsPage({}: MyEventsPageProps) {
  const navigate = useNavigate(); 
  const [tab, setTab] = useState<Tab>("created");
  const [created, setCreated] = useState<MyEvent[]>([]);
  const [registered, setRegistered] = useState<MyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [createdError, setCreatedError] = useState("");
  const [registeredError, setRegisteredError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [editing, setEditing] = useState<MyEvent | null>(null);
  const [pending, setPending] = useState<PendingAction>(null);
  const [notice, setNotice] = useState("");

    useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const token = localStorage.getItem("token");
    let currentUserId: string | null = null;

    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          window.atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload);
        currentUserId = payload.id || payload.sub; 
      } catch (e) {
        console.error("Ошибка парсинга токена:", e);
      }
    }

    const fetchCreatedEvents = fetch("http://localhost:3000/events", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    }).then(async (res) => {
      if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.data || []);
      
      const myCreatedList = currentUserId 
        ? list.filter((e: any) => e.userId === currentUserId || e.user?.id === currentUserId)
        : list;

      return myCreatedList.map((e: any) => ({
        ...e,
        category: e.category?.name || e.category || "Другое",
        location: e.address,
        seatsLeft: e.capacity,
        imageUrl: e.image || "https://placehold.co"
      }));
    });

        const fetchMyRegistrations = fetch("http://localhost:3000/registrations/my", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }).then(async (res) => {
      if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
      const rawData = await res.json();
      
      const list = Array.isArray(rawData) ? rawData : (rawData.data || rawData.registrations || []);
      
      const detailedEventsPromises = list.map(async (item: any) => {
        try {
          const eventRes = await fetch(`http://localhost:3000/events/${item.eventId}`);
          if (!eventRes.ok) return null;
          
          const eventDetails = await eventRes.json();
          
          return {
            ...eventDetails,
            category: eventDetails.category?.name || eventDetails.category || "Другое",
            location: eventDetails.address,
            seatsLeft: eventDetails.capacity,
            imageUrl: eventDetails.image || "https://placehold.co",
            registrationId: item.id
          };
        } catch {
          return null;
        }
      });

      const detailedEvents = await Promise.all(detailedEventsPromises);
      return detailedEvents.filter((e) => e !== null);
    });

    Promise.allSettled([fetchCreatedEvents, fetchMyRegistrations]).then(
      ([events, registrations]) => {
        if (cancelled) return;
        if (events.status === "fulfilled") {
          setCreated(events.value);
          setCreatedError("");
        } else {
          setCreatedError((events.reason as Error).message);
        }
        if (registrations.status === "fulfilled") {
          setRegistered(registrations.value);
          setRegisteredError("");
        } else {
          setRegisteredError((registrations.reason as Error).message);
        }
        setLoading(false);
      }
    );

    return () => { cancelled = true; };
  }, [reloadKey]);

  const retry = () => {
    setLoading(true);
    setCreatedError("");
    setRegisteredError("");
    setReloadKey((k) => k + 1);
  };

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const handleConfirm = async () => {
    if (!pending) return;
    const { kind, event } = pending;
    setPending(null);

    if (kind === "delete") {
      try {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:3000/events/${event.id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
        setCreated((prev) => prev.filter((e) => e.id !== event.id));
        setNotice("Мероприятие удалено");
      } catch (err) {
        setNotice(`Не удалось удалить: ${(err as Error).message}`);
      }
    } else {
      try {
        const token = localStorage.getItem("token");
        const regId = (event as any).registrationId;
        if (regId) {
          await fetch(`http://localhost:3000/registrations/${regId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
          });
        }
        setRegistered((prev) => prev.filter((e) => e.id !== event.id));
        setNotice("Запись успешно отменена");
      } catch (err) {
        setNotice("Не удалось отменить запись");
      }
    }
  };

  const handleSave = async (updated: EventItem) => {
    if (!editing) return;
    const merged: MyEvent = { ...editing, ...updated };
    try {
      await updateEvent(merged);
      setCreated((prev) => prev.map((e) => (e.id === merged.id ? merged : e)));
      setEditing(null);
      setNotice("Изменения сохранены");
    } catch (err) {
      setNotice(`Не удалось сохранить: ${(err as Error).message}`);
    }
  };

  const tabClass = (active: boolean) =>
    `relative pb-3 text-sm font-medium transition-colors ${
      active ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
    }`;

  const underline = <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-blue-600 rounded" />;
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Мои мероприятия
          </h1>
          <p className="text-gray-500">
            Управляйте своими событиями и записями в одном месте
          </p>
        </div>
        <button
          onClick={() => navigate("/create-event")}
          className="self-start sm:self-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          Создать мероприятие
        </button>
      </div>

      <div role="tablist" className="flex gap-8 border-b border-gray-200 mb-6">
        <button
          role="tab"
          aria-selected={tab === "created"}
          onClick={() => setTab("created")}
          className={tabClass(tab === "created")}
        >
          Созданные мной ({created.length})
          {tab === "created" && underline}
        </button>
        <button
          role="tab"
          aria-selected={tab === "registered"}
          onClick={() => setTab("registered")}
          className={tabClass(tab === "registered")}
        >
          Я записан ({registered.length})
          {tab === "registered" && underline}
        </button>
      </div>

      {loading && (
        <p className="py-16 text-center text-gray-500">Загружаем мероприятия…</p>
      )}

      {!loading && tab === "created" && createdError && (
        <ErrorBox
          title="Не удалось загрузить мероприятия"
          message={`${createdError}.`}
          onRetry={retry}
        />
      )}

      {!loading && tab === "registered" && registeredError && (
        <ErrorBox
          title="Не удалось загрузить ваши записи"
          message={registeredError}
          onRetry={retry}
        />
      )}

      {!loading && tab === "created" && !createdError && (
        <EventGrid
          events={created}
          empty={
            <EmptyState
              title="Вы пока не создали ни одного мероприятия"
              text="Опубликуйте первое событие, и оно появится в афише."
              buttonLabel="Создать мероприятие"
              onClick={() => navigate("/create-event")}
            />
          }
          actions={(event) => (
            <div className="flex gap-2">
              <button onClick={() => setEditing(event)} className={outlineButton}>
                Редактировать
              </button>
              <button
                onClick={() => setPending({ kind: "delete", event })}
                className={dangerButton}
              >
                Удалить
              </button>
            </div>
          )}
        />
      )}

      {!loading && tab === "registered" && !registeredError && (
        <EventGrid
          events={registered}
          empty={
            <EmptyState
              title="Вы пока никуда не записаны"
              text="Выберите мероприятие в афише и запишитесь на него."
              buttonLabel="Смотреть афишу"
              onClick={() => navigate("/events")}
            />
          }
          actions={(event) => (
            <button
              onClick={() => setPending({ kind: "unregister", event })}
              className={`${dangerButton} w-full`}
            >
              Отменить запись
            </button>
          )}
        />
      )}

      {editing && (
        <EditEventModal
          event={editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}

      {pending && (
        <ConfirmModal
          title={
            pending.kind === "delete"
              ? "Удалить мероприятие?"
              : "Отменить запись?"
          }
          message={
            pending.kind === "delete"
              ? `«${pending.event.title}» будет удалено без возможности восстановления.`
              : `Вы больше не будете записаны на «${pending.event.title}». Место освободится для других участников.`
          }
          confirmLabel={pending.kind === "delete" ? "Удалить" : "Отменить запись"}
          cancelLabel={pending.kind === "delete" ? "Отмена" : "Оставить запись"}
          onConfirm={handleConfirm}
          onCancel={() => setPending(null)}
        />
      )}

      {notice && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] rounded-lg bg-gray-900 px-4 py-2 text-sm text-white shadow-lg"
        >
          {notice}
        </div>
      )}
    </div>
  );
}

interface EventGridProps {
  events: MyEvent[];
  empty: ReactNode;
  actions: (event: MyEvent) => ReactNode;
}

function EventGrid({ events, empty, actions }: EventGridProps) {
  if (events.length === 0) return <>{empty}</>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {events.map((event) => (
        <EventCard key={event.id} event={event} actions={actions(event)} />
      ))}
    </div>
  );
}

interface ErrorBoxProps {
  title: string;
  message: string;
  onRetry: () => void;
}

function ErrorBox({ title, message, onRetry }: ErrorBoxProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
      <h2 className="text-lg font-semibold text-red-700">{title}</h2>
      <p className="mt-1 mb-4 text-sm text-red-600">{message}</p>
      <button
        onClick={onRetry}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
      >
        Повторить запрос
      </button>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  text: string;
  buttonLabel: string;
  onClick?: () => void;
}

function EmptyState({ title, text, buttonLabel, onClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="mt-1 mb-5 text-sm text-gray-500">{text}</p>
      <button
        onClick={onClick}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
