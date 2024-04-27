const config = {
  api_path: "http://localhost:3000",
  token_name: "NODEPOS_TOKEN",
  headers: () => {
    return {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("NODEPOS_TOKEN"),
      },
    };
  },
};

export default config;
