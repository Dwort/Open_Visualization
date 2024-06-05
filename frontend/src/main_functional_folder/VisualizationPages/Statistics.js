import React, { useEffect } from "react";

function StatisticsPage() {
  useEffect(() => {
    console.log("Ви перейшли в розділ Статистика");
  }, []); // Цей код запускається при завантаженні сторінки

  return <div>Це сторінка зі статистикою</div>;
}

export default StatisticsPage;
