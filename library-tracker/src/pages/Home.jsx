import { useOutletContext } from "react-router-dom";

function Home() {
  const { library } = useOutletContext();

  const currentlyReading = library.find((book) => book.status === "reading");

  return (
<main>
  <h1>Home</h1>
  {currentlyReading ? (
    <section>
      <h2>Currently Reading</h2>
      <h3>{currentlyReading.title}</h3>
      <p>{currentlyReading.author}</p>
    </section>
  ) : (
    <p>No book currently being read.</p>
  )}
</main>
  );
}

export default Home;