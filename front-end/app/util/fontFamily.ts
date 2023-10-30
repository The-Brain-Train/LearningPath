const addGoogleFont = () => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css?family=Poppins:400,700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  };
  
  export default addGoogleFont;