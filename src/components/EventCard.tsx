import type { ReactNode } from "react";
import { type EventItem } from "../types/event";

interface EventCardProps {
  event: EventItem;
  
  onDetails?: (id: string) => void;
  
  actions?: ReactNode;
}

const categoryColors: Record<string, string> = {
  Концерт: "bg-blue-100 text-blue-700",
  Лекция: "bg-purple-100 text-purple-700",
  Выставка: "bg-pink-100 text-pink-700",
  Спорт: "bg-green-100 text-green-700",
  "Мастер-класс": "bg-orange-100 text-orange-700",
  Кино: "bg-gray-200 text-gray-700",
  Нетворкинг: "bg-teal-100 text-teal-700",
  Фестиваль: "bg-yellow-100 text-yellow-700",
};

export default function EventCard({ event, onDetails, actions }: EventCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-40 w-full">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {event.category && (
          <span
            className={`absolute top-31 left-3 text-xs font-medium px-2 py-1 rounded-md ${categoryColors[event.category] ?? "bg-gray-100 text-gray-700"}`}
          >
            {event.category}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2">
          {event.title}
        </h3>

        <div className="text-sm text-gray-500 flex items-center gap-1">
          📅 {event.date}
        </div>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          📍 {event.location}
        </div>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          💳 {event.price}
        </div>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          👤 Осталось {event.seatsLeft} мест
        </div>

        {actions ? (
          <div className="mt-auto pt-2">{actions}</div>
        ) : (
          onDetails && (
            <button
              onClick={() => onDetails(event.id)}
              className="mt-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              Подробнее
            </button>
          )
        )}
      </div>
    </div>
  );
}