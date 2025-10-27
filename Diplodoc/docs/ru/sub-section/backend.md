# Backend проекта "Веб-сервис сбора и анализа статистической информации цен на электроэнергию"

## 1. Общая архитектура

Бэкенд проекта написан на Python с использованием фреймворка Flask. Он отвечает за:
- получение и обработку данных о ценах на электроэнергию,
- взаимодействие с базой данных,
- предоставление API для фронтенда,
- выполнение математических расчётов и генерацию статистики.

## 2. Файлы проекта

### 2.1 `app.py` — назначение и содержание

app.py — главный файл бэкенда проекта. Его задачи:

- Инициализация приложения Flask — запуск веб-сервера, обработка HTTP-запросов.
- Подключение к базе данных — через SQLAlchemy и создание сессий для запросов.
- Организация API для фронтенда — маршруты /api/..., которые предоставляют данные о ценах, регионах, статистику и отчёты.
- Автоматическое обновление данных — запуск скрипта fetch_data.py через планировщик APScheduler каждый день в 18:00 и через ручной API /api/reload.
- Выполнение бизнес-логики — фильтрация данных по дате, региону, часу, агрегация, расчёт суммарного объёма и средних цен.
- Генерация Excel-отчётов — экспорт данных через /api/report/xls.
- Отображение веб-страницы — рендер главной страницы с графиками и статистикой (index.html).

### 2.2  Примеры кода и пояснения

#### 2.2.1 Инициализация приложения и базы данных
```python
app = Flask(__name__)
app.json.ensure_ascii=False
engine = create_engine(DB_URL)
Session = sessionmaker(bind=engine)
Base.metadata.create_all(engine)
```
- Flask(__name__) — создаёт экземпляр веб-приложения.
- app.json.ensure_ascii=False — разрешает корректное отображение русских символов в JSON.
- create_engine(DB_URL) — подключение к базе данных PostgreSQL.
- Session = sessionmaker(bind=engine) — фабрика сессий для запросов к БД.
- Base.metadata.create_all(engine) — создаёт таблицы, если их ещё нет.

#### 2.2.2 Планировщик автоматического обновления данных
```python
def reload_data_bg():
    cwd = os.getcwd()
    python = os.path.join(cwd, 'venv/bin/python3')
    script = os.path.join(cwd, 'fetch_data.py')
    subprocess.run([python, script], cwd=cwd)

def start_scheduler():
    tz = pytz.timezone('Europe/Moscow')
    sched = BackgroundScheduler(timezone=tz)
    sched.add_job(reload_data_bg, 'cron', hour=18, minute=0, id='daily_fetch')
    sched.start()
```
- reload_data_bg() — запускает скрипт fetch_data.py в фоновом режиме.
- start_scheduler() — настраивает ежедневное автоматическое обновление данных в 18:00 по Москве.
  
#### 2.2.3 Проверка параметров запросов
```python
def enforce_limit(f_iso, t_iso):
    if not f_iso or not t_iso:
        abort(400, 'Оба параметра from и to обязательны')
    f = datetime.fromisoformat(f_iso)
    t = datetime.fromisoformat(t_iso)
    if t < f:
        abort(400, 'to должно быть >= from')
    if (t - f) > timedelta(days=365):
        abort(400, 'нельзя запрашивать больше чем 3 месяца')
    return f, t
```
- Проверяет корректность дат начала (from) и конца (to) в API-запросах.
- Ограничивает максимальный период запроса до 1 года.
- При некорректных данных возвращает ошибку HTTP 400.

#### 2.2.4 API для ручного обновления данных
```python
@app.route('/api/reload', methods=['POST'])
def api_reload():
    threading.Thread(target=reload_data_bg, daemon=True).start()
    return jsonify({'status':'started','message':'Обновление запущено'})
```
- Запускает обновление данных в отдельном потоке, чтобы сервер не блокировался.
- Возвращает JSON с подтверждением начала процесса.

#### 2.2.5 API для получения таблицы данных
```python
@app.route('/api/table')
def api_table():
    f_iso = request.args.get('from')
    t_iso = request.args.get('to')
    f, t = enforce_limit(f_iso, t_iso)
    region = request.args.get("region")
    hour = request.args.get("hour")

    with engine.connect() as conn:
        filters = ["timestamp >= :from", "timestamp <= :to"]
        params = {"from": f, "to": t}
        if region:
            filters.append("region = :region")
            params["region"] = region
        if hour:
            filters.append("EXTRACT(HOUR FROM timestamp) = :hour")
            params["hour"] = int(hour)
        where_clause = " AND ".join(filters)
        sql = f"SELECT * FROM elec_reports WHERE {where_clause} ORDER BY timestamp, region"
        rows = conn.execute(text(sql), params).mappings()
        data = [dict(r) for r in rows]
    return jsonify(data)
```
- Позволяет фронтенду получать данные с фильтрами: даты, регион, час.
- Выполняет SQL-запрос и возвращает результат в формате JSON.

#### 2.2.6 Главная страница сайта
```python
@app.route("/")
def index():
    ses = Session()
    # Подготовка данных для графиков: прошлый и вчерашний день
    # ...
    ses.close()
    return render_template('index.html',
        gens_labels=[label for _,label in gens],
        prev_date=prev.strftime('%Y-%m-%d'),
        yest_date=yest.strftime('%Y-%m-%d'),
        vol_prev=[vol_prev[key] for key,_ in gens],
        vol_yest=[vol_yest[key] for key,_ in gens],
        shares=shares,
        prices=prices,
        region=region
    )
```
- Рендерит главную страницу с графиками и статистикой по генерации электроэнергии и ценам.
- Считает суммарный объём по типам генерации для предыдущих дней.

#### 2.2.7 Генерация Excel-отчёта
```python
@app.route('/api/report/xls')
def api_report_xls():
    df = pd.DataFrame(records)
    buf = BytesIO()
    df.to_excel(buf, index=False, engine='openpyxl')
    buf.seek(0)
    return send_file(buf, mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                     download_name="report.xlsx", as_attachment=True)
```
- Преобразует данные в Excel-файл с помощью pandas.
- Возвращает пользователю как скачиваемый файл.
