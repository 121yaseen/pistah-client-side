import Header from "./components/shared/Header";
import InventoryPage from "./inventory/page";

export default function Home() {
  return (
    <div>
      <Header />
      <main>
        <InventoryPage />
      </main>
    </div>
  );
}
