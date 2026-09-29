import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { type EventItem } from "../types/event";
import {
  formatEventDate,
  formatPrice,
  parseEventDate,
  parsePrice,
} from "../data/EventFormat";

interface EditEventModalProps {
  event: EventItem;
  onSave: (updated: EventItem) => void;
  onClose: () => void;
}

interface FormState {
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;
  seatsLeft: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function EditEventModal({
  event,
  onSave,
  onClose,
}: EditEventModalProps) {
  const initialDate = parseEventDate(event.date);

  const [form, setForm] = useState<FormState>({
    title: event.title,
    date: initialDate.date,
    time: initialDate.time,
    location: event.location,
    price: String(parsePrice(event.price)),
    seatsLeft: String(event.seatsLeft),
  });
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const price = Number(form.price);
    const seats = Number(form.seatsLeft);
    const newErrors: Errors = {};

    if (!form.title.trim()) newErrors.title = "Введите название";
    if (!form.date) newErrors.date = "Выберите дату";
    if (!form.time) newErrors.time = "Выберите время";
    if (!form.location.trim()) newErrors.location = "Введите адрес";
    if (form.price === "" || !Number.isInteger(price) || price < 0) {
      newErrors.price = "Введите целое число, 0 или больше";
    }
    if (form.seatsLeft === "" || !Number.isInteger(seats) || seats < 1) {
      newErrors.seatsLeft = "Введите целое число, минимум 1";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave({
      ...event,
      title: form.title.trim(),
      date: formatEventDate(form.date, form.time),
      location: form.location.trim(),
      price: formatPrice(price),
      seatsLeft: seats,
    });
  };

  const error = (name: keyof FormState) =>
    errors[name] ? (
      <p className="mt-1 text-xs text-red-600">{errors[name]}</p>
    ) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="edit-title" className="text-lg font-semibold text-gray-900">
          Редактировать мероприятие
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="edit-name" className="mb-1 block text-sm font-medium text-gray-700">
              Название
            </label>
            <input
              id="edit-name"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              autoFocus
              className={inputClass}
            />
            {error("title")}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-date" className="mb-1 block text-sm font-medium text-gray-700">
                Дата
              </label>
              <input
                id="edit-date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className={inputClass}
              />
              {error("date")}
            </div>
            <div>
              <label htmlFor="edit-time" className="mb-1 block text-sm font-medium text-gray-700">
                Время
              </label>
              <input
                id="edit-time"
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
                className={inputClass}
              />
              {error("time")}
            </div>
          </div>

          <div>
            <label htmlFor="edit-location" className="mb-1 block text-sm font-medium text-gray-700">
              Адрес
            </label>
            <input
              id="edit-location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              className={inputClass}
            />
            {error("location")}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-price" className="mb-1 block text-sm font-medium text-gray-700">
                Цена билета, ₽
              </label>
              <input
                id="edit-price"
                name="price"
                type="number"
                min="0"
                step="1"
                value={form.price}
                onChange={handleChange}
                className={inputClass}
              />
              {error("price")}
            </div>
            <div>
              <label htmlFor="edit-seats" className="mb-1 block text-sm font-medium text-gray-700">
                Количество мест
              </label>
              <input
                id="edit-seats"
                name="seatsLeft"
                type="number"
                min="1"
                step="1"
                value={form.seatsLeft}
                onChange={handleChange}
                className={inputClass}
              />
              {error("seatsLeft")}
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}