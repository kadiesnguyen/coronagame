/**
 * Per-socket role check. Do not use global._io.role — it races across connections.
 */
const isAdminSocket = (socket) => {
  const role = socket?.data?.role || socket?.data?.user?.role;
  return role === "admin";
};

module.exports = {
  isAdminSocket,
};
