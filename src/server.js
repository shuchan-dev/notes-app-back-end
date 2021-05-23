const Hapi = require("@hapi/hapi");
// Mengunakan route configuration pada server
const routes = require("./routes");

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: "localhost",
    // Cross-origin resource sharing (CORS)
    // Contoh penggunaannya *(kita hanya perlu memberikan nilai header ‘Access-Control-Allow-Origin’ dengan nilai origin luar yang akan mengkonsumsi datanya (aplikasi client).
    // response.header('Access-Control-Allow-Origin', 'http://ec2-13-212-153-62.ap-southeast-1.compute.////amazonaws.com:8000/'); )*
    // Atau Anda bisa menggunakan tanda * pada nilai origin untuk memperbolehkan data dikonsumsi oleh seluruh origin
    // response.header('Access-Control-Allow-Origin', '*');
    // Penerapannya akan jauh lebih mudah bila menggunakan Hapi. Dengan Hapi, CORS dapat ditetapkan pada spesifik route dengan menambahkan properti options.cors di konfigurasi route.js nya.

    // Bila ingin cakupannya lebih luas alias CORS diaktifkan di seluruh route yang ada di server, Anda bisa tetapkan CORS pada konfigurasi ketika hendak membuat server dengan menambahkan properti routes.cors. Contohnya seperti Di Bawah ini:
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // Menjalankan fungsi routes dari routes.js
  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
