import React, { useEffect } from "react";

function InteractiveMapPage() {
  useEffect(() => {
    console.log("Ви перейшли в розділ Інтерактивна Карта");
  }, []); // Цей код запускається при завантаженні сторінки

  return <div>Це сторінка з інтерактивною картою</div>;
}

export default InteractiveMapPage;
