const handleForbidden = (status, navigate) => {
  if (status === 403) {
    navigate("/FORBIDDEN");
  }
};

export default handleForbidden;
