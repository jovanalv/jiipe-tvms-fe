const handleUnauthorized = (status, navigate) => {
  if (status === 401) {
    localStorage.removeItem("token");
    navigate("/login");
  }
};

export default handleUnauthorized;
