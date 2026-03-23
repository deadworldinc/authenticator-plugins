/**
 * Background Plugin: API Bridge
 * Отдает пароли по HTTP запросу на localhost:12345
 */
export default function init(sdk) {
  const { db, crypto, pkg, ui } = sdk;
  const http = window.nw.require('http');

  console.log(`[${pkg.name}] Инициализация API сервера...`);

  const server = http.createServer(async (req, res) => {
    // Настройка CORS (чтобы браузерное расширение могло достучаться)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const url = new URL(req.url, `http://${req.headers.host}`);
    const siteQuery = url.searchParams.get('site');

    if (req.method === 'GET' && siteQuery) {
      try {
        // Поиск в NeDB через проброшенный SDK db
        const records = await db.find({ 
          type: 'password', 
          site: new RegExp(siteQuery, 'i') 
        });

        const results = records.map(rec => ({
          site: rec.site,
          login: rec.login,
          // Дешифруем на лету через SDK
          password: crypto.decrypt(rec.value)
        }));

        res.statusCode = 200;
        res.end(JSON.stringify(results));
      } catch (err) {
        res.end(JSON.stringify(err.message));
      }
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  });

  // Запуск сервера
  server.listen(12345, '127.0.0.1', () => {
    console.log(`[${pkg.name}] Server running at http://localhost:12345`);
    ui.notify(`${pkg.title || pkg.name}: API Server started on port 12345`, 'success');
  });

  // ВАЖНО: Возвращаем деструктор для Hot Reload и корректного выключения
  return () => {
    console.log(`[${pkg.name}] Остановка API сервера...`);
    
    if (server.listening) {
      // 1. Сначала ПРИНУДИТЕЛЬНО разрываем всё
      if (server.closeAllConnections) server.closeAllConnections();
      if (server.closeIdleConnections) server.closeIdleConnections();

      // 2. Сразу после этого закрываем
      server.close(); 
      
      // 3. Выводим лог СНАРУЖИ колбэка
      // В NW.js колбэк внутри close может не вызваться, если контекст сменился
      console.log("Порт 12345 успешно освобожден.");
    }

    server.unref(); 
  };
}