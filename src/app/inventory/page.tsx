import Header from "../components/shared/Header";
import InventoryPageComponent from "../components/InventoryPage";

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main>
        <InventoryPageComponent />
      </main>
    </>
  );
}
