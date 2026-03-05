/**
 * Config do app (ajuste fácil sem mexer no core).
 * - Troque o logo em /assets e ajuste o caminho aqui.
 */
window.APP_CONFIG = {
  appName: "Academia do Brigadista",
  logoPath: "assets/logo.png",
  adminPath: "admin.html",
  serial: {
    // hashes SHA-256 dos seriais válidos
    allowedHashes: [
  "4fdf411d62bd9fc2cda8bd80c7dc8c0d2cc4c5a48dfb5b812d41d467718efc05",
  "4519917e3c1e706e6e37ed8777fdf7d691b9e3fe671e67c62a9dad31bc99c3e0",
  "6eab90dd23282ed30e44ccc60e678677fb868a6be431ae763f87422be25b1cd4",
  "2db4140b543da793ba272a17d26faf90e0c75d8bc4e04c46a3c7a003150266bb",
  "7bda037b65369cd43a9d921fd6e831fb6e8d795647006a85d8898a7094cc03bf",
  "2a63c3039bc5b1bdbbdfe172463ad74e790762ad2ebf38650220949a00670a4a",
  "44f136d35c73c57ec1a19fe44b574c1a11275010810f0b4e99d2c23789e8a62b",
  "0b8af22183858f76462028c57c4c350b0002700cb6b2abe23ee8be55e85e7f3c",
  "9a94140a78c218d472855cf0b98d404564893ac1ffc624889e97a9a886496ea7",
  "268cffe169fb2bd7d7b79b2583c1f9c96a8460c2c223b4f53b4ee8e0fc7cafc1",
  "99b51711f17dcd2b355f6c0bda37dc6df66f71d9dd30e1d3dbd6658d8ebc9a75",
  "ab904984dd3f280cb57d6625de7ab67cc59ffb50452a581691d13cabe801a0e4",
  "43397902b5ff8b7edd351b18f5fb00e15edc58f5ac596ece7f0404f2e0240830",
  "e7dd9e55b0c93aec360727be3c09862a2487597bf1348a172dc78ac6cbbbe89c",
  "1bd15ff6869d56af5cc7b6c6ecacca873c456674bf7e86c73e1e81dbecaa971b",
  "2770d0fc7440e9cdb08f06e86eddad51cc29959c75a127276e94ccca4ba7ea0f",
  "48dafbe759c9b3cd91af8927dc76a490a434f23618e3139c52c83dc128ba9cd6",
  "8bdb3a6312b9cca09684e159b89e62d1a0137f102f60fc95328d793e47ba04d8",
  "88298ab6b52e5849ea70d09203e5174271f721863c8e0e77b8e2c167594c1fa6",
  "b9b4cc243d83a5f0d1704431378b5b0f57582ae14b08d6f78d8d5fa1a5a51b6c"
],
    storageKey: "adb_serial_ok_v1"
  },
  content: {
    coreManifest: "content/core/manifest.json",
    dlcIndex: "content/dlc/index.json",
    storageKeyEnabledDlcs: "adb_enabled_dlcs_v1",
    storageKeyLocalDlcs: "adb_local_dlcs_v1"
  },
  security: {
    // Admin local (troque depois). Em produção, ideal é backend.
    adminUser: "admin",
    adminPass: "admin123",
    storageKeyAdminSession: "adb_admin_session_v1"
  }
};
