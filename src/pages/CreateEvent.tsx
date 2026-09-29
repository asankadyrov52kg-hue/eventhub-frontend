import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

interface EventForm {
  title: string;
  description: string;
  date: string;
  time: string;
  address: string;
  category: string;
  price: string;
  seats: string;
  image: File | null;
}

function CreateEvent() {
  const [form, setForm] = useState<EventForm>({
    title: '',
    description: '',
    date: '',
    time: '',
    address: '',
    category: '',
    price: '',
    seats: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Можно загрузить только JPG или PNG');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Размер изображения не должен превышать 5 МБ');
      return;
    }

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };
  
  const [errors, setErrors] = useState({
    price: '',
    seats: '',
    });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

  const price = Number(form.price);
  const seats = Number(form.seats);

  const newErrors = {
    price: '',
    seats: '',
  };

  if (form.price === '' || price < 0) {
    newErrors.price = 'Цена не может быть отрицательной';
  }

  if (
    form.seats === '' ||
    !Number.isInteger(seats) ||
    seats < 1
  ) {
    newErrors.seats = 'Количество мест должно быть целым числом больше 0';
  }

  setErrors(newErrors);

  if (newErrors.price || newErrors.seats) {
    return;
  }

  console.log('Данные мероприятия:', {
    ...form,
    price,
    seats,
  });

  alert('Мероприятие готово к созданию');
};

  const handleCancel = () => {
    window.history.back();
  };

  const getTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getCurrentTime = () => {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};

  return (
    <main className="create-event-page">
      <div className="create-event-container">
        <div className="create-event-header">
          <h1>Создать мероприятие</h1>

          <p>
            Расскажите о вашем мероприятии, чтобы привлечь участников
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="create-event-content">

            {}

            <div className="create-event-form">

              {}

              <div className="form-field">
                <label htmlFor="title">
                  Название мероприятия <span>*</span>
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Например, Летний джаз в Саду «Эрмитаж»"
                  required
                />
              </div>

              {}

              <div className="form-field">
                <label htmlFor="description">
                  Описание <span>*</span>
                </label>

                <div className="textarea-wrapper">
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    maxLength={1000}
                    placeholder="Расскажите, о чем ваше мероприятие, что ждёт участников..."
                    required
                  />

                  <span className="characters-count">
                    {form.description.length}/1000
                  </span>
                </div>
              </div>

              {}

              <div className="form-field">
                <label>
                  Дата и время <span>*</span>
                </label>

                <div className="date-time-row">
                  <input
                    name="date"
                    type="date"
                    value={form.date}
                    min={getTodayDate()}
                    onChange={handleChange}
                    required
                  />

                  <input
                    name="time"
                    type="time"
                    value={form.time}
                    min={form.date === getTodayDate() ? getCurrentTime() : undefined}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {}

              <div className="form-field">
                <label htmlFor="address">
                  Адрес <span>*</span>
                </label>

                <input
                  id="address"
                  name="address"
                  type="text"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Например, Бишкек, ул. Ибраимова, 115"
                  required
                />
              </div>

              {}

              <div className="bottom-fields">

                <div className="form-field">
                  <label htmlFor="category">
                    Категория <span>*</span>
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Выберите категорию
                    </option>

                    <option value="concerts">
                      Концерты и музыка
                    </option>

                    <option value="sport">
                      Спорт
                    </option>

                    <option value="education">
                      Образование
                    </option>

                    <option value="business">
                      Бизнес и конференции
                    </option>

                    <option value="theatre">
                      Театр и искусство
                    </option>

                    <option value="exhibition">
                      Выставки
                    </option>

                    <option value="entertainment">
                      Развлечения
                    </option>

                    <option value="family">
                      Для всей семьи
                    </option>

                    <option value="other">
                      Другое
                    </option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="price">
                    Цена билета <span>*</span>
                  </label>

                  <div className="input-with-icon">
                    <span>С</span>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="1"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="Например, 500"
                      required
                    />
                  </div>
                  {errors.price && (
                    <span className="field-error">{errors.price}</span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="seats">
                    Количество мест <span>*</span>
                  </label>

                  <input
                    id="seats"
                    name="seats"
                    type="number"
                    min="1"
                    step="1"
                    value={form.seats}
                    onChange={handleChange}
                    placeholder="Например, 100"
                    required
                  />
                </div>
                  {errors.seats && (
                    <span className="field-error">{errors.seats}</span>
                )}
              </div>
            </div>

            {}

            <div className="image-section">

              <label className="image-label">
                Изображение мероприятия <span>*</span>
              </label>

              <label
                htmlFor="event-image"
                className="image-upload"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Предпросмотр мероприятия"
                  />
                ) : (
                  <>
                    <div className="upload-icon">
                      <svg
                        width="34"
                        height="34"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />

                        <circle
                          cx="8.5"
                          cy="8.5"
                          r="1.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />

                        <path
                          d="M21 15L16 10L5 21"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                      </svg>
                    </div>

                    <strong>
                      Загрузите изображение
                    </strong>

                    <p>
                      Перетащите файл сюда или нажмите для выбора
                    </p>

                    <small>
                      JPG, PNG, до 5 МБ
                    </small>
                  </>
                )}

                <input
                  id="event-image"
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageChange}
                  required={!imagePreview}
                  hidden
                />
              </label>

            </div>
          </div>

          {}

          <div className="create-event-footer">

            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
            >
              <span>←</span>
              Отмена
            </button>

            <button
              type="submit"
              className="create-button"
            >
              Создать мероприятие
            </button>

          </div>
        </form>
      </div>
    </main>
  );
}

export default CreateEvent;