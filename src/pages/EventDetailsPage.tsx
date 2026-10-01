import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface EventDetails {
  id: string;
  title: string;
  description: string;
  date: string;
  address: string;
  price: number;
  capacity: number;
  image?: string;
}

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const loadEventDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`http://localhost:3000/events/${id}`);
        if (!response.ok) throw new Error("Не удалось загрузить информацию о мероприятии");
        const data = await response.json();
        setEvent(data);
      } catch (err: any) {
        setError(err.message || "Ошибка соединения с сервером");
      } finally { 
        setLoading(false);
      }
    };
    if (id) loadEventDetails();
  }, [id]);

  const handleRegister = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Пожалуйста, войдите в аккаунт, чтобы записаться на мероприятие.");
      navigate("/login");
      return;
    }

    try {
      setIsRegistering(true);
      const response = await fetch("http://localhost:3000/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ eventId: id })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Не удалось записаться на мероприятие");
      }

      alert("Вы успешно записались на мероприятие!");
      if (event) {
        setEvent({ ...event, capacity: event.capacity - 1 });
      }
    } catch (err: any) {
      alert(err.message || "Произошла ошибка при регистрации");
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) {
    return <p className="text-center py-12 text-gray-500">Загрузка информации…</p>;
  }

  if (error || !event) {
    return <p className="text-center py-12 text-red-500">{error || "Мероприятие не найдено"}</p>;
  }

  const formattedDate = new Date(event.date).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <button
        onClick={() => navigate("/events")}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
      >
        <span>←</span> Назад к мероприятиям
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="w-full rounded-2xl overflow-hidden shadow-sm bg-gray-100 aspect-[16/10]">
            <img
              src={event.image || "https://placehold.co"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-950 mb-4">О мероприятии</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {event.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
            <div>
              <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-md mb-3">
                Мероприятие
              </span>
              <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight leading-tight">
                {event.title}
              </h1>
            </div>

            <div className="flex flex-col gap-4 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">📅</span>
                <div>
                  <p className="font-medium">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">📍</span>
                <div>
                  <p className="font-medium">{event.address}</p>
                  <button className="text-blue-600 hover:underline text-xs font-medium mt-1 block">
                    Показать на карте
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">₽</span>
                <p className="font-semibold text-base text-gray-950">
                  от {event.price} ₽
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">👥</span>
                <p className="font-medium">
                  Осталось {event.capacity} мест
                </p>
              </div>
            </div>

            <button
              onClick={handleRegister}
              disabled={isRegistering || event.capacity <= 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white disabled:text-gray-400 text-base font-semibold py-3.5 rounded-xl transition-all shadow-sm"
            >
              {isRegistering ? "Запись..." : event.capacity <= 0 ? "Мест нет" : "Записаться"}
            </button>
          </div>

          <div className="flex items-start gap-3 px-2 text-xs text-gray-400">
            <span className="text-base mt-0.5">🛡️</span>
            <p className="leading-relaxed">
              Ваши данные защищены. Запись поможет организатору подготовить мероприятие.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
