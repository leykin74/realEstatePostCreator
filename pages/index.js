import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [rooms, setRooms] = useState("");
  const [address, setAddress] = useState("");
  const [documents, setDocuments] = useState("");
  const [apartments, setApartments] = useState("");
  const [house, setHouse] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rooms: rooms, address: address, documents: documents, apartments: apartments, house: house }),
      });

      const data = await response.json();

      console.info(data);

      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }


      setResult(data.message.message.content);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Генератор объявления</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="rooms"
            placeholder="Количество комнат"
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
          />
          <input
            type="text"
            name="address"
            placeholder="Полный адрес"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="text"
            name="documents"
            placeholder="Информация о документах"
            value={documents}
            onChange={(e) => setDocuments(e.target.value)}
          />
          <input
            type="text"
            name="apartments"
            placeholder="Описание квартиры"
            value={apartments}
            onChange={(e) => setApartments(e.target.value)}
          />
          <input
            type="text"
            name="house"
            placeholder="Описание дома, жк"
            value={house}
            onChange={(e) => setHouse(e.target.value)}
          />
          <input type="submit" value="Сгенерировать объявление" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
